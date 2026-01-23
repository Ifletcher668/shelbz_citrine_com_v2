import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { X, Gem } from "lucide-react";
import { SimpleDivider } from "@/Components/ornaments/OrnamentalDivider";

/**
 * Gallery Section - "Crafted Examples"
 * Dark, heavy gallery with lightbox
 */
export default function GallerySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedImage, setSelectedImage] = useState(null);

  const galleryItems = [
    { id: 1, title: "Black Spinel Solitaire", subtitle: "Platinum Setting" },
    { id: 2, title: "Cushion Cut Ring", subtitle: "18kt Gold Band" },
    { id: 3, title: "Gem Selection", subtitle: "Uncut Black Spinel" },
    { id: 4, title: "Artisan at Work", subtitle: "Royal Karkhana" },
    { id: 5, title: "Finished Piece", subtitle: "Custom Commission" },
    { id: 6, title: "Detail Shot", subtitle: "Hand-Engraved Band" },
  ];

  return (
    <section
      ref={ref}
      id="gallery"
      className="section bg-parchment-dark relative"
    >
      {/* Texture overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink-black/40 via-transparent to-ink-black/40" />

      <div className="section-container relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-space-6"
        >
          <h2 className="font-cinzel text-4xl md:text-5xl text-bone-white leading-tight mb-space-4">
            Examples of Our Craft
          </h2>
          <p className="font-crimson text-lg text-ash-grey max-w-2xl mx-auto">
            Each piece is a unique collaboration between you and our artisans.
          </p>
        </motion.div>

        <SimpleDivider />

        {/* Gallery Grid - HEAVY SHADOWS */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-space-5 mt-space-8">
          {galleryItems.map((item, index) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{
                duration: 0.7,
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              onClick={() => setSelectedImage(item)}
              className="group relative aspect-square bg-vellum metallic-border heavy-shadow overflow-hidden transition-all duration-700 hover:border-aged-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-aged-gold"
              aria-label={`View ${item.title}`}
            >
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-8 h-8 border-l border-t border-aged-gold/20 group-hover:border-aged-gold/60 transition-colors duration-700" />
              <div className="absolute top-0 right-0 w-8 h-8 border-r border-t border-aged-gold/20 group-hover:border-aged-gold/60 transition-colors duration-700" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-l border-b border-aged-gold/20 group-hover:border-aged-gold/60 transition-colors duration-700" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-r border-b border-aged-gold/20 group-hover:border-aged-gold/60 transition-colors duration-700" />

              {/* Placeholder Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-space-4">
                <Gem className="w-10 h-10 text-aged-gold/30 mb-space-3 group-hover:text-aged-gold/60 group-hover:scale-110 transition-all duration-700" />
                <span className="font-spectral text-sm text-charcoal-mist text-center group-hover:text-ash-grey transition-colors duration-700 uppercase tracking-wide">
                  {item.title}
                </span>
                <span className="font-crimson text-xs text-sepia-shadow text-center mt-space-1 italic">
                  {item.subtitle}
                </span>
              </div>

              {/* Heavy hover overlay */}
              <div className="absolute inset-0 bg-aged-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Lightbox Modal - DARK */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-space-4 bg-ink-black/95 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-space-4 right-space-4 p-space-3 text-ash-grey hover:text-bone-white transition-colors duration-500 metallic-border bg-vellum"
              aria-label="Close lightbox"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Image Container */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-4xl w-full"
            >
              <div className="aspect-square bg-parchment-dark metallic-border heavy-shadow flex flex-col items-center justify-center p-space-8 relative">
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-aged-gold/40" />
                <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-aged-gold/40" />
                <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-aged-gold/40" />
                <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-aged-gold/40" />

                <Gem className="w-20 h-20 text-aged-gold/40 mb-space-5" />
                <h3 className="font-cinzel text-3xl text-bone-white mb-space-2">
                  {selectedImage.title}
                </h3>
                <p className="font-crimson text-base text-ash-grey">
                  {selectedImage.subtitle}
                </p>
                <p className="font-crimson text-sm text-sepia-shadow mt-space-4 italic">
                  Full resolution image placeholder
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
