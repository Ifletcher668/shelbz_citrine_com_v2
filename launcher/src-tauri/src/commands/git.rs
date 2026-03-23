use std::process::Command;
use std::sync::Arc;
use tauri::State;
use crate::state::AppState;

fn run_git(args: &[&str], project_root: &std::path::Path) -> Result<String, String> {
    let output = Command::new("git")
        .args(args)
        .current_dir(project_root)
        .output()
        .map_err(|e| format!("git command failed: {e}"))?;
    Ok(String::from_utf8_lossy(&output.stdout).trim().to_string())
}

#[derive(serde::Serialize)]
pub struct GitInfo {
    pub branch: String,
    pub behind: u32,
    pub ahead: u32,
    pub dirty: u32,
}

#[tauri::command]
pub async fn check_updates(state: State<'_, Arc<AppState>>) -> Result<GitInfo, String> {
    let root = state.root();

    let _ = Command::new("git")
        .args(["-C", root.to_str().unwrap_or(""), "fetch", "origin", "--quiet"])
        .output();

    let branch = run_git(&["rev-parse", "--abbrev-ref", "HEAD"], &root)
        .unwrap_or_else(|_| "unknown".to_string());

    let behind_str = run_git(&["rev-list", "--count", "HEAD..@{u}"], &root).unwrap_or_default();
    let ahead_str = run_git(&["rev-list", "--count", "@{u}..HEAD"], &root).unwrap_or_default();
    let status = run_git(&["status", "--porcelain"], &root).unwrap_or_default();

    let behind: u32 = behind_str.parse().unwrap_or(0);
    let ahead: u32 = ahead_str.parse().unwrap_or(0);
    let dirty: u32 = if status.is_empty() { 0 } else { status.lines().count() as u32 };

    Ok(GitInfo { branch, behind, ahead, dirty })
}

#[tauri::command]
pub async fn git_pull(state: State<'_, Arc<AppState>>) -> Result<String, String> {
    let root = state.root();
    let output = Command::new("git")
        .args(["pull", "--ff-only"])
        .current_dir(&root)
        .output()
        .map_err(|e| e.to_string())?;

    let stdout = String::from_utf8_lossy(&output.stdout).to_string();
    let stderr = String::from_utf8_lossy(&output.stderr).to_string();

    if !output.status.success() {
        return Err(format!("{stdout}\n{stderr}").trim().to_string());
    }

    if stdout.contains("package.json") || stdout.contains("yarn.lock") {
        let _ = Command::new("yarn")
            .arg("install")
            .current_dir(&root)
            .output();
    }

    Ok(stdout)
}
