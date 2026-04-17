use std::process::Command;
use std::sync::Arc;
use tauri::{AppHandle, Emitter, State};
use crate::commands::icloud::icloud_save;
use crate::commands::processes::get_process_status;
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

#[tauri::command]
pub async fn publish(
    app: AppHandle,
    state: State<'_, Arc<AppState>>,
) -> Result<(), String> {
    let log_dir = state.log_dir();

    // Step 1: ensure backend is stopped
    let status = get_process_status(state.clone()).await?;
    if status.backend {
        return Err("Please stop the backend before publishing.".to_string());
    }

    let root = state.root();

    let step = |msg: &str| {
        let _ = app.emit("publish:step", msg);
        launcher_log(&app, &log_dir, &format!("[deploy] {msg}"));
    };

    launcher_log(&app, &log_dir, "[deploy] Starting publish pipeline…");

    // Step 2: run frontend tests
    step("Running tests…");
    run_yarn_streaming(
        &["workspace", "shelbz-citrine-frontend", "test", "--passWithNoTests", "--ci", "--watchAll=false"],
        &root,
        &app,
        "publish:ci:log",
        &log_dir,
    ).await.map_err(|e| { launcher_log(&app, &log_dir, &format!("[deploy] Tests failed: {e}")); e })?;

    // Step 3: build smoke test
    step("Running build smoke test…");
    run_yarn_streaming(
        &["workspace", "shelbz-citrine-frontend", "build"],
        &root,
        &app,
        "publish:ci:log",
        &log_dir,
    ).await.map_err(|e| { launcher_log(&app, &log_dir, &format!("[deploy] Build failed: {e}")); e })?;

    // Step 4: icloud save
    step("CI passed. Saving to iCloud…");
    icloud_save(app.clone(), state.clone()).await?;

    // Step 5: trigger Netlify deploy
    step("Triggering Netlify deploy…");
    let hook_url = read_netlify_hook_url(&root)?;
    let path = augmented_path(&root);
    let output = Command::new("curl")
        .args(["-s", "-o", "/dev/null", "-w", "%{http_code}", "-X", "POST", &hook_url])
        .env("PATH", &path)
        .output()
        .map_err(|e| format!("Failed to trigger deploy: {e}"))?;

    let http_code = String::from_utf8_lossy(&output.stdout);
    if http_code.trim() != "200" && http_code.trim() != "201" {
        let msg = format!("Netlify deploy hook returned HTTP {}", http_code.trim());
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

    step("Deploy triggered successfully!");
    launcher_log(&app, &log_dir, "[deploy] Publish pipeline complete");
    Ok(())
}
