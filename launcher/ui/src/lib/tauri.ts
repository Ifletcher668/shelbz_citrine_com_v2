import { invoke } from "@tauri-apps/api/core";
import { listen, UnlistenFn } from "@tauri-apps/api/event";

export interface ProcessStatus {
  frontend: boolean;
  backend: boolean;
  storybook: boolean;
}

export interface GitInfo {
  branch: string;
  behind: number;
  ahead: number;
  dirty: number;
}

export interface Prerequisites {
  node: string | null;
  yarn: string | null;
  git: string | null;
  /** The configured project root, or null if not set yet. */
  project_root: string | null;
  node_modules: boolean;
  backend_env: boolean;
  frontend_env: boolean;
}

// Process management
export const startFrontend = () => invoke("start_frontend");
export const startBackend = () => invoke("start_backend");
export const startStorybook = () => invoke("start_storybook");
export const stopProcess = (process: string) => invoke("stop_process", { process });
export const getProcessStatus = () => invoke<ProcessStatus>("get_process_status");

// Git
export const checkUpdates = () => invoke<GitInfo>("check_updates");
export const gitFetch = () => invoke<void>("git_fetch");
export const gitPull = () => invoke<string>("git_pull");

// iCloud
export const icloudSave = () => invoke("icloud_save");
export const icloudRestore = () => invoke("icloud_restore");
export const icloudStatus = () => invoke<string>("icloud_status");

// Deploy
export const publish = () => invoke("publish");

// Logs
export const getLog = (name: string) => invoke<string[]>("get_log", { name });
export const clearLog = (name: string) => invoke("clear_log", { name });

// System
export const openUrl = (url: string) => invoke("open_url", { url });
export const checkPrerequisites = () => invoke<Prerequisites>("check_prerequisites");
export const getStoredProjectPath = () => invoke<string | null>("get_stored_project_path");
export const setProjectPath = (path: string) => invoke("set_project_path", { path });
export const cloneRepo = (destDir: string) => invoke<string>("clone_repo", { destDir: destDir });
export const installDeps = () => invoke("install_deps");
export const getProjectPath = () => invoke<string>("get_project_path");

// Browser
export const showBrowser = (label: string, url: string, x: number, y: number, width: number, height: number) =>
  invoke<void>("show_browser", { label, url, x, y, width, height });
export const hideBrowser = (label: string) => invoke<void>("hide_browser", { label });
export const reloadBrowser = (label: string) => invoke<void>("reload_browser", { label });
export const navigateBrowser = (label: string, url: string) => invoke<void>("navigate_browser", { label, url });

// Event listeners
export const onLog = (process: string, cb: (line: string) => void): Promise<UnlistenFn> =>
  listen<string>(`log:${process}`, (e) => cb(e.payload));

export const onPublishStep = (cb: (msg: string) => void): Promise<UnlistenFn> =>
  listen<string>("publish:step", (e) => cb(e.payload));

export const onInstallLog = (cb: (line: string) => void): Promise<UnlistenFn> =>
  listen<string>("install:log", (e) => cb(e.payload));

export const onCloneLog = (cb: (line: string) => void): Promise<UnlistenFn> =>
  listen<string>("clone:log", (e) => cb(e.payload));
