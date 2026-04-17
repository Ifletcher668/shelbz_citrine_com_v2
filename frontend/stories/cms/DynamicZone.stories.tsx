import type { Meta, StoryObj } from "@storybook/react";
import DynamicZone from "../../Components/cms/DynamicZone";
import type {
  GetPageBySlugRowSection,
  GetPageBySlugMediaGallerySection,
} from "../../lib/strapi-cms/strapiApi";
import { MediaFile } from "strapi-typed-client";

const meta: Meta<typeof DynamicZone> = {
  title: "CMS/DynamicZone",
  component: DynamicZone,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Renders an array of Strapi page sections. Each `__component` value maps to a specific CMS component. Currently supports `sections.row` and `sections.media-gallery`.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof DynamicZone>;

const rowSection: GetPageBySlugRowSection = {
  id: 1,
  __component: "sections.row",
  section_id: "alsdkfjljkasfd",
  columns: [
    {
      id: 1,
      __component: "column.column",
      body: "# Multigenerational Craft\n\nFor seven generations, artisans have been passing down the knowledge of jewelcrafting.",
    },
    {
      id: 2,
      __component: "column.column",
      body: "## The Stone\n\nBlack spinel ranks **8 on the Mohs scale** — harder than most gemstones, far more durable than diamonds for daily wear.",
    },
  ],
};
const gallerySection: GetPageBySlugMediaGallerySection = {
  id: 2,
  use_pagination: false,
  pagination_count: null,
  pagination_filter: null,
  __component: "sections.media-gallery",
  title: "Recent Work",
  Images: [
    {
      id: 1,
      url: "https://picsum.photos/seed/dz1/600/800",
      alternativeText: "Signet ring",
      width: 600,
      height: 800,
      formats: null,
    },
    {
      id: 2,
      url: "https://picsum.photos/seed/dz2/800/600",
      alternativeText: "Cuff bracelet",
      width: 800,
      height: 600,
      formats: null,
    },
    {
      id: 3,
      url: "https://picsum.photos/seed/dz3/500/700",
      alternativeText: "Pendant",
      width: 500,
      height: 700,
      formats: null,
    },
  ] as MediaFile[],
};

export const RowOnly: Story = {
  name: "Row Only",
  args: { sections: [rowSection] },
};

export const GalleryOnly: Story = {
  name: "Gallery Only",
  args: { sections: [gallerySection] },
};

export const RowThenGallery: Story = {
  name: "Row → Gallery",
  args: { sections: [rowSection, gallerySection] },
};

export const MultipleRows: Story = {
  name: "Multiple Rows",
  args: {
    sections: [
      rowSection,
      {
        id: 3,
        __component: "sections.row",
        section_id: "process",
        columns: [
          {
            id: 4,
            __component: "column.column",
            body: "### Step 1: Consultation\n\nWe begin with a conversation — your vision, the stone you have in mind, and the occasion that calls for it.",
          },
          {
            id: 5,
            __component: "column.column",
            body: "### Step 2: Stone Selection\n\nWe source ethically mined stones with provenance documentation. Every inclusion is recorded.",
          },
          {
            id: 6,
            __component: "column.column",
            body: "### Step 3: Forging\n\nThe metal is hand-worked using techniques refined across centuries. No casting — every piece is forged.",
          },
        ],
      },
    ],
  },
};

export const Empty: Story = {
  name: "Empty / Null",
  args: { sections: undefined },
};
