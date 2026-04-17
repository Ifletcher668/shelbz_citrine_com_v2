export interface StorybookTheme {
  id: string;
  name: string;
  /** Raw CSS string injected into document.head as a <style> tag. */
  css: string;
}

/**
 * Default theme — empty override, so the @theme fallbacks in globals.css apply.
 * Represents the "Void" (default dark) aesthetic.
 */
const DEFAULT_CSS = ``;

/**
 * Citrine Light — warm parchment variant for contrast testing.
 * Useful for verifying component legibility outside the default dark theme.
 */
const CITRINE_LIGHT_CSS = `
:root {
  --color-bg-base: #f5f0e8;
  --color-bg-raised: #ede6d6;
  --color-bg-inset: #e0d8c8;
  --color-text-muted: #8a7a6a;
  --color-text-body: #4a3e30;
  --color-text-heading: #1a1208;
  --color-accent: #7a5c2a;
  --color-interactive: rgba(122, 92, 42, 0.15);
  --color-neutral: #9a8a7a;
  --color-info: #2a4a6a;
  --color-danger: #6a1a1a;
  --color-success: #1a3a1e;

  --color-void: #f5f0e8;
  --color-stone-dark: #ede6d6;
  --color-stone-deeper: #e0d8c8;
  --color-fog: #8a7a6a;
  --color-stone-grey: #4a3e30;
  --color-silver-white: #1a1208;
  --color-pale-gold: #7a5c2a;
  --color-aged-gold: #5a3c10;

  --color-background: #f5f0e8;
  --color-foreground: #1a1208;
  --color-primary: #7a5c2a;
  --color-primary-foreground: #f5f0e8;
  --color-secondary: #9a8a7a;
  --color-secondary-foreground: #1a1208;
  --color-muted: #e0d8c8;
  --color-muted-foreground: #4a3e30;
  --color-card: #ede6d6;
  --color-card-foreground: #4a3e30;
  --color-accent-foreground: #f5f0e8;
  --color-popover: #ede6d6;
  --color-popover-foreground: #1a1208;
  --color-destructive: #6a1a1a;
  --color-destructive-foreground: #f5f0e8;
  --color-ring: #7a5c2a;
  --color-input: #ede6d6;
}
`;

/**
 * Deep Forge — richer, purple-dark variant.
 * More saturated dark tones; good for testing hover/focus states on dark surfaces.
 */
const DEEP_FORGE_CSS = `
:root {
  --color-bg-base: #060408;
  --color-bg-raised: #100c14;
  --color-bg-inset: #1a1520;
  --color-text-muted: #6a5a7a;
  --color-text-body: #9a8aaa;
  --color-text-heading: #e0d8f0;
  --color-accent: #c0a0e0;
  --color-interactive: rgba(80, 40, 120, 0.4);
  --color-neutral: #4a4060;
  --color-info: #a0b0d8;
  --color-danger: #501020;
  --color-success: #203028;

  --color-void: #060408;
  --color-stone-dark: #100c14;
  --color-stone-deeper: #1a1520;
  --color-fog: #6a5a7a;
  --color-stone-grey: #9a8aaa;
  --color-silver-white: #e0d8f0;
  --color-pale-gold: #c0a0e0;
  --color-aged-gold: #8060a0;

  --color-background: #060408;
  --color-foreground: #e0d8f0;
  --color-primary: #c0a0e0;
  --color-primary-foreground: #060408;
  --color-secondary: #4a4060;
  --color-secondary-foreground: #e0d8f0;
  --color-muted: #1a1520;
  --color-muted-foreground: #9a8aaa;
  --color-card: #100c14;
  --color-card-foreground: #9a8aaa;
  --color-accent-foreground: #060408;
  --color-popover: #100c14;
  --color-popover-foreground: #e0d8f0;
  --color-destructive: #501020;
  --color-destructive-foreground: #e0d8f0;
  --color-ring: #c0a0e0;
  --color-input: #100c14;
}
`;

export const THEMES: StorybookTheme[] = [
  { id: "default", name: "Default (Void)", css: DEFAULT_CSS },
  { id: "citrine-light", name: "Citrine Light", css: CITRINE_LIGHT_CSS },
  { id: "deep-forge", name: "Deep Forge", css: DEEP_FORGE_CSS },
];
