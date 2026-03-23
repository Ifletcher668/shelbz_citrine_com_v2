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

| Package    | Description              | Deploy target    |
| ---------- | ------------------------ | ---------------- |
| `frontend` | Next.js static site      | Netlify          |
| `backend`  | Strapi CMS               | localhost only   |
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

---

## iCloud Data Sync

Strapi data (database + uploaded media) is shared between collaborators via a folder in iCloud Drive:

```
~/Library/Mobile Documents/com~apple~CloudDocs/shelbz_citrine_com_cms_data/
├── current/      # Latest save
├── backups/      # Last 5 saves (auto-pruned)
└── meta.json     # Who saved last and when
```

The local database at `backend/.tmp/data.db` is the working copy. Scripts push/pull between local and iCloud explicitly.

### First-time setup (just cloned the repo)

```bash
yarn icloud:restore   # Pull latest data from iCloud
yarn backend          # Start Strapi
```

If restore reports "No database found in iCloud", nobody has saved yet — just run `yarn backend` to create a fresh DB, then `yarn icloud:save` when done.

### Daily workflow

```bash
yarn icloud:restore   # Pull latest before starting
yarn backend          # Work in Strapi
# (stop Strapi when done)
yarn icloud:save      # Push changes to iCloud
```

### Restore a previous version

```bash
yarn icloud:status                          # List available backups
yarn icloud:restore --backup <backup-name>  # Restore a specific backup
```

### Rules

1. **Never run Strapi simultaneously** — two people editing SQLite at once causes corruption. Coordinate first.
2. **Restore before starting** to get your collaborator's latest changes.
3. **Save after finishing** so your changes are available to your collaborator.
4. If iCloud shows files with a cloud icon in Finder, click them to download before running restore.

---

## TODO / Ideas

### Testing & Quality

- [ ] Add unit tests for everything (frontend components, backend utils, launcher logic)
- [ ] Add Claude.md files with rich context where appropriate (per package, key directories)
- [ ] Ensure consistent UI across the app (design tokens, shared component library)

### Data & CMS

- [x] Save Strapi data to iCloud (local backup/portability)
- [x] Build seed script: iCloud → Strapi (restore or bootstrap from backup)
- [ ] Implement caching for seeds (avoid re-seeding unchanged content)
- [ ] Enable Next.js preview mode for Strapi content types (draft previews before publish)
- [x] Add option to change color theme. Wire this to the frontend using css variables. Follow Obsidian's structure for clear variable naming and theming
- [ ] Whitelabel Strapi to look prettier

### Developer Experience

- [ ] Add telemetry with detailed log files (structured logs pasteable into Claude for debugging)
- [ ] Build out Storybook for each Strapi component type
- [ ] Build out Storybook for each Layout/Page composition component
- [ ] Build out Storybook for style tokens/theming/documentation on customization

### Launcher (`/launcher`)

- [ ] Add first time launch that clones the repos. Subsequent launches check for git diff and pulls/rebuilds if necessary.
- [ ] Launch frontend and backend concurrently from the menu bar app
- [ ] Add a **Publish** button: saves new Strapi data to iCloud + triggers a Netlify deploy
- [ ] Option to launch Storybook from the launcher
- [ ] Option to view the log files for debugging
- [ ] Install dependencies with launcher (node, etc)
- [ ] Detect if github repo is different than local one and suggest to "update to latest version" 
- [ ] Stretch goal: Add image optimization tool based on conventions set for Strapi uploads

### Components & Content Types

- [-] **Add Header single type** in Strapi
- [-] **Add Footer single type** in Strapi
- [ ] Build out every Strapi component type
  - Audit current hard-coded pages for all component patterns
  - Build each component, add tests, add Storybook stories
- [ ] Add option for spans with arbitrary colors/borders/underlines in the .md text editor
- [ ] Build out Blog content type (posts, categories, tags, RSS feed)
- [ ] Build out Store (e-commerce — likely Stripe for payments)

### Suggestions

- [ ] SEO / sitemap: auto-generate `sitemap.xml` and `robots.txt` at build time (Next.js)
- [ ] Accessibility audit (a11y): run Lighthouse CI or axe on every page
- [ ] Privacy-friendly analytics (Plausible or Fathom — no cookies, GDPR-safe)
- [ ] Image optimization pipeline: define conventions for media uploads in Strapi (formats, max size)
- [ ] GitHub Actions CI: lint, type-check, and test on every push
- [ ] Environment variable documentation: add a `.env.example` to each package with all required vars described
