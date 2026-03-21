"use strict";

/**
 * Seed script — creates the "heritage" theme with all default design token values.
 *
 * These values mirror the hardcoded @theme block in frontend/styles/globals.css.
 * Running this script establishes heritage as the active theme in Strapi,
 * enabling the CMS-driven theme system.
 *
 * Usage (from /backend directory):
 *   yarn seed:theme
 */
async function seed() {
  const strapi = await require("@strapi/strapi").createStrapi().load();

  const existing = await strapi.entityService.findMany("api::theme.theme", {
    filters: { name: "heritage" },
  });

  if (existing.length > 0) {
    console.log("[seed-heritage-theme] Heritage theme already exists, skipping.");
    await strapi.destroy();
    return;
  }

  await strapi.entityService.create("api::theme.theme", {
    data: {
      name: "heritage",
      is_active: true,

      // 12 color slots — named by role in the app, not by visual appearance.
      // Each slot drives multiple CSS variables (see frontend/lib/theme.js).
      colors: {
        bg_base:      "#000000",   // Page / root background
        bg_raised:    "#0a0a0a",   // Cards, elevated surfaces
        bg_inset:     "#141414",   // Form inputs, code blocks
        text_muted:   "#5a5a5a",   // Disabled, subdued text
        text_body:    "#8c8273",   // Default body text
        text_heading: "#e5e0d8",   // Headings, bright text
        accent:       "#b4aa96",   // Links, borders, highlights
        interactive:  "#291d0466", // Button face / fill (includes alpha)
        neutral:      "#424852",   // Secondary UI elements
        info:         "#b8c5d6",   // Info callouts, cool highlights
        danger:       "#4a1a1a",   // Destructive actions, warnings
        success:      "#2d3a2e",   // Success states
      },

      typography: {
        google_fonts_url:
          "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400&family=IBM+Plex+Mono:wght@300;400;500&display=swap",
        font_display: '"Cinzel", serif',
        font_body:    '"Crimson Text", Georgia, serif',
        font_ui:      '"Cinzel", serif',
        font_mono:    '"IBM Plex Mono", "Courier New", monospace',
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
    },
  });

  console.log("[seed-heritage-theme] Heritage theme created and activated.");
  await strapi.destroy();
}

seed().catch((err) => {
  console.error("[seed-heritage-theme] Error:", err);
  process.exit(1);
});
