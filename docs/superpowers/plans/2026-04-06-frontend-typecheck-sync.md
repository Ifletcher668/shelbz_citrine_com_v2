# Frontend Type-Check & Sync Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all 23 TypeScript errors in the frontend, then add `frontend-typecheck` and `types-in-sync` CI jobs to prevent regressions.

**Architecture:** Four targeted annotation-only fixes (no `.jsx`→`.tsx` conversions) eliminate the type errors. Two new parallel CI jobs enforce a clean `tsc` and validate that `frontend/types/strapi-generated/` always mirrors `backend/types/generated/`.

**Tech Stack:** TypeScript 5, Next.js 15, Jest 29, GitHub Actions

---

## File Map

| File | Change |
|---|---|
| `frontend/package.json` | Add `@types/jest` to `devDependencies` |
| `frontend/Components/layout/Section.jsx` | JSDoc `@type` on `Section` export; `className = undefined` default in `Container` |
| `frontend/Components/shared/RichContent.jsx` | `className = undefined` default |
| `frontend/Components/cms/__tests__/fixtures.js` | `@returns` JSDoc on `makeRow` |
| `.github/workflows/ci.yml` | Add `frontend-typecheck` and `types-in-sync` jobs |

---

## Task 1: Install `@types/jest`

The tsconfig includes `**/*.tsx` which pulls test files in. TypeScript has no type definitions for `describe`, `it`, or `expect` because `@types/jest` is absent.

**Files:**
- Modify: `frontend/package.json`

- [ ] **Verify the current failure**

```bash
cd frontend && yarn type-check 2>&1 | grep "TS2582\|TS2304" | wc -l
```

Expected: `17` (17 lines matching those two error codes)

- [ ] **Add `@types/jest` to devDependencies**

In `frontend/package.json`, add inside `"devDependencies"`:

```json
"@types/jest": "^29.5.14",
```

Full devDependencies block after edit:

```json
"devDependencies": {
  "@types/jest": "^29.5.14",
  "@types/node": "^25.5.2",
  "@types/react": "^19.2.14",
  "@types/react-dom": "^19.2.3",
  "autoprefixer": "^10.4.20",
  "eslint": "^9.18.0",
  "eslint-config-next": "^15.5.10",
  "postcss": "^8.4.49",
  "tailwindcss": "^4.1.18",
  "typescript": "^5.9.3"
}
```

- [ ] **Install**

```bash
cd /Users/artorias/Projects/shelbz_citrine_com_v2 && yarn install
```

Expected: exits 0, new `@types/jest` entry appears in lockfile. (`--frozen-lockfile` would fail here since the lockfile is being updated with a new package.)

- [ ] **Confirm those 17 errors are gone**

```bash
cd frontend && yarn type-check 2>&1 | grep "TS2582\|TS2304"
```

Expected: no output. Remaining errors are only `TS2322` and `TS2741`.

- [ ] **Commit**

```bash
git add frontend/package.json yarn.lock && git commit -m "fix: add @types/jest to eliminate TS2582/TS2304 in test files"
```

---

## Task 2: Fix `makeRow` fixture type widening

`fixtures.js` is untyped JS. TypeScript widens `__component: 'sections.row'` to `string`. `RowCms.test.tsx` passes the result to `RowCms` which expects `StrapiRow` (requiring the literal `"sections.row"`).

**Files:**
- Modify: `frontend/Components/cms/__tests__/fixtures.js`

- [ ] **Verify the current TS2322 errors in the test file**

```bash
cd frontend && yarn type-check 2>&1 | grep "RowCms.test.tsx.*TS2322"
```

Expected: 6 lines (one per `makeRow()` call in the test).

- [ ] **Add `@returns` JSDoc to `makeRow`**

In `frontend/Components/cms/__tests__/fixtures.js`, change the `makeRow` function from:

```js
export function makeRow(overrides = {}) {
  return {
    __component: 'sections.row',
```

to:

```js
/**
 * @returns {import('../../../types/cms').StrapiRow}
 */
export function makeRow(overrides = {}) {
  return {
    __component: 'sections.row',
```

- [ ] **Verify the 6 TS2322 errors in the test file are gone**

```bash
cd frontend && yarn type-check 2>&1 | grep "RowCms.test.tsx"
```

Expected: no output (all 20 test-file errors should now be resolved between Task 1 and Task 2).

- [ ] **Commit**

```bash
git add frontend/Components/cms/__tests__/fixtures.js && git commit -m "fix: annotate makeRow return type to narrow __component literal"
```

---

## Task 3: Fix `Section` forwardRef losing the `children` prop

React 18 removed implicit `PropsWithChildren` from `forwardRef`. TypeScript's JS inference of the `.jsx` file loses the props shape entirely, leaving only `RefAttributes<any>`. A JSDoc `@type` on the exported constant restores the full prop surface.

**Files:**
- Modify: `frontend/Components/layout/Section.jsx`

- [ ] **Verify the current error**

```bash
cd frontend && yarn type-check 2>&1 | grep "RowCms.tsx(20"
```

Expected: one line — `Property 'children' does not exist on type 'IntrinsicAttributes & RefAttributes<any>'`.

- [ ] **Add `@type` annotation to the `Section` export**

In `frontend/Components/layout/Section.jsx`, change:

```js
export const Section = forwardRef(
  (
    {
      children,
```

to:

```js
/**
 * @type {React.ForwardRefExoticComponent<{
 *   children?: React.ReactNode;
 *   className?: string;
 *   variant?: "default" | "hero";
 *   background?: string;
 *   overlay?: string;
 *   texture?: { variant: string; opacity: number } | false;
 *   corners?: string | false;
 *   cornerSize?: number;
 *   cornerColor?: string;
 *   id?: string;
 *   [key: string]: any;
 * } & React.RefAttributes<HTMLElement>>}
 */
export const Section = forwardRef(
  (
    {
      children,
```

- [ ] **Verify the children error is gone**

```bash
cd frontend && yarn type-check 2>&1 | grep "RowCms.tsx(20"
```

Expected: no output.

- [ ] **Commit**

```bash
git add frontend/Components/layout/Section.jsx && git commit -m "fix: annotate Section forwardRef props to restore children in TS"
```

---

## Task 4: Fix `className` inferred as required in `Container` and `RichContent`

TypeScript infers a destructured prop with no default as required `any`. Adding `= undefined` makes it optional.

**Files:**
- Modify: `frontend/Components/layout/Section.jsx` (`Container` function)
- Modify: `frontend/Components/shared/RichContent.jsx`

- [ ] **Verify the two remaining errors**

```bash
cd frontend && yarn type-check 2>&1 | grep "TS2741"
```

Expected: 2 lines — `RowCms.tsx(27` (Container) and `RowCms.tsx(40` (RichContent).

- [ ] **Add `className = undefined` to `Container`**

In `frontend/Components/layout/Section.jsx`, change the `Container` function signature from:

```js
export const Container = ({ children, size = "wide", className, ...props }) => {
```

to:

```js
export const Container = ({ children, size = "wide", className = undefined, ...props }) => {
```

- [ ] **Add `className = undefined` to `RichContent`**

In `frontend/Components/shared/RichContent.jsx`, change:

```js
export default function RichContent({ body, className, as: Tag = "div" }) {
```

to:

```js
export default function RichContent({ body, className = undefined, as: Tag = "div" }) {
```

- [ ] **Verify all errors are gone**

```bash
cd frontend && yarn type-check 2>&1 | grep "error TS"
```

Expected: no output — `tsc` exits 0.

- [ ] **Run full type-check and confirm clean exit**

```bash
cd frontend && yarn type-check
```

Expected: exits 0 with no error lines.

- [ ] **Commit**

```bash
git add frontend/Components/layout/Section.jsx frontend/Components/shared/RichContent.jsx && git commit -m "fix: default className to undefined in Container and RichContent"
```

---

## Task 5: Add `frontend-typecheck` CI job

A dedicated job that runs `tsc` in parallel with the other frontend jobs. Catches type errors before they reach the build step.

**Files:**
- Modify: `.github/workflows/ci.yml`

- [ ] **Add the job after the `frontend-build` job block**

In `.github/workflows/ci.yml`, add the following block after the `frontend-build` job (before `backend-test`):

```yaml
  # ─── Frontend type-check ─────────────────────────────────────────────────────
  frontend-typecheck:
    name: Frontend type-check
    needs: install
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version-file: ".node-version"
          cache: yarn

      - uses: actions/cache/restore@v4
        with:
          path: |
            node_modules
            frontend/node_modules
            backend/node_modules
            backend/src/plugins/wysiwyg-editor/node_modules
          key: nm-${{ runner.os }}-${{ hashFiles('yarn.lock') }}

      - name: Type-check
        run: yarn workspace shelbz-citrine-frontend type-check
```

- [ ] **Verify the YAML is valid**

```bash
python3 -c "import yaml, sys; yaml.safe_load(open('.github/workflows/ci.yml'))" && echo "YAML OK"
```

Expected: `YAML OK`

- [ ] **Commit**

```bash
git add .github/workflows/ci.yml && git commit -m "ci: add frontend-typecheck job"
```

---

## Task 6: Add `types-in-sync` CI job

A lightweight job with no install step. Runs the existing `sync-strapi-types.js` script directly with `node`, then asserts the working tree is clean. If the generated types have drifted, `git diff --exit-code` fails with a non-zero exit code and the job surfaces a clear fix instruction.

**Files:**
- Modify: `.github/workflows/ci.yml`

- [ ] **Add the job after `frontend-typecheck`**

In `.github/workflows/ci.yml`, add after the `frontend-typecheck` job block:

```yaml
  # ─── Types in sync ───────────────────────────────────────────────────────────
  types-in-sync:
    name: Strapi types in sync
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version-file: ".node-version"

      - name: Sync types from backend
        run: node frontend/scripts/sync-strapi-types.js

      - name: Assert no diff
        run: |
          git diff --exit-code frontend/types/strapi-generated/ || \
            (echo "::error::frontend/types/strapi-generated/ is out of sync with backend/types/generated/. Run 'yarn workspace shelbz-citrine-frontend sync-types' locally and commit the result." && exit 1)
```

- [ ] **Verify the YAML is valid**

```bash
python3 -c "import yaml, sys; yaml.safe_load(open('.github/workflows/ci.yml'))" && echo "YAML OK"
```

Expected: `YAML OK`

- [ ] **Smoke-test the sync script locally to confirm it exits cleanly**

```bash
node frontend/scripts/sync-strapi-types.js && git diff --exit-code frontend/types/strapi-generated/ && echo "IN SYNC"
```

Expected: `IN SYNC` (types are already current on this branch).

- [ ] **Commit**

```bash
git add .github/workflows/ci.yml && git commit -m "ci: add types-in-sync hard-gate job"
```

---

## Success Criteria

- `cd frontend && yarn type-check` → exits 0, zero error lines
- `cd frontend && yarn build` → completes without type errors
- `node frontend/scripts/sync-strapi-types.js && git diff --exit-code frontend/types/strapi-generated/` → exits 0
- CI workflow contains `frontend-typecheck` and `types-in-sync` jobs, both passing
