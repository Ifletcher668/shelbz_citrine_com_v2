import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

const meta: Meta = {
  title: "Foundations/Theme Overrides",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Demonstrates how page-level `theme_overrides` work. In production, the `[...slug].tsx` catch-all page reads the `theme_overrides` JSON field from Strapi and applies it as inline CSS custom properties on the page root element. Any child component — regardless of depth — automatically inherits the overridden tokens. These stories use the same mechanism: a story-level decorator sets CSS vars on a wrapper div.",
      },
    },
  },
};

export default meta;

function TokenCard({
  label,
  cssVar,
}: {
  label: string;
  cssVar: string;
}) {
  return (
    <div
      className="p-4"
      style={{
        background: "var(--color-bg-raised)",
        border: "1px solid var(--color-accent)",
      }}
    >
      <div
        className="w-full h-8 mb-2"
        style={{ background: `var(${cssVar})` }}
      />
      <code
        className="text-xs font-mono"
        style={{ color: "var(--color-text-muted)" }}
      >
        {label}
      </code>
    </div>
  );
}

/** Default — no overrides, global theme applies */
export const NoOverride: StoryObj = {
  name: "No Override",
  render: () => (
    <div
      className="p-8"
      style={{ background: "var(--color-bg-base)", minHeight: 300 }}
    >
      <h2
        className="text-xl font-display tracking-wider mb-6"
        style={{ color: "var(--color-text-heading)" }}
      >
        Default Theme
      </h2>
      <div className="grid grid-cols-3 gap-4">
        <TokenCard label="bg-base" cssVar="--color-bg-base" />
        <TokenCard label="accent" cssVar="--color-accent" />
        <TokenCard label="text-heading" cssVar="--color-text-heading" />
      </div>
    </div>
  ),
};

/**
 * Warm Gold Override — simulates a page in Strapi with
 * theme_overrides: { "--color-accent": "#d4a020", "--color-bg-base": "#1a0f05" }
 */
export const WarmGoldOverride: StoryObj = {
  name: "Warm Gold Override",
  decorators: [
    (Story) => (
      <div
        style={
          {
            "--color-bg-base": "#1a0f05",
            "--color-bg-raised": "#2a1a08",
            "--color-accent": "#d4a020",
            "--color-text-heading": "#f0e8d0",
            "--color-primary": "#d4a020",
            "--color-ring": "#d4a020",
          } as React.CSSProperties
        }
      >
        <Story />
      </div>
    ),
  ],
  render: () => (
    <div
      className="p-8"
      style={{ background: "var(--color-bg-base)", minHeight: 300 }}
    >
      <div
        className="text-xs font-mono mb-4 px-2 py-1 inline-block"
        style={{
          background: "var(--color-bg-inset)",
          color: "var(--color-text-muted)",
        }}
      >
        page.theme_overrides applied
      </div>
      <h2
        className="text-xl font-display tracking-wider mb-6"
        style={{ color: "var(--color-text-heading)" }}
      >
        Warm Gold Override
      </h2>
      <div className="grid grid-cols-3 gap-4">
        <TokenCard label="bg-base" cssVar="--color-bg-base" />
        <TokenCard label="accent" cssVar="--color-accent" />
        <TokenCard label="text-heading" cssVar="--color-text-heading" />
      </div>
    </div>
  ),
};

/**
 * Midnight Blue Override — a cooler dark variant, demonstrating that overrides
 * can shift the entire mood of a page while reusing all components unchanged.
 */
export const MidnightBlueOverride: StoryObj = {
  name: "Midnight Blue Override",
  decorators: [
    (Story) => (
      <div
        style={
          {
            "--color-bg-base": "#060812",
            "--color-bg-raised": "#0d1220",
            "--color-accent": "#6080d0",
            "--color-text-heading": "#d0d8f0",
            "--color-text-body": "#7080a0",
            "--color-primary": "#6080d0",
            "--color-ring": "#6080d0",
          } as React.CSSProperties
        }
      >
        <Story />
      </div>
    ),
  ],
  render: () => (
    <div
      className="p-8"
      style={{ background: "var(--color-bg-base)", minHeight: 300 }}
    >
      <div
        className="text-xs font-mono mb-4 px-2 py-1 inline-block"
        style={{
          background: "var(--color-bg-inset)",
          color: "var(--color-text-muted)",
        }}
      >
        page.theme_overrides applied
      </div>
      <h2
        className="text-xl font-display tracking-wider mb-6"
        style={{ color: "var(--color-text-heading)" }}
      >
        Midnight Blue Override
      </h2>
      <div className="grid grid-cols-3 gap-4">
        <TokenCard label="bg-base" cssVar="--color-bg-base" />
        <TokenCard label="accent" cssVar="--color-accent" />
        <TokenCard label="text-heading" cssVar="--color-text-heading" />
      </div>
    </div>
  ),
};
