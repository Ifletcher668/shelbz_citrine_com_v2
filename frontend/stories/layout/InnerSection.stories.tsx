import type { Meta, StoryObj } from "@storybook/react";
import InnerSection from "../../Components/layout/InnerSection";
import SectionHeader from "../../Components/layout/SectionHeader";

const meta: Meta<typeof InnerSection> = {
  title: "Layout/InnerSection",
  component: InnerSection,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Content grouping within a Section. Composition: `PageLayout > Section > Container > InnerSection > content`. Controls gap (tight/normal/loose), width (full/reading/narrow), and align (left/center).",
      },
    },
  },
  argTypes: {
    gap: { control: "select", options: ["tight", "normal", "loose"] },
    width: { control: "select", options: ["full", "reading", "narrow"] },
    align: { control: "select", options: ["left", "center"] },
  },
};

export default meta;
type Story = StoryObj<typeof InnerSection>;

function DemoContent() {
  return (
    <>
      <SectionHeader
        heading="The Stone"
        subtitle="Sourced from artisanal mines across South Asia."
        divider
      />
      <p style={{ color: "var(--color-text-body)" }}>
        Black spinel ranks 8 on the Mohs scale — harder than most gemstones,
        and far more durable than diamonds for daily wear.
      </p>
      <p style={{ color: "var(--color-text-body)" }}>
        The same bezel-setting method that secured Mughal court jewels now
        cradles this 2.5ct stone.
      </p>
    </>
  );
}

export const Default: Story = {
  args: { gap: "normal", width: "full", align: "left" },
  render: (args) => (
    <div style={{ background: "var(--color-bg-base)", padding: "2rem" }}>
      <InnerSection {...args}>
        <DemoContent />
      </InnerSection>
    </div>
  ),
};

export const Centered: Story = {
  args: { gap: "loose", width: "narrow", align: "center" },
  render: (args) => (
    <div style={{ background: "var(--color-bg-base)", padding: "2rem" }}>
      <InnerSection {...args}>
        <DemoContent />
      </InnerSection>
    </div>
  ),
};

export const Reading: Story = {
  name: "Reading Width",
  args: { gap: "normal", width: "reading", align: "left" },
  render: (args) => (
    <div style={{ background: "var(--color-bg-base)", padding: "2rem" }}>
      <InnerSection {...args}>
        <DemoContent />
      </InnerSection>
    </div>
  ),
};
