import type { Meta, StoryObj } from "@storybook/react";
import RowCms from "../../Components/cms/sections/RowCms";
import type { GetPageBySlugRowSection } from "../../lib/strapi-cms/strapiApi";

const meta: Meta<typeof RowCms> = {
  title: "CMS/RowCms",
  component: RowCms,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Primary CMS building block — a `sections.row` entry with 1–6 WYSIWYG columns. Each column body is markdown rendered by `RichContent`. Columns animate in on scroll (or immediately on mount in Storybook).",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof RowCms>;

const RICH_BODY_1 = `
# Multigenerational Craft

For seven generations, artisans in India and Thailand have been passing down the knowledge of jewelcrafting.

Black spinel ranks **8 on the Mohs scale** — harder than most gemstones, and far more durable than diamonds for daily wear.
`;

const RICH_BODY_2 = `
## The Stone

The same bezel-setting method that secured Mughal court jewels now cradles this 2.5ct stone. Each inclusion tells a story of geological pressure — millions of years compressed into a single facet.

> *"Not self-expression but surrender to the logic of materials."*
> — Ananda Coomaraswamy
`;

const RICH_BODY_3 = `
### The Process

From first conversation to finished piece: sketch, stone selection, metalwork, and setting.

Each step requires decisions that **cannot be rushed** — the hand that wears the ring must shape its making.
`;

const mockOneColumn: GetPageBySlugRowSection = {
  id: 1,
  __component: "sections.row",
  section_id: null,
  columns: [{ id: 1, __component: "column.column", body: RICH_BODY_1 }],
};

const mockTwoColumn: GetPageBySlugRowSection = {
  id: 2,
  __component: "sections.row",
  section_id: null,
  columns: [
    { id: 1, __component: "column.column", body: RICH_BODY_1 },
    { id: 2, __component: "column.column", body: RICH_BODY_2 },
  ],
};

const mockThreeColumn: GetPageBySlugRowSection = {
  id: 3,
  __component: "sections.row",
  section_id: null,
  columns: [
    { id: 1, __component: "column.column", body: RICH_BODY_1 },
    { id: 2, __component: "column.column", body: RICH_BODY_2 },
    { id: 3, __component: "column.column", body: RICH_BODY_3 },
  ],
};

export const OneColumn: Story = {
  name: "1 Column",
  args: { data: mockOneColumn },
};

export const TwoColumns: Story = {
  name: "2 Columns",
  args: { data: mockTwoColumn },
};

export const ThreeColumns: Story = {
  name: "3 Columns",
  args: { data: mockThreeColumn },
};

export const WithThemeOverride: Story = {
  name: "With Theme Override",
  args: { data: mockTwoColumn },
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
