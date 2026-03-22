/**
 * Semantic color slots used for text coloring.
 * Background slots (bg_base, bg_raised, bg_inset) are excluded since they're
 * not meaningful as text colors.
 *
 * This file has no React/Strapi imports so it can be used in tests and configs.
 */
export const TEXT_COLOR_SLOTS = [
  {
    field: "text_muted",
    name: "text-muted",
    cssVar: "--color-text-muted",
    defaultHex: "#5a5a5a",
  },
  {
    field: "text_body",
    name: "text-body",
    cssVar: "--color-text-body",
    defaultHex: "#8c8273",
  },
  {
    field: "text_heading",
    name: "text-heading",
    cssVar: "--color-text-heading",
    defaultHex: "#e5e0d8",
  },
  {
    field: "accent",
    name: "accent",
    cssVar: "--color-accent",
    defaultHex: "#b4aa96",
  },
  {
    field: "interactive",
    name: "interactive",
    cssVar: "--color-interactive",
    defaultHex: "#291d04",
  },
  {
    field: "neutral",
    name: "neutral",
    cssVar: "--color-neutral",
    defaultHex: "#424852",
  },
  {
    field: "info",
    name: "info",
    cssVar: "--color-info",
    defaultHex: "#b8c5d6",
  },
  {
    field: "danger",
    name: "danger",
    cssVar: "--color-danger",
    defaultHex: "#4a1a1a",
  },
  {
    field: "success",
    name: "success",
    cssVar: "--color-success",
    defaultHex: "#2d3a2e",
  },
];

/** The set of semantic color names accepted by the markdown parser. */
export const SEMANTIC_COLOR_NAMES = TEXT_COLOR_SLOTS.map((s) => s.name);
