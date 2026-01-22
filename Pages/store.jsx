import { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Filter, X, ChevronDown } from 'lucide-react';
import Navigation from '@/Components/shared/Navigation';
import ProductCard from '@/Components/shared/ProductCard';
import { products, collections, categories } from '@/data/products';

export default function StorePage() {
  const router = useRouter();
  const { collection: queryCollection, category: queryCategory } = router.query;

  const [selectedCollection, setSelectedCollection] = useState(queryCollection || 'all');
  const [selectedCategory, setSelectedCategory] = useState(queryCategory || 'all');
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);

  // Update state when query params change
  useMemo(() => {
    if (queryCollection) setSelectedCollection(queryCollection);
    if (queryCategory) setSelectedCategory(queryCategory);
  }, [queryCollection, queryCategory]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by collection
    if (selectedCollection !== 'all') {
      result = result.filter(p => p.collection === selectedCollection);
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return result;
  }, [selectedCollection, selectedCategory, sortBy]);

  const clearFilters = () => {
    setSelectedCollection('all');
    setSelectedCategory('all');
    router.push('/store', undefined, { shallow: true });
  };

  const hasActiveFilters = selectedCollection !== 'all' || selectedCategory !== 'all';

  return (
    <>
      <Head>
        <title>Collections | DARKLUX - Heritage Dark Luxury</title>
        <meta name="description" content="Explore our curated collections of heritage-crafted dark luxury jewelry. From the Noble Collection to Royal Commissions, find pieces worthy of legend." />
      </Head>

      <Navigation />

      <main className="min-h-screen bg-[#0a0a0a] pt-20">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl lg:text-6xl font-cormorant font-semibold text-white mb-6"
            >
              {selectedCollection !== 'all'
                ? collections[selectedCollection]?.name
                : 'All Collections'}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-gray-400 font-inter max-w-2xl mx-auto"
            >
              {selectedCollection !== 'all'
                ? collections[selectedCollection]?.description
                : 'Heritage craftsmanship meets dark romanticism. Each piece is forged by artisans whose families have served royal courts for generations.'}
            </motion.p>
          </div>
        </section>

        {/* Collection Tabs */}
        <section className="border-y border-gray-800 bg-[#0a0a0a]/50 sticky top-[72px] z-40">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between py-4 overflow-x-auto">
              <div className="flex items-center space-x-1 md:space-x-2">
                <button
                  onClick={() => {
                    setSelectedCollection('all');
                    router.push('/store', undefined, { shallow: true });
                  }}
                  className={`px-4 py-2 text-sm font-inter uppercase tracking-wider whitespace-nowrap transition-colors ${
                    selectedCollection === 'all'
                      ? 'text-white bg-gray-800'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  All
                </button>
                {Object.values(collections).map((col) => (
                  <button
                    key={col.id}
                    onClick={() => {
                      setSelectedCollection(col.id);
                      router.push(`/store?collection=${col.id}`, undefined, { shallow: true });
                    }}
                    className={`px-4 py-2 text-sm font-inter uppercase tracking-wider whitespace-nowrap transition-colors ${
                      selectedCollection === col.id
                        ? 'text-white bg-gray-800'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {col.name.replace('The ', '').replace(' Collection', '').replace('s', '')}
                  </button>
                ))}
              </div>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden flex items-center space-x-2 px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span className="text-sm font-inter uppercase tracking-wider">Filter</span>
              </button>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside
              className={`${
                showFilters ? 'block' : 'hidden'
              } md:block w-full md:w-64 flex-shrink-0 space-y-8`}
            >
              {/* Category Filter */}
              <div>
                <h3 className="text-white font-cormorant text-lg mb-4">Category</h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`block w-full text-left px-3 py-2 text-sm font-inter transition-colors ${
                        selectedCategory === cat.id
                          ? 'text-white bg-gray-800'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Info */}
              {selectedCollection !== 'all' && (
                <div>
                  <h3 className="text-white font-cormorant text-lg mb-4">Price Range</h3>
                  <p className="text-gray-400 text-sm font-inter">
                    {collections[selectedCollection]?.priceRange}
                  </p>
                </div>
              )}

              {/* Clear Filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center space-x-2 text-[#8b0000] hover:text-red-400 text-sm font-inter uppercase tracking-wider transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>Clear Filters</span>
                </button>
              )}
            </aside>

            {/* Product Grid */}
            <div className="flex-1">
              {/* Sort & Results Count */}
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-800">
                <p className="text-gray-400 text-sm font-inter">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'piece' : 'pieces'}
                </p>

                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-transparent text-gray-400 text-sm font-inter uppercase tracking-wider pr-8 cursor-pointer hover:text-white transition-colors focus:outline-none"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Name</option>
                  </select>
                  <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
              </div>

              {/* Products */}
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProducts.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-gray-400 font-inter mb-4">No pieces match your selection</p>
                  <button
                    onClick={clearFilters}
                    className="text-[#8b0000] hover:text-red-400 text-sm font-inter uppercase tracking-wider transition-colors"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Legendary CTA */}
        {selectedCollection !== 'legendary' && (
          <section className="border-t border-gray-800 bg-gradient-to-b from-[#0a0a0a] to-[#1a0a0a]">
            <div className="max-w-4xl mx-auto px-6 py-16 text-center">
              <h2 className="text-3xl md:text-4xl font-cormorant font-semibold text-white mb-4">
                Seeking Something Legendary?
              </h2>
              <p className="text-gray-400 font-inter mb-8 max-w-2xl mx-auto">
                Our Mythic Forge creates one-of-a-kind artifacts through private consultation.
                Gem-encrusted relics, jeweled daggers, and pieces worthy of a campaign finale.
              </p>
              <Link
                href="/store?collection=legendary"
                className="inline-block px-8 py-4 bg-[#8b0000] text-white text-sm font-inter uppercase tracking-wider hover:bg-[#6b0000] transition-colors"
              >
                Explore Legendary Pieces
              </Link>
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
              <Link href="/#provenance" className="text-gray-400 hover:text-white text-sm font-inter transition-colors">
                Our Story
              </Link>
              <Link href="/#waitlist" className="text-gray-400 hover:text-white text-sm font-inter transition-colors">
                Waitlist
              </Link>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
