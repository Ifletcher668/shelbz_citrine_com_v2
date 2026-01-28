import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { Calendar, Gem, PenTool, Hammer, Package } from "lucide-react";
import OrnamentalDivider from "@/Components/ornaments/OrnamentalDivider";

/**
 * Process Section - "The Artisan's Journey"
 * Simplified highlights - detail lives on consultation page
 */
export default function ProcessSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const steps = [
    {
      icon: Calendar,
      title: "Consultation",
      description: "45-60 minutes. In-person or Zoom.",
    },
    {
      icon: Gem,
      title: "Select Stone",
      description: "Untreated black spinel. India & Thailand.",
    },
    {
      icon: PenTool,
      title: "Design",
      description: "Artisan sketches in real-time. You collaborate.",
    },
    {
      icon: Hammer,
      title: "Forge",
      description: "Hand-forged in India & Thailand. 4-8 weeks.",
    },
    {
      icon: Package,
      title: "Deliver",
      description: "Approval photos first. Then insured shipping.",
    },
  ];

  return (
    <section ref={ref} className="section bg-void relative overflow-hidden">
      <div className="section-container relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12 max-w-4xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl mb-6">The Process</h2>
          <p className="text-lg">Five steps from consultation to delivery.</p>
        </motion.div>

        <OrnamentalDivider />

        {/* Timeline - Desktop: Horizontal Line */}
        <div className="relative max-w-6xl mx-auto mt-16">
          <div className="hidden md:block absolute top-12 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pale-gold/30 to-transparent" />

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-space-6 gap-20 md:gap-space-6">
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
                  className="relative"
                >
                  <div className="flex flex-row md:flex-col items-start md:items-center gap-space-6 md:gap-0">
                    {/* Step Icon Container - METALLIC */}
                    <div className="relative z-10 flex-shrink-0">
                      <div className="w-20 h-20 bg-stone-deeper border border-fog/20 heavy-shadow group hover:border-pale-gold transition-all duration-700 flex items-center justify-center">
                        <Icon className="w-7 h-7 text-pale-gold group-hover:scale-110 transition-transform duration-700" />
                      </div>

                      {/* Step number badge - DARK */}
                      <div className="absolute -top-2 -right-2 w-7 h-7 bg-deep-body border border-pale-gold text-silver-white text-xs font-mono font-medium shadow-lg flex items-center justify-center">
                        {index + 1}
                      </div>
                    </div>

                    {/* Mobile: Vertical connector */}
                    {index < steps.length - 1 && (
                      <div className="md:hidden absolute left-10 top-20 w-px h-full bg-pale-gold/20" />
                    )}

                    {/* Step Content - Sparse */}
                    <div className="flex flex-col gap-space-2 md:mt-8 md:text-center flex-1">
                      <h3 className="font-mono text-md font-medium uppercase tracking-wide">
                        {step.title}
                      </h3>
                      <p className="text-sm">{step.description}</p>
                    </div>
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
          className="text-center mt-16"
        >
          <Link href="/consultation" className="btn-primary">
            Learn More & Book
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
