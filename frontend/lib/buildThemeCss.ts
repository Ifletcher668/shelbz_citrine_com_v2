import type { GetActiveThemeReturn } from "./strapi-cms/strapiApi";

type ActiveTheme = NonNullable<GetActiveThemeReturn>;

export function buildThemeCss(theme: ActiveTheme): string {
  const vars: string[] = [];
  const { colors, typography, spacing, layout } = theme;

  if (colors) {
    const entries: [keyof typeof colors, string][] = [
      ["bg_base", "--color-bg-base"],
      ["bg_raised", "--color-bg-raised"],
      ["bg_inset", "--color-bg-inset"],
      ["text_muted", "--color-text-muted"],
      ["text_body", "--color-text-body"],
      ["text_heading", "--color-text-heading"],
      ["accent", "--color-accent"],
      ["interactive", "--color-interactive"],
      ["neutral", "--color-neutral"],
      ["info", "--color-info"],
      ["danger", "--color-danger"],
      ["success", "--color-success"],
    ];
    for (const [field, cssVar] of entries) {
      const val = colors[field];
      if (val) vars.push(`  ${cssVar}: ${val};`);
    }
  }

  if (typography) {
    const fontEntries: [keyof typeof typography, string][] = [
      ["font_display", "--font-display"],
      ["font_body", "--font-body"],
      ["font_ui", "--font-ui"],
      ["font_mono", "--font-mono"],
    ];
    for (const [field, cssVar] of fontEntries) {
      const val = typography[field];
      if (val) vars.push(`  ${cssVar}: ${val};`);
    }

    const sizeEntries: [keyof typeof typography, string][] = [
      ["text_6xl", "--text-6xl"],
      ["text_5xl", "--text-5xl"],
      ["text_4xl", "--text-4xl"],
      ["text_3xl", "--text-3xl"],
      ["text_2xl", "--text-2xl"],
      ["text_xl", "--text-xl"],
      ["text_lg", "--text-lg"],
      ["text_md", "--text-md"],
      ["text_base", "--text-base"],
      ["text_sm", "--text-sm"],
      ["text_xs", "--text-xs"],
    ];
    for (const [field, cssVar] of sizeEntries) {
      const val = typography[field];
      if (val) vars.push(`  ${cssVar}: ${val};`);
    }
  }

  if (spacing) {
    const spacingEntries: [keyof typeof spacing, string][] = [
      ["spacing_1", "--spacing-1"],
      ["spacing_2", "--spacing-2"],
      ["spacing_3", "--spacing-3"],
      ["spacing_4", "--spacing-4"],
      ["spacing_5", "--spacing-5"],
      ["spacing_6", "--spacing-6"],
      ["spacing_8", "--spacing-8"],
      ["spacing_10", "--spacing-10"],
      ["spacing_12", "--spacing-12"],
      ["spacing_16", "--spacing-16"],
      ["spacing_20", "--spacing-20"],
    ];
    for (const [field, cssVar] of spacingEntries) {
      const val = spacing[field];
      if (val) vars.push(`  ${cssVar}: ${val};`);
    }
  }

  if (layout) {
    const layoutEntries: [keyof typeof layout, string][] = [
      ["container_narrow", "--max-width-container-narrow"],
      ["container_reading", "--max-width-container-reading"],
      ["container_wide", "--max-width-container-wide"],
      ["radius_lg", "--radius-lg"],
      ["radius_md", "--radius-md"],
      ["radius_sm", "--radius-sm"],
      ["timing_souls", "--transition-timing-function-souls"],
      ["timing_sharp", "--transition-timing-function-sharp"],
      ["timing_smooth", "--transition-timing-function-smooth"],
    ];
    for (const [field, cssVar] of layoutEntries) {
      const val = layout[field];
      if (val) vars.push(`  ${cssVar}: ${val};`);
    }
  }

  return vars.length ? `:root {\n${vars.join("\n")}\n}` : "";
}

export function getGoogleFontsUrl(theme: ActiveTheme): string | null {
  return theme.typography?.google_fonts_url ?? null;
}
