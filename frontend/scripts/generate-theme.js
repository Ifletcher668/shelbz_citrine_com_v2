"use strict";

/**
 * Prebuild script — fetches the active theme from Strapi and writes
 * public/theme.css with :root CSS custom property overrides.
 *
 * Runs automatically before `next build` via the prebuild npm hook.
 * Self-contained CommonJS (no imports from lib/) to avoid module system issues.
 *
 * If Strapi is unavailable, an empty theme.css is written so the
 * @theme fallback values in styles/globals.css take effect.
 */

const fs = require("fs");
const path = require("path");

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

const OUTPUT_PATH = path.join(__dirname, "..", "public", "theme.css");

/**
 * Map from Strapi theme field paths to CSS custom property names.
 * One Strapi field may appear multiple times to populate multiple CSS vars.
 * See frontend/lib/theme.js for the authoritative comments on each slot.
 */
const THEME_VARIABLE_MAP = [
  // bg_base — page/root background
  ["colors.bg_base", "--color-bg-base"],
  ["colors.bg_base", "--color-background"],
  ["colors.bg_base", "--color-primary-foreground"],
  ["colors.bg_base", "--color-accent-foreground"],

  // bg_raised — cards, elevated surfaces
  ["colors.bg_raised", "--color-bg-raised"],
  ["colors.bg_raised", "--color-card"],
  ["colors.bg_raised", "--color-popover"],
  ["colors.bg_raised", "--color-input"],

  // bg_inset — form inputs, code blocks
  ["colors.bg_inset", "--color-bg-inset"],
  ["colors.bg_inset", "--color-muted"],

  // text_muted — disabled, subdued
  ["colors.text_muted", "--color-text-muted"],

  // text_body — default body text
  ["colors.text_body", "--color-text-body"],
  ["colors.text_body", "--color-muted-foreground"],
  ["colors.text_body", "--color-card-foreground"],

  // text_heading — headings, bright text
  ["colors.text_heading", "--color-text-heading"],
  ["colors.text_heading", "--color-foreground"],
  ["colors.text_heading", "--color-secondary-foreground"],
  ["colors.text_heading", "--color-destructive-foreground"],
  ["colors.text_heading", "--color-popover-foreground"],

  // accent — links, borders, highlights
  ["colors.accent", "--color-accent"],
  ["colors.accent", "--color-primary"],
  ["colors.accent", "--color-ring"],

  // interactive — button face / fill
  ["colors.interactive", "--color-interactive"],

  // neutral — secondary UI elements
  ["colors.neutral", "--color-neutral"],
  ["colors.neutral", "--color-secondary"],

  // info — info callouts, cool highlights
  ["colors.info", "--color-info"],

  // danger — destructive actions, warnings
  ["colors.danger", "--color-danger"],
  ["colors.danger", "--color-destructive"],

  // success — success states
  ["colors.success", "--color-success"],

  // Font families
  ["typography.font_display", "--font-display"],
  ["typography.font_body", "--font-body"],
  ["typography.font_ui", "--font-ui"],
  ["typography.font_mono", "--font-mono"],
  ["typography.font_serif", "--font-serif"],
  ["typography.font_sans", "--font-sans"],

  // Type scale
  ["typography.text_6xl", "--text-6xl"],
  ["typography.text_5xl", "--text-5xl"],
  ["typography.text_4xl", "--text-4xl"],
  ["typography.text_3xl", "--text-3xl"],
  ["typography.text_2xl", "--text-2xl"],
  ["typography.text_xl", "--text-xl"],
  ["typography.text_lg", "--text-lg"],
  ["typography.text_md", "--text-md"],
  ["typography.text_base", "--text-base"],
  ["typography.text_sm", "--text-sm"],
  ["typography.text_xs", "--text-xs"],

  // Spacing
  ["spacing.spacing_1", "--spacing-1"],
  ["spacing.spacing_2", "--spacing-2"],
  ["spacing.spacing_3", "--spacing-3"],
  ["spacing.spacing_4", "--spacing-4"],
  ["spacing.spacing_5", "--spacing-5"],
  ["spacing.spacing_6", "--spacing-6"],
  ["spacing.spacing_8", "--spacing-8"],
  ["spacing.spacing_10", "--spacing-10"],
  ["spacing.spacing_12", "--spacing-12"],
  ["spacing.spacing_16", "--spacing-16"],
  ["spacing.spacing_20", "--spacing-20"],

  // Layout
  ["layout.container_narrow", "--max-width-container-narrow"],
  ["layout.container_reading", "--max-width-container-reading"],
  ["layout.container_wide", "--max-width-container-wide"],
  ["layout.radius_lg", "--radius-lg"],
  ["layout.radius_md", "--radius-md"],
  ["layout.radius_sm", "--radius-sm"],
  ["layout.timing_souls", "--transition-timing-function-souls"],
  ["layout.timing_sharp", "--transition-timing-function-sharp"],
  ["layout.timing_smooth", "--transition-timing-function-smooth"],
];

function get(obj, path) {
  return path.split(".").reduce((curr, key) => curr && curr[key], obj);
}

function themeToCSS(theme) {
  if (!theme) return "";

  const declarations = [];
  for (const [path, cssVar] of THEME_VARIABLE_MAP) {
    const value = get(theme, path);
    if (value !== null && value !== undefined && value !== "") {
      declarations.push(`  ${cssVar}: ${value};`);
    }
  }

  const fontsUrl = theme.typography && theme.typography.google_fonts_url;
  const fontImport = fontsUrl ? `@import url("${fontsUrl}");\n\n` : "";

  if (declarations.length === 0) return fontImport;

  return `${fontImport}:root {\n${declarations.join("\n")}\n}\n`;
}

async function fetchActiveTheme() {
  const qs =
    "?filters[is_active][$eq]=true" +
    "&populate[colors]=*" +
    "&populate[typography]=*" +
    "&populate[spacing]=*" +
    "&populate[layout]=*";

  const url = `${STRAPI_URL}/api/themes${qs}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Strapi responded ${res.status} for ${url}`);
  const json = await res.json();
  const data = json.data;
  if (!data || data.length === 0) return null;
  return data[0];
}

async function main() {
  console.log("[generate-theme] Fetching active theme from Strapi…");

  let css = "";

  try {
    const theme = await fetchActiveTheme();
    if (!theme) {
      console.warn(
        "[generate-theme] No active theme found — writing empty theme.css (globals.css fallbacks will apply).",
      );
    } else {
      css = themeToCSS(theme);
      console.log(
        `[generate-theme] Active theme: "${theme.name}" — writing theme.css`,
      );
    }
  } catch (err) {
    console.warn(
      `[generate-theme] Could not reach Strapi (${err.message}) — writing empty theme.css.`,
    );
  }

  fs.writeFileSync(OUTPUT_PATH, css, "utf8");
  console.log(`[generate-theme] Written to ${OUTPUT_PATH}`);
}

main().catch((err) => {
  console.error("[generate-theme] Fatal error:", err);
  fs.writeFileSync(OUTPUT_PATH, "", "utf8");
});
