use std::process::Command;
use std::sync::Arc;
use tauri::{AppHandle, Emitter, State};
use crate::commands::icloud::icloud_save;
use crate::commands::processes::get_process_status;
use crate::state::AppState;

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
    // Step 1: ensure backend is stopped
    let status = get_process_status(state.clone()).await?;
    if status.backend {
        return Err("Please stop the backend before publishing.".to_string());
    }

    // Step 2: icloud save
    let _ = app.emit("publish:step", "Saving to iCloud...");
    icloud_save(app.clone(), state.clone()).await?;

    // Step 3: trigger Netlify deploy
    let _ = app.emit("publish:step", "Triggering Netlify deploy...");
    let hook_url = read_netlify_hook_url(&state.root())?;
    let output = Command::new("curl")
        .args(["-s", "-o", "/dev/null", "-w", "%{http_code}", "-X", "POST", &hook_url])
        .output()
        .map_err(|e| format!("Failed to trigger deploy: {e}"))?;

    let http_code = String::from_utf8_lossy(&output.stdout);
    if http_code.trim() != "200" && http_code.trim() != "201" {
        return Err(format!("Netlify deploy hook returned HTTP {}", http_code.trim()));
    }

    let _ = app.emit("publish:step", "Deploy triggered successfully!");
    Ok(())
}
