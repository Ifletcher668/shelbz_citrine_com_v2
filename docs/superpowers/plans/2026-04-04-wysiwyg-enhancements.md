# WYSIWYG Editor Enhancements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace `:::directive` markdown syntax with `<md-*>` custom HTML elements, add text/image alignment controls, and wire up a `Cmd+P` command palette with `/` slash trigger in the Strapi WYSIWYG editor.

**Architecture:** A new `mdElementExtension` replaces `containerDirectiveExtension` in both marked-extensions files. The extension depth-counts `<md-tagname>` / `</md-tagname>` pairs (same strategy as the old `:::` tokenizer), parses inner content recursively, and maps element+data attrs to existing CSS classes. A `command-registry.js` wraps all toolbar-config actions as callable commands; `CommandPalette.jsx` renders a searchable modal; `index.jsx` hooks `Cmd+P` and the `/` inputRead event to open it.

**Tech Stack:** React, CodeMirror 5, marked v12, styled-components, @strapi/design-system

---

## File Map

| File | Status | Change |
|---|---|---|
| `frontend/styles/globals.css` | Modify | Add `md-left`, `md-justify`, `md-valign-top/middle/bottom` classes |
| `backend/src/plugins/wysiwyg-editor/admin/src/utils/marked-extensions.js` | Modify | Replace `containerDirectiveExtension` with `mdElementExtension` |
| `backend/src/plugins/wysiwyg-editor/admin/src/utils/__tests__/marked-extensions.test.js` | Modify | Replace `containerDirectiveExtension` tests with `mdElementExtension` tests |
| `frontend/lib/marked-extensions.js` | Modify | Same `mdElementExtension` swap |
| `frontend/__tests__/lib/marked-extensions.test.js` | Modify | Update container directive tests to new syntax |
| `backend/src/plugins/wysiwyg-editor/admin/src/components/WYSIWYGEditor/toolbar-config.js` | Modify | Update all `:::` templates to `<md-*>` syntax; add alignment/image-alignment groups |
| `backend/src/plugins/wysiwyg-editor/admin/src/components/WYSIWYGEditor/command-registry.js` | Create | Central command registry derived from toolbar-config |
| `backend/src/plugins/wysiwyg-editor/admin/src/components/WYSIWYGEditor/CommandPalette.jsx` | Create | Searchable command modal |
| `backend/src/plugins/wysiwyg-editor/admin/src/components/WYSIWYGEditor/index.jsx` | Modify | Add palette state, `Cmd+P` extraKey, `/` inputRead handler |

---

### Task 1: Add new alignment CSS classes

**Files:**
- Modify: `frontend/styles/globals.css:897-899`

- [ ] **Step 1: Add new classes after `.md-right`**

In `frontend/styles/globals.css`, insert after the `.md-right` block (after line 899):

```css
  .md-left {
    text-align: left;
  }

  .md-justify {
    text-align: justify;
  }

  .md-valign-top {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }

  .md-valign-middle {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .md-valign-bottom {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }
```

- [ ] **Step 2: Commit**

```bash
git add frontend/styles/globals.css
git commit -m "feat: add md-left, md-justify, md-valign-* CSS classes"
```

---

### Task 2: Replace admin parser — write failing tests first (TDD)

**Files:**
- Modify: `backend/src/plugins/wysiwyg-editor/admin/src/utils/__tests__/marked-extensions.test.js`
- Modify: `backend/src/plugins/wysiwyg-editor/admin/src/utils/marked-extensions.js`

- [ ] **Step 1: Replace the `containerDirectiveExtension` describe block in the admin test file**

In `backend/src/plugins/wysiwyg-editor/admin/src/utils/__tests__/marked-extensions.test.js`, replace everything inside `describe("containerDirectiveExtension", ...)` (lines 197–290) and `describe("card directives", ...)` (lines 332–355) with the following (keep all other describe blocks untouched):

```js
// ─── mdElementExtension ───────────────────────────────────────────────────────

describe("mdElementExtension", () => {
  describe("alignment — horizontal", () => {
    test("<md-align data-dir=\"center\"> wraps in md-center", () => {
      const html = parse('<md-align data-dir="center">\nhello\n</md-align>');
      expect(html).toContain('class="md-container md-center"');
      expect(html).toContain("hello");
    });

    test("<md-align data-dir=\"right\"> wraps in md-right", () => {
      const html = parse('<md-align data-dir="right">\nhello\n</md-align>');
      expect(html).toContain('class="md-container md-right"');
    });

    test("<md-align data-dir=\"left\"> wraps in md-left", () => {
      const html = parse('<md-align data-dir="left">\nhello\n</md-align>');
      expect(html).toContain('class="md-left"');
    });

    test("<md-align data-dir=\"justify\"> wraps in md-justify", () => {
      const html = parse('<md-align data-dir="justify">\nhello\n</md-align>');
      expect(html).toContain('class="md-justify"');
    });
  });

  describe("alignment — vertical", () => {
    test("<md-align data-valign=\"top\"> wraps in md-valign-top", () => {
      const html = parse('<md-align data-valign="top">\nhello\n</md-align>');
      expect(html).toContain('class="md-valign-top"');
    });

    test("<md-align data-valign=\"middle\"> wraps in md-valign-middle", () => {
      const html = parse('<md-align data-valign="middle">\nhello\n</md-align>');
      expect(html).toContain('class="md-valign-middle"');
    });

    test("<md-align data-valign=\"bottom\"> wraps in md-valign-bottom", () => {
      const html = parse('<md-align data-valign="bottom">\nhello\n</md-align>');
      expect(html).toContain('class="md-valign-bottom"');
    });
  });

  describe("containers", () => {
    test("<md-container data-width=\"reading\"> wraps in md-constrain-reading", () => {
      const html = parse('<md-container data-width="reading">\ntext\n</md-container>');
      expect(html).toContain("md-constrain-reading");
    });

    test("<md-container data-width=\"narrow\"> wraps in md-constrain-narrow", () => {
      const html = parse('<md-container data-width="narrow">\ntext\n</md-container>');
      expect(html).toContain("md-constrain-narrow");
    });

    test("<md-container data-width=\"wide\"> wraps in md-constrain-wide", () => {
      const html = parse('<md-container data-width="wide">\ntext\n</md-container>');
      expect(html).toContain("md-constrain-wide");
    });

    test("<md-container data-width=\"full\"> wraps in md-constrain-full", () => {
      const html = parse('<md-container data-width="full">\ntext\n</md-container>');
      expect(html).toContain("md-constrain-full");
    });
  });

  describe("callouts", () => {
    test("<md-callout> renders <aside> with md-callout", () => {
      const html = parse("<md-callout>\nNote!\n</md-callout>");
      expect(html).toContain('<aside class="md-container md-callout">');
      expect(html).toContain("Note!");
    });

    test("<md-callout data-variant=\"warning\"> renders md-callout-warning", () => {
      const html = parse('<md-callout data-variant="warning">\nWatch out\n</md-callout>');
      expect(html).toContain("md-callout-warning");
    });

    test("<md-callout data-variant=\"info\"> renders md-callout-info", () => {
      const html = parse('<md-callout data-variant="info">\nFYI\n</md-callout>');
      expect(html).toContain("md-callout-info");
    });
  });

  describe("columns", () => {
    test("<md-columns data-count=\"2\"> splits on --- and creates 2 md-column divs", () => {
      const html = parse('<md-columns data-count="2">\nLeft\n---\nRight\n</md-columns>');
      expect(html).toContain("md-columns md-columns-2");
      expect(html.match(/class="md-column"/g)).toHaveLength(2);
    });

    test("<md-columns data-count=\"3\"> splits on --- and creates 3 md-column divs", () => {
      const html = parse('<md-columns data-count="3">\nA\n---\nB\n---\nC\n</md-columns>');
      expect(html).toContain("md-columns md-columns-3");
      expect(html.match(/class="md-column"/g)).toHaveLength(3);
    });

    test("--- column separator is not parsed as <hr>", () => {
      const html = parse('<md-columns data-count="2">\nLeft\n---\nRight\n</md-columns>');
      expect(html).not.toContain("<hr");
    });
  });

  describe("drop-cap and prose", () => {
    test("<md-drop-cap> renders drop-cap class", () => {
      const html = parse("<md-drop-cap>\nFirst paragraph.\n</md-drop-cap>");
      expect(html).toContain('class="md-container drop-cap"');
    });

    test("<md-prose> renders prose-heritage class", () => {
      const html = parse("<md-prose>\nSome text.\n</md-prose>");
      expect(html).toContain('class="md-container prose-heritage"');
    });
  });

  describe("self-closing", () => {
    test("<md-divider /> renders ornamental SVG", () => {
      const html = parse("<md-divider />");
      expect(html).toContain('class="md-divider"');
      expect(html).toContain("<svg");
    });

    test("<md-spacer /> renders md-spacer", () => {
      const html = parse("<md-spacer />");
      expect(html).toContain('class="md-spacer"');
      expect(html).not.toContain("<svg");
    });

    test('<md-spacer data-size="sm" /> renders md-spacer-sm', () => {
      const html = parse('<md-spacer data-size="sm" />');
      expect(html).toContain('class="md-spacer-sm"');
    });

    test('<md-spacer data-size="lg" /> renders md-spacer-lg', () => {
      const html = parse('<md-spacer data-size="lg" />');
      expect(html).toContain('class="md-spacer-lg"');
    });
  });

  describe("cards", () => {
    test('<md-card data-variant="dark"> renders md-card md-card-dark', () => {
      const html = parse('<md-card data-variant="dark">\nContent\n</md-card>');
      expect(html).toContain('class="md-card md-card-dark"');
      expect(html).toContain("Content");
    });

    test('<md-card data-variant="gold"> renders md-card md-card-gold', () => {
      const html = parse('<md-card data-variant="gold">\nContent\n</md-card>');
      expect(html).toContain('class="md-card md-card-gold"');
    });

    test('<md-card data-variant="steel"> renders md-card md-card-steel', () => {
      const html = parse('<md-card data-variant="steel">\nContent\n</md-card>');
      expect(html).toContain('class="md-card md-card-steel"');
    });

    test("card renders inner block content", () => {
      const html = parse('<md-card data-variant="gold">\n## Title\n\nParagraph\n</md-card>');
      expect(html).toContain("<h2");
      expect(html).toContain("Title");
      expect(html).toContain("Paragraph");
    });
  });

  describe("security", () => {
    test("unknown <md-*> element is not rendered as a container", () => {
      const html = parse("<md-unknown>\nhello\n</md-unknown>");
      expect(html).not.toContain("md-container");
    });

    test("old ::: syntax passes through as plain text (hard cut)", () => {
      const html = parse(":::center\nhello\n:::");
      expect(html).not.toContain("md-container");
      expect(html).not.toContain("md-center");
    });
  });

  describe("combined", () => {
    test("highlight inside <md-callout> renders both", () => {
      const html = parse("<md-callout>\n==important==\n</md-callout>");
      expect(html).toContain("md-callout");
      expect(html).toContain('<mark class="md-highlight">important</mark>');
    });

    test("colored text inside <md-align data-dir=\"center\"> renders both", () => {
      const html = parse('<md-align data-dir="center">\n{color:pale-gold}golden{/color}\n</md-align>');
      expect(html).toContain("md-center");
      expect(html).toContain("color:var(--color-pale-gold)");
    });

    test("nested: <md-align> inside <md-container>", () => {
      const html = parse('<md-container data-width="full">\n<md-align data-dir="center">\n# Heading\n</md-align>\n</md-container>');
      expect(html).toContain("md-constrain-full");
      expect(html).toContain("md-center");
      expect(html).toContain("<h1");
    });
  });
});
```

- [ ] **Step 2: Run tests — confirm they fail**

```bash
cd backend/src/plugins/wysiwyg-editor && yarn test --testPathPattern="marked-extensions" --no-coverage --forceExit 2>&1 | tail -20
```

Expected: FAIL — `mdElementExtension` tests all fail because the extension doesn't exist yet.

- [ ] **Step 3: Replace `containerDirectiveExtension` with `mdElementExtension` in admin marked-extensions.js**

In `backend/src/plugins/wysiwyg-editor/admin/src/utils/marked-extensions.js`:

1. **Replace the security whitelists section** — remove `ALLOWED_DIRECTIVES` and `SELF_CLOSING_DIRECTIVES`, add in their place:

```js
const ALLOWED_MD_ELEMENTS = new Set([
  "md-align",
  "md-container",
  "md-columns",
  "md-callout",
  "md-card",
  "md-drop-cap",
  "md-prose",
  "md-divider",
  "md-spacer",
]);

const ALLOWED_MD_ATTRS = {
  "md-align": {
    dir: ["left", "center", "right", "justify"],
    valign: ["top", "middle", "bottom"],
  },
  "md-container": { width: ["narrow", "reading", "wide", "full"] },
  "md-columns": { count: ["2", "3", "4", "5"] },
  "md-callout": { variant: ["warning", "info"] },
  "md-card": { variant: ["dark", "gold", "steel"] },
  "md-spacer": { size: ["sm", "lg"] },
};
```

2. **Add two helper functions** after `sanitizeUrl`:

```js
/**
 * Parse data-key="value" pairs from a tag attribute string.
 */
function parseDataAttrs(str) {
  const attrs = {};
  const re = /\bdata-([\w-]+)=["']?([^"'\s>\/]*)["']?/g;
  let m;
  while ((m = re.exec(str)) !== null) {
    attrs[m[1]] = m[2];
  }
  return attrs;
}

/**
 * Validate tag name and parsed attrs against ALLOWED_MD_ELEMENTS/ALLOWED_MD_ATTRS.
 */
function isAllowedElement(tagName, attrs) {
  if (!ALLOWED_MD_ELEMENTS.has(tagName)) return false;
  const allowedAttrs = ALLOWED_MD_ATTRS[tagName];
  if (!allowedAttrs) return true;
  for (const [key, value] of Object.entries(attrs)) {
    if (!(key in allowedAttrs)) return false;
    if (!allowedAttrs[key].includes(value)) return false;
  }
  return true;
}
```

3. **Replace `containerDirectiveExtension`** (the entire object, lines 201–325) with:

```js
/**
 * Custom element: <md-tagname data-key="value">body</md-tagname>
 * Also handles self-closing: <md-tagname data-key="value" />
 * Replaces the old :::directive syntax. Hard cut — ::: no longer parsed.
 */
const mdElementExtension = {
  name: "mdElement",
  level: "block",
  start(src) {
    const idx = src.indexOf("<md-");
    return idx === -1 ? undefined : idx;
  },
  tokenizer(src) {
    // Self-closing: <md-divider /> or <md-spacer data-size="sm" />
    const selfCloseMatch = /^<(md-[\w-]+)([^>]*)\s*\/>/.exec(src);
    if (selfCloseMatch) {
      const tagName = selfCloseMatch[1];
      const attrs = parseDataAttrs(selfCloseMatch[2]);
      if (!isAllowedElement(tagName, attrs)) return;
      const raw =
        selfCloseMatch[0] +
        (src[selfCloseMatch[0].length] === "\n" ? "\n" : "");
      return { type: "mdElement", raw, tagName, attrs, selfClose: true, tokens: [] };
    }

    // Paired: <md-tagname ...>body</md-tagname>
    const openMatch = /^<(md-[\w-]+)([^>]*)>/.exec(src);
    if (!openMatch) return;
    const tagName = openMatch[1];
    const attrs = parseDataAttrs(openMatch[2]);
    if (!isAllowedElement(tagName, attrs)) return;

    const closeTag = `</${tagName}>`;
    const openTag = `<${tagName}`;
    const rest = src.slice(openMatch[0].length);
    let depth = 1;
    let i = 0;
    while (i < rest.length && depth > 0) {
      if (
        rest.slice(i).startsWith(openTag) &&
        /[\s>]/.test(rest[i + openTag.length] || ">")
      ) {
        depth++;
        i += openTag.length;
      } else if (rest.slice(i).startsWith(closeTag)) {
        depth--;
        if (depth === 0) break;
        i += closeTag.length;
      } else {
        i++;
      }
    }
    if (depth !== 0) return; // unbalanced — not a valid element

    const body = rest.slice(0, i).trim();
    const rawEnd = openMatch[0].length + i + closeTag.length;
    const raw = src.slice(0, rawEnd) + (src[rawEnd] === "\n" ? "\n" : "");
    const token = { type: "mdElement", raw, tagName, attrs, selfClose: false };

    if (tagName === "md-columns") {
      const parts = body.split(/\n---\n/);
      token.colTokens = parts.map((part) => {
        const colToks = [];
        this.lexer.blockTokens(part.trim(), colToks);
        return colToks;
      });
    } else {
      token.tokens = [];
      this.lexer.blockTokens(body, token.tokens);
    }
    return token;
  },
  renderer(token) {
    const { tagName, attrs } = token;

    // Self-closing
    if (token.selfClose) {
      if (tagName === "md-divider") {
        return `<div class="md-divider" aria-hidden="true">${ORNAMENTAL_DIVIDER_SVG}</div>\n`;
      }
      if (tagName === "md-spacer") {
        const s = attrs.size;
        if (s === "sm") return `<div class="md-spacer-sm" aria-hidden="true"></div>\n`;
        if (s === "lg") return `<div class="md-spacer-lg" aria-hidden="true"></div>\n`;
        return `<div class="md-spacer" aria-hidden="true"></div>\n`;
      }
      return "";
    }

    // Columns
    if (tagName === "md-columns") {
      const count = attrs.count || "2";
      const colsHtml = (token.colTokens || [])
        .map(
          (colToks) =>
            `<div class="md-column">${this.parser.parse(colToks)}</div>`,
        )
        .join("");
      return `<div class="md-columns md-columns-${count}">${colsHtml}</div>\n`;
    }

    // Paired with recursive inner content
    const inner = this.parser.parse(token.tokens || []);
    switch (tagName) {
      case "md-align": {
        if (attrs.valign)
          return `<div class="md-valign-${attrs.valign}">${inner}</div>\n`;
        const dir = attrs.dir || "left";
        if (dir === "left") return `<div class="md-left">${inner}</div>\n`;
        if (dir === "center")
          return `<div class="md-container md-center">${inner}</div>\n`;
        if (dir === "right")
          return `<div class="md-container md-right">${inner}</div>\n`;
        if (dir === "justify")
          return `<div class="md-justify">${inner}</div>\n`;
        return `<div>${inner}</div>\n`;
      }
      case "md-container": {
        const widthMap = {
          narrow: "md-constrain-narrow",
          reading: "md-constrain-reading",
          wide: "md-constrain-wide",
          full: "md-constrain-full",
        };
        return `<div class="md-container ${widthMap[attrs.width] || ""}">${inner}</div>\n`;
      }
      case "md-callout": {
        if (attrs.variant === "warning")
          return `<aside class="md-container md-callout md-callout-warning">${inner}</aside>\n`;
        if (attrs.variant === "info")
          return `<aside class="md-container md-callout md-callout-info">${inner}</aside>\n`;
        return `<aside class="md-container md-callout">${inner}</aside>\n`;
      }
      case "md-card": {
        const variant = attrs.variant || "dark";
        return `<div class="md-card md-card-${variant}">${inner}</div>\n`;
      }
      case "md-drop-cap":
        return `<div class="md-container drop-cap">${inner}</div>\n`;
      case "md-prose":
        return `<div class="md-container prose-heritage">${inner}</div>\n`;
      default:
        return `<div class="md-container">${inner}</div>\n`;
    }
  },
  childTokens: ["tokens"],
};
```

4. **Update the `wysiwygMarked.use` extensions array** — replace `containerDirectiveExtension` with `mdElementExtension`:

```js
wysiwygMarked.use({
  gfm: true,
  breaks: false,
  extensions: [
    // Block first
    mdElementExtension,
    bulletPointExtension,
    relationEmbedExtension,
    // Inline — button/image BEFORE default link/image tokenizers
    buttonLinkExtension,
    attributedImageExtension,
    highlightExtension,
    coloredTextExtension,
    tooltipExtension,
  ],
});
```

5. **Update the file header comment** — replace the `ALIGNMENT`, `DROP CAP`, `CALLOUTS`, `COLUMNS`, `CONTAINERS`, `CARDS`, `DIVIDERS`, and `SPACERS` doc-comment lines with:

```js
 * ALIGNMENT:     <md-align data-dir="center">content</md-align>
 *                <md-align data-dir="left|right|justify">content</md-align>
 *                <md-align data-valign="top|middle|bottom">content</md-align>
 *
 * CONTAINERS:    <md-container data-width="narrow|reading|wide|full">content</md-container>
 *
 * COLUMNS:       <md-columns data-count="2|3|4|5">col1\n---\ncol2</md-columns>
 *
 * CALLOUTS:      <md-callout>text</md-callout>
 *                <md-callout data-variant="warning|info">text</md-callout>
 *
 * CARDS:         <md-card data-variant="dark|gold|steel">content</md-card>
 *
 * TYPOGRAPHY:    <md-drop-cap>First paragraph.</md-drop-cap>
 *                <md-prose>Prose content.</md-prose>
 *
 * DIVIDERS:      <md-divider />
 *
 * SPACERS:       <md-spacer />    <md-spacer data-size="sm" />    <md-spacer data-size="lg" />
```

- [ ] **Step 4: Run tests — confirm they pass**

```bash
cd backend/src/plugins/wysiwyg-editor && yarn test --testPathPattern="marked-extensions" --no-coverage --forceExit 2>&1 | tail -20
```

Expected: all `mdElementExtension` tests PASS, all other suites (highlightExtension, coloredTextExtension, etc.) still PASS.

- [ ] **Step 5: Commit**

```bash
git add backend/src/plugins/wysiwyg-editor/admin/src/utils/marked-extensions.js \
        backend/src/plugins/wysiwyg-editor/admin/src/utils/__tests__/marked-extensions.test.js
git commit -m "feat: replace :::directive syntax with <md-*> elements in admin parser"
```

---

### Task 3: Replace frontend parser (TDD)

**Files:**
- Modify: `frontend/__tests__/lib/marked-extensions.test.js`
- Modify: `frontend/lib/marked-extensions.js`

- [ ] **Step 1: Replace the container directive tests in the frontend test file**

In `frontend/__tests__/lib/marked-extensions.test.js`, find and replace all tests that use `:::` syntax for containers/alignment/columns/callouts/cards/dividers/spacers with equivalent `<md-*>` tests. Add these describe blocks (replacing only the container-related tests — keep highlight, coloredText, buttonLink, attributedImage, bulletPoint, relationEmbed, and utility function tests):

```js
// ─── mdElementExtension — alignment ──────────────────────────────────────────

test("md-align center: wraps in md-center", () => {
  const html = wysiwygMarked.parse('<md-align data-dir="center">\nhello\n</md-align>');
  expect(html).toContain('class="md-container md-center"');
  expect(html).toContain("hello");
});

test("md-align right: wraps in md-right", () => {
  const html = wysiwygMarked.parse('<md-align data-dir="right">\nhello\n</md-align>');
  expect(html).toContain('class="md-container md-right"');
});

test("md-align left: wraps in md-left", () => {
  const html = wysiwygMarked.parse('<md-align data-dir="left">\nhello\n</md-align>');
  expect(html).toContain('class="md-left"');
});

test("md-align justify: wraps in md-justify", () => {
  const html = wysiwygMarked.parse('<md-align data-dir="justify">\nhello\n</md-align>');
  expect(html).toContain('class="md-justify"');
});

test("md-align valign middle: wraps in md-valign-middle", () => {
  const html = wysiwygMarked.parse('<md-align data-valign="middle">\nhello\n</md-align>');
  expect(html).toContain('class="md-valign-middle"');
});

// ─── mdElementExtension — containers ─────────────────────────────────────────

test("md-container reading: wraps in md-constrain-reading", () => {
  const html = wysiwygMarked.parse('<md-container data-width="reading">\ntext\n</md-container>');
  expect(html).toContain("md-constrain-reading");
});

// ─── mdElementExtension — callouts ───────────────────────────────────────────

test("md-callout: renders aside with md-callout class", () => {
  const html = wysiwygMarked.parse("<md-callout>\nNote!\n</md-callout>");
  expect(html).toContain('<aside class="md-container md-callout">');
  expect(html).toContain("Note!");
});

test("md-callout warning variant: renders md-callout-warning", () => {
  const html = wysiwygMarked.parse('<md-callout data-variant="warning">\nWatch out\n</md-callout>');
  expect(html).toContain("md-callout-warning");
});

// ─── mdElementExtension — columns ────────────────────────────────────────────

test("md-columns count=2: splits on --- and creates 2 md-column divs", () => {
  const html = wysiwygMarked.parse('<md-columns data-count="2">\nLeft\n---\nRight\n</md-columns>');
  expect(html).toContain("md-columns md-columns-2");
  expect(html.match(/class="md-column"/g)).toHaveLength(2);
});

test("md-columns: --- separator not parsed as <hr>", () => {
  const html = wysiwygMarked.parse('<md-columns data-count="2">\nLeft\n---\nRight\n</md-columns>');
  expect(html).not.toContain("<hr");
});

// ─── mdElementExtension — cards ──────────────────────────────────────────────

test("md-card gold: renders md-card md-card-gold", () => {
  const html = wysiwygMarked.parse('<md-card data-variant="gold">\nContent\n</md-card>');
  expect(html).toContain('class="md-card md-card-gold"');
});

// ─── mdElementExtension — self-closing ───────────────────────────────────────

test("md-divider: renders ornamental SVG", () => {
  const html = wysiwygMarked.parse("<md-divider />");
  expect(html).toContain('class="md-divider"');
  expect(html).toContain("<svg");
});

test("md-spacer: renders md-spacer", () => {
  const html = wysiwygMarked.parse("<md-spacer />");
  expect(html).toContain('class="md-spacer"');
});

test('md-spacer size=sm: renders md-spacer-sm', () => {
  const html = wysiwygMarked.parse('<md-spacer data-size="sm" />');
  expect(html).toContain('class="md-spacer-sm"');
});

// ─── mdElementExtension — security ───────────────────────────────────────────

test("old ::: syntax is no longer rendered (hard cut)", () => {
  const html = wysiwygMarked.parse(":::center\nhello\n:::");
  expect(html).not.toContain("md-center");
  expect(html).not.toContain("md-container");
});
```

- [ ] **Step 2: Run frontend tests — confirm new container tests fail**

```bash
cd frontend && yarn test --testPathPattern="marked-extensions" 2>&1 | tail -20
```

Expected: FAIL on the new `<md-*>` tests (extension doesn't exist yet), old `:::` tests may pass/fail depending on leftover code.

- [ ] **Step 3: Replace `containerDirectiveExtension` with `mdElementExtension` in frontend marked-extensions.js**

In `frontend/lib/marked-extensions.js`:

1. **Replace `ALLOWED_DIRECTIVES` and `SELF_CLOSING_DIRECTIVES`** (lines 107–137) with the same whitelists as the admin file:

```js
const ALLOWED_MD_ELEMENTS = new Set([
  "md-align",
  "md-container",
  "md-columns",
  "md-callout",
  "md-card",
  "md-drop-cap",
  "md-prose",
  "md-divider",
  "md-spacer",
]);

const ALLOWED_MD_ATTRS = {
  "md-align": {
    dir: ["left", "center", "right", "justify"],
    valign: ["top", "middle", "bottom"],
  },
  "md-container": { width: ["narrow", "reading", "wide", "full"] },
  "md-columns": { count: ["2", "3", "4", "5"] },
  "md-callout": { variant: ["warning", "info"] },
  "md-card": { variant: ["dark", "gold", "steel"] },
  "md-spacer": { size: ["sm", "lg"] },
};
```

2. **Add the same two helpers** (`parseDataAttrs`, `isAllowedElement`) after `sanitizeUrl` — identical to admin file.

3. **Replace `containerDirectiveExtension`** (lines 204–325) with the same `mdElementExtension` object as the admin file — identical code.

4. **Update `wysiwygMarked.use` extensions array** — replace `containerDirectiveExtension` with `mdElementExtension`.

5. **Update the file header comment** — same doc-comment replacement as admin file.

- [ ] **Step 4: Run frontend tests — confirm they pass**

```bash
cd frontend && yarn test --testPathPattern="marked-extensions" 2>&1 | tail -20
```

Expected: all new `<md-*>` tests PASS, all other tests (highlight, coloredText, buttonLink, attributedImage, bulletPoint, relationEmbed, extractRelationRefs, parseWithRelations) still PASS.

- [ ] **Step 5: Commit**

```bash
git add frontend/lib/marked-extensions.js frontend/__tests__/lib/marked-extensions.test.js
git commit -m "feat: replace :::directive syntax with <md-*> elements in frontend parser"
```

---

### Task 4: Update toolbar-config.js

**Files:**
- Modify: `backend/src/plugins/wysiwyg-editor/admin/src/components/WYSIWYGEditor/toolbar-config.js`

- [ ] **Step 1: Replace the entire file content**

Replace `toolbar-config.js` with:

```js
/**
 * wysiwyg-only toolbar groups.
 * Standard markdown buttons (Bold, Italic, Headings, etc.) live directly in Toolbar.jsx.
 *
 * Note: The "Colors" group is no longer static. Color swatches are built
 * dynamically in Toolbar.jsx from the active theme via useThemeColors().
 *
 * Row 2 layout:
 *   Structure ▾ | Alignment ▾ | Image ▾ | Columns ▾ | Components ▾ | == ? [-] [+] | [color swatches] | Button ▾ | Block ▾ | Decorative ▾
 */
export const WYSIWYG_GROUPS = [
  /**
   * Structure — container widths.
   */
  {
    label: "Structure",
    dropdown: true,
    buttons: [
      {
        id: "container-narrow",
        label: "Narrow",
        title: "Narrow Container",
        action: "block",
        template: '<md-container data-width="narrow">\n${selection}\n</md-container>',
      },
      {
        id: "container-reading",
        label: "Reading",
        title: "Reading Width Container",
        action: "block",
        template: '<md-container data-width="reading">\n${selection}\n</md-container>',
      },
      {
        id: "container-wide",
        label: "Wide",
        title: "Wide Container",
        action: "block",
        template: '<md-container data-width="wide">\n${selection}\n</md-container>',
      },
      {
        id: "container-full",
        label: "Full Width",
        title: "Full Width Container",
        action: "block",
        template: '<md-container data-width="full">\n${selection}\n</md-container>',
      },
    ],
  },
  /**
   * Alignment — horizontal and vertical text alignment.
   */
  {
    label: "Alignment",
    dropdown: true,
    buttons: [
      {
        id: "align-left",
        label: "Left",
        title: "Align Left",
        action: "block",
        template: '<md-align data-dir="left">\n${selection}\n</md-align>',
      },
      {
        id: "align-center",
        label: "Center",
        title: "Align Center",
        action: "block",
        template: '<md-align data-dir="center">\n${selection}\n</md-align>',
      },
      {
        id: "align-right",
        label: "Right",
        title: "Align Right",
        action: "block",
        template: '<md-align data-dir="right">\n${selection}\n</md-align>',
      },
      {
        id: "align-justify",
        label: "Justify",
        title: "Justify Text",
        action: "block",
        template: '<md-align data-dir="justify">\n${selection}\n</md-align>',
      },
      {
        id: "valign-top",
        label: "Top",
        title: "Vertical Align Top",
        action: "block",
        template: '<md-align data-valign="top">\n${selection}\n</md-align>',
      },
      {
        id: "valign-middle",
        label: "Middle",
        title: "Vertical Align Middle",
        action: "block",
        template: '<md-align data-valign="middle">\n${selection}\n</md-align>',
      },
      {
        id: "valign-bottom",
        label: "Bottom",
        title: "Vertical Align Bottom",
        action: "block",
        template: '<md-align data-valign="bottom">\n${selection}\n</md-align>',
      },
    ],
  },
  /**
   * Image Alignment — float and width controls for attributed images.
   */
  {
    label: "Image",
    dropdown: true,
    buttons: [
      {
        id: "img-float-left",
        label: "Float Left",
        title: "Image Float Left",
        action: "block",
        template: "![alt](url){.float-left .w-1/3}",
      },
      {
        id: "img-float-right",
        label: "Float Right",
        title: "Image Float Right",
        action: "block",
        template: "![alt](url){.float-right .w-1/3}",
      },
      {
        id: "img-center",
        label: "Center",
        title: "Image Center",
        action: "block",
        template: "![alt](url){.mx-auto}",
      },
      {
        id: "img-full",
        label: "Full Width",
        title: "Image Full Width",
        action: "block",
        template: "![alt](url){.w-full}",
      },
    ],
  },
  {
    label: "Columns",
    dropdown: true,
    buttons: [
      {
        id: "columns-2",
        label: "2 Columns",
        title: "2 Columns",
        action: "block",
        template: '<md-columns data-count="2">\nLeft\n---\nRight\n</md-columns>',
      },
      {
        id: "columns-3",
        label: "3 Columns",
        title: "3 Columns",
        action: "block",
        template: '<md-columns data-count="3">\nCol 1\n---\nCol 2\n---\nCol 3\n</md-columns>',
      },
      {
        id: "columns-4",
        label: "4 Columns",
        title: "4 Columns",
        action: "block",
        template: '<md-columns data-count="4">\nCol 1\n---\nCol 2\n---\nCol 3\n---\nCol 4\n</md-columns>',
      },
      {
        id: "columns-5",
        label: "5 Columns",
        title: "5 Columns",
        action: "block",
        template: '<md-columns data-count="5">\nCol 1\n---\nCol 2\n---\nCol 3\n---\nCol 4\n---\nCol 5\n</md-columns>',
      },
    ],
  },
  /**
   * Formatting — inline text decorations.
   */
  {
    label: "Formatting",
    buttons: [
      {
        id: "highlight",
        label: "==",
        title: "Highlight",
        action: "wrap",
        before: "==",
        after: "==",
      },
      {
        id: "tooltip",
        label: "?",
        title: "Tooltip",
        action: "wrap",
        before: "^[",
        after: "](Tooltip text)",
      },
      {
        id: "bullet-x",
        label: "[-]",
        title: "X Bullet",
        action: "block",
        template: "[-] ${selection}",
      },
      {
        id: "bullet-check",
        label: "[+]",
        title: "Check Bullet",
        action: "block",
        template: "[+] ${selection}",
      },
      {
        id: "line-break",
        label: "↵",
        title: "Line Break (<br>)",
        action: "block",
        template: "<br>",
      },
    ],
  },
  /**
   * Button — inline CTA button links.
   */
  {
    label: "Button",
    dropdown: true,
    buttons: [
      {
        id: "btn-primary",
        label: "Primary",
        title: "Primary Button",
        action: "block",
        template: "[${selection}](/url){.btn-primary}",
      },
      {
        id: "btn-secondary",
        label: "Secondary",
        title: "Secondary Button",
        action: "block",
        template: "[${selection}](/url){.btn-secondary}",
      },
    ],
  },
  /**
   * Block — typographic block styles.
   */
  {
    label: "Block",
    dropdown: true,
    buttons: [
      {
        id: "drop-cap",
        label: "Drop Cap",
        title: "Drop Cap",
        action: "block",
        template: "<md-drop-cap>\n${selection}\n</md-drop-cap>",
      },
      {
        id: "prose",
        label: "Prose",
        title: "Prose",
        action: "block",
        template: "<md-prose>\n${selection}\n</md-prose>",
      },
      {
        id: "callout",
        label: "Callout",
        title: "Callout",
        action: "block",
        template: "<md-callout>\n${selection}\n</md-callout>",
      },
      {
        id: "callout-warning",
        label: "Warning",
        title: "Callout Warning",
        action: "block",
        template: '<md-callout data-variant="warning">\n${selection}\n</md-callout>',
      },
      {
        id: "callout-info",
        label: "Info",
        title: "Callout Info",
        action: "block",
        template: '<md-callout data-variant="info">\n${selection}\n</md-callout>',
      },
    ],
  },
  /**
   * Decorative — ornamental dividers and spacing.
   */
  {
    label: "Decorative",
    dropdown: true,
    buttons: [
      {
        id: "divider",
        label: "Divider",
        title: "Ornamental Divider",
        action: "block",
        template: "<md-divider />",
      },
      {
        id: "spacer",
        label: "Spacer",
        title: "Spacer",
        action: "block",
        template: "<md-spacer />",
      },
      {
        id: "spacer-sm",
        label: "Spacer S",
        title: "Small Spacer",
        action: "block",
        template: '<md-spacer data-size="sm" />',
      },
      {
        id: "spacer-lg",
        label: "Spacer L",
        title: "Large Spacer",
        action: "block",
        template: '<md-spacer data-size="lg" />',
      },
    ],
  },
];
```

- [ ] **Step 2: Commit**

```bash
git add backend/src/plugins/wysiwyg-editor/admin/src/components/WYSIWYGEditor/toolbar-config.js
git commit -m "feat: update toolbar templates to <md-*> syntax, add alignment and image groups"
```

---

### Task 5: Create command-registry.js

**Files:**
- Create: `backend/src/plugins/wysiwyg-editor/admin/src/components/WYSIWYGEditor/command-registry.js`

- [ ] **Step 1: Create the file**

```js
/**
 * command-registry.js
 * Converts WYSIWYG_GROUPS into a flat array of searchable commands.
 * Each command has an action(cm) function that can be called with a raw
 * CodeMirror instance (not a ref).
 */
import { WYSIWYG_GROUPS } from "./toolbar-config";
import { wysiwygBlock, wysiwygWrap } from "./editor-handlers";

function makeAction(button) {
  if (button.action === "wrap") {
    return (cm) => wysiwygWrap({ current: cm }, button.before, button.after);
  }
  return (cm) => wysiwygBlock({ current: cm }, button.template);
}

export const COMMANDS = WYSIWYG_GROUPS.flatMap((group) =>
  group.buttons.map((button) => ({
    id: button.id,
    name: button.title || button.label,
    group: group.label,
    keywords: [button.label, button.id].filter(Boolean),
    action: makeAction(button),
  })),
);
```

- [ ] **Step 2: Commit**

```bash
git add backend/src/plugins/wysiwyg-editor/admin/src/components/WYSIWYGEditor/command-registry.js
git commit -m "feat: add command registry derived from toolbar config"
```

---

### Task 6: Create CommandPalette.jsx

**Files:**
- Create: `backend/src/plugins/wysiwyg-editor/admin/src/components/WYSIWYGEditor/CommandPalette.jsx`

- [ ] **Step 1: Create the file**

```jsx
import React, { useState, useEffect, useRef } from "react";
import { Box, Typography } from "@strapi/design-system";
import { styled } from "styled-components";

// ── Styled components ──────────────────────────────────────────────────────────

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 10001;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 15dvh;
  background-color: rgba(0, 0, 0, 0.5);
`;

const PaletteBox = styled.div`
  background: ${({ theme }) => theme.colors.neutral0};
  border: 1px solid ${({ theme }) => theme.colors.neutral200};
  border-radius: 8px;
  width: min(560px, 90dvw);
  max-height: 420px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral200};
  background: transparent;
  color: ${({ theme }) => theme.colors.neutral800};
  font-size: 14px;
  outline: none;
  box-sizing: border-box;

  &::placeholder {
    color: ${({ theme }) => theme.colors.neutral500};
  }
`;

const ResultsList = styled.div`
  overflow-y: auto;
  flex: 1;
`;

const GroupHeader = styled.div`
  padding: 4px 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${({ theme }) => theme.colors.neutral500};
  background: ${({ theme }) => theme.colors.neutral100};
  position: sticky;
  top: 0;
`;

const ResultItem = styled.button`
  width: 100%;
  text-align: left;
  padding: 8px 16px;
  border: none;
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary100 : "transparent"};
  color: ${({ theme }) => theme.colors.neutral800};
  cursor: pointer;
  font-size: 13px;
  line-height: 1.4;

  &:hover {
    background: ${({ theme }) => theme.colors.neutral100};
  }
`;

// ── Component ──────────────────────────────────────────────────────────────────

/**
 * CommandPalette — searchable modal for all toolbar commands.
 *
 * Props:
 *   isOpen    {boolean}
 *   onClose   {() => void}
 *   onExecute {(command) => void}  — caller deletes slash if needed, then calls action
 *   commands  {Array<{ id, name, group, keywords[], action }>}
 */
export default function CommandPalette({ isOpen, onClose, onExecute, commands }) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);

  // Reset and focus when opened
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  const filtered = query
    ? commands.filter((c) =>
        `${c.name} ${c.keywords.join(" ")}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      )
    : commands;

  // Group results preserving toolbar group order
  const grouped = filtered.reduce((acc, cmd) => {
    if (!acc[cmd.group]) acc[cmd.group] = [];
    acc[cmd.group].push(cmd);
    return acc;
  }, {});

  // Flat list for keyboard navigation
  const flat = Object.values(grouped).flat();

  function execute(cmd) {
    onExecute(cmd);
    onClose();
  }

  function handleKeyDown(e) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, flat.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (flat[activeIndex]) execute(flat[activeIndex]);
    } else if (e.key === "Escape") {
      onClose();
    }
  }

  if (!isOpen) return null;

  let flatIdx = 0;
  return (
    <Overlay onClick={onClose}>
      <PaletteBox onClick={(e) => e.stopPropagation()}>
        <SearchInput
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveIndex(0);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search commands…"
          aria-label="Command palette search"
        />
        <ResultsList>
          {Object.entries(grouped).map(([group, cmds]) => (
            <div key={group}>
              <GroupHeader>{group}</GroupHeader>
              {cmds.map((cmd) => {
                const idx = flatIdx++;
                return (
                  <ResultItem
                    key={cmd.id}
                    $active={idx === activeIndex}
                    type="button"
                    onClick={() => execute(cmd)}
                    onMouseEnter={() => setActiveIndex(idx)}
                  >
                    {cmd.name}
                  </ResultItem>
                );
              })}
            </div>
          ))}
          {flat.length === 0 && (
            <Box padding={4}>
              <Typography textColor="neutral500">
                No commands match &ldquo;{query}&rdquo;
              </Typography>
            </Box>
          )}
        </ResultsList>
      </PaletteBox>
    </Overlay>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add backend/src/plugins/wysiwyg-editor/admin/src/components/WYSIWYGEditor/CommandPalette.jsx
git commit -m "feat: add CommandPalette modal component"
```

---

### Task 7: Wire up command palette in index.jsx

**Files:**
- Modify: `backend/src/plugins/wysiwyg-editor/admin/src/components/WYSIWYGEditor/index.jsx`

- [ ] **Step 1: Add imports at the top of index.jsx**

After the existing imports, add:

```js
import CommandPalette from "./CommandPalette";
import { COMMANDS } from "./command-registry";
```

- [ ] **Step 2: Add palette state and refs inside the component**

After the existing `const [viewMode, setViewMode] = useState("editor");` line, add:

```js
const [paletteOpen, setPaletteOpen] = useState(false);
const slashPosRef = useRef(null); // set when palette is opened via '/' trigger
```

- [ ] **Step 3: Add palette callbacks**

After the existing `handleCollapse` callback, add:

```js
const closePalette = useCallback(() => {
  setPaletteOpen(false);
  editorRef.current?.focus();
}, []);

const handlePaletteExecute = useCallback((cmd) => {
  const cm = editorRef.current;
  if (!cm) return;
  if (slashPosRef.current) {
    const { line, ch } = slashPosRef.current;
    cm.replaceRange("", { line, ch }, { line, ch: ch + 1 });
    slashPosRef.current = null;
  }
  cmd.action(cm);
  cm.focus();
}, []);
```

- [ ] **Step 4: Add `Cmd+P` extraKey and `/` inputRead handler to the CodeMirror initialization**

Inside the `useEffect` that initializes CodeMirror, in the `extraKeys` object, add after the existing `"Cmd-D"` entry:

```js
"Cmd-P": () => {
  slashPosRef.current = null;
  setPaletteOpen(true);
},
```

After `editorRef.current = cm;` and before `return () => { ... }`, add the `inputRead` handler:

```js
cm.on("inputRead", (editor, change) => {
  if (change.text[0] !== "/") return;
  const cursor = editor.getCursor();
  const lineContent = editor.getLine(cursor.line);
  const beforeSlash = lineContent.slice(0, cursor.ch - 1).trim();
  if (beforeSlash !== "") return;
  // '/' at start of line — open palette and track slash position for cleanup
  slashPosRef.current = { line: cursor.line, ch: cursor.ch - 1 };
  setPaletteOpen(true);
});
```

- [ ] **Step 5: Render CommandPalette in the JSX**

In the return statement, inside `<Field.Root ...>`, after the closing `</Flex>` of the media library dialog block, add:

```jsx
<CommandPalette
  isOpen={paletteOpen}
  onClose={closePalette}
  onExecute={handlePaletteExecute}
  commands={COMMANDS}
/>
```

- [ ] **Step 6: Commit**

```bash
git add backend/src/plugins/wysiwyg-editor/admin/src/components/WYSIWYGEditor/index.jsx
git commit -m "feat: add Cmd+P command palette and / slash trigger to WYSIWYG editor"
```

---

## Verification

- [ ] Start Strapi: `cd backend && yarn develop`
- [ ] Open any content type with a WYSIWYG field
- [ ] Type `:::center\nhello\n:::` — verify it renders as plain text (hard cut confirmed)
- [ ] Click **Alignment → Center** — verify `<md-align data-dir="center">` is inserted
- [ ] Click **Image → Float Left** — verify `![alt](url){.float-left .w-1/3}` is inserted
- [ ] Click **Decorative → Divider** — verify `<md-divider />` is inserted and preview shows the SVG
- [ ] Type `<md-callout data-variant="warning">\ntest\n</md-callout>` — verify preview renders the callout
- [ ] Press `Cmd+P` — palette opens, search field is focused
- [ ] Type "center" — results filter to alignment commands
- [ ] Press Enter on "Align Center" — `<md-align data-dir="center">` inserted, palette closes
- [ ] Press Escape — palette closes, nothing inserted
- [ ] Type `/` at the start of a new line — palette opens
- [ ] Select "Ornamental Divider" — `/` is deleted and `<md-divider />` is inserted
- [ ] Press Escape after typing `/` — `/` stays as a literal character
- [ ] Run all tests: `cd backend/src/plugins/wysiwyg-editor && yarn test --no-coverage --forceExit`
- [ ] Run all frontend tests: `cd frontend && yarn test`
- [ ] Build frontend: `cd frontend && yarn build` — verify no errors
