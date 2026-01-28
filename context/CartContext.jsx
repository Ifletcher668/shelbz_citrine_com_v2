import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("darkLuxCart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        // Failed to parse saved cart, start fresh
        setItems([]);
      }
    }
  }, []);

  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("darkLuxCart", JSON.stringify(items));
  }, [items]);

  const addItem = (
    product,
    quantity = 1,
    size = null,
    customization = null,
  ) => {
    setItems((currentItems) => {
      const existingIndex = currentItems.findIndex(
        (item) => item.product.id === product.id && item.size === size,
      );

      if (existingIndex > -1) {
        const updated = [...currentItems];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      return [
        ...currentItems,
        { product, quantity, size, customization, addedAt: Date.now() },
      ];
    });
    setIsOpen(true);
  };

  const removeItem = (productId, size = null) => {
    setItems((currentItems) =>
      currentItems.filter(
        (item) => !(item.product.id === productId && item.size === size),
      ),
    );
  };

  const updateQuantity = (productId, size, quantity) => {
    if (quantity <= 0) {
      removeItem(productId, size);
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.product.id === productId && item.size === size
          ? { ...item, quantity }
          : item,
      ),
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getSubtotal = () => {
    return items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    );
  };

  const getItemCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((prev) => !prev);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getSubtotal,
        getItemCount,
        openCart,
        closeCart,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
