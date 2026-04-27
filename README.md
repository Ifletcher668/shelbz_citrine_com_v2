# shelbz.citrine.com v2 — Monorepo

## Structure

```
shelbz_citrine_com_v2/
├── frontend/          # Next.js (SSG) — deployed to Netlify
├── backend/           # Strapi CMS — deployed to Render
└── package.json       # Workspace root
```

## Packages

| Package    | Description         | Deploy target  |
| ---------- | ------------------- | -------------- |
| `frontend` | Next.js static site | Netlify        |
| `backend`  | Strapi CMS          | localhost only |

## Getting Started

```bash
# Install all workspace dependencies
yarn install

# Run frontend dev server
yarn frontend

# Run backend (Strapi)
yarn backend

# Run both concurrently
yarn dev
```

---
