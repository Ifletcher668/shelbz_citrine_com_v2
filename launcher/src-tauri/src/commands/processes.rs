use std::fs::{self, OpenOptions};
use std::io::{BufRead, BufReader, Write};
use std::os::unix::process::CommandExt;
use std::process::{Child, Command, Stdio};
use std::sync::Arc;
use tauri::{AppHandle, Emitter, State};
use crate::state::AppState;

fn spawn_yarn_process(
    script: &str,
    project_root: &std::path::Path,
    log_path: &std::path::Path,
    app_handle: AppHandle,
    event_name: String,
) -> Result<Child, String> {
    fs::create_dir_all(log_path.parent().unwrap()).map_err(|e| e.to_string())?;

    // Truncate the log file and signal the UI to clear its in-memory lines.
    let _ = fs::write(log_path, "");
    let _ = app_handle.emit(&format!("{event_name}:reset"), ());

    // Emit a startup line so the LogViewer shows activity immediately.
    let startup_msg = format!("[launcher] Starting: yarn {script} in {}", project_root.display());
    let _ = app_handle.emit(&event_name, &startup_msg);
    // Also write it to the log file.
    if let Ok(mut file) = OpenOptions::new().create(true).append(true).open(log_path) {
        let _ = writeln!(file, "{startup_msg}");
    }

    // macOS GUI apps don't inherit the shell PATH, so prepend common tool locations.
    let current_path = std::env::var("PATH").unwrap_or_default();
    let home = std::env::var("HOME").unwrap_or_default();

    // Resolve the mise-managed node version from .node-version if present.
    let node_bin = std::fs::read_to_string(project_root.join(".node-version"))
        .ok()
        .map(|v| v.trim().to_string())
        .and_then(|v| {
            let mise_path = format!("{home}/.local/share/mise/installs/node/{v}/bin");
            if std::path::Path::new(&mise_path).exists() {
                return Some(mise_path);
            }
            let nvm_path = format!("{home}/.nvm/versions/node/v{v}/bin");
            if std::path::Path::new(&nvm_path).exists() {
                return Some(nvm_path);
            }
            None
        })
        .unwrap_or_default();

    let augmented_path = format!(
        "{node_bin}:/opt/homebrew/bin:/opt/homebrew/sbin:/usr/local/bin:/usr/local/sbin:{current_path}"
    );

    let mut cmd = Command::new("yarn");
    cmd.arg(script)
        .current_dir(project_root)
        .env("PATH", &augmented_path)
        .stdout(Stdio::piped())
        .stderr(Stdio::piped());

    // Create a new process group so we can kill the whole tree
    unsafe {
        cmd.pre_exec(|| {
            libc::setpgid(0, 0);
            Ok(())
        });
    }

    let mut child = cmd.spawn().map_err(|e| {
        let msg = format!("[launcher] ERROR: Failed to spawn `yarn {script}`: {e}");
        let _ = app_handle.emit(&event_name, &msg);
        if let Ok(mut file) = OpenOptions::new().create(true).append(true).open(log_path) {
            let _ = writeln!(file, "{msg}");
        }
        format!("Failed to spawn yarn {script}: {e}")
    })?;

    let stdout = child.stdout.take();
    let stderr = child.stderr.take();
    let log_path_buf = log_path.to_path_buf();
    let log_path_buf2 = log_path.to_path_buf();

    if let Some(stdout) = stdout {
        let handle = app_handle.clone();
        let ev = event_name.clone();
        let path = log_path_buf.clone();
        std::thread::spawn(move || {
            let reader = BufReader::new(stdout);
            let mut file = OpenOptions::new().create(true).append(true).open(&path).ok();
            for line in reader.lines().flatten() {
                if let Some(f) = &mut file {
                    let _ = writeln!(f, "{line}");
                }
                let _ = handle.emit(&ev, line);
            }
        });
    }

    if let Some(stderr) = stderr {
        let handle = app_handle.clone();
        let ev = event_name.clone();
        let path = log_path_buf2;
        std::thread::spawn(move || {
            let reader = BufReader::new(stderr);
            let mut file = OpenOptions::new().create(true).append(true).open(&path).ok();
            for line in reader.lines().flatten() {
                let prefixed = format!("[err] {line}");
                if let Some(f) = &mut file {
                    let _ = writeln!(f, "{prefixed}");
                }
                let _ = handle.emit(&ev, prefixed);
            }
        });
    }

    Ok(child)
}

#[tauri::command]
pub async fn start_frontend(
    app: AppHandle,
    state: State<'_, Arc<AppState>>,
) -> Result<(), String> {
    let mut handles = state.handles.lock().unwrap();
    if handles.frontend.is_some() {
        return Err("Frontend is already running".to_string());
    }
    let root = state.root();
    let log_path = state.log_dir().join("frontend.log");
    let child = spawn_yarn_process("frontend", &root, &log_path, app, "log:frontend".to_string())?;
    handles.frontend = Some(child);
    Ok(())
}

#[tauri::command]
pub async fn start_backend(
    app: AppHandle,
    state: State<'_, Arc<AppState>>,
) -> Result<(), String> {
    let mut handles = state.handles.lock().unwrap();
    if handles.backend.is_some() {
        return Err("Backend is already running".to_string());
    }
    let root = state.root();
    let log_path = state.log_dir().join("backend.log");
    let child = spawn_yarn_process("backend", &root, &log_path, app, "log:backend".to_string())?;
    handles.backend = Some(child);
    Ok(())
}

#[tauri::command]
pub async fn start_storybook(
    app: AppHandle,
    state: State<'_, Arc<AppState>>,
) -> Result<(), String> {
    let root = state.root();
    let storybook_config = root.join("frontend").join(".storybook");
    if !storybook_config.exists() {
        return Err("Storybook is not configured in this project yet.".to_string());
    }

    let mut handles = state.handles.lock().unwrap();
    if handles.storybook.is_some() {
        return Err("Storybook is already running".to_string());
    }
    let log_path = state.log_dir().join("storybook.log");
    let child = spawn_yarn_process("storybook", &root, &log_path, app, "log:storybook".to_string())?;
    handles.storybook = Some(child);
    Ok(())
}

fn kill_child(child: &mut Child) {
    let pid = child.id() as i32;
    unsafe {
        libc::killpg(pid, libc::SIGTERM);
    }
    std::thread::sleep(std::time::Duration::from_millis(500));
    let _ = child.try_wait();
    unsafe {
        libc::killpg(pid, libc::SIGKILL);
    }
    let _ = child.wait();
}

#[tauri::command]
pub async fn stop_process(
    process: String,
    state: State<'_, Arc<AppState>>,
) -> Result<(), String> {
    let mut handles = state.handles.lock().unwrap();
    match process.as_str() {
        "frontend" => {
            if let Some(mut child) = handles.frontend.take() { kill_child(&mut child); }
        }
        "backend" => {
            if let Some(mut child) = handles.backend.take() { kill_child(&mut child); }
        }
        "storybook" => {
            if let Some(mut child) = handles.storybook.take() { kill_child(&mut child); }
        }
        "all" => {
            if let Some(mut child) = handles.frontend.take() { kill_child(&mut child); }
            if let Some(mut child) = handles.backend.take() { kill_child(&mut child); }
            if let Some(mut child) = handles.storybook.take() { kill_child(&mut child); }
        }
        _ => return Err(format!("Unknown process: {process}")),
    }
    Ok(())
}

#[derive(serde::Serialize)]
pub struct ProcessStatus {
    pub frontend: bool,
    pub backend: bool,
    pub storybook: bool,
}

#[tauri::command]
pub async fn get_process_status(
    state: State<'_, Arc<AppState>>,
) -> Result<ProcessStatus, String> {
    let mut handles = state.handles.lock().unwrap();

    let frontend = if let Some(child) = &mut handles.frontend {
        match child.try_wait() {
            Ok(Some(_)) => { handles.frontend = None; false }
            Ok(None) => true,
            Err(_) => false,
        }
    } else { false };

    let backend = if let Some(child) = &mut handles.backend {
        match child.try_wait() {
            Ok(Some(_)) => { handles.backend = None; false }
            Ok(None) => true,
            Err(_) => false,
        }
    } else { false };

    let storybook = if let Some(child) = &mut handles.storybook {
        match child.try_wait() {
            Ok(Some(_)) => { handles.storybook = None; false }
            Ok(None) => true,
            Err(_) => false,
        }
    } else { false };

    Ok(ProcessStatus { frontend, backend, storybook })
}

pub fn kill_all_processes(state: &Arc<AppState>) {
    let mut handles = state.handles.lock().unwrap();
    if let Some(mut child) = handles.frontend.take() { kill_child(&mut child); }
    if let Some(mut child) = handles.backend.take() { kill_child(&mut child); }
    if let Some(mut child) = handles.storybook.take() { kill_child(&mut child); }
}
