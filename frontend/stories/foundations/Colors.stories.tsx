import type { Meta, StoryObj } from "@storybook/react";
import React, { useEffect, useState } from "react";

const meta: Meta = {
  title: "Foundations/Colors",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "All semantic color slots and aesthetic aliases. Switch themes in the toolbar to see every swatch update live — this confirms the ThemeDecorator is working correctly.",
      },
    },
  },
};

export default meta;

// ─── Token definitions ────────────────────────────────────────────────────────

const SEMANTIC_SLOTS = [
  { cssVar: "--color-bg-base", label: "bg-base", description: "Page / root background" },
  { cssVar: "--color-bg-raised", label: "bg-raised", description: "Cards, elevated surfaces" },
  { cssVar: "--color-bg-inset", label: "bg-inset", description: "Form inputs, code blocks" },
  { cssVar: "--color-text-muted", label: "text-muted", description: "Disabled, subdued text" },
  { cssVar: "--color-text-body", label: "text-body", description: "Default body text" },
  { cssVar: "--color-text-heading", label: "text-heading", description: "Headings, bright text" },
  { cssVar: "--color-accent", label: "accent", description: "Links, borders, highlights" },
  { cssVar: "--color-interactive", label: "interactive", description: "Button face / fill" },
  { cssVar: "--color-neutral", label: "neutral", description: "Secondary UI elements" },
  { cssVar: "--color-info", label: "info", description: "Info callouts" },
  { cssVar: "--color-danger", label: "danger", description: "Destructive actions" },
  { cssVar: "--color-success", label: "success", description: "Success states" },
];

const AESTHETIC_ALIASES = [
  { cssVar: "--color-void", label: "void" },
  { cssVar: "--color-stone-dark", label: "stone-dark" },
  { cssVar: "--color-stone-deeper", label: "stone-deeper" },
  { cssVar: "--color-fog", label: "fog" },
  { cssVar: "--color-stone-grey", label: "stone-grey" },
  { cssVar: "--color-silver-white", label: "silver-white" },
  { cssVar: "--color-pale-gold", label: "pale-gold" },
  { cssVar: "--color-aged-gold", label: "aged-gold" },
];

const SHADCN_ALIASES = [
  { cssVar: "--color-background", label: "background" },
  { cssVar: "--color-foreground", label: "foreground" },
  { cssVar: "--color-primary", label: "primary" },
  { cssVar: "--color-primary-foreground", label: "primary-foreground" },
  { cssVar: "--color-secondary", label: "secondary" },
  { cssVar: "--color-secondary-foreground", label: "secondary-foreground" },
  { cssVar: "--color-muted", label: "muted" },
  { cssVar: "--color-muted-foreground", label: "muted-foreground" },
  { cssVar: "--color-card", label: "card" },
  { cssVar: "--color-card-foreground", label: "card-foreground" },
  { cssVar: "--color-accent-foreground", label: "accent-foreground" },
  { cssVar: "--color-popover", label: "popover" },
  { cssVar: "--color-popover-foreground", label: "popover-foreground" },
  { cssVar: "--color-destructive", label: "destructive" },
  { cssVar: "--color-destructive-foreground", label: "destructive-foreground" },
  { cssVar: "--color-ring", label: "ring" },
  { cssVar: "--color-input", label: "input" },
];

// ─── Swatch component ─────────────────────────────────────────────────────────

function ColorSwatch({
  cssVar,
  label,
  description,
}: {
  cssVar: string;
  label: string;
  description?: string;
}) {
  const [resolved, setResolved] = useState("");

  useEffect(() => {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(cssVar)
      .trim();
    setResolved(value);
  });

  return (
    <div className="flex flex-col gap-2 min-w-[160px]">
      <div
        className="w-full h-14 border border-fog/20"
        style={{ background: `var(${cssVar})` }}
      />
      <div className="flex flex-col gap-0.5">
        <code
          className="text-xs font-mono"
          style={{ color: "var(--color-text-heading)" }}
        >
          {label}
        </code>
        <code
          className="text-xs font-mono"
          style={{ color: "var(--color-text-muted)" }}
        >
          {resolved || cssVar}
        </code>
        {description && (
          <span
            className="text-xs"
            style={{ color: "var(--color-text-body)" }}
          >
            {description}
          </span>
        )}
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-12">
      <h2
        className="text-lg font-display tracking-wider uppercase mb-6 pb-2"
        style={{
          color: "var(--color-text-heading)",
          borderBottom: "1px solid var(--color-accent)",
        }}
      >
        {title}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {children}
      </div>
    </div>
  );
}

// ─── Stories ──────────────────────────────────────────────────────────────────

export const AllColors: StoryObj = {
  name: "All Colors",
  render: () => (
    <div
      className="p-8"
      style={{ background: "var(--color-bg-base)", minHeight: "100vh" }}
    >
      <h1
        className="text-2xl font-display tracking-widest uppercase mb-2"
        style={{ color: "var(--color-text-heading)" }}
      >
        Color System
      </h1>
      <p className="mb-10 text-sm" style={{ color: "var(--color-text-body)" }}>
        Switch themes in the toolbar to see all swatches update live.
      </p>

      <Section title="Semantic Slots (12 roles)">
        {SEMANTIC_SLOTS.map((s) => (
          <ColorSwatch key={s.cssVar} {...s} />
        ))}
      </Section>

      <Section title="Aesthetic Aliases">
        {AESTHETIC_ALIASES.map((s) => (
          <ColorSwatch key={s.cssVar} {...s} />
        ))}
      </Section>

      <Section title="shadcn/ui Semantic Aliases">
        {SHADCN_ALIASES.map((s) => (
          <ColorSwatch key={s.cssVar} {...s} />
        ))}
      </Section>
    </div>
  ),
};
