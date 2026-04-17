use std::fs::OpenOptions;
use std::io::{BufRead, Write};
use std::process::{Command, Stdio};
use tauri::{AppHandle, Emitter};

/// Build an augmented PATH for yarn commands run from a GUI app (no shell inheritance on macOS).
pub(crate) fn augmented_path(project_root: &std::path::Path) -> String {
    let current_path = std::env::var("PATH").unwrap_or_default();
    let home = std::env::var("HOME").unwrap_or_default();

    let node_bin = std::fs::read_to_string(project_root.join(".node-version"))
        .ok()
        .map(|v| v.trim().to_string())
        .and_then(|v| {
            let mise = format!("{home}/.local/share/mise/installs/node/{v}/bin");
            if std::path::Path::new(&mise).exists() { return Some(mise); }
            let nvm = format!("{home}/.nvm/versions/node/v{v}/bin");
            if std::path::Path::new(&nvm).exists() { return Some(nvm); }
            None
        })
        .unwrap_or_default();

    format!("{node_bin}:/opt/homebrew/bin:/opt/homebrew/sbin:/usr/local/bin:/usr/local/sbin:{current_path}")
}

/// Append a message to the unified launcher log file and emit it as a `log:launcher` event.
/// Use this for lifecycle events (start, success, failure) and any non-streaming notes.
pub(crate) fn launcher_log(app: &AppHandle, log_dir: &std::path::Path, msg: &str) {
    let _ = app.emit("log:launcher", msg);
    if let Ok(mut f) = OpenOptions::new()
        .create(true)
        .append(true)
        .open(log_dir.join("launcher.log"))
    {
        let _ = writeln!(f, "{msg}");
    }
}

/// Run a yarn script, streaming stdout+stderr to both a specific Tauri event channel
/// (for inline UI display) and the unified launcher log.
///
/// Uses std::process::Command — Tauri 2's internal Tokio runtime does not enable the
/// I/O driver required by tokio::process::Command. The blocking child.wait() is moved
/// to a spawn_blocking thread so it doesn't stall the async runtime.
pub(crate) async fn run_yarn_streaming(
    args: &[&str],
    project_root: &std::path::Path,
    app: &AppHandle,
    event: &str,
    log_dir: &std::path::Path,
) -> Result<(), String> {
    let path = augmented_path(project_root);

    let mut child = Command::new("yarn")
        .args(args)
        .current_dir(project_root)
        .env("PATH", &path)
        .stdin(Stdio::null())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| format!("Failed to start yarn: {e}"))?;

    let stdout = child.stdout.take();
    let stderr = child.stderr.take();
    let ev = event.to_string();
    let ev_err = ev.clone();
    let handle_out = app.clone();
    let handle_err = app.clone();
    let log_dir_out = log_dir.to_path_buf();
    let log_dir_err = log_dir.to_path_buf();

    if let Some(out) = stdout {
        std::thread::spawn(move || {
            let mut launcher_file = OpenOptions::new()
                .create(true).append(true)
                .open(log_dir_out.join("launcher.log")).ok();
            for line in std::io::BufReader::new(out).lines().flatten() {
                let _ = handle_out.emit(&ev, &line);
                let _ = handle_out.emit("log:launcher", &line);
                if let Some(f) = &mut launcher_file { let _ = writeln!(f, "{line}"); }
            }
        });
    }

    if let Some(err) = stderr {
        std::thread::spawn(move || {
            let mut launcher_file = OpenOptions::new()
                .create(true).append(true)
                .open(log_dir_err.join("launcher.log")).ok();
            for line in std::io::BufReader::new(err).lines().flatten() {
                let prefixed = format!("[err] {line}");
                let _ = handle_err.emit(&ev_err, &prefixed);
                let _ = handle_err.emit("log:launcher", &prefixed);
                if let Some(f) = &mut launcher_file { let _ = writeln!(f, "{prefixed}"); }
            }
        });
    }

    let status = tokio::task::spawn_blocking(move || child.wait())
        .await
        .map_err(|e| format!("Task join error: {e}"))?
        .map_err(|e| e.to_string())?;

    if !status.success() {
        return Err(format!("yarn {} exited with status {status}", args.join(" ")));
    }
    Ok(())
}
