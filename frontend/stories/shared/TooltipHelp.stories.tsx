import type { Meta, StoryObj } from "@storybook/react";
import TooltipHelp from "../../Components/shared/TooltipHelp";

const meta: Meta<typeof TooltipHelp> = {
  title: "Shared/TooltipHelp",
  component: TooltipHelp,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Inline help tooltip — wraps text with a subtle help icon that shows additional information on hover. Scales automatically with font size.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof TooltipHelp>;

export const Default: Story = {
  args: {
    children: "And far more durable than diamonds for daily wear.",
    tooltip:
      "Black spinel ranks 8 on the Mohs hardness scale. Its crystal structure makes it more resistant to breaking and chipping than diamonds in daily wear.",
  },
  render: (args) => (
    <p
      className="text-lg max-w-md"
      style={{ color: "var(--color-text-body)" }}
    >
      Many gems are forged with the same techniques and passion. But our crown
      jewel? Black Spinel: Harder than most gemstones.{" "}
      <TooltipHelp {...args} />
    </p>
  ),
};

export const ShortTooltip: Story = {
  args: {
    children: "kundan setting",
    tooltip: "An ancient Indian goldsmithing technique using pure gold foil.",
  },
  render: (args) => (
    <p className="text-base" style={{ color: "var(--color-text-body)" }}>
      This ring was crafted using <TooltipHelp {...args} /> — a method
      perfected over seven generations.
    </p>
  ),
};

export const InHeading: Story = {
  render: () => (
    <h2
      className="text-3xl font-display"
      style={{ color: "var(--color-text-heading)" }}
    >
      <TooltipHelp tooltip="The Mohs scale measures mineral scratch resistance from 1 (talc) to 10 (diamond).">
        Mohs Hardness 7.5–8
      </TooltipHelp>
    </h2>
  ),
};
