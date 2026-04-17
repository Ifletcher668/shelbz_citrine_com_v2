import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

const meta: Meta = {
  title: "Foundations/Typography",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Font families, fluid type scale, and line-height tokens. All sizes use clamp() for viewport-responsive scaling.",
      },
    },
  },
};

export default meta;

const TYPE_SCALE = [
  { cssVar: "--text-6xl", label: "text-6xl", sample: "Heirloom Forged in Fire" },
  { cssVar: "--text-5xl", label: "text-5xl", sample: "Heirloom Forged in Fire" },
  { cssVar: "--text-4xl", label: "text-4xl", sample: "Heirloom Forged in Fire" },
  { cssVar: "--text-3xl", label: "text-3xl", sample: "Heirloom Forged in Fire" },
  { cssVar: "--text-2xl", label: "text-2xl", sample: "Multigenerational Artisans" },
  { cssVar: "--text-xl", label: "text-xl", sample: "Multigenerational Artisans" },
  { cssVar: "--text-lg", label: "text-lg", sample: "Black spinel cleaves along octahedral planes" },
  { cssVar: "--text-md", label: "text-md", sample: "Black spinel cleaves along octahedral planes" },
  { cssVar: "--text-base", label: "text-base", sample: "For seven generations, artisans have been passing down the knowledge of jewelcrafting." },
  { cssVar: "--text-sm", label: "text-sm", sample: "For seven generations, artisans have been passing down the knowledge of jewelcrafting." },
  { cssVar: "--text-xs", label: "text-xs", sample: "Ring. Bezel-set spinel, 18kt gold. Forged in the old way." },
];

const FONT_FAMILIES = [
  { cssVar: "--font-display", label: "display", name: "Cinzel", usage: "Headings, logo, decorative titles" },
  { cssVar: "--font-body", label: "body", name: "Crimson Text", usage: "Body copy, prose, long-form reading" },
  { cssVar: "--font-ui", label: "ui", name: "Cinzel", usage: "Navigation, labels, small caps UI" },
  { cssVar: "--font-mono", label: "mono", name: "IBM Plex Mono", usage: "Code, metadata, technical details" },
];

export const TypeScale: StoryObj = {
  name: "Type Scale",
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
        Fluid Type Scale
      </h2>
      <div className="flex flex-col gap-6">
        {TYPE_SCALE.map(({ cssVar, label, sample }) => (
          <div
            key={cssVar}
            className="flex items-baseline gap-6 pb-4"
            style={{ borderBottom: "1px solid var(--color-bg-inset)" }}
          >
            <div className="w-24 shrink-0">
              <code
                className="text-xs font-mono"
                style={{ color: "var(--color-text-muted)" }}
              >
                {label}
              </code>
            </div>
            <div
              className="font-display"
              style={{
                fontSize: `var(${cssVar})`,
                color: "var(--color-text-heading)",
                lineHeight: 1.2,
              }}
            >
              {sample}
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const FontFamilies: StoryObj = {
  name: "Font Families",
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
        Font Families
      </h2>
      <div className="flex flex-col gap-12">
        {FONT_FAMILIES.map(({ cssVar, label, name, usage }) => (
          <div key={cssVar}>
            <div className="flex items-center gap-4 mb-3">
              <code
                className="text-xs font-mono px-2 py-0.5"
                style={{
                  color: "var(--color-text-muted)",
                  background: "var(--color-bg-inset)",
                }}
              >
                --font-{label}
              </code>
              <span
                className="text-sm"
                style={{ color: "var(--color-text-muted)" }}
              >
                {name} — {usage}
              </span>
            </div>
            <div
              className="text-4xl"
              style={{
                fontFamily: `var(${cssVar})`,
                color: "var(--color-text-heading)",
              }}
            >
              The quick brown fox jumps over the lazy dog
            </div>
            <div
              className="text-lg mt-2"
              style={{
                fontFamily: `var(${cssVar})`,
                color: "var(--color-text-body)",
              }}
            >
              ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const Headings: StoryObj = {
  name: "Heading Hierarchy",
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
        Heading Hierarchy
      </h2>
      <div className="flex flex-col gap-6">
        {(["h1", "h2", "h3", "h4", "h5", "h6"] as const).map((Tag) => (
          <div
            key={Tag}
            className="flex items-baseline gap-4 pb-4"
            style={{ borderBottom: "1px solid var(--color-bg-inset)" }}
          >
            <code
              className="text-xs font-mono w-8 shrink-0"
              style={{ color: "var(--color-text-muted)" }}
            >
              {Tag}
            </code>
            <Tag
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--color-text-heading)",
              }}
            >
              For Seven Generations
            </Tag>
          </div>
        ))}
      </div>
    </div>
  ),
};
