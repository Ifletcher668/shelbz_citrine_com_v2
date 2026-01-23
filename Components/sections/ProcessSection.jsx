import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { Calendar, Gem, PenTool, Hammer, Package } from "lucide-react";
import OrnamentalDivider from "@/Components/ornaments/OrnamentalDivider";

/**
 * Process Section - "The Artisan's Journey"
 * 5-step timeline with heavy metal aesthetic
 */
export default function ProcessSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const steps = [
    {
      icon: Calendar,
      title: "Book Consultation",
      description: "In-person (Olympia) or via Zoom",
    },
    {
      icon: Gem,
      title: "Select Your Gem",
      description: "See black spinel in person or virtually",
    },
    {
      icon: PenTool,
      title: "Design Together",
      description: "Share photos and your unique vision",
    },
    {
      icon: Hammer,
      title: "Artisans Craft",
      description: "4-8 weeks at Royal Karkhana in India",
    },
    {
      icon: Package,
      title: "Delivered to You",
      description: "Insured shipping with approval photos first",
    },
  ];

  return (
    <section
      ref={ref}
      className="section bg-ink-black relative overflow-hidden"
    >
      {/* Heavy vignette */}
      <div className="absolute inset-0 bg-vignette" />

      <div className="section-container relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-space-6"
        >
          <h2 className="font-cinzel text-4xl md:text-5xl text-bone-white leading-tight mb-space-4">
            How It Works:
            <br />
            <span className="text-metallic-gold italic">
              From Vision to Heirloom
            </span>
          </h2>
          <p className="font-crimson text-lg text-ash-grey max-w-2xl mx-auto">
            The ancient craft of jewelry-making, adapted for modern
            collaboration.
          </p>
        </motion.div>

        <OrnamentalDivider />

        {/* Timeline - Desktop: Horizontal Line */}
        <div className="relative max-w-6xl mx-auto mt-space-10">
          <div className="hidden md:block absolute top-12 left-0 right-0 h-px bg-gradient-to-r from-transparent via-aged-gold/30 to-transparent" />

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-space-8 md:gap-space-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 60 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 0.9,
                    delay: index * 0.15,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="relative flex md:flex-col items-start md:items-center gap-space-4 md:gap-0"
                >
                  {/* Step Icon Container - METALLIC */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className="w-20 h-20 bg-vellum metallic-border heavy-shadow flex items-center justify-center group hover:border-aged-gold transition-all duration-700">
                      <Icon className="w-7 h-7 text-aged-gold group-hover:scale-110 transition-transform duration-700" />
                    </div>

                    {/* Step number badge - DARK */}
                    <span className="absolute -top-2 -right-2 w-7 h-7 bg-blood-ruby border border-aged-gold text-bone-white text-xs font-spectral flex items-center justify-center font-medium shadow-lg">
                      {index + 1}
                    </span>
                  </div>

                  {/* Mobile: Vertical connector */}
                  {index < steps.length - 1 && (
                    <div className="md:hidden absolute left-10 top-20 w-px h-16 bg-aged-gold/20" />
                  )}

                  {/* Step Content */}
                  <div className="md:mt-space-5 md:text-center flex-1">
                    <h3 className="font-spectral text-base text-bone-white font-medium mb-space-2 uppercase tracking-wide">
                      {step.title}
                    </h3>
                    <p className="font-crimson text-sm text-charcoal-mist leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mt-space-10"
        >
          <Link href="/consultation" className="btn-primary">
            Start Your Journey
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
