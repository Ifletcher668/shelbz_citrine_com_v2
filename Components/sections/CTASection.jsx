import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { Sparkles } from "lucide-react";

/**
 * Final CTA Section - "The Forge Awaits"
 * Dark, heavy final push
 */
export default function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="section bg-parchment-dark relative overflow-hidden"
    >
      {/* Heavy background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-amber-glow/3 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blood-ruby/5 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-black/60 via-transparent to-ink-black/60" />
      </div>

      <div className="section-container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Ornamental Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="mb-space-6"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 metallic-border heavy-shadow bg-vellum">
              <Sparkles className="w-10 h-10 text-aged-gold" />
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-cinzel text-4xl md:text-5xl text-bone-white leading-tight mb-space-5"
          >
            Ready to Create
            <br />
            <span className="text-metallic-gold italic">Your Heirloom?</span>
          </motion.h2>

          {/* Supporting text */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="font-crimson text-lg text-ash-grey mb-space-8 max-w-xl mx-auto leading-relaxed"
          >
            No obligation. Just a conversation about your vision, your style,
            and how we can bring your dream piece to life through the hands of
            master artisans.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-space-6"
          >
            <Link
              href="/consultation"
              className="btn-primary text-lg px-space-8 py-space-5"
            >
              Book Free Consultation
            </Link>
          </motion.div>

          {/* Trust reinforcement */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.8 }}
            className="space-y-space-2"
          >
            <p className="font-spectral text-sm text-charcoal-mist uppercase tracking-wide">
              In-person in Olympia or via Zoom nationwide
            </p>

            {/* Decorative line */}
            <div className="flex items-center justify-center gap-space-3 mt-space-4">
              <div className="w-12 h-px bg-aged-gold/20" />
              <div className="w-1 h-1 bg-aged-gold/40 rotate-45" />
              <div className="w-12 h-px bg-aged-gold/20" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
