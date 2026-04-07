# WYSIWYG Editor Enhancements Design

**Date:** 2026-04-04
**Status:** Approved

---

## Context

The Strapi WYSIWYG editor uses `:::directive ... :::` syntax for block-level elements and CodeMirror 5 as the editing surface. Two improvements are required:

1. **Syntax overhaul** — Replace `:::` directives with semantic custom HTML elements and `data-*` attributes. Hard cut, no backward compatibility.
2. **Editor UX** — Add a command palette (`Cmd+P` + `/` at line start) so all toolbar actions are keyboard-accessible and searchable.

---

## Syntax Mapping

All `:::` directives map to `<md-*>` custom elements. Variants become `data-*` attributes.

### Alignment (new — expands existing center/right)

| Tag | Behavior |
|---|---|
| `<md-align data-dir="left">` | Left-align block content |
| `<md-align data-dir="center">` | Center-align block content |
| `<md-align data-dir="right">` | Right-align block content |
| `<md-align data-dir="justify">` | Justify-align block content |
| `<md-align data-valign="top">` | Flex container, align-items: flex-start |
| `<md-align data-valign="middle">` | Flex container, align-items: center |
| `<md-align data-valign="bottom">` | Flex container, align-items: flex-end |
| Combined `data-dir` + `data-valign` | Both applied simultaneously |

### Containers

| Old | New |
|---|---|
| `:::container-narrow ... :::` | `<md-container data-width="narrow">...</md-container>` |
| `:::container-reading ... :::` | `<md-container data-width="reading">...</md-container>` |
| `:::container-wide ... :::` | `<md-container data-width="wide">...</md-container>` |
| `:::container-full ... :::` | `<md-container data-width="full">...</md-container>` |

### Columns

| Old | New |
|---|---|
| `:::columns-2 ... :::` | `<md-columns data-count="2">...</md-columns>` |
| `:::columns-3 ... :::` | `<md-columns data-count="3">...</md-columns>` |
| `:::columns-4 ... :::` | `<md-columns data-count="4">...</md-columns>` |
| `:::columns-5 ... :::` | `<md-columns data-count="5">...</md-columns>` |

Column content still uses `\n---\n` as the column separator inside the tag.

### Content Blocks

| Old | New |
|---|---|
| `:::callout ... :::` | `<md-callout>...</md-callout>` |
| `:::callout-warning ... :::` | `<md-callout data-variant="warning">...</md-callout>` |
| `:::callout-info ... :::` | `<md-callout data-variant="info">...</md-callout>` |
| `:::card-dark ... :::` | `<md-card data-variant="dark">...</md-card>` |
| `:::card-gold ... :::` | `<md-card data-variant="gold">...</md-card>` |
| `:::card-steel ... :::` | `<md-card data-variant="steel">...</md-card>` |
| `:::drop-cap ... :::` | `<md-drop-cap>...</md-drop-cap>` |
| `:::prose ... :::` | `<md-prose>...</md-prose>` |

### Decorative (self-closing)

| Old | New |
|---|---|
| `:::divider :::` | `<md-divider />` |
| `:::spacer :::` | `<md-spacer />` |
| `:::spacer-sm :::` | `<md-spacer data-size="sm" />` |
| `:::spacer-lg :::` | `<md-spacer data-size="lg" />` |

### Unchanged Inline Syntax

`==highlight==`, `{color:x}text{/color}`, `^[tooltip](content)`, `[Label](/url){.btn-primary}`, `![alt](url){.float-left}` — all inline syntax stays as-is.

---

## Parser Architecture

Both `marked-extensions.js` files (admin and frontend) are updated with the same changes.

### Self-closing tokenizer

Regex `/^<(md-[\w-]+)([^>]*)\s*\/>/` at block level. Matches `<md-divider />`, `<md-spacer data-size="lg" />`, etc.

### Paired-tag tokenizer

Depth-counting scan — same strategy as the existing `:::` tokenizer. Finds balanced `<md-tagname` / `</md-tagname>` pairs. Extracts inner content and passes it to `marked.lexer()` for recursive markdown parsing. Handles nesting (e.g. `<md-container>` wrapping `<md-columns>`).

### Renderer output

Maps element name + data attributes to CSS classes. **Note:** `md-left`, `md-justify`, and the three `md-valign-*` classes are new and must be added to `globals.css`; all other classes already exist.

| Input | Output |
|---|---|
| `<md-align data-dir="left">` | `<div class="md-left">...</div>` |
| `<md-align data-dir="center">` | `<div class="md-center">...</div>` |
| `<md-align data-dir="right">` | `<div class="md-right">...</div>` |
| `<md-align data-dir="justify">` | `<div class="md-justify">...</div>` |
| `<md-align data-valign="top">` | `<div class="md-valign-top">...</div>` |
| `<md-align data-valign="middle">` | `<div class="md-valign-middle">...</div>` |
| `<md-align data-valign="bottom">` | `<div class="md-valign-bottom">...</div>` |
| `<md-container data-width="reading">` | `<div class="md-container md-constrain-reading">...</div>` |
| `<md-columns data-count="3">` | `<div class="md-columns md-columns-3">` + column splitting |
| `<md-callout data-variant="warning">` | `<div class="md-callout md-callout-warning">...</div>` |
| `<md-card data-variant="gold">` | `<div class="md-card-gold">...</div>` |
| `<md-drop-cap>` | `<div class="drop-cap">...</div>` |
| `<md-prose>` | `<div class="prose-heritage">...</div>` |
| `<md-divider />` | existing divider markup |
| `<md-spacer data-size="sm" />` | `<div class="md-spacer-sm"></div>` |

### Security

`ALLOWED_DIRECTIVES` becomes `ALLOWED_MD_ELEMENTS` — validates tag name against a set and checks attribute values against per-tag allowlists.

---

## Toolbar Updates

### Alignment group

Replaces the current Center/Right buttons. Two sub-groups:

**Horizontal text alignment:**
- Left → `<md-align data-dir="left">\n${selection}\n</md-align>`
- Center → `<md-align data-dir="center">\n${selection}\n</md-align>`
- Right → `<md-align data-dir="right">\n${selection}\n</md-align>`
- Justify → `<md-align data-dir="justify">\n${selection}\n</md-align>`

**Vertical alignment:**
- Top → `<md-align data-valign="top">\n${selection}\n</md-align>`
- Middle → `<md-align data-valign="middle">\n${selection}\n</md-align>`
- Bottom → `<md-align data-valign="bottom">\n${selection}\n</md-align>`

### Image alignment group (new)

Positioned between Alignment and Columns in Row 2. Wraps selected image markdown or inserts placeholder:

- Float Left → `![alt](url){.float-left .w-1/3}`
- Float Right → `![alt](url){.float-right .w-1/3}`
- Center → `![alt](url){.mx-auto}`
- Full Width → `![alt](url){.w-full}`

---

## Command Palette

### `command-registry.js`

Central registry of all toolbar actions. Shape:

```js
{
  id: string,
  name: string,        // display name in palette
  group: string,       // category header
  keywords: string[],  // extra search terms
  action: (cm) => void // called with CodeMirror instance
}
```

Every toolbar button references a registry entry. The toolbar and palette both call the same `action`.

### `CommandPalette.jsx`

Modal overlay component. Props: `{ isOpen, onClose, commands, cm }`.

Behavior:
- Auto-focuses search input on open
- Filters commands by `name` and `keywords` as user types
- Results grouped by `group`, navigable with arrow keys
- Enter or click executes `action(cm)` then closes
- ESC closes without action
- Styled with Strapi design system tokens

### Triggers

**`Cmd+P`** — registered in CodeMirror `extraKeys`. Sets `paletteOpen: true` in `index.jsx` state.

**`/` at line start** — `inputRead` event in CodeMirror. Fires when `/` is typed and the cursor is at column 0 (or preceded only by whitespace on the line). Opens palette. On command select: deletes the `/`, inserts the block. On ESC: `/` stays as a literal character.

---

## Files Modified

### Backend plugin (`backend/src/plugins/wysiwyg-editor/`)

| File | Change |
|---|---|
| `admin/src/components/WYSIWYGEditor/toolbar-config.js` | Replace all `:::` templates with `<md-*>`; add left/justify/vertical alignment entries; add image alignment group |
| `admin/src/components/WYSIWYGEditor/index.jsx` | Add `paletteOpen` state; register `Cmd+P` in `extraKeys`; add `inputRead` handler for `/`; render `<CommandPalette>` |
| `admin/src/utils/marked-extensions.js` | Remove `:::` tokenizer; add `<md-*>` self-closing + paired-tag tokenizer and renderer |
| `admin/src/utils/__tests__/marked-extensions.test.js` | Replace all `:::` test cases with `<md-*>` equivalents |
| **NEW** `admin/src/components/WYSIWYGEditor/CommandPalette.jsx` | Modal palette component |
| **NEW** `admin/src/components/WYSIWYGEditor/command-registry.js` | Central command registry |

### Frontend (`frontend/`)

| File | Change |
|---|---|
| `lib/marked-extensions.js` | Same tokenizer swap as admin |
| `__tests__/lib/marked-extensions.test.js` | Replace all `:::` test cases with `<md-*>` equivalents |

### Frontend styles

| File | Change |
|---|---|
| `frontend/styles/globals.css` | Add `md-left` (text-align: left), `md-justify` (text-align: justify), `md-valign-top/middle/bottom` (flex + align-items) |

### No changes needed

`relation-renderers.js`, `strapi.js`, `relation-config.js`, `Preview.jsx`, `Toolbar.jsx`, `editor-handlers.js`

---

## Verification

1. Start Strapi dev server (`yarn develop` in `backend/`)
2. Open any content type with a WYSIWYG field
3. Confirm `:::` syntax no longer renders (plain text passthrough)
4. Manually insert `<md-callout data-variant="warning">test</md-callout>` — preview renders callout
5. Click all alignment toolbar buttons — verify correct `<md-align>` tags inserted
6. Click image alignment buttons — verify attributed image syntax inserted
7. Press `Cmd+P` — palette opens, search filters correctly, selecting a command inserts syntax and closes palette
8. Type `/` at start of a line — palette opens; ESC leaves `/` intact; selecting a command replaces it
9. Run `yarn test` in both `backend/src/plugins/wysiwyg-editor/` and `frontend/`
10. Build frontend and verify a page with WYSIWYG content renders all block types correctly
