# shelbz.citrine.com v2 — Monorepo

## Structure

```
shelbz_citrine_com_v2/
├── frontend/          # Next.js (SSG) — deployed to Netlify
├── backend/           # Strapi CMS — localhost only, never deployed
├── launcher/          # Tauri menu bar app — macOS only
│   ├── src/           # Rust backend (system tray, process management)
│   ├── ui/            # React/HTML frontend for launcher UI
│   └── tauri.conf.json
└── package.json       # Workspace root
```

## Packages

| Package | Description | Deploy target |
|---|---|---|
| `frontend` | Next.js static site | Netlify |
| `backend` | Strapi CMS | localhost only |
| `launcher` | Tauri macOS menu bar app | macOS app bundle |

## Getting Started

```bash
# Install all workspace dependencies
npm install

# Run frontend dev server
npm run frontend

# Run backend (Strapi)
npm run backend

# Run both concurrently
npm run dev
```
