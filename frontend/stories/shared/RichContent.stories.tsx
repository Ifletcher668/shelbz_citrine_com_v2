import type { Meta, StoryObj } from "@storybook/react";
import RichContent from "../../Components/shared/RichContent";
import { RelationsContext } from "../../lib/RelationsContext";
import { MediaContext } from "../../lib/MediaContext";

const meta: Meta<typeof RichContent> = {
  title: "Shared/RichContent",
  component: RichContent,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Renders markdown body content. Uses RelationsContext and MediaContext to resolve embedded references like `[ref:faq:1]`. Requires both contexts — provided as story-level decorators here.",
      },
    },
  },
  decorators: [
    (Story) => (
      <RelationsContext.Provider value={{}}>
        <MediaContext.Provider value={{}}>
          <Story />
        </MediaContext.Provider>
      </RelationsContext.Provider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof RichContent>;

const MARKDOWN_BODY = `
# Multigenerational Craft

For seven generations, artisans in India and Thailand have been passing down the knowledge of jewelcrafting. Black spinel ranks **8 on the Mohs scale** — harder than most gemstones, and far more durable than diamonds for daily wear.

## The Stone

The same bezel-setting method that secured Mughal court jewels now cradles this 2.5ct stone. Each inclusion tells a story of geological pressure — millions of years compressed into a single facet.

> *"Not self-expression but surrender to the logic of materials."*
> — Ananda Coomaraswamy

### The Process

From first conversation to finished piece: sketch, stone selection, metalwork, and setting.

Each step requires decisions that **cannot be rushed** — the hand that wears the ring must shape its making.

---

A numbered list:

1. Consultation (45–60 min)
2. Stone selection
3. Hand-forged in Jaipur

A bullet list:

- Untreated black spinel
- Ethically sourced, direct partnerships
- Lifetime repair guarantee
`;

export const Default: Story = {
  args: { body: MARKDOWN_BODY },
};

export const InlineOnly: Story = {
  name: "Inline Formatting",
  args: {
    body: `This stone is **harder** than most gemstones. It is *far more durable* than diamonds for daily wear. Visit [Royal Karkhana](https://royalkarkhana.com) for more.`,
  },
};

export const AsArticle: Story = {
  name: "As <article>",
  args: {
    body: MARKDOWN_BODY,
    as: "article",
  },
};

export const WithThemeOverride: Story = {
  name: "With Theme Override",
  args: { body: MARKDOWN_BODY },
  decorators: [
    (Story) => (
      <div
        style={
          {
            "--color-bg-base": "#1a0f05",
            "--color-text-heading": "#f0e8d0",
            "--color-text-body": "#c8b89a",
          } as React.CSSProperties
        }
      >
        <Story />
      </div>
    ),
  ],
};
