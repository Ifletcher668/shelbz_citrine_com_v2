import type { Meta, StoryObj } from "@storybook/react";
import CartDrawer from "../../Components/shared/CartDrawer";
import { CartProvider } from "../../context/CartContext";
import { useCart } from "../../context/CartContext";
import { useEffect } from "react";

const meta: Meta<typeof CartDrawer> = {
  title: "Shared/CartDrawer",
  component: CartDrawer,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Sliding cart drawer — requires CartProvider. Uses AnimatePresence for enter/exit. Shows empty state or item list depending on CartContext state.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof CartDrawer>;

const mockProduct = {
  id: "black-spinel-bezel-001",
  name: "Bezel-Set Black Spinel Ring",
  category: "rings",
  collection: "adventurer",
  price: 3200,
  shortDescription: "Platinum band, 2.5ct octahedral cut. Hand-forged.",
  inStock: true,
  featured: true,
};

function OpenEmptyCart() {
  const { openCart } = useCart();
  useEffect(() => { openCart(); }, [openCart]);
  return <CartDrawer />;
}

function OpenFilledCart() {
  const { openCart, addItem } = useCart();
  useEffect(() => {
    addItem(mockProduct, 1, "7");
    addItem({ ...mockProduct, id: "spinel-ring-002", name: "Cushion-Cut Engagement Ring", price: 5800 }, 1, "6.5");
    openCart();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <CartDrawer />;
}

export const Empty: Story = {
  name: "Empty Cart",
  decorators: [
    (Story) => (
      <CartProvider>
        <OpenEmptyCart />
      </CartProvider>
    ),
  ],
  render: () => null,
};

export const WithItems: Story = {
  name: "With Items",
  decorators: [
    (Story) => (
      <CartProvider>
        <OpenFilledCart />
      </CartProvider>
    ),
  ],
  render: () => null,
};
