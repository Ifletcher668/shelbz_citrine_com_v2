/**
 * Theme utilities — converts a Strapi Theme entry into injected CSS.
 *
 * The active theme is fetched at build time by scripts/generate-theme.js and
 * written to public/theme.css. That file is linked in _document.js, where its
 * :root block overrides the fallback values defined in the @theme block in
 * styles/globals.css.
 *
 * Color architecture — one layer, 12 role-named slots:
 *
 *   bg_base      Page / root background   → --color-bg-base
 *   bg_raised    Cards, elevated surfaces  → --color-bg-raised
 *   bg_inset     Form inputs, code blocks  → --color-bg-inset
 *   text_muted   Disabled, subdued text    → --color-text-muted
 *   text_body    Default body text         → --color-text-body
 *   text_heading Headings, bright text     → --color-text-heading
 *   accent       Links, borders, highlights → --color-accent
 *   interactive  Button face / fill        → --color-interactive
 *   neutral      Secondary UI elements     → --color-neutral
 *   info         Info callouts             → --color-info
 *   danger       Destructive actions       → --color-danger
 *   success      Success states            → --color-success
 *
 * Each slot also drives shadcn/ui semantic tokens (--color-background,
 * --color-primary, etc.) so changing one value cascades through the full UI.
 *
 * Border color (--color-border) is left hardcoded in @theme because it uses
 * an rgba value that cannot be derived from a simple hex slot.
 */

/**
 * Map from Strapi theme field paths to CSS custom property names.
 * Format: [strapiPath, cssVar]
 * One Strapi field may appear multiple times to populate multiple CSS vars.
 */
const THEME_VARIABLE_MAP = [
  // ─── bg_base — page/root background ───────────────────────────────────────
  ["colors.bg_base", "--color-bg-base"],
  ["colors.bg_base", "--color-background"],
  ["colors.bg_base", "--color-primary-foreground"],
  ["colors.bg_base", "--color-accent-foreground"],

  // ─── bg_raised — cards, elevated surfaces ─────────────────────────────────
  ["colors.bg_raised", "--color-bg-raised"],
  ["colors.bg_raised", "--color-card"],
  ["colors.bg_raised", "--color-popover"],
  ["colors.bg_raised", "--color-input"],

  // ─── bg_inset — form inputs, code blocks ──────────────────────────────────
  ["colors.bg_inset", "--color-bg-inset"],
  ["colors.bg_inset", "--color-muted"],

  // ─── text_muted — disabled, subdued ───────────────────────────────────────
  ["colors.text_muted", "--color-text-muted"],

  // ─── text_body — default body text ────────────────────────────────────────
  ["colors.text_body", "--color-text-body"],
  ["colors.text_body", "--color-muted-foreground"],
  ["colors.text_body", "--color-card-foreground"],

  // ─── text_heading — headings, bright text ─────────────────────────────────
  ["colors.text_heading", "--color-text-heading"],
  ["colors.text_heading", "--color-foreground"],
  ["colors.text_heading", "--color-secondary-foreground"],
  ["colors.text_heading", "--color-destructive-foreground"],
  ["colors.text_heading", "--color-popover-foreground"],

  // ─── accent — links, borders, highlights ──────────────────────────────────
  ["colors.accent", "--color-accent"],
  ["colors.accent", "--color-primary"],
  ["colors.accent", "--color-ring"],

  // ─── interactive — button face / fill ─────────────────────────────────────
  ["colors.interactive", "--color-interactive"],

  // ─── neutral — secondary UI elements ──────────────────────────────────────
  ["colors.neutral", "--color-neutral"],
  ["colors.neutral", "--color-secondary"],

  // ─── info — info callouts, cool highlights ─────────────────────────────────
  ["colors.info", "--color-info"],

  // ─── danger — destructive actions, warnings ────────────────────────────────
  ["colors.danger", "--color-danger"],
  ["colors.danger", "--color-destructive"],

  // ─── success — success states ─────────────────────────────────────────────
  ["colors.success", "--color-success"],

  // ─── Typography — Font Families ────────────────────────────────────────────
  ["typography.font_display", "--font-display"],
  ["typography.font_body",    "--font-body"],
  ["typography.font_ui",      "--font-ui"],
  ["typography.font_mono",    "--font-mono"],
  ["typography.font_serif",   "--font-serif"],
  ["typography.font_sans",    "--font-sans"],

  // ─── Typography — Type Scale ───────────────────────────────────────────────
  ["typography.text_6xl",  "--text-6xl"],
  ["typography.text_5xl",  "--text-5xl"],
  ["typography.text_4xl",  "--text-4xl"],
  ["typography.text_3xl",  "--text-3xl"],
  ["typography.text_2xl",  "--text-2xl"],
  ["typography.text_xl",   "--text-xl"],
  ["typography.text_lg",   "--text-lg"],
  ["typography.text_md",   "--text-md"],
  ["typography.text_base", "--text-base"],
  ["typography.text_sm",   "--text-sm"],
  ["typography.text_xs",   "--text-xs"],

  // ─── Spacing ───────────────────────────────────────────────────────────────
  ["spacing.spacing_1",  "--spacing-1"],
  ["spacing.spacing_2",  "--spacing-2"],
  ["spacing.spacing_3",  "--spacing-3"],
  ["spacing.spacing_4",  "--spacing-4"],
  ["spacing.spacing_5",  "--spacing-5"],
  ["spacing.spacing_6",  "--spacing-6"],
  ["spacing.spacing_8",  "--spacing-8"],
  ["spacing.spacing_10", "--spacing-10"],
  ["spacing.spacing_12", "--spacing-12"],
  ["spacing.spacing_16", "--spacing-16"],
  ["spacing.spacing_20", "--spacing-20"],

  // ─── Layout ────────────────────────────────────────────────────────────────
  ["layout.container_narrow",  "--max-width-container-narrow"],
  ["layout.container_reading", "--max-width-container-reading"],
  ["layout.container_wide",    "--max-width-container-wide"],
  ["layout.radius_lg",         "--radius-lg"],
  ["layout.radius_md",         "--radius-md"],
  ["layout.radius_sm",         "--radius-sm"],
  ["layout.timing_souls",      "--transition-timing-function-souls"],
  ["layout.timing_sharp",      "--transition-timing-function-sharp"],
  ["layout.timing_smooth",     "--transition-timing-function-smooth"],
];

function get(obj, path) {
  return path.split(".").reduce((curr, key) => curr?.[key], obj);
}

/**
 * Convert a Strapi Theme entry into a CSS string suitable for injection.
 *
 * Emits:
 *   1. A Google Fonts @import (if google_fonts_url is set)
 *   2. A :root { } block with all non-empty CSS variable declarations
 *
 * @param {object} theme - Strapi Theme flat response object
 * @returns {string} CSS string
 */
export function themeToCSS(theme) {
  if (!theme) return "";

  const declarations = [];

  for (const [path, cssVar] of THEME_VARIABLE_MAP) {
    const value = get(theme, path);
    if (value !== null && value !== undefined && value !== "") {
      declarations.push(`  ${cssVar}: ${value};`);
    }
  }

  const fontsUrl = theme.typography?.google_fonts_url;
  const fontImport = fontsUrl ? `@import url("${fontsUrl}");\n\n` : "";

  if (declarations.length === 0) return fontImport;

  return `${fontImport}:root {\n${declarations.join("\n")}\n}\n`;
}
