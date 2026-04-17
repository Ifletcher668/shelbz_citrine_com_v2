import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

const meta: Meta = {
  title: "Foundations/Spacing",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Fluid spacing scale used by Tailwind p-*, m-*, gap-* utilities. All values use clamp() for viewport-responsive sizing.",
      },
    },
  },
};

export default meta;

const SPACING_SCALE = [
  { cssVar: "--spacing-1", label: "spacing-1", tailwind: "p-1 / m-1 / gap-1" },
  { cssVar: "--spacing-2", label: "spacing-2", tailwind: "p-2 / m-2 / gap-2" },
  { cssVar: "--spacing-3", label: "spacing-3", tailwind: "p-3 / m-3 / gap-3" },
  { cssVar: "--spacing-4", label: "spacing-4", tailwind: "p-4 / m-4 / gap-4" },
  { cssVar: "--spacing-5", label: "spacing-5", tailwind: "p-5 / m-5 / gap-5" },
  { cssVar: "--spacing-6", label: "spacing-6", tailwind: "p-6 / m-6 / gap-6" },
  { cssVar: "--spacing-8", label: "spacing-8", tailwind: "p-8 / m-8 / gap-8" },
  { cssVar: "--spacing-10", label: "spacing-10", tailwind: "p-10 / m-10 / gap-10" },
  { cssVar: "--spacing-12", label: "spacing-12", tailwind: "p-12 / m-12 / gap-12" },
  { cssVar: "--spacing-16", label: "spacing-16", tailwind: "p-16 / m-16 / gap-16" },
  { cssVar: "--spacing-20", label: "spacing-20", tailwind: "p-20 / m-20 / gap-20" },
];

export const SpacingScale: StoryObj = {
  name: "Spacing Scale",
  render: () => (
    <div
      className="p-8"
      style={{ background: "var(--color-bg-base)", minHeight: "100vh" }}
    >
      <h2
        className="text-lg font-display tracking-wider uppercase mb-8 pb-2"
        style={{
          color: "var(--color-text-heading)",
          borderBottom: "1px solid var(--color-accent)",
        }}
      >
        Fluid Spacing Scale
      </h2>
      <div className="flex flex-col gap-3">
        {SPACING_SCALE.map(({ cssVar, label, tailwind }) => (
          <div key={cssVar} className="flex items-center gap-6">
            {/* Label */}
            <div className="w-28 shrink-0">
              <code
                className="text-xs font-mono"
                style={{ color: "var(--color-text-muted)" }}
              >
                {label}
              </code>
            </div>
            {/* Visual bar */}
            <div
              style={{
                width: `var(${cssVar})`,
                height: "var(--spacing-4)",
                background: "var(--color-accent)",
                minWidth: 4,
              }}
            />
            {/* Tailwind utility */}
            <code
              className="text-xs font-mono"
              style={{ color: "var(--color-text-muted)" }}
            >
              {tailwind}
            </code>
          </div>
        ))}
      </div>

      <h2
        className="text-lg font-display tracking-wider uppercase mt-16 mb-8 pb-2"
        style={{
          color: "var(--color-text-heading)",
          borderBottom: "1px solid var(--color-accent)",
        }}
      >
        Applied Spacing
      </h2>
      <div className="flex flex-wrap gap-4">
        {SPACING_SCALE.slice(0, 6).map(({ cssVar, label }) => (
          <div
            key={cssVar}
            style={{
              padding: `var(${cssVar})`,
              background: "var(--color-bg-raised)",
              border: "1px solid var(--color-accent)",
            }}
          >
            <div
              className="text-xs font-mono"
              style={{ color: "var(--color-text-body)" }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};
