import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, Crown, Gem, Circle, Sparkles, Watch, Dices, Sword, Shirt } from 'lucide-react';
import { collections } from '@/data/products';

const categoryIcons = {
  rings: Circle,
  pendants: Gem,
  earrings: Sparkles,
  bracelets: Watch,
  dice: Dices,
  blades: Sword,
  textiles: Shirt,
};

export default function ProductCard({ product, index = 0 }) {
  const collection = collections[product.collection];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const isLegendary = product.collection === 'legendary';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group"
    >
      <Link href={`/product/${product.id}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-square bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden mb-3">
          {/* Placeholder for product image */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              {(() => {
                const IconComponent = isLegendary ? Crown : (categoryIcons[product.category] || Gem);
                return (
                  <div className="w-16 h-16 mx-auto mb-1 rounded-full bg-gray-700/50 flex items-center justify-center">
                    <IconComponent className={`w-8 h-8 ${isLegendary ? 'text-[#8b0000]' : 'text-gray-500'}`} />
                  </div>
                );
              })()}
              <span className="text-xs text-gray-500 font-inter uppercase tracking-wider">
                {product.category}
              </span>
            </div>
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="flex items-center space-x-2 text-white text-sm font-inter uppercase tracking-wider">
              <Eye className="w-4 h-4" />
              <span>{isLegendary ? 'View Showpiece' : 'View Details'}</span>
            </div>
          </div>

          {/* Collection Badge */}
          <div className="absolute top-2 left-3">
            <span
              className={`px-1 py-1 text-xs font-inter uppercase tracking-wider ${
                product.collection === 'adventurer'
                  ? 'bg-gray-800 text-gray-300'
                  : product.collection === 'bridal'
                  ? 'bg-[#4a0e4e]/80 text-purple-200'
                  : 'bg-[#8b0000]/80 text-red-200'
              }`}
            >
              {collection.name}
            </span>
          </div>

          {/* Featured Badge */}
          {product.featured && (
            <div className="absolute top-2 right-3">
              <span className="px-1 py-1 bg-[#8b0000] text-white text-xs font-inter uppercase tracking-wider">
                Featured
              </span>
            </div>
          )}

          {/* Royal Commission Indicator */}
          {isLegendary && (
            <div className="absolute bottom-2 left-3 right-3">
              <div className="bg-black/80 backdrop-blur-sm px-2 py-1 text-center">
                <span className="text-xs text-gray-300 font-inter">
                  By Consultation Only
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-2">
          <h3 className="font-cormorant text-lg text-white group-hover:text-gray-200 transition-colors">
            {product.name}
          </h3>
          <p className="text-gray-400 text-sm font-inter line-clamp-1">
            {product.shortDescription}
          </p>
          <div className="flex items-center justify-between pt-1">
            <span className="text-white font-cormorant text-lg">
              {isLegendary ? `From ${formatPrice(product.price)}` : formatPrice(product.price)}
            </span>
            {product.inStock && !isLegendary && (
              <span className="text-xs text-green-500 font-inter uppercase tracking-wider">
                Available
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
