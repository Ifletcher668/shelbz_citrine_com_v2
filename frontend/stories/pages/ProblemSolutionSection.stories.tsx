import type { Meta, StoryObj } from "@storybook/react";
import ProblemSolutionSection from "../../Components/pages/home/ProblemSolutionSection";

const meta: Meta<typeof ProblemSolutionSection> = {
  title: "Pages/ProblemSolutionSection",
  component: ProblemSolutionSection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          'Two-column comparison — "The Standard" vs "Our Alternative". Four paired contrast points. Heavy border styling with stone texture background.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ProblemSolutionSection>;

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
