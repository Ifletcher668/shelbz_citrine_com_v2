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

testing

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

## TODO / Ideas

### Testing & Quality

- [ ] Add unit tests for everything (frontend components, backend utils, launcher logic)
- [ ] Add Claude.md files with rich context where appropriate (per package, key directories)
- [ ] Ensure consistent UI across the app (design tokens, shared component library)

### Data & CMS

- [ ] Save Strapi data to iCloud (local backup/portability)
- [ ] Build seed script: iCloud → Strapi (restore or bootstrap from backup)
- [ ] Implement caching for seeds (avoid re-seeding unchanged content)
- [ ] Enable Next.js preview mode for Strapi content types (draft previews before publish)
- [ ] Add option to change color theme. Wire this to the frontend using css variables. Follow Obsidian's structure for clear variable naming and theming
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
- [ ] Stretch goal: Add image optimization tool based on conventions set for Strapi uploads

### Components & Content Types

- [ ] **Add Header single type** in Strapi
  - `site_name` (string) + `logo` (media)
  - `nav_links` — repeatable `nav/nav-link` component
    - `label` (string, required)
    - `link_type` (enum: `page | blog | store | external`)
    - `page` (relation → Page, used when `link_type = page`)
    - `url` (string, used when `link_type = external`)
    - `open_in_new_tab` (boolean)
  - Grant public `find` permission in bootstrap
- [ ] **Add Footer single type** in Strapi
  - `copyright` (string)
  - `links` — repeatable `nav/nav-link` component (reuse same component)
  - `social_links` — repeatable `nav/social-link` component (`platform` enum + `url`)
  - Grant public `find` permission in bootstrap
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
