import { useRef } from "react";
import BackgroundTexture from "@/Components/shared/BackgroundTexture";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { Sparkles } from "lucide-react";

/**
 * Final CTA Section - "The Invitation"
 * Dark, heavy final push without desperation
 * Literary voice: Direct invitation, no manipulation
 */
export default function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="section bg-stone-dark relative overflow-hidden"
    >
      <BackgroundTexture variant="rune" opacity={0.03} />

      {/* Subtle background glow */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-pale-gold/2 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-void/40 via-transparent to-void/40" />
      </div>

      <div className="section-container relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex flex-col gap-12">
            {/* Ornamental Icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-flex items-center justify-center w-20 h-20 border border-fog/20 heavy-shadow bg-stone-deeper">
                <Sparkles className="w-10 h-10 text-pale-gold" />
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl md:text-5xl"
            >
              Ready to Commission
              <br />
              <span className="text-pale-gold italic">
                Something Built to Last?
              </span>
            </motion.h2>

            {/* Supporting text - expanded */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-2xl mx-auto"
            >
              <div className="flex flex-col gap-8">
                <p className="text-lg">
                  No obligation. No sales pitch. Just a conversation about what
                  you want, what's possible, and whether working with
                  seventh-generational artisans 8,000 miles away makes sense for
                  your specific vision.
                </p>
                <p className="text-md text-fog">
                  We'll discuss budget, timeline, metal options, stone
                  selection, and design constraints (some ideas look great on
                  Pinterest but fail in practice—we'll tell you why). If at the
                  end you decide to go elsewhere, we'll shake hands and wish you
                  well. If you want to move forward, we'll start sketching.
                </p>
                <p className="text-sm text-fog/80 italic">
                  Consultations last 45-60 minutes. In-person at our Olympia, WA
                  studio or via Zoom. Bring photos of rings you love (and hate).
                  We'll photograph your hands if designing for fit. No
                  commitment required.
                </p>
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link href="/consultation" className="btn-primary text-lg">
                Book a Free Consultation
              </Link>
            </motion.div>

            {/* Trust reinforcement with context */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.8 }}
            >
              <div className="flex flex-col gap-8">
                <p className="font-mono text-xs text-fog uppercase tracking-[0.2em]">
                  In-person in Olympia, WA • Zoom nationwide
                </p>

                {/* Additional trust signals */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto pt-12 border-t border-fog/10">
                  <div className="flex flex-col gap-6">
                    <p className="font-mono text-[10px] text-pale-gold/70 uppercase tracking-wider">
                      Direct Partnership
                    </p>
                    <p className="text-sm">Royal Karkhana • India & Thailand</p>
                  </div>
                  <div className="flex flex-col gap-6">
                    <p className="font-mono text-[10px] text-pale-gold/70 uppercase tracking-wider">
                      Gemstone Sourcing
                    </p>
                    <p className="text-sm">India & Thailand • Untreated</p>
                  </div>
                  <div className="flex flex-col gap-6">
                    <p className="font-mono text-[10px] text-pale-gold/70 uppercase tracking-wider">
                      Timeline
                    </p>
                    <p className="text-sm">
                      4-8 weeks • Progress photos included
                    </p>
                  </div>
                </div>

                {/* Decorative line */}
                <div className="flex items-center justify-center gap-4">
                  <div className="w-12 h-px bg-pale-gold/20" />
                  <div className="w-1 h-1 bg-pale-gold/40 rotate-45" />
                  <div className="w-12 h-px bg-pale-gold/20" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
