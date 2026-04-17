import type { Meta, StoryObj } from "@storybook/react";
import FAQSection from "../../Components/pages/home/FAQSection";

const meta: Meta<typeof FAQSection> = {
  title: "Pages/FAQSection",
  component: FAQSection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          'FAQ accordion with 10 questions covering pricing, timeline, process, and stone sourcing. Heavy metallic border styling with animated entry on scroll.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof FAQSection>;

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
