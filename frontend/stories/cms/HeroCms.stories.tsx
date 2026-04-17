import type { Meta, StoryObj } from "@storybook/react";
import HeroCms from "../../Components/cms/sections/HeroCms";

const meta: Meta<typeof HeroCms> = {
  title: "CMS/HeroCms",
  component: HeroCms,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "CMS `sections.hero` block — headline, subheadline, optional CTA button, and SimpleDivider. Animates in on mount.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof HeroCms>;

export const Full: Story = {
  name: "Full (Headline + Subheadline + CTA)",
  args: {
    data: {
      __component: "sections.hero",
      id: 1,
      headline: "Heirloom Jewelry.\nMultigenerational Craft.",
      subheadline:
        "For seven generations, artisans in India and Thailand have been passing down the knowledge of jewelcrafting.",
      cta_text: "Book a Free Consultation",
      cta_link: "/consultation",
    },
  },
};

export const HeadlineOnly: Story = {
  name: "Headline Only",
  args: {
    data: {
      __component: "sections.hero",
      id: 2,
      headline: "The Work Speaks.",
      subheadline: null,
      cta_text: null,
      cta_link: null,
    },
  },
};

export const WithThemeOverride: Story = {
  name: "With Theme Override",
  args: {
    data: {
      __component: "sections.hero",
      id: 3,
      headline: "Forged in the Old Way.",
      subheadline: "Seven generations of artisan craft. Untreated stones. Direct provenance.",
      cta_text: "Commission a Piece",
      cta_link: "/consultation",
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
