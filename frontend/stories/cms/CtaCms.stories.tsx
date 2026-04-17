import type { Meta, StoryObj } from "@storybook/react";
import CtaCms from "../../Components/cms/sections/CtaCms";

const meta: Meta<typeof CtaCms> = {
  title: "CMS/CtaCms",
  component: CtaCms,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "CMS `sections.cta` block — dark section with rune texture, sparkles icon, headline, body text, and optional button link.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof CtaCms>;

export const Full: Story = {
  name: "Full (Headline + Body + Button)",
  args: {
    data: {
      __component: "sections.cta",
      id: 1,
      headline: "Ready to Commission Something Built to Last?",
      body: "No obligation. No sales pitch. Just a conversation about what you want, what's possible, and whether working with seventh-generational artisans makes sense for your vision.",
      button_text: "Book a Free Consultation",
      button_link: "/consultation",
    },
  },
};

export const NoButton: Story = {
  name: "Headline + Body (No Button)",
  args: {
    data: {
      __component: "sections.cta",
      id: 2,
      headline: "Forged in the old way.",
      body: "The stone remembers darkness.",
      button_text: null,
      button_link: null,
    },
  },
};

export const WithThemeOverride: Story = {
  name: "With Theme Override",
  args: {
    data: {
      __component: "sections.cta",
      id: 3,
      headline: "Commission a Piece",
      body: "In-person in Olympia, WA • Zoom nationwide",
      button_text: "Get Started",
      button_link: "/consultation",
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
