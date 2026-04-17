use std::net::TcpStream;
use std::process::Command;
use std::sync::Arc;
use std::time::{Duration, Instant};
use tauri::{AppHandle, Emitter, State};
use crate::commands::processes::{get_process_status, start_backend_internal, stop_backend_internal};
use crate::commands::util::{augmented_path, launcher_log, run_yarn_streaming};
use crate::state::AppState;

#[derive(serde::Serialize)]
pub struct DeployStatus {
    pub last_deployed_at: Option<String>,
    pub hook_configured: bool,
}

#[tauri::command]
pub async fn get_deploy_status(state: State<'_, Arc<AppState>>) -> Result<DeployStatus, String> {
    let hook_configured = read_netlify_hook_url(&state.root()).is_ok();
    let deploy_json_path = state.log_dir().join("last_deploy.json");
    let last_deployed_at = std::fs::read_to_string(&deploy_json_path)
        .ok()
        .and_then(|s| serde_json::from_str::<serde_json::Value>(&s).ok())
        .and_then(|v| v["last_deployed_at"].as_str().map(String::from));
    Ok(DeployStatus { last_deployed_at, hook_configured })
}

#[derive(serde::Deserialize)]
struct LauncherConfig {
    #[serde(rename = "netlifyBuildHookUrl")]
    netlify_build_hook_url: String,
}

fn read_netlify_hook_url(project_root: &std::path::Path) -> Result<String, String> {
    let config_path = project_root.join("launcher.config.json");
    let json = std::fs::read_to_string(&config_path).map_err(|_| {
        format!(
            "launcher.config.json not found at {}. Copy launcher.config.json.example and set your Netlify build hook URL.",
            config_path.display()
        )
    })?;
    let config: LauncherConfig =
        serde_json::from_str(&json).map_err(|e| format!("Failed to parse launcher.config.json: {e}"))?;
    Ok(config.netlify_build_hook_url)
}

/// Poll port 1337 until Strapi accepts connections or the timeout elapses.
async fn wait_for_backend_health(timeout: Duration) -> bool {
    let deadline = Instant::now() + timeout;
    loop {
        let remaining = deadline.saturating_duration_since(Instant::now());
        if remaining.is_zero() { return false; }
        let reachable = tokio::task::spawn_blocking(|| {
            TcpStream::connect_timeout(
                &"127.0.0.1:1337".parse().unwrap(),
                Duration::from_millis(500),
            ).is_ok()
        }).await.unwrap_or(false);

        if reachable { return true; }
        tokio::time::sleep(Duration::from_secs(2)).await;
    }
}

#[tauri::command]
pub async fn deploy(
    app: AppHandle,
    state: State<'_, Arc<AppState>>,
) -> Result<(), String> {
    let log_dir = state.log_dir();

    // The backend MUST be running before we start.
    // Netlify's build fetches all page content from Strapi via getStaticProps,
    // so Strapi must be reachable on its configured URL throughout the Netlify build.
    let status = get_process_status(state.clone()).await?;
    if !status.backend {
        return Err(
            "Start the CMS backend before deploying. \
             Netlify's build fetches all page content from Strapi via getStaticProps — \
             the backend must be reachable when Netlify builds. \
             Use 'Start Both' in the launcher and wait for it to finish loading."
            .to_string(),
        );
    }

    let state_arc = state.inner().clone();
    let root = state.root();

    let step = |msg: &str| {
        let _ = app.emit("deploy:step", msg);
        launcher_log(&app, &log_dir, &format!("[deploy] {msg}"));
    };

    launcher_log(&app, &log_dir, "[deploy] Starting deploy pipeline…");

    // Step 1: build smoke test — verifies the Next.js app compiles cleanly.
    // Run first (while the backend is still up) so any compile errors surface immediately
    // before we touch the database or uploads.
    step("Running build smoke test…");
    run_yarn_streaming(
        &["workspace", "shelbz-citrine-frontend", "build"],
        &root,
        &app,
        "deploy:ci:log",
        &log_dir,
    ).await.map_err(|e| {
        launcher_log(&app, &log_dir, &format!("[deploy] Build failed: {e}"));
        "Build smoke test failed. Fix the TypeScript or compilation errors shown \
         in the CI output above, then try deploying again."
        .to_string()
    })?;

    // Step 2: stop the backend so the file-level scripts can run safely.
    // Both images:publish and icloud-save check port 1337 and exit with an error
    // if Strapi is still running (to avoid reading a mid-write database or uploads dir).
    step("Stopping backend for housekeeping steps…");
    stop_backend_internal(&state_arc, &app);
    // Give the process group a moment to fully release file handles.
    tokio::time::sleep(Duration::from_millis(800)).await;

    // Step 3: publish images — copy backend/public/uploads/ → frontend/public/uploads/
    // Must run before icloud-save so that the iCloud backup captures the same uploads
    // state that was just synced to the frontend. The Netlify build will pick these
    // up as committed static assets.
    step("Publishing images to frontend…");
    run_yarn_streaming(
        &["images:publish"],
        &root,
        &app,
        "deploy:ci:log",
        &log_dir,
    ).await.map_err(|e| {
        launcher_log(&app, &log_dir, &format!("[deploy] images:publish failed: {e}"));
        format!(
            "Image publish failed. \
             Check that backend/public/uploads/ exists (run Strapi at least once to create it) \
             and that no other Strapi process is running outside the launcher. \
             Details: {e}"
        )
    })?;

    // Step 4: iCloud save — back up the Strapi DB + uploads.
    // Runs after images:publish so the backup reflects the same state that was just synced.
    step("Saving Strapi data to iCloud…");
    run_yarn_streaming(
        &["icloud:save"],
        &root,
        &app,
        "deploy:ci:log",
        &log_dir,
    ).await.map_err(|e| {
        launcher_log(&app, &log_dir, &format!("[deploy] iCloud save failed: {e}"));
        "iCloud save failed. Check that: \
         (1) iCloud Drive is enabled and ~/Library/Mobile Documents/ is accessible, \
         (2) no other Strapi process is running outside the launcher, \
         (3) iCloud does not have newer data from another device — if so, use 'iCloud Restore' first. \
         Details are in the CI output above."
        .to_string()
    })?;

    // Step 5: restart the backend so it is reachable when Netlify actually runs getStaticProps.
    // (Netlify queues builds; the real HTTP calls to Strapi happen seconds-to-minutes later.)
    step("Restarting backend before triggering Netlify…");
    start_backend_internal(&state_arc, app.clone()).map_err(|e| {
        format!(
            "Failed to restart the backend after housekeeping: {e}. \
             Start it manually via 'Start Both' before retrying the Netlify trigger."
        )
    })?;

    step("Waiting for backend to become healthy…");
    let healthy = wait_for_backend_health(Duration::from_secs(120)).await;
    if !healthy {
        return Err(
            "Backend did not become healthy within 2 minutes after restart. \
             Check the Backend log tab for errors, fix them, and try deploying again."
            .to_string(),
        );
    }

    // Step 6: trigger Netlify deploy via build hook.
    // Backend is now confirmed healthy — Netlify can reach Strapi throughout its build.
    step("Triggering Netlify deploy…");
    let hook_url = read_netlify_hook_url(&root).map_err(|e| {
        format!(
            "{e} \
             Copy launcher.config.json.example → launcher.config.json and paste your \
             Netlify build hook URL (Netlify → Site settings → Build & Deploy → Build hooks)."
        )
    })?;
    let path = augmented_path(&root);
    let output = Command::new("curl")
        .args(["-s", "-o", "/dev/null", "-w", "%{http_code}", "-X", "POST", &hook_url])
        .env("PATH", &path)
        .output()
        .map_err(|e| format!("Failed to run curl: {e}. Is curl installed?"))?;

    let http_code = String::from_utf8_lossy(&output.stdout);
    if http_code.trim() != "200" && http_code.trim() != "201" {
        let msg = format!(
            "Netlify deploy hook returned HTTP {}. \
             Verify that netlifyBuildHookUrl in launcher.config.json is correct \
             and that you have an active internet connection. \
             The backend has already been restarted.",
            http_code.trim()
        );
        launcher_log(&app, &log_dir, &format!("[deploy] Error: {msg}"));
        return Err(msg);
    }

    // Record the deploy timestamp.
    let now = chrono::Utc::now().to_rfc3339();
    let deploy_json = serde_json::json!({ "last_deployed_at": now });
    let _ = std::fs::create_dir_all(&log_dir);
    let _ = std::fs::write(
        log_dir.join("last_deploy.json"),
        serde_json::to_string(&deploy_json).unwrap_or_default(),
    );

    step("Deploy triggered! Keep the backend running until Netlify finishes building.");
    launcher_log(&app, &log_dir, "[deploy] Deploy pipeline complete");
    Ok(())
}

#[tauri::command]
pub async fn publish_images(
    app: AppHandle,
    state: State<'_, Arc<AppState>>,
) -> Result<(), String> {
    let log_dir = state.log_dir();

    // Strapi must be stopped — the script checks port 1337 and exits if it's reachable.
    let status = get_process_status(state.clone()).await?;
    if status.backend {
        return Err(
            "Stop the CMS backend before publishing images. \
             The script requires Strapi to be offline so it can safely read the uploads directory."
            .to_string(),
        );
    }

    let root = state.root();

    let step = |msg: &str| {
        let _ = app.emit("images:publish:step", msg);
        launcher_log(&app, &log_dir, &format!("[images:publish] {msg}"));
    };

    launcher_log(&app, &log_dir, "[images:publish] Starting image publish…");
    step("Publishing images…");

    run_yarn_streaming(
        &["images:publish"],
        &root,
        &app,
        "images:publish:log",
        &log_dir,
    ).await.map_err(|e| {
        launcher_log(&app, &log_dir, &format!("[images:publish] Failed: {e}"));
        e
    })?;

    step("Images published successfully!");
    launcher_log(&app, &log_dir, "[images:publish] Done");
    Ok(())
}
