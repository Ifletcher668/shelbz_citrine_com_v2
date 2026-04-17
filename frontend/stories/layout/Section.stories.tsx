import type { Meta, StoryObj } from "@storybook/react";
import { Section, Container } from "../../Components/layout/Section";

const meta: Meta<typeof Section> = {
  title: "Layout/Section",
  component: Section,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Top-level vertical-spacing container with optional background, texture overlay, vignette, and corner decorations. The composition pattern is `Section > Container > content`.",
      },
    },
  },
  argTypes: {
    background: {
      control: "select",
      options: ["void", "stone-dark", "stone-deeper", "transparent"],
    },
    overlay: {
      control: "select",
      options: ["none", "vignette", "fog"],
    },
    corners: {
      control: "select",
      options: [false, "accent", "flourish"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Section>;

const SampleContent = () => (
  <Container>
    <div className="py-12 flex flex-col gap-4">
      <h2
        className="text-3xl font-display tracking-wider"
        style={{ color: "var(--color-text-heading)" }}
      >
        For Seven Generations
      </h2>
      <p style={{ color: "var(--color-text-body)" }}>
        Artisans passing down the knowledge of jewelcrafting — harder than most
        gemstones and far more durable than diamonds for daily wear.
      </p>
    </div>
  </Container>
);

export const Default: Story = {
  args: { background: "void", overlay: "none", corners: false },
  render: (args) => (
    <Section {...args}>
      <SampleContent />
    </Section>
  ),
};

export const AllBackgrounds: Story = {
  name: "All Backgrounds",
  render: () => (
    <div>
      {(["void", "stone-dark", "stone-deeper"] as const).map((bg) => (
        <Section key={bg} background={bg}>
          <Container>
            <div className="py-8">
              <p
                className="text-xs font-mono mb-2"
                style={{ color: "var(--color-text-muted)" }}
              >
                background=&quot;{bg}&quot;
              </p>
              <p style={{ color: "var(--color-text-heading)" }}>
                Forged in the old way. The stone remembers darkness.
              </p>
            </div>
          </Container>
        </Section>
      ))}
    </div>
  ),
};

export const WithTexture: Story = {
  name: "With Texture",
  render: () => (
    <Section
      background="stone-dark"
      texture={{ variant: "stone", opacity: 0.05 }}
      overlay="vignette"
    >
      <SampleContent />
    </Section>
  ),
};

export const WithCornerFlourish: Story = {
  name: "With Corner Flourish",
  render: () => (
    <Section background="stone-dark" corners="flourish" overlay="fog">
      <SampleContent />
    </Section>
  ),
};

export const WithCornerAccents: Story = {
  name: "With Corner Accents",
  render: () => (
    <Section
      background="stone-deeper"
      corners="accent"
      cornerColor="pale-gold"
      cornerSize={24}
    >
      <SampleContent />
    </Section>
  ),
};

export const RuneTexture: Story = {
  name: "Rune Texture (Header Style)",
  render: () => (
    <Section
      background="stone-dark"
      texture={{ variant: "rune", opacity: 0.0032 }}
    >
      <SampleContent />
    </Section>
  ),
};
