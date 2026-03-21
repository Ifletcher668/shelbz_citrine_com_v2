/**
 * Unit tests for frontend/lib/theme.js — themeToCSS()
 *
 * Verifies:
 * - Each of the 12 semantic color slots emits the correct primary CSS var
 * - Each slot also drives its shadcn/ui compat aliases
 * - Typography, spacing, and layout slots emit the correct CSS vars
 * - google_fonts_url produces an @import rule
 * - Null/empty inputs produce empty output
 * - Partial themes only emit non-empty values
 */

import { themeToCSS } from "../../lib/theme.js";

// Minimal heritage-equivalent theme object (Strapi flat response shape)
const FULL_THEME = {
  colors: {
    bg_base:      "#000000",
    bg_raised:    "#0a0a0a",
    bg_inset:     "#141414",
    text_muted:   "#5a5a5a",
    text_body:    "#8c8273",
    text_heading: "#e5e0d8",
    accent:       "#b4aa96",
    interactive:  "#291d0466",
    neutral:      "#424852",
    info:         "#b8c5d6",
    danger:       "#4a1a1a",
    success:      "#2d3a2e",
  },
  typography: {
    google_fonts_url: "https://fonts.googleapis.com/css2?family=Cinzel",
    font_display: '"Cinzel", serif',
    font_body:    '"Crimson Text", Georgia, serif',
    font_ui:      '"Cinzel", serif',
    font_mono:    '"IBM Plex Mono", monospace',
    font_serif:   '"Crimson Text", Georgia, serif',
    font_sans:    '"Cinzel", serif',
    text_6xl:  "clamp(3.5rem, 8vw, 5.5rem)",
    text_5xl:  "clamp(3rem, 6vw, 4.5rem)",
    text_4xl:  "clamp(2.25rem, 5vw, 3.5rem)",
    text_3xl:  "clamp(1.75rem, 4vw, 2.5rem)",
    text_2xl:  "clamp(1.5rem, 3vw, 2rem)",
    text_xl:   "clamp(1.4rem, 2.8vw, 1.8rem)",
    text_lg:   "clamp(1.375rem, 2.5vw, 1.5rem)",
    text_md:   "clamp(1.25rem, 2vw, 1.375rem)",
    text_base: "1.25rem",
    text_sm:   "1.125rem",
    text_xs:   "1rem",
  },
  spacing: {
    spacing_1:  "clamp(0.25rem, 0.5vw, 0.5rem)",
    spacing_2:  "clamp(0.5rem, 1vw, 0.75rem)",
    spacing_3:  "clamp(0.75rem, 1.5vw, 1rem)",
    spacing_4:  "clamp(1rem, 2vw, 1.25rem)",
    spacing_5:  "clamp(1.25rem, 2.5vw, 1.5rem)",
    spacing_6:  "clamp(1.5rem, 3vw, 2rem)",
    spacing_8:  "clamp(2rem, 4vw, 3rem)",
    spacing_10: "clamp(2.5rem, 5vw, 4rem)",
    spacing_12: "clamp(3rem, 6vw, 5rem)",
    spacing_16: "clamp(4rem, 8vw, 6rem)",
    spacing_20: "clamp(5rem, 10vw, 8rem)",
  },
  layout: {
    container_narrow:  "41.625rem",
    container_reading: "62rem",
    container_wide:    "80rem",
    radius_lg:         "0",
    radius_md:         "0",
    radius_sm:         "0",
    timing_souls:  "cubic-bezier(0.25, 0.1, 0.25, 1)",
    timing_sharp:  "cubic-bezier(0.4, 0, 0.6, 1)",
    timing_smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
  },
};

// Helper — parses the :root block into a { varName: value } map
function parseRootVars(css) {
  const match = css.match(/:root\s*\{([^}]+)\}/s);
  if (!match) return {};
  return Object.fromEntries(
    match[1]
      .trim()
      .split("\n")
      .map((line) => line.trim().replace(/;$/, "").split(/:\s+/))
      .filter((parts) => parts.length === 2)
  );
}

// ─── Null / empty inputs ────────────────────────────────────────────────────

test("null theme → empty string", () => {
  expect(themeToCSS(null)).toBe("");
});

test("undefined theme → empty string", () => {
  expect(themeToCSS(undefined)).toBe("");
});

test("empty object → empty string", () => {
  expect(themeToCSS({})).toBe("");
});

// ─── Google Fonts @import ───────────────────────────────────────────────────

test("google_fonts_url produces @import rule", () => {
  const css = themeToCSS(FULL_THEME);
  expect(css).toContain('@import url("https://fonts.googleapis.com/css2?family=Cinzel")');
});

test("no google_fonts_url → no @import", () => {
  const theme = { ...FULL_THEME, typography: { ...FULL_THEME.typography, google_fonts_url: undefined } };
  expect(themeToCSS(theme)).not.toContain("@import");
});

// ─── 12 semantic color slots → primary vars ─────────────────────────────────

test.each([
  ["bg_base",      "--color-bg-base",      "#000000"],
  ["bg_raised",    "--color-bg-raised",    "#0a0a0a"],
  ["bg_inset",     "--color-bg-inset",     "#141414"],
  ["text_muted",   "--color-text-muted",   "#5a5a5a"],
  ["text_body",    "--color-text-body",    "#8c8273"],
  ["text_heading", "--color-text-heading", "#e5e0d8"],
  ["accent",       "--color-accent",       "#b4aa96"],
  ["interactive",  "--color-interactive",  "#291d0466"],
  ["neutral",      "--color-neutral",      "#424852"],
  ["info",         "--color-info",         "#b8c5d6"],
  ["danger",       "--color-danger",       "#4a1a1a"],
  ["success",      "--color-success",      "#2d3a2e"],
])("colors.%s → %s = %s", (slot, cssVar, value) => {
  const vars = parseRootVars(themeToCSS(FULL_THEME));
  expect(vars[cssVar]).toBe(value);
});

// ─── shadcn/ui compat aliases ───────────────────────────────────────────────

test("bg_base also drives --color-background and --color-primary-foreground", () => {
  const vars = parseRootVars(themeToCSS(FULL_THEME));
  expect(vars["--color-background"]).toBe("#000000");
  expect(vars["--color-primary-foreground"]).toBe("#000000");
  expect(vars["--color-accent-foreground"]).toBe("#000000");
});

test("bg_raised also drives --color-card, --color-popover, --color-input", () => {
  const vars = parseRootVars(themeToCSS(FULL_THEME));
  expect(vars["--color-card"]).toBe("#0a0a0a");
  expect(vars["--color-popover"]).toBe("#0a0a0a");
  expect(vars["--color-input"]).toBe("#0a0a0a");
});

test("bg_inset also drives --color-muted", () => {
  const vars = parseRootVars(themeToCSS(FULL_THEME));
  expect(vars["--color-muted"]).toBe("#141414");
});

test("text_body also drives --color-muted-foreground and --color-card-foreground", () => {
  const vars = parseRootVars(themeToCSS(FULL_THEME));
  expect(vars["--color-muted-foreground"]).toBe("#8c8273");
  expect(vars["--color-card-foreground"]).toBe("#8c8273");
});

test("text_heading also drives --color-foreground and shadcn foreground aliases", () => {
  const vars = parseRootVars(themeToCSS(FULL_THEME));
  expect(vars["--color-foreground"]).toBe("#e5e0d8");
  expect(vars["--color-secondary-foreground"]).toBe("#e5e0d8");
  expect(vars["--color-destructive-foreground"]).toBe("#e5e0d8");
  expect(vars["--color-popover-foreground"]).toBe("#e5e0d8");
});

test("accent also drives --color-primary and --color-ring", () => {
  const vars = parseRootVars(themeToCSS(FULL_THEME));
  expect(vars["--color-primary"]).toBe("#b4aa96");
  expect(vars["--color-ring"]).toBe("#b4aa96");
});

test("neutral also drives --color-secondary", () => {
  const vars = parseRootVars(themeToCSS(FULL_THEME));
  expect(vars["--color-secondary"]).toBe("#424852");
});

test("danger also drives --color-destructive", () => {
  const vars = parseRootVars(themeToCSS(FULL_THEME));
  expect(vars["--color-destructive"]).toBe("#4a1a1a");
});

// ─── Typography, spacing, layout ────────────────────────────────────────────

test("typography font families are emitted", () => {
  const vars = parseRootVars(themeToCSS(FULL_THEME));
  expect(vars["--font-display"]).toBe('"Cinzel", serif');
  expect(vars["--font-mono"]).toBe('"IBM Plex Mono", monospace');
});

test("type scale values are emitted", () => {
  const vars = parseRootVars(themeToCSS(FULL_THEME));
  expect(vars["--text-6xl"]).toBe("clamp(3.5rem, 8vw, 5.5rem)");
  expect(vars["--text-base"]).toBe("1.25rem");
});

test("spacing values are emitted", () => {
  const vars = parseRootVars(themeToCSS(FULL_THEME));
  expect(vars["--spacing-4"]).toBe("clamp(1rem, 2vw, 1.25rem)");
  expect(vars["--spacing-20"]).toBe("clamp(5rem, 10vw, 8rem)");
});

test("layout values are emitted", () => {
  const vars = parseRootVars(themeToCSS(FULL_THEME));
  expect(vars["--max-width-container-wide"]).toBe("80rem");
  expect(vars["--radius-lg"]).toBe("0");
  expect(vars["--transition-timing-function-souls"]).toBe("cubic-bezier(0.25, 0.1, 0.25, 1)");
});

// ─── Partial theme ───────────────────────────────────────────────────────────

test("partial theme only emits present values", () => {
  const partial = { colors: { bg_base: "#111111" } };
  const css = themeToCSS(partial);
  const vars = parseRootVars(css);
  expect(vars["--color-bg-base"]).toBe("#111111");
  expect(vars["--color-bg-raised"]).toBeUndefined();
  expect(vars["--font-display"]).toBeUndefined();
});

test("empty string values are not emitted", () => {
  const theme = { colors: { bg_base: "", accent: "#b4aa96" } };
  const vars = parseRootVars(themeToCSS(theme));
  expect(vars["--color-bg-base"]).toBeUndefined();
  expect(vars["--color-accent"]).toBe("#b4aa96");
});

test("null values are not emitted", () => {
  const theme = { colors: { bg_base: null, accent: "#b4aa96" } };
  const vars = parseRootVars(themeToCSS(theme));
  expect(vars["--color-bg-base"]).toBeUndefined();
  expect(vars["--color-accent"]).toBe("#b4aa96");
});

// ─── CSS output structure ────────────────────────────────────────────────────

test("output wraps declarations in :root {}", () => {
  const css = themeToCSS({ colors: { bg_base: "#000" } });
  expect(css).toMatch(/^:root \{/m);
  expect(css).toMatch(/\}$/m);
});

test("@import appears before :root when both are present", () => {
  const css = themeToCSS(FULL_THEME);
  const importIdx = css.indexOf("@import");
  const rootIdx = css.indexOf(":root");
  expect(importIdx).toBeLessThan(rootIdx);
});
