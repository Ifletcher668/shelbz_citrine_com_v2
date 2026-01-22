import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  Lock,
  CreditCard,
  Truck,
  Check,
  ShoppingBag,
  Shield,
  Gift,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { collections } from '@/data/products';

const steps = [
  { id: 'information', label: 'Information' },
  { id: 'shipping', label: 'Shipping' },
  { id: 'payment', label: 'Payment' },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    country: 'United States',
    state: '',
    zipCode: '',
    phone: '',
    shippingMethod: 'standard',
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvc: '',
    saveInfo: false,
    giftMessage: '',
  });

  const subtotal = getSubtotal();
  const shippingCost = formData.shippingMethod === 'express' ? 50 : (subtotal > 1000 ? 0 : 25);
  const taxRate = 0.08; // 8% tax
  const tax = subtotal * taxRate;
  const total = subtotal + shippingCost + tax;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsProcessing(false);
    setOrderComplete(true);
    clearCart();
  };

  // Empty cart state
  if (items.length === 0 && !orderComplete) {
    return (
      <>
        <Head>
          <title>Checkout | DARKLUX</title>
        </Head>
        <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
          <div className="text-center">
            <ShoppingBag className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h1 className="text-2xl font-cormorant text-white mb-2">Your Collection is Empty</h1>
            <p className="text-gray-400 font-inter mb-6">
              Discover pieces crafted for those who walk in shadow
            </p>
            <Link
              href="/store"
              className="inline-block px-8 py-4 bg-[#8b0000] text-white text-sm font-inter uppercase tracking-wider hover:bg-[#6b0000] transition-colors"
            >
              Explore Collections
            </Link>
          </div>
        </main>
      </>
    );
  }

  // Order complete state
  if (orderComplete) {
    return (
      <>
        <Head>
          <title>Order Confirmed | DARKLUX</title>
        </Head>
        <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-lg"
          >
            <div className="w-20 h-20 bg-[#8b0000] rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-cormorant font-semibold text-white mb-4">
              Your Order is Confirmed
            </h1>
            <p className="text-gray-400 font-inter mb-2">
              Thank you for choosing DARKLUX. Your pieces will be crafted with the care
              befitting their future keeper.
            </p>
            <p className="text-gray-500 font-inter text-sm mb-8">
              A confirmation email has been sent to {formData.email}
            </p>
            <div className="space-y-4">
              <Link
                href="/store"
                className="block px-8 py-4 bg-[#8b0000] text-white text-sm font-inter uppercase tracking-wider hover:bg-[#6b0000] transition-colors"
              >
                Continue Exploring
              </Link>
              <Link
                href="/"
                className="block px-8 py-4 border border-gray-700 text-gray-300 text-sm font-inter uppercase tracking-wider hover:border-gray-500 hover:text-white transition-colors"
              >
                Return Home
              </Link>
            </div>
          </motion.div>
        </main>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Checkout | DARKLUX</title>
        <meta name="robots" content="noindex" />
      </Head>

      <main className="min-h-screen bg-[#0a0a0a]">
        {/* Header */}
        <header className="border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="text-2xl font-cormorant font-semibold tracking-wider text-white">
              DARK<span style={{ color: '#8b0000' }}>LUX</span>
            </Link>
            <div className="flex items-center gap-2 text-gray-400">
              <Lock className="w-4 h-4" />
              <span className="text-sm font-inter">Secure Checkout</span>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Back Link */}
          <Link
            href="/store"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm font-inter mb-8 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Continue Shopping
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left Column - Form */}
            <div>
              {/* Progress Steps */}
              <div className="flex items-center mb-8">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-inter ${
                        index < currentStep
                          ? 'bg-[#8b0000] text-white'
                          : index === currentStep
                          ? 'bg-gray-800 text-white border-2 border-[#8b0000]'
                          : 'bg-gray-800 text-gray-500'
                      }`}
                    >
                      {index < currentStep ? <Check className="w-4 h-4" /> : index + 1}
                    </div>
                    <span
                      className={`ml-2 text-sm font-inter ${
                        index === currentStep ? 'text-white' : 'text-gray-500'
                      }`}
                    >
                      {step.label}
                    </span>
                    {index < steps.length - 1 && (
                      <div className="w-12 h-px bg-gray-700 mx-4" />
                    )}
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmit}>
                <AnimatePresence mode="wait">
                  {/* Step 1: Information */}
                  {currentStep === 0 && (
                    <motion.div
                      key="information"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <h2 className="text-2xl font-cormorant font-semibold text-white mb-6">
                        Contact Information
                      </h2>

                      <div>
                        <label className="block text-sm font-inter text-gray-300 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 bg-gray-900 border border-gray-700 text-white font-inter focus:outline-none focus:border-[#8b0000] transition-colors"
                          placeholder="you@example.com"
                        />
                      </div>

                      <h3 className="text-xl font-cormorant font-semibold text-white pt-4">
                        Shipping Address
                      </h3>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-inter text-gray-300 mb-2">
                            First Name
                          </label>
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 text-white font-inter focus:outline-none focus:border-[#8b0000] transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-inter text-gray-300 mb-2">
                            Last Name
                          </label>
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 text-white font-inter focus:outline-none focus:border-[#8b0000] transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-inter text-gray-300 mb-2">
                          Address
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 bg-gray-900 border border-gray-700 text-white font-inter focus:outline-none focus:border-[#8b0000] transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-inter text-gray-300 mb-2">
                          Apartment, suite, etc. (optional)
                        </label>
                        <input
                          type="text"
                          name="apartment"
                          value={formData.apartment}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-900 border border-gray-700 text-white font-inter focus:outline-none focus:border-[#8b0000] transition-colors"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-inter text-gray-300 mb-2">
                            City
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 text-white font-inter focus:outline-none focus:border-[#8b0000] transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-inter text-gray-300 mb-2">
                            State
                          </label>
                          <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 text-white font-inter focus:outline-none focus:border-[#8b0000] transition-colors"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-inter text-gray-300 mb-2">
                            ZIP Code
                          </label>
                          <input
                            type="text"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 text-white font-inter focus:outline-none focus:border-[#8b0000] transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-inter text-gray-300 mb-2">
                            Phone
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 text-white font-inter focus:outline-none focus:border-[#8b0000] transition-colors"
                            placeholder="For delivery updates"
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleNext}
                        className="w-full py-4 bg-[#8b0000] text-white text-sm font-inter uppercase tracking-wider hover:bg-[#6b0000] transition-colors mt-6"
                      >
                        Continue to Shipping
                      </button>
                    </motion.div>
                  )}

                  {/* Step 2: Shipping */}
                  {currentStep === 1 && (
                    <motion.div
                      key="shipping"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <h2 className="text-2xl font-cormorant font-semibold text-white mb-6">
                        Shipping Method
                      </h2>

                      <div className="space-y-3">
                        <label
                          className={`flex items-center justify-between p-4 border cursor-pointer transition-colors ${
                            formData.shippingMethod === 'standard'
                              ? 'border-[#8b0000] bg-[#8b0000]/10'
                              : 'border-gray-700 hover:border-gray-600'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <input
                              type="radio"
                              name="shippingMethod"
                              value="standard"
                              checked={formData.shippingMethod === 'standard'}
                              onChange={handleInputChange}
                              className="sr-only"
                            />
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                formData.shippingMethod === 'standard'
                                  ? 'border-[#8b0000]'
                                  : 'border-gray-600'
                              }`}
                            >
                              {formData.shippingMethod === 'standard' && (
                                <div className="w-2.5 h-2.5 rounded-full bg-[#8b0000]" />
                              )}
                            </div>
                            <div>
                              <p className="text-white font-inter">Standard Shipping</p>
                              <p className="text-gray-400 text-sm font-inter">
                                7-14 business days{' '}
                                {subtotal > 1000 && (
                                  <span className="text-green-500">(Free for orders over $1,000)</span>
                                )}
                              </p>
                            </div>
                          </div>
                          <span className="text-white font-inter">
                            {subtotal > 1000 ? 'FREE' : '$25'}
                          </span>
                        </label>

                        <label
                          className={`flex items-center justify-between p-4 border cursor-pointer transition-colors ${
                            formData.shippingMethod === 'express'
                              ? 'border-[#8b0000] bg-[#8b0000]/10'
                              : 'border-gray-700 hover:border-gray-600'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <input
                              type="radio"
                              name="shippingMethod"
                              value="express"
                              checked={formData.shippingMethod === 'express'}
                              onChange={handleInputChange}
                              className="sr-only"
                            />
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                formData.shippingMethod === 'express'
                                  ? 'border-[#8b0000]'
                                  : 'border-gray-600'
                              }`}
                            >
                              {formData.shippingMethod === 'express' && (
                                <div className="w-2.5 h-2.5 rounded-full bg-[#8b0000]" />
                              )}
                            </div>
                            <div>
                              <p className="text-white font-inter">Express Shipping</p>
                              <p className="text-gray-400 text-sm font-inter">
                                3-5 business days, insured delivery
                              </p>
                            </div>
                          </div>
                          <span className="text-white font-inter">$50</span>
                        </label>
                      </div>

                      {/* Gift Message */}
                      <div className="pt-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Gift className="w-5 h-5 text-gray-400" />
                          <label className="text-sm font-inter text-gray-300">
                            Add a Gift Message (optional)
                          </label>
                        </div>
                        <textarea
                          name="giftMessage"
                          value={formData.giftMessage}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-4 py-3 bg-gray-900 border border-gray-700 text-white font-inter focus:outline-none focus:border-[#8b0000] transition-colors resize-none"
                          placeholder="Your message will be included with the delivery..."
                        />
                      </div>

                      <div className="flex gap-4 mt-6">
                        <button
                          type="button"
                          onClick={handleBack}
                          className="px-6 py-4 border border-gray-700 text-gray-300 text-sm font-inter uppercase tracking-wider hover:border-gray-500 hover:text-white transition-colors"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={handleNext}
                          className="flex-1 py-4 bg-[#8b0000] text-white text-sm font-inter uppercase tracking-wider hover:bg-[#6b0000] transition-colors"
                        >
                          Continue to Payment
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Payment */}
                  {currentStep === 2 && (
                    <motion.div
                      key="payment"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <h2 className="text-2xl font-cormorant font-semibold text-white mb-6">
                        Payment Details
                      </h2>

                      <div className="flex items-center gap-2 p-4 bg-gray-800/50 border border-gray-700 mb-6">
                        <Lock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-400 text-sm font-inter">
                          All transactions are secure and encrypted
                        </span>
                      </div>

                      <div>
                        <label className="block text-sm font-inter text-gray-300 mb-2">
                          Card Number
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleInputChange}
                            required
                            maxLength={19}
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 text-white font-inter focus:outline-none focus:border-[#8b0000] transition-colors pr-12"
                            placeholder="1234 5678 9012 3456"
                          />
                          <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-inter text-gray-300 mb-2">
                          Name on Card
                        </label>
                        <input
                          type="text"
                          name="cardName"
                          value={formData.cardName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 bg-gray-900 border border-gray-700 text-white font-inter focus:outline-none focus:border-[#8b0000] transition-colors"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-inter text-gray-300 mb-2">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            name="expiry"
                            value={formData.expiry}
                            onChange={handleInputChange}
                            required
                            maxLength={5}
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 text-white font-inter focus:outline-none focus:border-[#8b0000] transition-colors"
                            placeholder="MM/YY"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-inter text-gray-300 mb-2">
                            CVC
                          </label>
                          <input
                            type="text"
                            name="cvc"
                            value={formData.cvc}
                            onChange={handleInputChange}
                            required
                            maxLength={4}
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 text-white font-inter focus:outline-none focus:border-[#8b0000] transition-colors"
                            placeholder="123"
                          />
                        </div>
                      </div>

                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="saveInfo"
                          checked={formData.saveInfo}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <div
                          className={`w-5 h-5 border-2 flex items-center justify-center transition-colors ${
                            formData.saveInfo ? 'bg-[#8b0000] border-[#8b0000]' : 'border-gray-600'
                          }`}
                        >
                          {formData.saveInfo && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className="text-gray-300 text-sm font-inter">
                          Save payment information for future purchases
                        </span>
                      </label>

                      <div className="flex gap-4 mt-6">
                        <button
                          type="button"
                          onClick={handleBack}
                          className="px-6 py-4 border border-gray-700 text-gray-300 text-sm font-inter uppercase tracking-wider hover:border-gray-500 hover:text-white transition-colors"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          disabled={isProcessing}
                          className="flex-1 py-4 bg-[#8b0000] text-white text-sm font-inter uppercase tracking-wider hover:bg-[#6b0000] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {isProcessing ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <Lock className="w-4 h-4" />
                              Complete Order - {formatPrice(total)}
                            </>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:pl-8 lg:border-l lg:border-gray-800">
              <div className="sticky top-8">
                <h2 className="text-xl font-cormorant font-semibold text-white mb-6">
                  Order Summary
                </h2>

                {/* Cart Items */}
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={`${item.product.id}-${item.size}`} className="flex gap-4">
                      <div className="w-16 h-16 bg-gray-800 flex-shrink-0 flex items-center justify-center relative">
                        <span className="text-gray-600 text-xs font-inter">
                          {item.product.category}
                        </span>
                        {item.quantity > 1 && (
                          <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#8b0000] text-white text-xs rounded-full flex items-center justify-center">
                            {item.quantity}
                          </span>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-cormorant text-sm">
                          {item.product.name}
                        </h3>
                        {item.size && (
                          <p className="text-gray-500 text-xs font-inter">Size: {item.size}</p>
                        )}
                        <p className="text-gray-400 text-xs font-inter mt-0.5">
                          {collections[item.product.collection]?.name}
                        </p>
                      </div>
                      <div className="text-white font-inter text-sm">
                        {formatPrice(item.product.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="border-t border-gray-800 pt-4 space-y-3">
                  <div className="flex justify-between text-sm font-inter">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-white">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-inter">
                    <span className="text-gray-400">Shipping</span>
                    <span className="text-white">
                      {shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-inter">
                    <span className="text-gray-400">Tax (estimated)</span>
                    <span className="text-white">{formatPrice(tax)}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-gray-800">
                    <span className="text-white font-cormorant text-lg">Total</span>
                    <span className="text-white font-cormorant text-xl">{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="mt-8 pt-6 border-t border-gray-800 space-y-3">
                  <div className="flex items-center gap-3 text-gray-400">
                    <Shield className="w-5 h-5" />
                    <span className="text-sm font-inter">Authenticity Guaranteed</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-400">
                    <Truck className="w-5 h-5" />
                    <span className="text-sm font-inter">Insured Worldwide Shipping</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-400">
                    <Lock className="w-5 h-5" />
                    <span className="text-sm font-inter">Secure Payment Processing</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
