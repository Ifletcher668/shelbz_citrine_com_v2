import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

const meta: Meta = {
  title: "Foundations/Tokens",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Layout tokens: container widths, border radii (brutalist — all zero), and animation timing functions.",
      },
    },
  },
};

export default meta;

export const ContainerWidths: StoryObj = {
  name: "Container Widths",
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
        Container Widths
      </h2>
      <div className="flex flex-col gap-6">
        {[
          { cssVar: "--max-width-container-narrow", label: "narrow", desc: "41.625rem — Tight, focused content" },
          { cssVar: "--max-width-container-reading", label: "reading", desc: "62rem — Mid-width reading layout" },
          { cssVar: "--max-width-container-wide", label: "wide", desc: "80rem — Spacious layout" },
          { cssVar: "--max-width-container-full", label: "full", desc: "100vw — Full width override" },
        ].map(({ cssVar, label, desc }) => (
          <div key={cssVar}>
            <div className="flex items-center gap-4 mb-2">
              <code
                className="text-xs font-mono"
                style={{ color: "var(--color-text-muted)" }}
              >
                {label}
              </code>
              <span
                className="text-sm"
                style={{ color: "var(--color-text-body)" }}
              >
                {desc}
              </span>
            </div>
            <div
              style={{
                maxWidth: `var(${cssVar})`,
                height: "var(--spacing-4)",
                background: "var(--color-accent)",
                opacity: 0.4,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  ),
};

export const AnimationTimings: StoryObj = {
  name: "Animation Timings",
  render: () => {
    const [tick, setTick] = React.useState(0);

    return (
      <div
        className="p-8"
        style={{ background: "var(--color-bg-base)", minHeight: "100vh" }}
      >
        <h2
          className="text-lg font-display tracking-wider uppercase mb-4 pb-2"
          style={{
            color: "var(--color-text-heading)",
            borderBottom: "1px solid var(--color-accent)",
          }}
        >
          Animation Timing Functions
        </h2>
        <button
          className="mb-8 px-4 py-2 text-sm font-mono uppercase tracking-wider"
          style={{
            background: "var(--color-bg-inset)",
            color: "var(--color-text-heading)",
            border: "1px solid var(--color-accent)",
          }}
          onClick={() => setTick((t) => t + 1)}
        >
          Replay animations
        </button>
        <div className="flex flex-col gap-8">
          {[
            { cssVar: "--transition-timing-function-souls", label: "souls", desc: "Deliberate, weighty — cubic-bezier(0.25, 0.1, 0.25, 1)" },
            { cssVar: "--transition-timing-function-sharp", label: "sharp", desc: "Snappy — cubic-bezier(0.4, 0, 0.6, 1)" },
            { cssVar: "--transition-timing-function-smooth", label: "smooth", desc: "Ease-in-out — cubic-bezier(0.4, 0, 0.2, 1)" },
          ].map(({ cssVar, label, desc }) => (
            <div key={`${cssVar}-${tick}`}>
              <div className="flex items-center gap-4 mb-2">
                <code
                  className="text-xs font-mono"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  timing-{label}
                </code>
                <span
                  className="text-xs"
                  style={{ color: "var(--color-text-body)" }}
                >
                  {desc}
                </span>
              </div>
              <div
                className="h-3"
                style={{
                  width: "var(--spacing-6)",
                  background: "var(--color-accent)",
                  animation: `slide-right 1.2s var(${cssVar}) forwards`,
                }}
              />
            </div>
          ))}
        </div>
        <style>{`
          @keyframes slide-right {
            from { transform: translateX(0); opacity: 0.3; }
            to { transform: translateX(300px); opacity: 1; }
          }
        `}</style>
      </div>
    );
  },
};

export const BorderRadius: StoryObj = {
  name: "Border Radius",
  render: () => (
    <div
      className="p-8"
      style={{ background: "var(--color-bg-base)", minHeight: "100vh" }}
    >
      <h2
        className="text-lg font-display tracking-wider uppercase mb-4 pb-2"
        style={{
          color: "var(--color-text-heading)",
          borderBottom: "1px solid var(--color-accent)",
        }}
      >
        Border Radius — Brutalist (all zero)
      </h2>
      <p
        className="text-sm mb-8"
        style={{ color: "var(--color-text-body)" }}
      >
        This design system uses zero border radius throughout — pure brutalism, no softening curves.
      </p>
      <div className="flex gap-8">
        {[
          { cssVar: "--radius-lg", label: "radius-lg" },
          { cssVar: "--radius-md", label: "radius-md" },
          { cssVar: "--radius-sm", label: "radius-sm" },
        ].map(({ cssVar, label }) => (
          <div key={cssVar} className="flex flex-col items-center gap-2">
            <div
              style={{
                width: 80,
                height: 80,
                background: "var(--color-bg-raised)",
                border: "1px solid var(--color-accent)",
                borderRadius: `var(${cssVar})`,
              }}
            />
            <code
              className="text-xs font-mono"
              style={{ color: "var(--color-text-muted)" }}
            >
              {label}
            </code>
          </div>
        ))}
      </div>
    </div>
  ),
};
