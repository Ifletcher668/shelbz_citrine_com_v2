use std::sync::Arc;
use std::sync::atomic::{AtomicBool, Ordering};
use tauri::{AppHandle, Emitter, LogicalPosition, LogicalSize, Manager, Rect, State, WebviewBuilder, WebviewUrl};
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
    // Seed the URL map so get_webview_url works before any explicit navigation.
    state.browser_urls.lock().unwrap().entry(label.clone()).or_insert_with(|| url.clone());

    if let Some(webview) = app.get_webview(&label) {
        webview.show().map_err(|e| e.to_string())?;
        webview
            .set_bounds(Rect {
                position: LogicalPosition::new(x, y).into(),
                size: LogicalSize::new(width, height).into(),
            })
            .map_err(|e| e.to_string())?;

        // If this webview has never successfully finished loading (e.g. was blank),
        // re-navigate now that it is visible again.
        let already_loaded = state.browser_loaded.lock().unwrap().contains(&label);
        if !already_loaded {
            if let Ok(nav_url) = url.parse::<tauri::Url>() {
                let wv = webview.clone();
                std::thread::spawn(move || {
                    std::thread::sleep(std::time::Duration::from_millis(150));
                    let _ = wv.navigate(nav_url);
                });
            }
        }
    } else {
        let window = app
            .get_window("main")
            .ok_or_else(|| "main window not found".to_string())?;
        let parsed_url = url.parse::<tauri::Url>().map_err(|e| e.to_string())?;

        // Pre-build the credential injection script (backend only).
        let credential_script: Option<String> = if label == "browser-backend" {
            let env_path = state.root().join("launcher").join(".env");
            read_backend_credentials(&env_path).map(|(email, password)| {
                let safe_email = email.replace('\\', "\\\\").replace('"', "\\\"");
                let safe_password = password.replace('\\', "\\\\").replace('"', "\\\"");
                format!(
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
                )
            })
        } else {
            None
        };

        // Shared state for the page-load handler.
        let first_load_done = Arc::new(AtomicBool::new(false));
        let app_clone = app.clone();
        let state_clone = Arc::clone(state.inner());
        let label_for_handler = label.clone();
        let nav_url_for_reload = parsed_url.clone();

        let builder = WebviewBuilder::new(&label, WebviewUrl::External(parsed_url.clone()))
            .on_page_load(move |webview, payload| {
                if payload.event() != PageLoadEvent::Finished {
                    return;
                }

                let already_loaded = state_clone
                    .browser_loaded
                    .lock()
                    .unwrap()
                    .contains(&label_for_handler);

                if already_loaded {
                    // Browser already completed its initial two-phase load.
                    // Subsequent navigations just re-emit the loaded signal and
                    // re-run credential injection so login pages are auto-filled.
                    let _ = app_clone.emit(
                        &format!("browser:loaded:{}", label_for_handler),
                        (),
                    );
                    if let Some(ref script) = credential_script {
                        let _ = webview.eval(script);
                    }
                } else if !first_load_done.swap(true, Ordering::SeqCst) {
                    // First load complete: re-navigate to fix WKWebView blank-screen
                    // bug on macOS. We wait until after the first Finished event so we
                    // don't interrupt a page that is still loading.
                    let url = nav_url_for_reload.clone();
                    let wv = webview.clone();
                    std::thread::spawn(move || {
                        std::thread::sleep(std::time::Duration::from_millis(100));
                        let _ = wv.navigate(url);
                    });
                } else {
                    // Second load (the re-navigate above): the page is now visible.
                    // Mark as loaded and notify the frontend.
                    state_clone
                        .browser_loaded
                        .lock()
                        .unwrap()
                        .insert(label_for_handler.clone());
                    let _ = app_clone.emit(
                        &format!("browser:loaded:{}", label_for_handler),
                        (),
                    );
                    if let Some(ref script) = credential_script {
                        let _ = webview.eval(script);
                    }
                }
            });

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
pub async fn navigate_browser(
    app: AppHandle,
    state: State<'_, Arc<AppState>>,
    label: String,
    url: String,
) -> Result<(), String> {
    let parsed = url.parse::<tauri::Url>().map_err(|e| e.to_string())?;
    if let Some(webview) = app.get_webview(&label) {
        webview.navigate(parsed).map_err(|e| e.to_string())?;
        state.browser_urls.lock().unwrap().insert(label, url);
    }
    Ok(())
}

#[tauri::command]
pub async fn go_back(app: AppHandle, label: String) -> Result<(), String> {
    if let Some(webview) = app.get_webview(&label) {
        webview.eval("window.history.back()").map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[tauri::command]
pub async fn go_forward(app: AppHandle, label: String) -> Result<(), String> {
    if let Some(webview) = app.get_webview(&label) {
        webview.eval("window.history.forward()").map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[tauri::command]
pub async fn get_webview_url(
    state: State<'_, Arc<AppState>>,
    label: String,
) -> Result<String, String> {
    let map = state.browser_urls.lock().unwrap();
    map.get(&label)
        .cloned()
        .ok_or_else(|| "Webview URL not tracked".to_string())
}
