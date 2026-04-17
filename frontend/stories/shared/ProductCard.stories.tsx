import type { Meta, StoryObj } from "@storybook/react";
import ProductCard from "../../Components/shared/ProductCard";

const meta: Meta<typeof ProductCard> = {
  title: "Shared/ProductCard",
  component: ProductCard,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Product card with hover overlay, collection badge, and category icon. Links to `/product/:id`. Animates in on scroll (mounts immediately in Storybook).",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ProductCard>;

const adventurerProduct = {
  id: "adventurer-001",
  name: "Obsidian Signet",
  collection: "adventurer",
  category: "rings",
  price: 385,
  shortDescription: "Heavy sterling silver signet ring with 2ct black spinel",
  inStock: true,
  featured: true,
};

const heirloomProduct = {
  id: "bridal-001",
  name: "Cushion-Cut Engagement Ring",
  collection: "bridal",
  category: "rings",
  price: 4200,
  shortDescription: "18kt yellow gold with kundan technique, 3.2ct black spinel",
  inStock: true,
  featured: false,
};

const legendaryProduct = {
  id: "legendary-001",
  name: "Damascus Sigil Blade",
  collection: "legendary",
  category: "blades",
  price: 18000,
  shortDescription: "Folded Damascus steel with black spinel pommel. 14 months.",
  inStock: false,
  featured: false,
};

const earringProduct = {
  id: "adventurer-earrings-001",
  name: "Void Chandelier Earrings",
  collection: "adventurer",
  category: "earrings",
  price: 640,
  shortDescription: "Sterling silver drop earrings with paired 1.2ct black spinel",
  inStock: true,
  featured: false,
};

export const Adventurer: Story = {
  name: "Adventurer Collection",
  args: { product: adventurerProduct, index: 0 },
  render: (args) => (
    <div className="w-64" style={{ background: "var(--color-bg-base)", padding: "1rem" }}>
      <ProductCard {...args} />
    </div>
  ),
};

export const Heirloom: Story = {
  name: "Heirloom Collection",
  args: { product: heirloomProduct, index: 0 },
  render: (args) => (
    <div className="w-64" style={{ background: "var(--color-bg-base)", padding: "1rem" }}>
      <ProductCard {...args} />
    </div>
  ),
};

export const Legendary: Story = {
  name: "Legendary (By Consultation)",
  args: { product: legendaryProduct, index: 0 },
  render: (args) => (
    <div className="w-64" style={{ background: "var(--color-bg-base)", padding: "1rem" }}>
      <ProductCard {...args} />
    </div>
  ),
};

export const Grid: Story = {
  name: "Product Grid",
  render: () => (
    <div
      className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6"
      style={{ background: "var(--color-bg-base)" }}
    >
      {[adventurerProduct, heirloomProduct, earringProduct, legendaryProduct].map(
        (product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        )
      )}
    </div>
  ),
};
