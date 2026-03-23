use std::fs;
use std::io::{BufRead, BufReader};
use std::sync::Arc;
use tauri::State;
use crate::state::AppState;

#[tauri::command]
pub async fn get_log(name: String, state: State<'_, Arc<AppState>>) -> Result<Vec<String>, String> {
    let path = state.log_dir().join(format!("{name}.log"));
    if !path.exists() {
        return Ok(vec![]);
    }
    let file = fs::File::open(&path).map_err(|e| e.to_string())?;
    let lines: Vec<String> = BufReader::new(file).lines().flatten().collect();
    let start = if lines.len() > 500 { lines.len() - 500 } else { 0 };
    Ok(lines[start..].to_vec())
}

#[tauri::command]
pub async fn clear_log(name: String, state: State<'_, Arc<AppState>>) -> Result<(), String> {
    let path = state.log_dir().join(format!("{name}.log"));
    if path.exists() {
        fs::write(&path, "").map_err(|e| e.to_string())?;
    }
    Ok(())
}
