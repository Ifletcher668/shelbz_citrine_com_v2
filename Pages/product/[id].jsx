import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Shield,
  Gem,
  Clock,
  MapPin,
  Crown,
  Mail,
} from 'lucide-react';
import Navigation from '@/Components/shared/Navigation';
import ProductCard from '@/Components/shared/ProductCard';
import { useCart } from '@/context/CartContext';
import { getProductById, getRelatedProducts, collections, products } from '@/data/products';

// Ring sizes for jewelry
const ringSizes = ['5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12'];

// Generate static paths for all products
export async function getStaticPaths() {
  const paths = products.map((product) => ({
    params: { id: product.id },
  }));

  return {
    paths,
    fallback: false,
  };
}

// Fetch product data at build time
export async function getStaticProps({ params }) {
  const product = getProductById(params.id);

  if (!product) {
    return {
      notFound: true,
    };
  }

  const relatedProducts = getRelatedProducts(product);
  const collection = collections[product.collection];

  return {
    props: {
      product,
      relatedProducts,
      collection,
    },
  };
}

export default function ProductPage({ product, relatedProducts, collection }) {
  const { addItem } = useCart();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = () => {
    if (product.category === 'rings' && !selectedSize) {
      alert('Please select a ring size');
      return;
    }
    addItem(product, quantity, selectedSize);
  };

  const needsSize = product?.category === 'rings';
  const isLegendary = product?.collection === 'legendary';

  return (
    <>
      <Head>
        <title>{product.name} | DARKLUX</title>
        <meta name="description" content={product.shortDescription} />
      </Head>

      <Navigation />

      <main className="min-h-screen bg-[#0a0a0a] pt-20">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-6 py-4">
          <nav className="flex items-center space-x-2 text-sm font-inter">
            <Link href="/store" className="text-gray-400 hover:text-white transition-colors">
              Collections
            </Link>
            <span className="text-gray-600">/</span>
            <Link
              href={`/store?collection=${product.collection}`}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {collection?.name}
            </Link>
            <span className="text-gray-600">/</span>
            <span className="text-gray-300">{product.name}</span>
          </nav>
        </div>

        {/* Product Section */}
        <section className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              {/* Main Image */}
              <div className="relative aspect-square bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gray-700/30 flex items-center justify-center">
                      {isLegendary ? (
                        <Crown className="w-16 h-16 text-[#8b0000]" />
                      ) : (
                        <Gem className="w-16 h-16 text-gray-500" />
                      )}
                    </div>
                    <span className="text-sm text-gray-500 font-inter uppercase tracking-wider">
                      {product.category}
                    </span>
                  </div>
                </div>

                {/* Image Navigation */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setCurrentImageIndex((prev) =>
                          prev === 0 ? product.images.length - 1 : prev - 1
                        )
                      }
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-colors"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() =>
                        setCurrentImageIndex((prev) =>
                          prev === product.images.length - 1 ? 0 : prev + 1
                        )
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-colors"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Collection Badge */}
                <div className="absolute top-4 left-4">
                  <span
                    className={`px-3 py-1.5 text-xs font-inter uppercase tracking-wider ${
                      product.collection === 'adventurer'
                        ? 'bg-gray-800 text-gray-300'
                        : product.collection === 'bridal'
                        ? 'bg-[#4a0e4e]/80 text-purple-200'
                        : 'bg-[#8b0000]/80 text-red-200'
                    }`}
                  >
                    {collection?.name}
                  </span>
                </div>
              </div>

              {/* Thumbnail Strip */}
              {product.images.length > 1 && (
                <div className="flex gap-2">
                  {product.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-16 h-16 bg-gray-800 flex-shrink-0 transition-all ${
                        currentImageIndex === index
                          ? 'ring-2 ring-[#8b0000]'
                          : 'opacity-60 hover:opacity-100'
                      }`}
                    >
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-xs text-gray-500">{index + 1}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Title & Price */}
              <div>
                <h1 className="text-3xl md:text-4xl font-cormorant font-semibold text-white mb-2">
                  {product.name}
                </h1>
                <p className="text-gray-400 font-inter">{product.shortDescription}</p>
                <div className="mt-4 flex items-baseline gap-3">
                  <span className="text-2xl text-white font-cormorant">
                    {isLegendary ? `From ${formatPrice(product.price)}` : formatPrice(product.price)}
                  </span>
                  {!isLegendary && product.inStock && (
                    <span className="text-sm text-green-500 font-inter uppercase tracking-wider">
                      In Stock
                    </span>
                  )}
                </div>
              </div>

              {/* Legendary Notice */}
              {isLegendary ? (
                <div className="border border-[#8b0000]/50 bg-[#8b0000]/10 p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <Crown className="w-6 h-6 text-[#8b0000]" />
                    <h3 className="text-white font-cormorant text-lg">Legendary Artifact</h3>
                  </div>
                  <p className="text-gray-400 font-inter text-sm">
                    This piece is displayed as an example of our Mythic Forge capabilities.
                    All Legendary pieces begin with a private consultation to understand your vision.
                  </p>
                  <a
                    href="mailto:commissions@darklux.com?subject=Legendary Commission Inquiry"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#8b0000] text-white text-sm font-inter uppercase tracking-wider hover:bg-[#6b0000] transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    Request Consultation
                  </a>
                </div>
              ) : (
                <>
                  {/* Size Selection (for rings) */}
                  {needsSize && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-white font-inter text-sm uppercase tracking-wider">
                          Ring Size
                        </label>
                        <button className="text-gray-400 hover:text-white text-xs font-inter underline transition-colors">
                          Size Guide
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {ringSizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`w-12 h-10 text-sm font-inter transition-all ${
                              selectedSize === size
                                ? 'bg-[#8b0000] text-white'
                                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quantity & Add to Cart */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-700">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="w-10 h-12 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 h-12 flex items-center justify-center text-white font-inter">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity((q) => q + 1)}
                        className="w-10 h-12 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={handleAddToCart}
                      disabled={needsSize && !selectedSize}
                      className={`flex-1 h-12 text-sm font-inter uppercase tracking-wider transition-colors ${
                        needsSize && !selectedSize
                          ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                          : 'bg-[#8b0000] text-white hover:bg-[#6b0000]'
                      }`}
                    >
                      Add to Collection
                    </button>
                  </div>
                </>
              )}

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-6 py-6 border-y border-gray-800">
                <div className="flex items-center gap-2 text-gray-400">
                  <Shield className="w-5 h-5" />
                  <span className="text-sm font-inter">Authenticity Guaranteed</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock className="w-5 h-5" />
                  <span className="text-sm font-inter">{product.craftsmanship?.includes('hour') ? product.craftsmanship : '40+ Hours Craftsmanship'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <MapPin className="w-5 h-5" />
                  <span className="text-sm font-inter">Jaipur, India</span>
                </div>
              </div>

              {/* Tabs */}
              <div>
                <div className="flex border-b border-gray-800">
                  {['description', 'materials', 'provenance'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-3 text-sm font-inter uppercase tracking-wider transition-colors ${
                        activeTab === tab
                          ? 'text-white border-b-2 border-[#8b0000]'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="py-6">
                  {activeTab === 'description' && (
                    <div className="prose prose-invert max-w-none">
                      <p className="text-gray-300 font-inter leading-relaxed whitespace-pre-line">
                        {product.description}
                      </p>
                    </div>
                  )}

                  {activeTab === 'materials' && (
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-white font-cormorant text-lg mb-2">Materials</h4>
                        <ul className="space-y-1">
                          {product.materials.map((material, index) => (
                            <li key={index} className="text-gray-400 font-inter text-sm flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-[#8b0000] rounded-full" />
                              {material}
                            </li>
                          ))}
                        </ul>
                      </div>
                      {product.dimensions && (
                        <div>
                          <h4 className="text-white font-cormorant text-lg mb-2">Dimensions</h4>
                          <p className="text-gray-400 font-inter text-sm">{product.dimensions}</p>
                        </div>
                      )}
                      {product.weight && (
                        <div>
                          <h4 className="text-white font-cormorant text-lg mb-2">Weight</h4>
                          <p className="text-gray-400 font-inter text-sm">{product.weight}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'provenance' && (
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-white font-cormorant text-lg mb-2">Craftsmanship</h4>
                        <p className="text-gray-400 font-inter text-sm">{product.craftsmanship}</p>
                      </div>
                      <div>
                        <h4 className="text-white font-cormorant text-lg mb-2">Heritage</h4>
                        <p className="text-gray-400 font-inter text-sm">{product.provenance}</p>
                      </div>
                      {product.customizable && (
                        <div className="mt-4 p-4 bg-gray-800/50 border border-gray-700">
                          <p className="text-gray-300 font-inter text-sm">
                            <span className="text-[#8b0000]">Customizable:</span> This piece can be personalized with custom enamel work, engravings, or stone selection. Contact us for bespoke options.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="border-t border-gray-800 bg-[#0a0a0a]">
            <div className="max-w-7xl mx-auto px-6 py-16">
              <h2 className="text-2xl md:text-3xl font-cormorant font-semibold text-white mb-8 text-center">
                You May Also Desire
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {relatedProducts.map((relatedProduct, index) => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} index={index} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="border-t border-gray-800 py-12 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm font-inter">
              &copy; {new Date().getFullYear()} DARKLUX. Heritage Craftsmanship, Dark Romanticism.
            </p>
            <div className="flex items-center space-x-6">
              <Link href="/" className="text-gray-400 hover:text-white text-sm font-inter transition-colors">
                Home
              </Link>
              <Link href="/store" className="text-gray-400 hover:text-white text-sm font-inter transition-colors">
                Collections
              </Link>
              <Link href="/#provenance" className="text-gray-400 hover:text-white text-sm font-inter transition-colors">
                Our Story
              </Link>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
