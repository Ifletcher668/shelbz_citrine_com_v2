# Shelbz Citrine Launcher

A macOS menu bar app for managing the shelbz.citrine.com development environment. Start/stop services, watch logs, pull updates, and publish — all from the tray.

---

## Prerequisites

Install these before building or running the launcher:

| Tool | Install |
|------|---------|
| **Rust ≥ 1.77.2** | `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs \| sh` |
| **tauri-cli v2** | `cargo install tauri-cli --version "^2"` |
| **Node.js** | [nodejs.org](https://nodejs.org) or `brew install node` |
| **Yarn** | `npm install -g yarn` |
| **Xcode Command Line Tools** | `xcode-select --install` |

Verify:
```bash
rustc --version    # should be ≥ 1.77.2
cargo tauri --version
node --version
yarn --version
```

---

## Building the App

```bash
# From the repo root
cd launcher/src-tauri
cargo tauri build
```

The `.app` bundle and `.dmg` installer will be output to:
```
launcher/src-tauri/target/release/bundle/macos/shelbz-launcher.app
launcher/src-tauri/target/release/bundle/dmg/shelbz-launcher_*.dmg
```

> **First build takes 5–10 minutes** — Rust compiles from scratch. Subsequent builds are faster.

---

## Setting Up on a New Machine

### Option A — Already have the repo cloned

1. Open the `.app` (or run `cargo tauri dev` in dev mode)
2. The app detects the repo automatically — no setup needed

### Option B — Fresh machine, download `.app` from GitHub

The launcher can clone the repo for you:

1. **Download** `shelbz-launcher.app` from the latest GitHub release
2. **Move** it to `/Applications` and open it
3. The **Setup Screen** appears automatically:
   - Confirm you have Node.js, Yarn, and Git installed (shown as a checklist)
   - Choose **"Clone from GitHub"** and pick a destination folder (default: `~/Projects/shelbz_citrine_com_v2`)
   - Click **"Clone Repository"** — clones `https://github.com/Ifletcher668/dark_lux_heritage_store.git`
4. After cloning, click **"Install Dependencies"** — runs `yarn install`
5. Set up environment files when prompted:
   - `backend/.env` — copy from `backend/.env.example` and fill in secrets
   - `frontend/.env.local` — copy from `frontend/.env.example`
6. Click **"Continue"** — the main dashboard opens

The launcher saves the project path to `~/Library/Application Support/com.shelbzcitrine.launcher/config.json` so it remembers on next launch.

---

## Development Mode

Runs the Rust backend and Vite frontend concurrently with hot-reload:

```bash
cd launcher/src-tauri
cargo tauri dev
```

This automatically starts the Vite dev server on port 1420 (`beforeDevCommand` in `tauri.conf.json`).

To work on just the UI without rebuilding Rust:
```bash
cd launcher/ui
yarn dev
```

---

## Project Structure

```
launcher/
  src-tauri/              # Rust backend (Tauri v2)
    Cargo.toml
    tauri.conf.json
    src/
      main.rs             # entry: tray setup, AppState init, command registration
      state.rs            # AppState: process handles, project root, persisted config
      tray.rs             # tray icon click → show/hide window
      commands/
        processes.rs      # start/stop frontend, backend, storybook
        git.rs            # git fetch, pull, status
        icloud.rs         # delegates to yarn icloud:* scripts
        deploy.rs         # POST to Netlify build hook
        logs.rs           # read/clear log files
        system.rs         # prerequisites check, clone repo, install deps
    icons/                # app + tray icons (all sizes)
    build.rs
  ui/                     # React + Vite frontend
    src/
      App.tsx             # routing: loading → setup → dashboard
      components/
        SetupScreen.tsx   # first-time setup wizard
        StatusPanel.tsx   # per-service status + start/stop
        ActionBar.tsx     # Start Both / Stop All / Publish
        GitStatus.tsx     # branch info + Pull button
        LogViewer.tsx     # tabbed real-time log output
        PublishFlow.tsx   # iCloud save + Netlify deploy flow
      hooks/
        useProcessStatus.ts
        useLogs.ts
      lib/
        tauri.ts          # typed invoke() + listen() wrappers
```

---

## Troubleshooting

**"Rust version too old"**
```bash
rustup update stable
```

**"cargo tauri: command not found"**
```bash
cargo install tauri-cli --version "^2"
```

**Icons missing during build**
```bash
cd launcher/src-tauri
cargo tauri icon icons/128x128@2x.png
```

**App won't open (macOS Gatekeeper)**
```bash
xattr -cr /Applications/shelbz-launcher.app
```
Or: System Settings → Privacy & Security → "Open Anyway"

**Port 1420 already in use (dev mode)**
```bash
lsof -ti:1420 | xargs kill
```

**Orphaned node processes after crash**
```bash
pkill -f "next dev"
pkill -f "strapi"
```
