use std::process::Command;
use std::sync::Arc;
use tauri::{AppHandle, Emitter, State};
use crate::state::AppState;

fn run_yarn_script_streaming(
    script: &str,
    project_root: &std::path::Path,
    app: AppHandle,
    event: &str,
) -> Result<(), String> {
    use std::io::BufRead;

    let mut child = Command::new("yarn")
        .arg(script)
        .current_dir(project_root)
        .stdout(std::process::Stdio::piped())
        .stderr(std::process::Stdio::piped())
        .spawn()
        .map_err(|e| e.to_string())?;

    let stdout = child.stdout.take();
    let stderr = child.stderr.take();
    let ev = event.to_string();
    let ev2 = format!("{event}:err");
    let handle2 = app.clone();

    if let Some(out) = stdout {
        let handle = app.clone();
        let ev = ev.clone();
        std::thread::spawn(move || {
            for line in std::io::BufReader::new(out).lines().flatten() {
                let _ = handle.emit(&ev, &line);
            }
        });
    }

    if let Some(err) = stderr {
        std::thread::spawn(move || {
            for line in std::io::BufReader::new(err).lines().flatten() {
                let _ = handle2.emit(&ev2, &line);
            }
        });
    }

    let status = child.wait().map_err(|e| e.to_string())?;
    if !status.success() {
        return Err(format!("yarn {script} exited with status {status}"));
    }
    Ok(())
}

#[tauri::command]
pub async fn icloud_save(
    app: AppHandle,
    state: State<'_, Arc<AppState>>,
) -> Result<(), String> {
    let root = state.root();
    run_yarn_script_streaming("icloud:save", &root, app, "icloud:save")
}

#[tauri::command]
pub async fn icloud_restore(
    app: AppHandle,
    state: State<'_, Arc<AppState>>,
) -> Result<(), String> {
    let root = state.root();
    run_yarn_script_streaming("icloud:restore", &root, app, "icloud:restore")
}

#[tauri::command]
pub async fn icloud_status(state: State<'_, Arc<AppState>>) -> Result<String, String> {
    let root = state.root();
    let output = Command::new("yarn")
        .arg("icloud:status")
        .current_dir(&root)
        .output()
        .map_err(|e| e.to_string())?;
    Ok(String::from_utf8_lossy(&output.stdout).to_string())
}
