// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod state;
mod tray;

use std::path::PathBuf;
use std::sync::Arc;
use tauri::{Manager, RunEvent};
use commands::{browser, deploy, git, icloud, logs, processes, system};
use state::{AppState, PersistedConfig};

const APP_SUPPORT_SUBDIR: &str = "com.shelbzcitrine.launcher";
const CONFIG_FILE: &str = "config.json";

fn config_path() -> PathBuf {
    let base = dirs::data_dir()
        .unwrap_or_else(|| PathBuf::from("~/.local/share"));
    base.join(APP_SUPPORT_SUBDIR).join(CONFIG_FILE)
}

/// Load persisted project root from config, falling back to the dev-mode location.
fn load_project_root(config_path: &PathBuf) -> PathBuf {
    // 1. Try persisted config
    if let Ok(json) = std::fs::read_to_string(config_path) {
        if let Ok(cfg) = serde_json::from_str::<PersistedConfig>(&json) {
            if let Some(root) = cfg.project_root {
                let p = PathBuf::from(root);
                if p.exists() {
                    return p;
                }
            }
        }
    }

    // 2. Dev-mode fallback: CARGO_MANIFEST_DIR is only set at compile time.
    //    launcher/src-tauri is 2 levels below the project root.
    let manifest_dir = env!("CARGO_MANIFEST_DIR");
    let dev_root = PathBuf::from(manifest_dir)
        .parent()
        .and_then(|p| p.parent())
        .map(|p| p.to_path_buf());

    if let Some(root) = dev_root {
        if root.join("package.json").exists() {
            return root;
        }
    }

    // 3. Not found — return empty path; UI will show setup/clone screen.
    PathBuf::new()
}

/// Kill any processes still listening on our managed dev ports from a previous
/// session that crashed or was force-quit before the normal exit handler ran.
fn kill_orphaned_dev_ports() {
    for port in [3000u16, 1337, 6006] {
        let Ok(out) = std::process::Command::new("lsof")
            .args(["-ti", &format!(":{port}")])
            .output()
        else {
            continue;
        };
        for pid_str in String::from_utf8_lossy(&out.stdout).split_whitespace() {
            if let Ok(pid) = pid_str.parse::<libc::pid_t>() {
                unsafe { libc::kill(pid, libc::SIGKILL); }
            }
        }
    }
}

fn main() {
    kill_orphaned_dev_ports();
    let cfg_path = config_path();
    let initial_root = load_project_root(&cfg_path);
    let app_state = Arc::new(AppState::new(cfg_path, initial_root));
    let state_for_exit = app_state.clone();

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .manage(app_state)
        .setup(|app| {
            tray::setup_tray(app)?;
            if let Some(state) = app.try_state::<Arc<AppState>>() {
                let log_dir = state.log_dir();
                if log_dir != PathBuf::new().join("launcher").join("logs") {
                    let _ = std::fs::create_dir_all(&log_dir);
                }
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            // browser
            browser::show_browser,
            browser::hide_browser,
            browser::reload_browser,
            browser::navigate_browser,
            browser::go_back,
            browser::go_forward,
            browser::get_webview_url,
            // processes
            processes::start_frontend,
            processes::start_backend,
            processes::start_storybook,
            processes::stop_process,
            processes::get_process_status,
            // git
            git::check_updates,
            git::git_fetch,
            git::git_pull,
            // icloud
            icloud::icloud_save,
            icloud::icloud_restore,
            icloud::icloud_status,
            // deploy
            deploy::publish,
            deploy::get_deploy_status,
            // logs
            logs::get_log,
            logs::clear_log,
            // system
            system::check_prerequisites,
            system::install_deps,
            system::open_url,
            system::get_project_path,
            system::get_stored_project_path,
            system::set_project_path,
            system::clone_repo,
        ])
        .build(tauri::generate_context!())
        .expect("error while building tauri application")
        .run(move |app_handle, event| {
            match event {
                RunEvent::ExitRequested { .. } => {
                    processes::kill_all_processes(&state_for_exit);
                }
                RunEvent::Reopen { .. } => {
                    if let Some(window) = app_handle.get_webview_window("main") {
                        let _ = window.show();
                        let _ = window.set_focus();
                    }
                }
                _ => {}
            }
        });
}
