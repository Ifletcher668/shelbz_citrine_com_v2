use std::sync::Arc;
use tauri::{AppHandle, LogicalPosition, LogicalSize, Manager, Rect, State, WebviewBuilder, WebviewUrl};
use tauri::webview::PageLoadEvent;
use crate::state::AppState;

/// Read STRAPI_ADMIN_EMAIL and STRAPI_ADMIN_PASSWORD from a .env file.
fn read_backend_credentials(env_path: &std::path::Path) -> Option<(String, String)> {
    let content = std::fs::read_to_string(env_path).ok()?;
    let mut email = None;
    let mut password = None;
    for line in content.lines() {
        let line = line.trim();
        if let Some(val) = line.strip_prefix("STRAPI_ADMIN_EMAIL=") {
            email = Some(val.trim_matches('"').to_string());
        } else if let Some(val) = line.strip_prefix("STRAPI_ADMIN_PASSWORD=") {
            password = Some(val.trim_matches('"').to_string());
        }
    }
    match (email, password) {
        (Some(e), Some(p)) if !e.is_empty() && !p.is_empty() => Some((e, p)),
        _ => None,
    }
}

#[tauri::command]
pub async fn show_browser(
    app: AppHandle,
    state: State<'_, Arc<AppState>>,
    label: String,
    url: String,
    x: f64,
    y: f64,
    width: f64,
    height: f64,
) -> Result<(), String> {
    // Pre-read credentials for the backend browser before any async moves.
    let credentials = if label == "browser-backend" {
        let env_path = state.root().join("launcher").join(".env");
        read_backend_credentials(&env_path)
    } else {
        None
    };

    if let Some(webview) = app.get_webview(&label) {
        webview.show().map_err(|e| e.to_string())?;
        webview
            .set_bounds(Rect {
                position: LogicalPosition::new(x, y).into(),
                size: LogicalSize::new(width, height).into(),
            })
            .map_err(|e| e.to_string())?;
    } else {
        let window = app
            .get_window("main")
            .ok_or_else(|| "main window not found".to_string())?;
        let parsed_url = url.parse::<tauri::Url>().map_err(|e| e.to_string())?;

        let mut builder = WebviewBuilder::new(&label, WebviewUrl::External(parsed_url));

        if let Some((email, password)) = credentials {
            // Escape any backslashes or quotes in the credential strings.
            let safe_email = email.replace('\\', "\\\\").replace('"', "\\\"");
            let safe_password = password.replace('\\', "\\\\").replace('"', "\\\"");

            let script = format!(
                r#"(function poll() {{
                    var el = document.querySelector('input[name="email"]');
                    var pw = document.querySelector('input[name="password"]');
                    if (el && pw && !el.value) {{
                        var setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
                        setter.call(el, "{safe_email}");
                        el.dispatchEvent(new Event('input', {{ bubbles: true }}));
                        setter.call(pw, "{safe_password}");
                        pw.dispatchEvent(new Event('input', {{ bubbles: true }}));
                        var btn = document.querySelector('button[type="submit"]');
                        if (btn) btn.click();
                    }} else if (!el) {{
                        setTimeout(poll, 300);
                    }}
                }})();"#
            );

            builder = builder.on_page_load(move |webview, payload| {
                if payload.event() == PageLoadEvent::Finished {
                    let _ = webview.eval(&script);
                }
            });
        }

        window
            .add_child(
                builder,
                LogicalPosition::new(x, y),
                LogicalSize::new(width, height),
            )
            .map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[tauri::command]
pub async fn hide_browser(app: AppHandle, label: String) -> Result<(), String> {
    if let Some(webview) = app.get_webview(&label) {
        webview.hide().map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[tauri::command]
pub async fn reload_browser(app: AppHandle, label: String) -> Result<(), String> {
    if let Some(webview) = app.get_webview(&label) {
        webview
            .eval("window.location.reload()")
            .map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[tauri::command]
pub async fn navigate_browser(app: AppHandle, label: String, url: String) -> Result<(), String> {
    let parsed = url.parse::<tauri::Url>().map_err(|e| e.to_string())?;
    if let Some(webview) = app.get_webview(&label) {
        webview.navigate(parsed).map_err(|e| e.to_string())?;
    }
    Ok(())
}
