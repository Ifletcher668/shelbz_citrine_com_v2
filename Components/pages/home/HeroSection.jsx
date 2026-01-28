import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { SimpleDivider } from "@/Components/ornaments/OrnamentalDivider";
import TooltipHelp from "@/Components/shared/TooltipHelp";
import { Section, Container } from "@/Components/layout/Section";

/**
 * Hero Section - "Grimoire Opening"
 * Above-the-fold content with dark academia aesthetic
 * Literary voice: Compelling headline, accessible subtext
 */
export default function HeroSection() {
  const scrollToGallery = () => {
    document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Section variant="hero">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-void/60 to-void" />
      </div>

      <Container className="relative z-10 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.2,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="mb-12"
        >
          Heirloom Jewelry.
          <br className="hidden md:block" />
          <span className="text-metallic-cold">Multigenerational Craft.</span>
        </motion.h1>

        {/* Subheadline - Lighter, more accessible */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="max-w-4xl mx-auto mb-10"
        >
          <div className="flex flex-col gap-space-4">
            <p className="text-xl md:text-xl">
              For seven generations, artisans in India and Thailand have been
              passing down the knowledge of jewelcrafting.
            </p>
            <p>
              {" "}
              Many gems are forged with the same techniques and passion. But our
              crown jewel? Black Spinel: Harder than most gemstones.{" "}
              <TooltipHelp tooltip="Black spinel ranks 8 on the Mohs hardness scale (diamonds are 10). But hardness measures scratch resistance, not durability. Spinel's crystal structure makes it more resistant to breaking and chipping than diamonds in daily wear.">
                And far more durable than diamonds for daily wear.
              </TooltipHelp>
            </p>
            <p>
              Each piece is hand-forged using techniques refined across
              centuries—methods that prioritize durability over speed, integrity
              over volume. Above all, we prioritize the quality of the materials
              and craftsmanship.
            </p>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-16"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-space-6">
            <Link href="/consultation" className="btn-primary">
              Book a Free Consultation
            </Link>
            <button onClick={scrollToGallery} className="btn-secondary">
              View the Work
            </button>
          </div>
        </motion.div>

        <SimpleDivider className="mb-12" />

        {/* Subtle context - not a lecture */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="max-w-2xl mx-auto mb-12"
        >
          <p className="text-sm text-stone-grey/90 italic">
            "In medieval lapidaries, black spinel was prescribed against
            nightmares—a talisman stone. Whether you believe in that or not,
            there's something to wearing opacity in a world that demands
            transparency."
          </p>
        </motion.div>

        {/* Hero Image Placeholder - Gallery style */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-12 max-w-4xl mx-auto"
        >
          <div className="aspect-[16/9] bg-stone-dark border border-stone-grey/10 heavy-shadow relative overflow-hidden">
            {/* Minimal corner accents */}
            <div className="absolute top-0 left-0 w-12 h-12 border-l border-t border-pale-gold/20" />
            <div className="absolute top-0 right-0 w-12 h-12 border-r border-t border-pale-gold/20" />
            <div className="absolute bottom-0 left-0 w-12 h-12 border-l border-b border-pale-gold/20" />
            <div className="absolute bottom-0 right-0 w-12 h-12 border-r border-b border-pale-gold/20" />

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
              <Sparkles className="w-12 h-12 text-pale-gold/20 mb-4" />
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone-grey/90">
                Hero Image Placeholder
              </p>
              <p className="text-xs text-stone-grey/70 mt-2">
                Black Spinel Ring — Macro Shot
              </p>
            </div>
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}
