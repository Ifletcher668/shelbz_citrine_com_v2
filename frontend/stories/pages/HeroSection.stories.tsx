import type { Meta, StoryObj } from "@storybook/react";
import HeroSection from "../../Components/pages/home/HeroSection";

const meta: Meta<typeof HeroSection> = {
  title: "Pages/HeroSection",
  component: HeroSection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          'Above-the-fold hero — "Grimoire Opening". Animated heading, subheadline with inline TooltipHelp, dual CTAs, divider, quote, and hero image placeholder.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof HeroSection>;

export const Default: Story = {};

export const WithThemeOverride: Story = {
  name: "With Theme Override",
  decorators: [
    (Story) => (
      <div
        style={
          {
            "--color-bg-base": "#0d0a14",
            "--color-accent": "#9b6dff",
            "--color-text-heading": "#e8e0f0",
          } as React.CSSProperties
        }
      >
        <Story />
      </div>
    ),
  ],
};
