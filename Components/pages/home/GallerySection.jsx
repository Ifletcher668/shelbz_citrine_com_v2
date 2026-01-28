import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { X, Gem } from "lucide-react";
import OrnamentalDivider from "@/Components/ornaments/OrnamentalDivider";
import BackgroundTexture from "@/Components/shared/BackgroundTexture";

/**
 * Gallery Section - "Crafted Examples"
 * Dark, heavy gallery with lightbox
 * Literary voice: Souls item descriptions + museum catalog precision
 */
export default function GallerySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedImage, setSelectedImage] = useState(null);

  const galleryItems = [
    {
      id: 1,
      title: "Bezel-Set Black Spinel",
      subtitle: "Ring. Platinum band. 2.5ct octahedral cut.",
      description:
        "Hand-forged in the old way. The setting protects the stone's edges—practical for those who work with their hands. Commission for a surgeon in Seattle.",
    },
    {
      id: 2,
      title: "Cushion-Cut Engagement Ring",
      subtitle: "18kt yellow gold. Kundan technique.",
      description:
        "Pure gold foil burnished between stone and metal. No prongs, no glue. The same method used for Mughal court jewelry. The client's grandmother wore a similar piece in Rajasthan, 1940s.",
    },
    {
      id: 3,
      title: "Raw Black Spinel",
      subtitle: "Uncut. South Asian deposit.",
      description:
        "Before faceting. Mohs hardness 7.5-8, naturally occurring octahedral crystal structure. This stone will be cut to client specifications—size, proportion, and brilliance calibrated for their design.",
    },
    {
      id: 4,
      title: "The Workshop",
      subtitle: "Royal Karkhana workshops.",
      description:
        "Seventh-generational artisan at the bench. Tools inherited from his father. The anvil is older than the building. Metal, fire, and forty years of practice.",
    },
    {
      id: 5,
      title: "Finished Commission",
      subtitle: "Palladium band, 3ct spinel.",
      description:
        "Six weeks from initial sketch to delivery. Client requested hypoallergenic metal (palladium, not white gold with nickel filler). Engraved with Devanagari script on the interior.",
    },
    {
      id: 6,
      title: "Hand-Engraved Detail",
      subtitle: "Granulation technique. Microscope work.",
      description:
        "Tiny gold spheres applied one at a time with tweezers and heat. An ancient Etruscan technique revived by Indian artisans. Takes three days for a band this size. Cannot be replicated by machine.",
    },
  ];

  return (
    <section ref={ref} id="gallery" className="section bg-stone-dark relative">
      <BackgroundTexture variant="gallery" opacity={0.04} />
      <div className="absolute inset-0 bg-gradient-to-b from-void/40 via-transparent to-void/40" />

      <div className="section-container relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12 max-w-4xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl mb-8">
            The Work:
            <br />
            <span className="text-pale-gold italic">
              Examples from the Archive
            </span>
          </h2>
          <p className="text-lg">
            Each piece tells a story—not the marketing kind, but the real kind.
            Client requests, material constraints, artisan solutions. These are
            commissions we've completed, photographed with permission, and
            cataloged like museum specimens.
          </p>
        </motion.div>

        <OrnamentalDivider />

        {/* Gallery Grid - HEAVY SHADOWS */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-space-8 mt-16">
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
              className="group relative aspect-square bg-stone-deeper border border-fog/20 heavy-shadow overflow-hidden transition-all duration-700 hover:border-pale-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-pale-gold"
              aria-label={`View ${item.title}`}
            >
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-8 h-8 border-l border-t border-pale-gold/20 group-hover:border-pale-gold/60 transition-colors duration-700" />
              <div className="absolute top-0 right-0 w-8 h-8 border-r border-t border-pale-gold/20 group-hover:border-pale-gold/60 transition-colors duration-700" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-l border-b border-pale-gold/20 group-hover:border-pale-gold/60 transition-colors duration-700" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-r border-b border-pale-gold/20 group-hover:border-pale-gold/60 transition-colors duration-700" />

              {/* Placeholder Content */}
              <div className="absolute inset-0 p-6 flex items-center justify-center">
                <div className="flex flex-col items-center gap-space-3">
                  <Gem className="w-10 h-10 text-pale-gold/30 group-hover:text-pale-gold/60 group-hover:scale-110 transition-all duration-700" />
                  <span className="font-mono text-xs text-silver-white text-center group-hover:text-pale-gold transition-colors duration-700 uppercase tracking-wide">
                    {item.title}
                  </span>
                  <span className="text-[10px] text-fog/90 text-center italic">
                    {item.subtitle}
                  </span>
                </div>
              </div>

              {/* Heavy hover overlay */}
              <div className="absolute inset-0 bg-pale-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </motion.button>
          ))}
        </div>

        {/* Bottom context */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mx-auto mt-16 text-center"
        >
          <p className="text-sm text-fog italic">
            "We photograph every commission from multiple angles before
            shipping. These images become part of your ring's provenance—a
            record of its creation that you can pass down with the piece
            itself."
          </p>
        </motion.div>
      </div>

      {/* Lightbox Modal - DARK with expanded content */}
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
              className="absolute top-6 right-6 p-3 text-stone-grey hover:text-silver-white transition-colors duration-500 border- border-fog/20 bg-stone-deeper"
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
              <div className="bg-stone-dark border-2 border-fog/20 heavy-shadow relative">
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-pale-gold/40" />
                <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-pale-gold/40" />
                <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-pale-gold/40" />
                <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-pale-gold/40" />

                {/* Image placeholder */}
                <div className="aspect-square p-16 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-space-8">
                    <Gem className="w-20 h-20 text-pale-gold/40" />
                    <p className="text-sm text-fog/90 italic">
                      Full resolution image placeholder
                    </p>
                  </div>
                </div>

                {/* Expanded caption - Souls-style flavor text */}
                <div className="border-t border-fog/20 p-10 bg-stone-deeper/50">
                  <div className="flex flex-col gap-space-2">
                    <h3 className="font-mono text-xl uppercase tracking-wide">
                      {selectedImage.title}
                    </h3>
                    <p className="text-sm text-pale-gold/80 italic">
                      {selectedImage.subtitle}
                    </p>
                  </div>
                  <p className="text-md mt-6">{selectedImage.description}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
