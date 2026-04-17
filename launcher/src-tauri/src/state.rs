use std::collections::{HashMap, HashSet};
use std::path::PathBuf;
use std::process::Child;
use std::sync::Mutex;
use serde::{Deserialize, Serialize};

pub struct ProcessHandles {
    pub frontend: Option<Child>,
    pub backend: Option<Child>,
    pub storybook: Option<Child>,
}

pub struct AppState {
    /// Project root — may be empty initially (not-yet-configured).
    pub project_root: Mutex<PathBuf>,
    pub handles: Mutex<ProcessHandles>,
    /// Path to the persisted config JSON for this app.
    pub config_path: PathBuf,
    /// Tracks the current URL for each named browser webview (label → url).
    pub browser_urls: Mutex<HashMap<String, String>>,
    /// Tracks which browser webviews have fully completed their initial load.
    pub browser_loaded: Mutex<HashSet<String>>,
}

#[derive(Serialize, Deserialize, Default)]
pub struct PersistedConfig {
    pub project_root: Option<String>,
}

impl AppState {
    pub fn new(config_path: PathBuf, initial_root: PathBuf) -> Self {
        AppState {
            project_root: Mutex::new(initial_root),
            handles: Mutex::new(ProcessHandles {
                frontend: None,
                backend: None,
                storybook: None,
            }),
            config_path,
            browser_urls: Mutex::new(HashMap::new()),
            browser_loaded: Mutex::new(HashSet::new()),
        }
    }

    /// Returns a snapshot of the current project root.
    pub fn root(&self) -> PathBuf {
        self.project_root.lock().unwrap().clone()
    }

    /// Derives the log directory from the current project root.
    pub fn log_dir(&self) -> PathBuf {
        self.root().join("launcher").join("logs")
    }

    /// Persists a new project root to the config file and updates state.
    pub fn set_root(&self, new_root: PathBuf) -> Result<(), String> {
        if let Some(parent) = self.config_path.parent() {
            std::fs::create_dir_all(parent).map_err(|e| e.to_string())?;
        }
        let cfg = PersistedConfig {
            project_root: Some(new_root.to_string_lossy().to_string()),
        };
        let json = serde_json::to_string_pretty(&cfg).map_err(|e| e.to_string())?;
        std::fs::write(&self.config_path, json).map_err(|e| e.to_string())?;
        *self.project_root.lock().unwrap() = new_root;
        Ok(())
    }
}
