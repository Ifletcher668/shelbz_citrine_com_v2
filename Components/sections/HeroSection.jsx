import { motion } from "framer-motion";
import { ChevronDown, Sparkles } from "lucide-react";
import Link from "next/link";
import { SimpleDivider } from "@/Components/ornaments/OrnamentalDivider";

/**
 * Hero Section - "Grimoire Opening"
 * Above-the-fold content with dark academia aesthetic
 * Slow, mystical animations
 */
export default function HeroSection() {
  const scrollToGallery = () => {
    document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="section relative min-h-screen flex items-center justify-center overflow-hidden bg-void">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-void/60 to-void" />
      </div>

      <div className="relative z-10 section-container text-center">
        {/* Main Headline - Illuminated manuscript style */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="font-garamond text-6xl text-silver-white leading-tight mb-12 font-light"
        >
          Custom Black Spinel
          <br className="hidden md:block" />
          <span className="text-metallic-cold">Engagement Rings</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="font-garamond text-lg md:text-xl text-stone-grey max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Crafted by seventh-generation Indian artisans.
          <br className="hidden md:block" />
          <span className="text-fog/80">
            Ethical sourcing. Multigenerational craft. Your vision, realized.
          </span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16"
        >
          <Link href="/consultation" className="btn-primary">
            Book Free Consultation
          </Link>
          <button onClick={scrollToGallery} className="btn-secondary">
            View Our Craft
          </button>
        </motion.div>

        <SimpleDivider className="mb-12" />

        {/* Hero Image Placeholder - Gallery style */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-12 max-w-4xl mx-auto"
        >
          <div className="aspect-[16/9] bg-stone-dark border border-fog/10 heavy-shadow relative overflow-hidden">
            {/* Minimal corner accents */}
            <div className="absolute top-0 left-0 w-12 h-12 border-l border-t border-pale-gold/20" />
            <div className="absolute top-0 right-0 w-12 h-12 border-r border-t border-pale-gold/20" />
            <div className="absolute bottom-0 left-0 w-12 h-12 border-l border-b border-pale-gold/20" />
            <div className="absolute bottom-0 right-0 w-12 h-12 border-r border-b border-pale-gold/20" />

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
              <Sparkles className="w-12 h-12 text-pale-gold/20 mb-4" />
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-fog/70">
                Hero Image Placeholder
              </p>
              <p className="font-garamond text-xs text-fog/50 mt-2">
                Black Spinel Ring — Macro Shot
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-fog/50">
            Scroll
          </span>
          <ChevronDown className="w-4 h-4 text-pale-gold/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}
