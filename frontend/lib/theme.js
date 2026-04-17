/**
 * themeToCSS — converts a Strapi theme object into a CSS string.
 *
 * Returns a string containing:
 *   1. An optional @import rule for Google Fonts (when typography.google_fonts_url is set)
 *   2. A :root { ... } block with all CSS custom-property overrides
 *
 * The :root block includes:
 *   - Semantic design-token vars (--color-bg-base, --font-display, etc.)
 *   - shadcn/ui compat aliases (--color-background, --color-primary, etc.)
 *   - Typography scale vars
 *   - Spacing vars
 *   - Layout vars
 *
 * Returns "" when theme is null, undefined, or has no populated fields.
 */
export function themeToCSS(theme) {
  if (!theme || typeof theme !== "object") return "";

  const vars = [];
  const { colors, typography, spacing, layout } = theme;

  // ─── Colors — semantic vars + shadcn/ui compat aliases ───────────────────
  if (colors) {
    function color(field, cssVar, ...aliases) {
      const val = colors[field];
      if (!val) return;
      vars.push(`  ${cssVar}: ${val};`);
      for (const alias of aliases) {
        vars.push(`  ${alias}: ${val};`);
      }
    }

    color("bg_base",      "--color-bg-base",      "--color-background", "--color-primary-foreground", "--color-accent-foreground");
    color("bg_raised",    "--color-bg-raised",     "--color-card", "--color-popover", "--color-input");
    color("bg_inset",     "--color-bg-inset",      "--color-muted");
    color("text_muted",   "--color-text-muted");
    color("text_body",    "--color-text-body",     "--color-muted-foreground", "--color-card-foreground");
    color("text_heading", "--color-text-heading",  "--color-foreground", "--color-secondary-foreground", "--color-destructive-foreground", "--color-popover-foreground");
    color("accent",       "--color-accent",        "--color-primary", "--color-ring");
    color("interactive",  "--color-interactive");
    color("neutral",      "--color-neutral",       "--color-secondary");
    color("info",         "--color-info");
    color("danger",       "--color-danger",        "--color-destructive");
    color("success",      "--color-success");
  }

  // ─── Typography — font families + fluid type scale ────────────────────────
  if (typography) {
    const fontFields = [
      ["font_display", "--font-display"],
      ["font_body",    "--font-body"],
      ["font_ui",      "--font-ui"],
      ["font_mono",    "--font-mono"],
      ["font_serif",   "--font-serif"],
      ["font_sans",    "--font-sans"],
    ];
    for (const [field, cssVar] of fontFields) {
      const val = typography[field];
      if (val) vars.push(`  ${cssVar}: ${val};`);
    }

    const sizeFields = [
      ["text_6xl",  "--text-6xl"],
      ["text_5xl",  "--text-5xl"],
      ["text_4xl",  "--text-4xl"],
      ["text_3xl",  "--text-3xl"],
      ["text_2xl",  "--text-2xl"],
      ["text_xl",   "--text-xl"],
      ["text_lg",   "--text-lg"],
      ["text_md",   "--text-md"],
      ["text_base", "--text-base"],
      ["text_sm",   "--text-sm"],
      ["text_xs",   "--text-xs"],
    ];
    for (const [field, cssVar] of sizeFields) {
      const val = typography[field];
      if (val) vars.push(`  ${cssVar}: ${val};`);
    }
  }

  // ─── Spacing ──────────────────────────────────────────────────────────────
  if (spacing) {
    const levels = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20];
    for (const n of levels) {
      const val = spacing[`spacing_${n}`];
      if (val) vars.push(`  --spacing-${n}: ${val};`);
    }
  }

  // ─── Layout ───────────────────────────────────────────────────────────────
  if (layout) {
    const layoutFields = [
      ["container_narrow",  "--max-width-container-narrow"],
      ["container_reading", "--max-width-container-reading"],
      ["container_wide",    "--max-width-container-wide"],
      ["radius_lg",         "--radius-lg"],
      ["radius_md",         "--radius-md"],
      ["radius_sm",         "--radius-sm"],
      ["timing_souls",      "--transition-timing-function-souls"],
      ["timing_sharp",      "--transition-timing-function-sharp"],
      ["timing_smooth",     "--transition-timing-function-smooth"],
    ];
    for (const [field, cssVar] of layoutFields) {
      const val = layout[field];
      if (val) vars.push(`  ${cssVar}: ${val};`);
    }
  }

  if (vars.length === 0) return "";

  const rootBlock = `:root {\n${vars.join("\n")}\n}`;
  const googleFontsUrl = typography?.google_fonts_url;

  return googleFontsUrl
    ? `@import url("${googleFontsUrl}");\n${rootBlock}`
    : rootBlock;
}
