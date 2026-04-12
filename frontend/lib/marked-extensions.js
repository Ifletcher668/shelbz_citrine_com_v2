/**
 * Wysiwyg Marked — Custom marked extensions for rich content.
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
 * ALIGNMENT:     <md-align data-dir="center">content</md-align>
 *                <md-align data-dir="left|right|justify">content</md-align>
 *                <md-align data-valign="top|middle|bottom">content</md-align>
 *
 * TOOLTIP:       ^[visible text](Tooltip content here)
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
 *
 * BULLETS:       [-] X / cross bullet point
 *                [+] checkmark bullet point
 *
 * EMBEDS:        [ref:bullet-list:42]
 *                Embeds a relation by type and id. Resolved at build time via
 *                parseWithRelations(body, relations). Use extractRelationRefs()
 *                to collect refs for prefetching.
 */
import { Marked } from "marked";
import { buildStrapiSrcSet } from "./strapi-cms/strapiApi";

// ─── Security Whitelists ──────────────────────────────────────────────────────

const ALLOWED_COLORS = new Set([
  // Semantic theme colors (current)
  "text-muted",
  "text-body",
  "text-heading",
  "accent",
  "interactive",
  "neutral",
  "info",
  "danger",
  "success",
  // Aesthetic names — kept for backward compatibility with existing content
  "pale-gold",
  "silver-white",
  "frost-blue",
  "deep-crimson",
  "moss-green",
  "fog",
  "stone-grey",
]);

const ALLOWED_BUTTON_CLASSES = new Set([
  "btn-primary",
  "btn-secondary",
  "sm",
  "lg",
]);

const ALLOWED_FIGURE_POSITIONAL_CLASSES = new Set([
  "float-left",
  "float-right",
  "w-1/3",
  "w-1/2",
  "w-2/3",
  "w-full",
  "mx-auto",
]);

const ALLOWED_FIGURE_DECORATION_CLASSES = new Set([
  "border",
  "rounded",
  "shadow",
]);

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
  // dir and valign are mutually exclusive in the renderer (valign takes priority).
  // Both are listed here so each is individually valid; combining them is not an error.
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

// ─── Inline SVGs ──────────────────────────────────────────────────────────────

const ORNAMENTAL_DIVIDER_SVG = `<svg width="200" height="40" viewBox="0 0 200 40" class="text-pale-gold opacity-60" aria-hidden="true"><line x1="10" y1="20" x2="80" y2="20" stroke="currentColor" stroke-width="1" stroke-linecap="round"/><line x1="120" y1="20" x2="190" y2="20" stroke="currentColor" stroke-width="1" stroke-linecap="round"/><circle cx="100" cy="20" r="4" fill="currentColor"/><circle cx="100" cy="20" r="8" fill="none" stroke="currentColor" stroke-width="1"/><path d="M 88 20 L 90 18 L 92 20 L 90 22 Z" fill="currentColor"/><path d="M 108 20 L 110 18 L 112 20 L 110 22 Z" fill="currentColor"/></svg>`;

const ICON_HELP_CIRCLE = `<svg width="0.85em" height="0.85em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:-0.05em;flex-shrink:0" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;

const ICON_ARROW_RIGHT = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`;

const ICON_X = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;

const ICON_CHECK = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 18 4 13"/></svg>`;

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
 * Escape characters that are unsafe inside HTML attribute values.
 */
function escapeAttr(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Strip dangerous protocols from URLs.
 */
function sanitizeUrl(url) {
  if (/^\s*(javascript|data|vbscript):/i.test(url)) return "#";
  return url;
}

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
  if (!allowedAttrs) return Object.keys(attrs).length === 0;
  for (const [key, value] of Object.entries(attrs)) {
    if (!(key in allowedAttrs)) return false;
    if (!allowedAttrs[key].includes(value)) return false;
  }
  return true;
}

// ─── Extensions ───────────────────────────────────────────────────────────────

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
      return {
        type: "mdElement",
        raw,
        tagName,
        attrs,
        selfClose: true,
        tokens: [],
      };
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
        if (s === "sm")
          return `<div class="md-spacer-sm" aria-hidden="true"></div>\n`;
        if (s === "lg")
          return `<div class="md-spacer-lg" aria-hidden="true"></div>\n`;
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
        const widthClass = widthMap[attrs.width];
        return `<div class="${widthClass ? `md-container ${widthClass}` : "md-container"}">${inner}</div>\n`;
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
  // Note: colTokens (used by md-columns) is an array of token arrays, not a flat
  // token array, so it cannot be listed in childTokens. Column content is invisible
  // to marked's walkTokens — rendered directly via this.parser.parse() instead.
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
    const btnClass = classes.find(
      (c) => c === "btn-primary" || c === "btn-secondary",
    );
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
    const iconHtml =
      iconName && BUTTON_ICONS[iconName] ? BUTTON_ICONS[iconName] : "";
    const iconClass = iconHtml ? "md-btn-icon" : "";

    const isExternal = attrs.target === "_blank";
    const targetAttr = isExternal
      ? ' target="_blank" rel="noopener noreferrer"'
      : "";

    const classAttr = [token.btnClass, sizeClass, iconClass]
      .filter(Boolean)
      .join(" ");
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
    const positional = classes.filter((c) =>
      ALLOWED_FIGURE_POSITIONAL_CLASSES.has(c),
    );
    const decoration = classes.filter((c) =>
      ALLOWED_FIGURE_DECORATION_CLASSES.has(c),
    );
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
      token.decoration.length > 0
        ? ` class="${token.decoration.join(" ")}"`
        : "";
    return `<figure class="${figureClass}"><img src="${url}" alt="${token.alt}"${imgClassAttr} data-strapi-img /></figure>`;
  },
};

/**
 * Bullet point: [-] cross/X  or  [+] checkmark
 * Block-level. Renders an icon-prefixed item with bordered icon box.
 *   [-] Text here   → X / cross bullet
 *   [+] Text here   → checkmark bullet
 */
const bulletPointExtension = {
  name: "bulletPoint",
  level: "block",
  start(src) {
    const m = src.search(/^\[-\] |^\[\+\] /m);
    return m === -1 ? undefined : m;
  },
  tokenizer(src) {
    const match = /^\[(-|\+)\] ([^\n]+)(?:\n|$)/.exec(src);
    if (!match) return;
    return {
      type: "bulletPoint",
      raw: match[0],
      icon: match[1] === "+" ? "check" : "x",
      text: match[2],
    };
  },
  renderer(token) {
    const iconSvg = token.icon === "check" ? ICON_CHECK : ICON_X;
    return `<div class="md-bullet md-bullet-${token.icon}"><span class="md-bullet-icon">${iconSvg}</span><span class="md-bullet-text">${token.text}</span></div>\n`;
  },
};

/**
 * Relation embed: [ref:type:id]
 * Block-level. Outputs a placeholder div with data attributes; replaced with
 * pre-rendered HTML by parseWithRelations() after the marked pass.
 */
const relationEmbedExtension = {
  name: "relationEmbed",
  level: "block",
  start(src) {
    const m = src.search(/^\[ref:[\w-]+:\d+\]/m);
    return m === -1 ? undefined : m;
  },
  tokenizer(src) {
    const match = /^\[ref:([\w-]+):(\d+)\][ \t]*(?:\n|$)/.exec(src);
    if (!match) return;
    return {
      type: "relationEmbed",
      raw: match[0],
      relType: match[1],
      relId: match[2],
    };
  },
  renderer(token) {
    return `<div data-md-rel="${token.relType}" data-md-rel-id="${token.relId}"></div>\n`;
  },
};

/**
 * Tooltip: ^[visible text](tooltip content here)
 * Renders an inline help tooltip with a HelpCircle icon.
 */
const tooltipExtension = {
  name: "tooltip",
  level: "inline",
  start(src) {
    const idx = src.indexOf("^[");
    return idx === -1 ? undefined : idx;
  },
  tokenizer(src) {
    const match = /^\^\[([^\]]+)\]\(([^)]+)\)/.exec(src);
    if (!match) return;
    return { type: "tooltip", raw: match[0], text: match[1], tip: match[2] };
  },
  renderer(token) {
    const tip = escapeAttr(token.tip.trim());
    return `<span class="md-tooltip" data-tooltip="${tip}">${token.text} ${ICON_HELP_CIRCLE}</span>`;
  },
};

// ─── Relation helpers ─────────────────────────────────────────────────────────

/**
 * Extract all [ref:type:id] references from a markdown string (deduplicated).
 */
export function extractRelationRefs(markdown) {
  const refs = [];
  const seen = new Set();
  const re = /\[ref:([\w-]+):(\d+)\]/g;
  let m;
  while ((m = re.exec(markdown)) !== null) {
    const key = `${m[1]}:${m[2]}`;
    if (!seen.has(key)) {
      seen.add(key);
      refs.push({ type: m[1], id: parseInt(m[2], 10) });
    }
  }
  return refs;
}

/**
 * Parse markdown to HTML, then:
 * 1. Replace relation embed placeholders with pre-rendered HTML strings.
 * 2. Inject srcset/sizes into Strapi image tags using the media map.
 *
 * @param {string} body - Markdown source
 * @param {Record<string, string>} relations - Map of "type:id" → HTML string
 * @param {Record<string, object>} mediaMap - Map of "/uploads/..." URL → StrapiMedia object
 */
export function parseWithRelations(body, relations = {}, mediaMap = {}) {
  let html = wysiwygMarked.parse(body);

  html = html.replace(
    /<div data-md-rel="([\w-]+)" data-md-rel-id="(\d+)"><\/div>/g,
    (_, type, id) => relations[`${type}:${id}`] ?? "",
  );

  if (Object.keys(mediaMap).length > 0) {
    html = html.replace(
      /<img src="([^"]+)"([^>]*) data-strapi-img \/>/g,
      (_match, url, rest) => {
        const media = mediaMap[url];
        if (!media) return `<img src="${url}"${rest} />`;
        const srcset = buildStrapiSrcSet(media);
        const extra = srcset
          ? ` srcset="${srcset}" sizes="(max-width: 768px) 100vw, 66vw"`
          : "";
        return `<img src="${url}"${rest}${extra} />`;
      },
    );
  }

  html = html.replace(/<p>(\s*<figure[\s\S]*?<\/figure>\s*)<\/p>/g, "$1");

  return html;
}

// ─── Configured Instance ──────────────────────────────────────────────────────

export const wysiwygMarked = new Marked();
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
  renderer: {
    // Plain ![alt](url) images (no {.class} suffix) — wrap in figure for consistency
    image({ href, title, text }) {
      const url = sanitizeUrl(href);
      const titleAttr = title ? ` title="${title}"` : "";
      return `<figure class="md-figure"><img src="${url}" alt="${text}"${titleAttr} data-strapi-img /></figure>`;
    },
  },
});
