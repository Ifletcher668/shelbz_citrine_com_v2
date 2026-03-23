use std::path::PathBuf;
use std::process::Command;
use std::sync::Arc;
use tauri::{AppHandle, Emitter, State};
use crate::state::AppState;

const REPO_URL: &str = "https://github.com/Ifletcher668/dark_lux_heritage_store.git";

#[derive(serde::Serialize)]
pub struct Prerequisites {
    pub node: Option<String>,
    pub yarn: Option<String>,
    pub git: Option<String>,
    /// Whether a project root has been configured (cloned or pointed at).
    pub project_root: Option<String>,
    pub node_modules: bool,
    pub backend_env: bool,
    pub frontend_env: bool,
}

fn augmented_path() -> String {
    let current = std::env::var("PATH").unwrap_or_default();
    let home = std::env::var("HOME").unwrap_or_default();

    // Find the node version from .node-version, resolving via mise or nvm.
    let node_bin = std::env::current_dir()
        .ok()
        .and_then(|cwd| {
            let mut dir = cwd;
            for _ in 0..4 {
                let candidate = dir.join(".node-version");
                if candidate.exists() {
                    return std::fs::read_to_string(candidate).ok();
                }
                if !dir.pop() { break; }
            }
            None
        })
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

    format!("{node_bin}:/opt/homebrew/bin:/opt/homebrew/sbin:/usr/local/bin:/usr/local/sbin:{current}")
}

fn get_version(cmd: &str, args: &[&str]) -> Option<String> {
    Command::new(cmd)
        .args(args)
        .env("PATH", augmented_path())
        .output()
        .ok()
        .filter(|o| o.status.success())
        .map(|o| String::from_utf8_lossy(&o.stdout).trim().to_string())
}

#[tauri::command]
pub async fn check_prerequisites(state: State<'_, Arc<AppState>>) -> Result<Prerequisites, String> {
    let node = get_version("node", &["--version"]);
    let yarn = get_version("yarn", &["--version"]);
    let git = get_version("git", &["--version"]);

    let root = state.root();
    let root_str = if root.as_os_str().is_empty() {
        None
    } else {
        Some(root.to_string_lossy().to_string())
    };

    let node_modules = root_str.is_some() && root.join("node_modules").exists();
    let backend_env = root_str.is_some() && root.join("backend").join(".env").exists();
    let frontend_env = root_str.is_some() && root.join("frontend").join(".env.local").exists();

    Ok(Prerequisites {
        node,
        yarn,
        git,
        project_root: root_str,
        node_modules,
        backend_env,
        frontend_env,
    })
}

#[tauri::command]
pub async fn get_project_path(state: State<'_, Arc<AppState>>) -> Result<String, String> {
    Ok(state.root().to_string_lossy().to_string())
}

/// Returns the persisted project root from the config file (or null if not set).
#[tauri::command]
pub async fn get_stored_project_path(state: State<'_, Arc<AppState>>) -> Result<Option<String>, String> {
    if let Ok(json) = std::fs::read_to_string(&state.config_path) {
        if let Ok(cfg) = serde_json::from_str::<crate::state::PersistedConfig>(&json) {
            return Ok(cfg.project_root);
        }
    }
    Ok(None)
}

/// Saves a project root path to config and updates AppState.
#[tauri::command]
pub async fn set_project_path(path: String, state: State<'_, Arc<AppState>>) -> Result<(), String> {
    let p = PathBuf::from(&path);
    if !p.exists() {
        return Err(format!("Path does not exist: {path}"));
    }
    state.set_root(p)?;
    // Ensure log directory exists for the new root
    let _ = std::fs::create_dir_all(state.log_dir());
    Ok(())
}

/// Clones the repo to `dest_parent/repo_name`, then saves the path.
/// Streams git clone output as "clone:log" events.
#[tauri::command]
pub async fn clone_repo(
    dest_dir: String,
    app: AppHandle,
    state: State<'_, Arc<AppState>>,
) -> Result<String, String> {
    use std::io::BufRead;

    let dest = PathBuf::from(&dest_dir);
    if !dest.exists() {
        std::fs::create_dir_all(&dest).map_err(|e| e.to_string())?;
    }

    let _ = app.emit("clone:log", format!("Cloning {REPO_URL} into {dest_dir}…"));

    let mut child = Command::new("git")
        .args(["clone", REPO_URL, "."])
        .current_dir(&dest)
        .env("PATH", augmented_path())
        .stdout(std::process::Stdio::piped())
        .stderr(std::process::Stdio::piped())
        .spawn()
        .map_err(|e| format!("Failed to start git clone: {e}"))?;

    let stderr = child.stderr.take();
    if let Some(err) = stderr {
        let handle = app.clone();
        std::thread::spawn(move || {
            for line in std::io::BufReader::new(err).lines().flatten() {
                let _ = handle.emit("clone:log", &line);
            }
        });
    }

    let status = child.wait().map_err(|e| e.to_string())?;
    if !status.success() {
        return Err(format!("git clone failed — check that {REPO_URL} is accessible"));
    }

    // Save the cloned path as the project root
    state.set_root(dest.clone())?;
    let _ = std::fs::create_dir_all(state.log_dir());

    let _ = app.emit("clone:log", "Clone complete!");
    Ok(dest.to_string_lossy().to_string())
}

/// Opens a URL in the system default browser.
#[tauri::command]
pub async fn open_url(url: String) -> Result<(), String> {
    std::process::Command::new("open")
        .arg(&url)
        .spawn()
        .map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub async fn install_deps(
    app: AppHandle,
    state: State<'_, Arc<AppState>>,
) -> Result<(), String> {
    use std::io::BufRead;

    let root = state.root();
    let mut child = Command::new("yarn")
        .arg("install")
        .current_dir(&root)
        .env("PATH", augmented_path())
        .stdout(std::process::Stdio::piped())
        .stderr(std::process::Stdio::piped())
        .spawn()
        .map_err(|e| e.to_string())?;

    let stdout = child.stdout.take();
    let handle = app.clone();
    if let Some(out) = stdout {
        std::thread::spawn(move || {
            for line in std::io::BufReader::new(out).lines().flatten() {
                let _ = handle.emit("install:log", &line);
            }
        });
    }

    let status = child.wait().map_err(|e| e.to_string())?;
    if !status.success() {
        return Err("yarn install failed".to_string());
    }
    Ok(())
}
