import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getSubtotal } =
    useCart();
  const subtotal = getSubtotal();

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0a0a0a] border-l border-gray-800 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800">
              <h2 className="text-lg font-cormorant font-semibold text-white tracking-wide">
                Your Selection
              </h2>
              <button
                onClick={closeCart}
                className="p-1 text-gray-400 hover:text-white transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-5 py-3">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-16 h-16 text-gray-600 mb-3" />
                  <p className="text-gray-400 font-inter mb-1">
                    Your collection awaits
                  </p>
                  <p className="text-gray-500 text-sm font-inter mb-5">
                    Discover pieces crafted for those who walk in shadow
                  </p>
                  <Link
                    href="/store"
                    onClick={closeCart}
                    className="inline-flex items-center px-5 py-2 bg-[#8b0000] text-white text-sm font-inter uppercase tracking-wider hover:bg-[#6b0000] transition-colors"
                  >
                    Explore Collections
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              ) : (
                <ul className="space-y-6">
                  {items.map((item) => (
                    <li
                      key={`${item.product.id}-${item.size}`}
                      className="flex gap-5"
                    >
                      {/* Product Image Placeholder */}
                      <div className="w-20 h-20 bg-gray-800 rounded flex-shrink-0 flex items-center justify-center">
                        <span className="text-gray-600 text-xs font-inter">
                          {item.product.category}
                        </span>
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-cormorant text-md truncate">
                          {item.product.name}
                        </h3>
                        <p className="text-gray-400 text-sm font-inter mt-0.5">
                          {formatPrice(item.product.price)}
                        </p>
                        {item.size && (
                          <p className="text-gray-500 text-xs font-inter mt-1">
                            Size: {item.size}
                          </p>
                        )}

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-4 mt-2">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.size,
                                item.quantity - 1,
                              )
                            }
                            className="w-7 h-7 flex items-center justify-center border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-white font-inter text-sm w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.size,
                                item.quantity + 1,
                              )
                            }
                            className="w-7 h-7 flex items-center justify-center border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() =>
                              removeItem(item.product.id, item.size)
                            }
                            className="ml-auto text-gray-500 hover:text-[#8b0000] text-xs font-inter uppercase tracking-wide transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-800 px-5 py-3 space-y-4">
                {/* Subtotal */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 font-inter">Subtotal</span>
                  <span className="text-white font-cormorant text-xl">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <p className="text-gray-500 text-xs font-inter">
                  Shipping and taxes calculated at checkout
                </p>

                {/* Checkout Button */}
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="block w-full py-3 bg-[#8b0000] text-white text-center text-sm font-inter uppercase tracking-wider hover:bg-[#6b0000] transition-colors"
                >
                  Proceed to Checkout
                </Link>

                {/* Continue Shopping */}
                <button
                  onClick={closeCart}
                  className="block w-full py-2 border border-gray-700 text-gray-300 text-center text-sm font-inter uppercase tracking-wider hover:border-gray-500 hover:text-white transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
