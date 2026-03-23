use std::process::Command;
use std::sync::Arc;
use tauri::{AppHandle, Emitter, State};
use crate::commands::icloud::icloud_save;
use crate::commands::processes::get_process_status;
use crate::state::AppState;

const NETLIFY_HOOK_URL: &str = "https://api.netlify.com/build_hooks/69c01671fd19e223778ece30";

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
    let output = Command::new("curl")
        .args(["-s", "-o", "/dev/null", "-w", "%{http_code}", "-X", "POST", NETLIFY_HOOK_URL])
        .output()
        .map_err(|e| format!("Failed to trigger deploy: {e}"))?;

    let http_code = String::from_utf8_lossy(&output.stdout);
    if http_code.trim() != "200" && http_code.trim() != "201" {
        return Err(format!("Netlify deploy hook returned HTTP {}", http_code.trim()));
    }

    let _ = app.emit("publish:step", "Deploy triggered successfully!");
    Ok(())
}
