import type { Meta, StoryObj } from "@storybook/react";
import ProcessSection from "../../Components/pages/home/ProcessSection";

const meta: Meta<typeof ProcessSection> = {
  title: "Pages/ProcessSection",
  component: ProcessSection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          'Five-step commission process — "The Artisan\'s Journey". Horizontal timeline on desktop, vertical on mobile. Steps animate in on scroll (immediate in Storybook).',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ProcessSection>;

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
