# Frontend Type-Check & Sync Design

**Date:** 2026-04-06  
**Branch:** feature/wysiwyg-enhancements  
**Status:** Approved

---

## Problem

The frontend has 23 TypeScript errors (4 root causes) that fail `next build` in CI. There is also no CI enforcement of type-checking (`tsc`) or type synchronisation between `backend/types/generated/` and `frontend/types/strapi-generated/`.

---

## Scope

- Fix all current TypeScript errors in the frontend (no `.jsx` → `.tsx` conversions)
- Add a `frontend-typecheck` CI job
- Add a `types-in-sync` CI job (hard gate: fails if generated types have drifted)

Out of scope: converting `.jsx` files to `.tsx`, composite local scripts, pre-commit hooks.

---

## TypeScript Error Fixes

### Root cause 1 — `@types/jest` not installed

**Symptoms:** `describe`, `it`, `expect` unknown in `RowCms.test.tsx` (20 errors).

**Fix:** Add `@types/jest` to `frontend/package.json` devDependencies and run `yarn install`.

The tsconfig includes `**/*.tsx`, which pulls in test files. TypeScript needs jest globals typed.

---

### Root cause 2 — `Section.jsx` `forwardRef` loses `children` prop

**Symptoms:** `RowCms.tsx` line 20 — "Property 'children' does not exist on type 'IntrinsicAttributes & RefAttributes<any>'".

React 18 removed the implicit `PropsWithChildren` from `FC` and `forwardRef`. TypeScript's JS inference does not recover `children` from the destructuring parameters alone.

**Fix:** Add a JSDoc `@typedef` + `@type` annotation to `Section.jsx`'s `forwardRef` call so TypeScript sees `children` as an accepted prop. Specifically, annotate the props parameter with `@param {{ children: React.ReactNode, [key: string]: any }}`.

---

### Root cause 3 — `className` inferred as required `any` in JS components

**Symptoms:**
- `RowCms.tsx` line 27 — `Container` missing `className`
- `RowCms.tsx` line 40 — `RichContent` missing `className`

TypeScript infers destructured props without defaults as required. `className` has no default in either `Container` or `RichContent`.

**Fix:** Add `className = undefined` as the default value in the destructuring of both components.

---

### Root cause 4 — `makeRow` fixture widens `__component` to `string`

**Symptoms:** `RowCms.test.tsx` lines 7, 13, 19, 24, 29, 34 — `__component: string` not assignable to `"sections.row"`.

`fixtures.js` is untyped JS; TypeScript widens string literals in object literals.

**Fix:** Add `/** @returns {import('../../../types/cms').StrapiRow} */` JSDoc to `makeRow` in `Components/cms/__tests__/fixtures.js`.

---

## CI Additions

Two new jobs added to `.github/workflows/ci.yml`, parallel with existing frontend jobs:

### `frontend-typecheck`

```
needs: install
runs: yarn workspace shelbz-citrine-frontend type-check
```

Runs `tsc --noEmit` via the existing `type-check` package script. Fails fast on any TypeScript error before the build runs.

### `types-in-sync`

```
needs: (none — no node_modules required)
runs:
  1. node frontend/scripts/sync-strapi-types.js
  2. git diff --exit-code frontend/types/strapi-generated/
```

Copies `backend/types/generated/*.d.ts` → `frontend/types/strapi-generated/` by calling the sync script directly with `node` (no yarn workspace invocation needed). Then checks whether the working tree changed. If it did, the job fails with a message instructing the developer to run `yarn workspace shelbz-citrine-frontend sync-types` locally and commit the result.

Does not need the shared `install` cache because the `sync-types` script uses only Node.js built-in modules (`fs`, `path`).

---

## Files Changed

| File | Change |
|---|---|
| `frontend/package.json` | Add `@types/jest` to devDependencies |
| `frontend/Components/layout/Section.jsx` | Add JSDoc props annotation to `forwardRef` call |
| `frontend/Components/layout/Section.jsx` | Add `className = undefined` default to `Container` |
| `frontend/Components/shared/RichContent.jsx` | Add `className = undefined` default |
| `frontend/Components/cms/__tests__/fixtures.js` | Add `@returns` JSDoc to `makeRow` |
| `.github/workflows/ci.yml` | Add `frontend-typecheck` and `types-in-sync` jobs |

---

## Success Criteria

- `yarn workspace shelbz-citrine-frontend type-check` exits 0
- `next build` completes without type errors
- CI passes all jobs including `frontend-typecheck` and `types-in-sync`
- Drifted types cause `types-in-sync` to fail with a clear, actionable message
