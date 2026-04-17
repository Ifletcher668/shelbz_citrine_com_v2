import type { Meta, StoryObj } from "@storybook/react";
import TextBlockCms from "../../Components/cms/sections/TextBlockCms";

const meta: Meta<typeof TextBlockCms> = {
  title: "CMS/TextBlockCms",
  component: TextBlockCms,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "CMS `sections.text-block` — WYSIWYG body with full section wrapper. Supports background, overlay, texture, corners, animation, and container size options.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof TextBlockCms>;

const BODY = `
# Multigenerational Craft

For seven generations, artisans in India and Thailand have been passing down the knowledge of jewelcrafting. Black spinel ranks **8 on the Mohs scale** — harder than most gemstones, and far more durable than diamonds for daily wear.

> *"Not self-expression but surrender to the logic of materials."*
> — Ananda Coomaraswamy

The same bezel-setting method that secured Mughal court jewels now cradles this 2.5ct stone. Each inclusion tells a story of geological pressure — millions of years compressed into a single facet.
`;

export const Default: Story = {
  name: "Default (Void Background)",
  args: {
    data: {
      __component: "sections.text-block",
      id: 1,
      body: BODY,
      background: "void",
      overlay: "none",
      texture: null,
      container_size: "reading",
      animation: "fade-up",
      enable_prose: true,
    },
  },
};

export const WithTexture: Story = {
  name: "With Stone Texture",
  args: {
    data: {
      __component: "sections.text-block",
      id: 2,
      body: BODY,
      background: "stone-dark",
      overlay: "none",
      texture: "stone",
      texture_opacity: 5,
      container_size: "reading",
      animation: "fade-up",
      enable_prose: true,
    },
  },
};

export const WithThemeOverride: Story = {
  name: "With Theme Override",
  args: {
    data: {
      __component: "sections.text-block",
      id: 3,
      body: BODY,
      background: "void",
      overlay: "none",
      container_size: "reading",
      animation: "none",
      enable_prose: true,
    },
  },
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
