import { motion } from "framer-motion";
import { ChevronDown, Sparkles } from "lucide-react";
import Link from "next/link";

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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background - Candlelit darkness */}
      <div className="absolute inset-0 bg-ink-black">
        {/* Vignette overlay */}
        <div className="absolute inset-0 bg-vignette" />

        {/* Parchment texture */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Subtle amber glow - DULLER for more tension */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-glow/3 rounded-full blur-3xl" />

        {/* Additional dark overlay for weight */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-ink-black/40 to-ink-black" />
      </div>

      <div className="relative z-10 section-container text-center pt-24">
        {/* Main Headline - Illuminated manuscript style */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="font-cinzel text-6xl text-bone-white leading-tight mb-space-6 mt-space-6"
        >
          Custom Black Spinel
          <br className="hidden md:block" />
          <span className="text-metallic-gold">Engagement Rings</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="font-crimson text-lg md:text-xl text-ash-grey max-w-2xl mx-auto mb-space-5 leading-relaxed"
        >
          Crafted by seventh-generation Indian artisans.
          <br className="hidden md:block" />
          <span className="text-charcoal-mist italic">
            Ethical sourcing. Multigenerational craft. Your vision, realized.
          </span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-space-4 mb-space-10"
        >
          <Link href="/consultation" className="btn-primary">
            Book Free Consultation
          </Link>
          <button onClick={scrollToGallery} className="btn-secondary">
            View Our Craft
          </button>
        </motion.div>

        {/* Decorative divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1.2, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-xs mx-auto mb-space-8"
        >
          <div className="h-px bg-gradient-to-r from-transparent via-aged-gold to-transparent relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-aged-gold rotate-45" />
          </div>
        </motion.div>

        {/* Hero Image Placeholder - Parchment style */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, delay: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-space-8 max-w-4xl mx-auto"
        >
          <div className="aspect-[16/9] bg-parchment-dark metallic-border heavy-shadow relative overflow-hidden">
            {/* Corner flourishes - HEAVIER */}
            <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-aged-gold/30" />
            <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-aged-gold/30" />
            <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-aged-gold/30" />
            <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-aged-gold/30" />

            {/* Dark inner shadow for depth */}
            <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.8)]" />

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-space-6">
              <Sparkles className="w-16 h-16 text-aged-gold/30 mb-space-4" />
              <p className="font-spectral text-sm uppercase tracking-wider text-charcoal-mist">
                Hero Image Placeholder
              </p>
              <p className="font-crimson text-xs text-sepia-shadow italic mt-space-2">
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
        transition={{ duration: 1, delay: 1.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-space-2"
        >
          <span className="font-spectral text-xs uppercase tracking-wider text-sepia-shadow">
            Scroll
          </span>
          <ChevronDown className="w-5 h-5 text-aged-gold/50" />
        </motion.div>
      </motion.div>
    </section>
  );
}
