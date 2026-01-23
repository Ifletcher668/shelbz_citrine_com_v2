import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { X, Gem } from "lucide-react";
import OrnamentalDivider from "@/Components/ornaments/OrnamentalDivider";
import BackgroundTexture from "@/Components/shared/BackgroundTexture";

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
    <section ref={ref} id="gallery" className="section bg-stone-dark relative">
      <BackgroundTexture variant="stone" opacity={0.03} />
      <div className="absolute inset-0 bg-gradient-to-b from-void/40 via-transparent to-void/40" />

      <div className="section-container relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <h2 className="font-garamond text-4xl md:text-5xl text-silver-white leading-tight mb-6">
            Examples of Our Craft
          </h2>
          <p className="font-garamond text-lg text-stone-grey max-w-2xl mx-auto">
            Each piece is a unique collaboration between you and our artisans.
          </p>
        </motion.div>

        <OrnamentalDivider />

        {/* Gallery Grid - HEAVY SHADOWS */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mt-16">
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
              className="group relative aspect-square bg-stone-deeper metallic-border heavy-shadow overflow-hidden transition-all duration-700 hover:border-pale-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-aged-gold"
              aria-label={`View ${item.title}`}
            >
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-8 h-8 border-l border-t border-pale-gold/20 group-hover:border-pale-gold/60 transition-colors duration-700" />
              <div className="absolute top-0 right-0 w-8 h-8 border-r border-t border-pale-gold/20 group-hover:border-pale-gold/60 transition-colors duration-700" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-l border-b border-pale-gold/20 group-hover:border-pale-gold/60 transition-colors duration-700" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-r border-b border-pale-gold/20 group-hover:border-pale-gold/60 transition-colors duration-700" />

              {/* Placeholder Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                <Gem className="w-10 h-10 text-pale-gold/30 mb-3 group-hover:text-pale-gold/60 group-hover:scale-110 transition-all duration-700" />
                <span className="font-mono text-sm text-fog text-center group-hover:text-stone-grey transition-colors duration-700 uppercase tracking-wide">
                  {item.title}
                </span>
                <span className="font-garamond text-xs text-fog/70 text-center mt-1 italic">
                  {item.subtitle}
                </span>
              </div>

              {/* Heavy hover overlay */}
              <div className="absolute inset-0 bg-pale-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
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
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-void/95 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 p-3 text-stone-grey hover:text-silver-white transition-colors duration-500 metallic-border bg-stone-deeper"
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
              <div className="aspect-square bg-stone-dark metallic-border heavy-shadow flex flex-col items-center justify-center p-16 relative">
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-pale-gold/40" />
                <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-pale-gold/40" />
                <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-pale-gold/40" />
                <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-pale-gold/40" />

                <Gem className="w-20 h-20 text-pale-gold/40 mb-8" />
                <h3 className="font-garamond text-3xl text-silver-white mb-2">
                  {selectedImage.title}
                </h3>
                <p className="font-garamond text-base text-stone-grey">
                  {selectedImage.subtitle}
                </p>
                <p className="font-garamond text-sm text-fog/70 mt-6 italic">
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
