use std::process::Command;
use std::sync::Arc;
use tauri::{AppHandle, State};
use crate::commands::util::{augmented_path, launcher_log, run_yarn_streaming};
use crate::state::AppState;

#[tauri::command]
pub async fn icloud_save(
    app: AppHandle,
    state: State<'_, Arc<AppState>>,
) -> Result<(), String> {
    let root = state.root();
    let log_dir = state.log_dir();
    launcher_log(&app, &log_dir, "[icloud] Starting save…");
    let result = run_yarn_streaming(&["icloud:save"], &root, &app, "icloud:save", &log_dir).await;
    match &result {
        Ok(_) => launcher_log(&app, &log_dir, "[icloud] Save complete"),
        Err(e) => launcher_log(&app, &log_dir, &format!("[icloud] Save failed: {e}")),
    }
    result
}

#[tauri::command]
pub async fn icloud_restore(
    app: AppHandle,
    state: State<'_, Arc<AppState>>,
) -> Result<(), String> {
    let root = state.root();
    let log_dir = state.log_dir();
    launcher_log(&app, &log_dir, "[icloud] Starting restore…");
    let result = run_yarn_streaming(&["icloud:restore"], &root, &app, "icloud:restore", &log_dir).await;
    match &result {
        Ok(_) => launcher_log(&app, &log_dir, "[icloud] Restore complete"),
        Err(e) => launcher_log(&app, &log_dir, &format!("[icloud] Restore failed: {e}")),
    }
    result
}

#[tauri::command]
pub async fn icloud_status(state: State<'_, Arc<AppState>>) -> Result<String, String> {
    let root = state.root();
    let path = augmented_path(&root);
    let output = Command::new("yarn")
        .arg("icloud:status")
        .current_dir(&root)
        .env("PATH", &path)
        .output()
        .map_err(|e| e.to_string())?;
    Ok(String::from_utf8_lossy(&output.stdout).to_string())
}
