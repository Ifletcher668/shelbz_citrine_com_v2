import type { Meta, StoryObj } from "@storybook/react";
import CTASection from "../../Components/pages/home/CTASection";

const meta: Meta<typeof CTASection> = {
  title: "Pages/CTASection",
  component: CTASection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          'Final CTA — "The Invitation". Dark section with rune texture background, Sparkles icon, headline, supporting text, and trust-signal grid. No desperation.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof CTASection>;

export const Default: Story = {};

export const WithThemeOverride: Story = {
  name: "With Theme Override",
  decorators: [
    (Story) => (
      <div
        style={
          {
            "--color-accent": "#d4a020",
            "--color-bg-base": "#1a0f05",
            "--color-text-heading": "#f0e8d0",
          } as React.CSSProperties
        }
      >
        <Story />
      </div>
    ),
  ],
};
