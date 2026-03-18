/**
 * Heritage Marked — Custom marked extensions for rich content.
 *
 * BUTTONS:       [Label](/url){.btn-primary}
 *                [Label](/url){.btn-secondary .lg icon=arrow-right target=_blank}
 *
 * HIGHLIGHT:     ==highlighted text==
 *
 * COLORS:        {color:pale-gold}golden text{/color}
 *                Available: pale-gold, silver-white, frost-blue, deep-crimson,
 *                           moss-green, fog, stone-grey
 *
 * IMAGES:        ![alt](/img.jpg){.float-left .w-1/3 .border}
 *                ![alt](/img.jpg){.mx-auto .w-1/2}
 *
 * ALIGNMENT:     :::center           :::right
 *                content             content
 *                :::                 :::
 *
 * DROP CAP:      :::drop-cap
 *                First paragraph gets large golden first letter.
 *                :::
 *
 * CALLOUTS:      :::callout           :::callout-warning     :::callout-info
 *                Note text            Warning text            Info text
 *                :::                  :::                     :::
 *
 * COLUMNS:       :::columns-2         :::columns-3
 *                Left column          Col 1
 *                ---                  ---
 *                Right column         Col 2
 *                                     ---
 *                :::                  Col 3
 *                                     :::
 *
 * DIVIDERS:      :::divider           (ornamental SVG divider)
 *                ---                  (simple gradient line — standard HR)
 *
 * SPACERS:       :::spacer            :::spacer-sm            :::spacer-lg
 */
import { Marked } from "marked";

// ─── Security Whitelists ──────────────────────────────────────────────────────

const ALLOWED_COLORS = new Set([
  "pale-gold",
  "silver-white",
  "frost-blue",
  "deep-crimson",
  "moss-green",
  "fog",
  "stone-grey",
]);

const ALLOWED_BUTTON_CLASSES = new Set(["btn-primary", "btn-secondary", "sm", "lg"]);

const ALLOWED_FIGURE_POSITIONAL_CLASSES = new Set([
  "float-left",
  "float-right",
  "w-1/3",
  "w-1/2",
  "w-2/3",
  "w-full",
  "mx-auto",
]);

const ALLOWED_FIGURE_DECORATION_CLASSES = new Set(["border", "rounded", "shadow"]);

const ALLOWED_DIRECTIVES = new Set([
  "center",
  "right",
  "drop-cap",
  "callout",
  "callout-warning",
  "callout-info",
  "columns-2",
  "columns-3",
  "divider",
  "spacer",
  "spacer-sm",
  "spacer-lg",
  "prose",
]);

const SELF_CLOSING_DIRECTIVES = new Set(["divider", "spacer", "spacer-sm", "spacer-lg"]);

// ─── Inline SVGs ──────────────────────────────────────────────────────────────

const ORNAMENTAL_DIVIDER_SVG = `<svg width="200" height="40" viewBox="0 0 200 40" class="text-pale-gold opacity-60" aria-hidden="true"><line x1="10" y1="20" x2="80" y2="20" stroke="currentColor" stroke-width="1" stroke-linecap="round"/><line x1="120" y1="20" x2="190" y2="20" stroke="currentColor" stroke-width="1" stroke-linecap="round"/><circle cx="100" cy="20" r="4" fill="currentColor"/><circle cx="100" cy="20" r="8" fill="none" stroke="currentColor" stroke-width="1"/><path d="M 88 20 L 90 18 L 92 20 L 90 22 Z" fill="currentColor"/><path d="M 108 20 L 110 18 L 112 20 L 110 22 Z" fill="currentColor"/></svg>`;

const ICON_ARROW_RIGHT = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`;

const ICON_EXTERNAL_LINK = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`;

const BUTTON_ICONS = {
  "arrow-right": ICON_ARROW_RIGHT,
  "external-link": ICON_EXTERNAL_LINK,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Parse `{.class1 .class2 key=value}` into `{ classes, attrs }`.
 */
function parseAttrs(str) {
  const classes = [];
  const attrs = {};
  for (const tok of str.trim().split(/\s+/)) {
    if (tok.startsWith(".")) {
      classes.push(tok.slice(1));
    } else if (tok.includes("=")) {
      const eq = tok.indexOf("=");
      attrs[tok.slice(0, eq)] = tok.slice(eq + 1);
    } else if (tok) {
      attrs[tok] = true;
    }
  }
  return { classes, attrs };
}

/**
 * Strip dangerous protocols from URLs.
 */
function sanitizeUrl(url) {
  if (/^\s*(javascript|data|vbscript):/i.test(url)) return "#";
  return url;
}

// ─── Extensions ───────────────────────────────────────────────────────────────

/**
 * Container directive: :::name\nbody\n:::
 * Handles alignment, callouts, columns, dividers, spacers, prose, drop-cap.
 */
const containerDirectiveExtension = {
  name: "containerDirective",
  level: "block",
  start(src) {
    const idx = src.indexOf(":::");
    return idx === -1 ? undefined : idx;
  },
  tokenizer(src) {
    // \n? before closing ::: allows empty-body (self-closing) directives
    const match = /^:::([\w][\w-]*)[^\n]*\n([\s\S]*?)\n?:::/.exec(src);
    if (!match) return;

    const name = match[1];
    if (!ALLOWED_DIRECTIVES.has(name)) return;

    const body = match[2];
    const token = {
      type: "containerDirective",
      raw: match[0],
      name,
      body,
    };

    if (!SELF_CLOSING_DIRECTIVES.has(name)) {
      if (name.startsWith("columns-")) {
        // Split on \n---\n before tokenizing so --- isn't parsed as <hr>
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
    }

    return token;
  },
  renderer(token) {
    const { name } = token;

    // Self-closing directives
    if (name === "divider") {
      return `<div class="md-divider" aria-hidden="true">${ORNAMENTAL_DIVIDER_SVG}</div>\n`;
    }
    if (name === "spacer") return `<div class="md-spacer" aria-hidden="true"></div>\n`;
    if (name === "spacer-sm") return `<div class="md-spacer-sm" aria-hidden="true"></div>\n`;
    if (name === "spacer-lg") return `<div class="md-spacer-lg" aria-hidden="true"></div>\n`;

    // Column layout
    if (name.startsWith("columns-")) {
      const colClass =
        name === "columns-3" ? "md-columns md-columns-3" : "md-columns md-columns-2";
      const colsHtml = (token.colTokens || [])
        .map((colToks) => `<div class="md-column">${this.parser.parse(colToks)}</div>`)
        .join("");
      return `<div class="${colClass}">${colsHtml}</div>\n`;
    }

    // Block directives with recursive inner content
    const inner = this.parser.parse(token.tokens || []);
    switch (name) {
      case "center":
        return `<div class="md-container md-center">${inner}</div>\n`;
      case "right":
        return `<div class="md-container md-right">${inner}</div>\n`;
      case "drop-cap":
        return `<div class="md-container drop-cap">${inner}</div>\n`;
      case "prose":
        return `<div class="md-container prose-heritage">${inner}</div>\n`;
      case "callout":
        return `<aside class="md-container md-callout">${inner}</aside>\n`;
      case "callout-warning":
        return `<aside class="md-container md-callout md-callout-warning">${inner}</aside>\n`;
      case "callout-info":
        return `<aside class="md-container md-callout md-callout-info">${inner}</aside>\n`;
      default:
        return `<div class="md-container">${inner}</div>\n`;
    }
  },
  childTokens: ["tokens"],
};

/**
 * Highlight: ==text==
 */
const highlightExtension = {
  name: "highlight",
  level: "inline",
  start(src) {
    const idx = src.indexOf("==");
    return idx === -1 ? undefined : idx;
  },
  tokenizer(src) {
    const match = /^==((?:[^=]|=(?!=))+)==/.exec(src);
    if (!match) return;
    return { type: "highlight", raw: match[0], text: match[1] };
  },
  renderer(token) {
    return `<mark class="md-highlight">${token.text}</mark>`;
  },
};

/**
 * Colored text: {color:pale-gold}text{/color}
 */
const coloredTextExtension = {
  name: "coloredText",
  level: "inline",
  start(src) {
    const idx = src.indexOf("{color:");
    return idx === -1 ? undefined : idx;
  },
  tokenizer(src) {
    const match = /^\{color:([\w-]+)\}([\s\S]*?)\{\/color\}/.exec(src);
    if (!match) return;
    const color = match[1];
    if (!ALLOWED_COLORS.has(color)) return;
    return { type: "coloredText", raw: match[0], color, text: match[2] };
  },
  renderer(token) {
    return `<span style="color:var(--color-${token.color})">${token.text}</span>`;
  },
};

/**
 * Button link: [Label](url){.btn-primary .lg icon=arrow-right}
 * Registered before the default link tokenizer so it intercepts btn-decorated links.
 */
const buttonLinkExtension = {
  name: "buttonLink",
  level: "inline",
  start(src) {
    const idx = src.indexOf("[");
    return idx === -1 ? undefined : idx;
  },
  tokenizer(src) {
    const match = /^\[([^\]]+)\]\(([^)]+)\)\{([^}]+)\}/.exec(src);
    if (!match) return;
    const { classes, attrs } = parseAttrs(match[3]);
    const btnClass = classes.find((c) => c === "btn-primary" || c === "btn-secondary");
    if (!btnClass) return;
    return {
      type: "buttonLink",
      raw: match[0],
      label: match[1],
      href: match[2],
      btnClass,
      classes,
      attrs,
    };
  },
  renderer(token) {
    const url = sanitizeUrl(token.href);
    const { classes, attrs } = token;

    const sizeClass = classes.includes("lg")
      ? "btn-lg"
      : classes.includes("sm")
        ? "btn-sm"
        : "";
    const iconName = attrs.icon;
    const iconHtml = iconName && BUTTON_ICONS[iconName] ? BUTTON_ICONS[iconName] : "";
    const iconClass = iconHtml ? "md-btn-icon" : "";

    const isExternal = attrs.target === "_blank";
    const targetAttr = isExternal ? ' target="_blank" rel="noopener noreferrer"' : "";

    const classAttr = [token.btnClass, sizeClass, iconClass].filter(Boolean).join(" ");
    return `<a href="${url}" class="${classAttr}"${targetAttr}>${token.label}${iconHtml}</a>`;
  },
};

/**
 * Attributed image: ![alt](url){.float-left .w-1/3 .border}
 * Registered before the default image tokenizer so it intercepts decorated images.
 */
const attributedImageExtension = {
  name: "attributedImage",
  level: "inline",
  start(src) {
    const idx = src.indexOf("![");
    return idx === -1 ? undefined : idx;
  },
  tokenizer(src) {
    const match = /^!\[([^\]]*)\]\(([^)]+)\)\{([^}]+)\}/.exec(src);
    if (!match) return;
    const { classes } = parseAttrs(match[3]);
    const positional = classes.filter((c) => ALLOWED_FIGURE_POSITIONAL_CLASSES.has(c));
    const decoration = classes.filter((c) => ALLOWED_FIGURE_DECORATION_CLASSES.has(c));
    return {
      type: "attributedImage",
      raw: match[0],
      alt: match[1],
      src: match[2],
      positional,
      decoration,
    };
  },
  renderer(token) {
    const url = sanitizeUrl(token.src);
    const figureClass = ["md-figure", ...token.positional].join(" ");
    const imgClassAttr =
      token.decoration.length > 0 ? ` class="${token.decoration.join(" ")}"` : "";
    return `<figure class="${figureClass}"><img src="${url}" alt="${token.alt}"${imgClassAttr} /></figure>`;
  },
};

// ─── Configured Instance ──────────────────────────────────────────────────────

export const heritageMarked = new Marked();
heritageMarked.use({
  gfm: true,
  breaks: false,
  extensions: [
    // Block first
    containerDirectiveExtension,
    // Inline — button/image BEFORE default link/image tokenizers
    buttonLinkExtension,
    attributedImageExtension,
    highlightExtension,
    coloredTextExtension,
  ],
});
