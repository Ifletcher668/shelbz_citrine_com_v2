import type { Meta, StoryObj } from "@storybook/react";
import GalleryCms from "../../Components/cms/sections/GalleryCms";
import type { GetPageBySlugMediaGallerySection } from "../../lib/strapi-cms/strapiApi";
import type { MediaFile } from "strapi-typed-client";

const meta: Meta<typeof GalleryCms> = {
  title: "CMS/GalleryCms",
  component: GalleryCms,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "CMS-driven image gallery. Images open in a lightbox. When no images are available, a placeholder message is shown.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof GalleryCms>;

/**
 * Mock media files using placeholder images.
 * In production these URLs come from Strapi's media library.
 */
const mockImages = [
  {
    id: 1,
    url: "https://picsum.photos/seed/ring1/600/800",
    alternativeText: "Black spinel signet ring — bezel set, 18kt gold",
    width: 600,
    height: 800,
    formats: null,
  },
  {
    id: 2,
    url: "https://picsum.photos/seed/ring2/800/600",
    alternativeText: "Crimson garnet cuff — hammered brass",
    width: 800,
    height: 600,
    formats: null,
  },
  {
    id: 3,
    url: "https://picsum.photos/seed/ring3/500/700",
    alternativeText: "Moonstone pendant — sterling silver, cab-cut",
    width: 500,
    height: 700,
    formats: null,
  },
  {
    id: 4,
    url: "https://picsum.photos/seed/ring4/700/500",
    alternativeText: "Labradorite band — oxidised silver",
    width: 700,
    height: 500,
    formats: null,
  },
  {
    id: 5,
    url: "https://picsum.photos/seed/ring5/600/600",
    alternativeText: "Sapphire cluster — prong set, 22kt gold",
    width: 600,
    height: 600,
    formats: null,
  },
  {
    id: 6,
    url: "https://picsum.photos/seed/ring6/900/600",
    alternativeText: "Alexandrite solitaire — bezel set, argentium silver",
    width: 900,
    height: 600,
    formats: null,
  },
];

const mockGallery: GetPageBySlugMediaGallerySection = {
  id: 1,
  __component: "sections.media-gallery",
  title: "Recent Commissions",
  Images: mockImages as unknown as MediaFile[],
  pagination_count: null,
  pagination_filter: null,
  use_pagination: false,
};

export const SingleGallery: Story = {
  name: "Single Gallery",
  args: { data: mockGallery },
};

export const EmptyGallery: Story = {
  name: "Empty Gallery",
  args: {
    data: {
      id: 4,
      __component: "sections.media-gallery",
      title: "Upcoming Work",
      Images: [],
      pagination_count: null,
      pagination_filter: null,
      use_pagination: false,
    } as GetPageBySlugMediaGallerySection,
  },
};

export const NoTitle: Story = {
  name: "No Title",
  args: {
    data: { ...mockGallery, title: null },
  },
};
