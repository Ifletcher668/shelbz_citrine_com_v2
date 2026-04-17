import type { Meta, StoryObj } from "@storybook/react";
import GallerySection from "../../Components/pages/home/GallerySection";

const meta: Meta<typeof GallerySection> = {
  title: "Pages/GallerySection",
  component: GallerySection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          'Gallery grid of six commission examples with lightbox modal. "Crafted Examples" section — dark grid with hover effects and lightbox. Click a card to open the modal.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof GallerySection>;

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
