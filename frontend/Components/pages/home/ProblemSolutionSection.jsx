import { motion } from "framer-motion";
import BackgroundTexture from "@/Components/shared/BackgroundTexture";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { X, Check } from "lucide-react";
import OrnamentalDivider from "@/Components/ornaments/OrnamentalDivider";

/**
 * Problem/Solution Section - "The Industry vs. The Craft"
 * Heavy metal aesthetic with visual tension
 * Literary voice: Robbins playful + Popova educational
 */
export default function ProblemSolutionSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const problems = [
    {
      title: "Quality casting with limited hand-finishing",
      description:
        "A well-made cast piece can be beautiful. But the metal has a different grain structure than forged work. The detail plateaus where the mold ended. Subtle, but permanent.",
    },
    {
      title: "Gemstones enhanced to meet market expectations",
      description:
        "Most sapphires are heat-treated to deepen color. It's industry standard, often disclosed in fine print. The stone is still 'natural'—but its story stops at the treatment facility, not the mine.",
    },
    {
      title: "Design refinement within established frameworks",
      description:
        "Many jewelers work from proven templates, adjusting proportions and details to your preferences. Efficient, lower-risk. But the creative vocabulary is already chosen.",
    },
    {
      title: "Supply chains with documentation gaps",
      description:
        "Certificates verify endpoints: this gold was refined here, this stone graded there. The middle—the actual mine, the actual hands—often remains abstract.",
    },
  ];

  const solutions = [
    {
      title: "Metal shaped by hammer and stake, grain by grain",
      description:
        "Our smiths learned kundan setting from their mothers, who learned from theirs. They can feel when the metal begins to work-harden. They anneal by eye, not timer. The granulation patterns come from memory, not templates.",
    },
    {
      title:
        "Stones selected for what the earth made, not what furnaces improved",
      description:
        "Untreated sapphires from artisanal mines in South Asia, with silk inclusions that catch light like star maps. Rubies whose color shifts between candlelight and noon sun. Our gemmologist has spent three decades learning to read these signatures before enhancement erases them.",
    },
    {
      title: "Design conversations that begin with questions, not catalogs",
      description:
        "We ask about the hand that will wear it—does it gesture often? Rest on a desk? Hold a pen, a scalpel, a steering wheel? The designer sketches while you speak, adjusting proportions in real-time. By the end, the piece has a logic that belongs to your life.",
    },
    {
      title: "Provenance traced through decades-long relationships",
      description:
        "We source directly from artisanal mining families across India and Thailand—relationships built over thirty years, not contracts signed last quarter. The gold is often recycled from temple donations. This level of access is rare because it requires sustained trust.",
    },
  ];

  return (
    <section ref={ref} className="section bg-stone-dark relative">
      {/* Stone texture for gritty feel */}
      <BackgroundTexture variant="stone" opacity={0.05} />
      {/* Dark overlay for weight */}
      <div className="absolute inset-0 bg-gradient-to-b from-void via-transparent to-void opacity-60" />

      <div className="section-container relative z-10">
        <div className="flex flex-col gap-12">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="flex flex-col gap-8">
              <h2 className="text-4xl md:text-5xl">
                Understanding
                <br className="hidden md:block" />
                <span className="text-pale-gold italic">True Quality</span>
              </h2>
              <p className="text-lg">
                When you understand the difference between mass production and
                artisan craft, between treated and untreated gemstones, between
                template selection and true bespoke design, you begin to see
                what makes heirloom jewelry worthy of being passed down through
                generations.
              </p>
            </div>
          </motion.div>

          <OrnamentalDivider />

          {/* Comparison Grid - HEAVY BORDERS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Problems Column - DARK & OPPRESSIVE */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="bg-stone-deeper tension-border heavy-shadow p-8 relative"
            >
              {/* Dark corner accent */}
              <div className="absolute top-0 left-0 w-12 h-12 border-l-2 border-t-2 border-steel-blue/40" />

              <h3 className="font-mono text-sm uppercase tracking-wider text-fog/70 mb-8 text-center">
                The Standard
              </h3>

              <ul className="flex flex-col gap-8">
                {problems.map((problem, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{
                      duration: 0.7,
                      delay: 0.5 + index * 0.1,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <div className="flex flex-col gap-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-6 h-6 bg-void border border-deep-body mt-0.5 flex items-center justify-center">
                          <X className="w-4 h-4 text-deep-body" />
                        </div>
                        <span className="text-md font-medium leading-none">
                          {problem.title}
                        </span>
                      </div>
                      <p className="text-sm text-fog/80 pl-9">
                        {problem.description}
                      </p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Solutions Column - METALLIC HIGHLIGHT */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="bg-stone-dark border border-fog/20 heavy-shadow p-8 relative"
            >
              {/* Gold corner accent */}
              <div className="absolute top-0 right-0 w-12 h-12 border-r-2 border-t-2 border-pale-gold/40" />

              <h3 className="font-mono text-sm uppercase tracking-wider text-pale-gold mb-8 text-center">
                Our Alternative
              </h3>

              <ul className="flex flex-col gap-8">
                {solutions.map((solution, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{
                      duration: 0.7,
                      delay: 0.5 + index * 0.1,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <div className="flex flex-col gap-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-6 h-6 bg-deep-body/20 border border-pale-gold mt-0.5 flex items-center justify-center">
                          <Check className="w-4 h-4 text-pale-gold" />
                        </div>
                        <span className="text-md text-silver-white font-medium leading-none">
                          {solution.title}
                        </span>
                      </div>
                      <p className="text-sm pl-9">{solution.description}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Bottom context */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl mx-auto text-center"
          >
            <p className="text-sm text-fog italic">
              The word "bespoke" derives from 16th-century Savile Row tailoring.
              A client would select fabric, and the tailor would mark it as
              "spoken for"—claimed before shears touched wool. The process
              involved measurements, hand-cut patterns, multiple fittings,
              adjustments for posture and movement. The word meant collaboration
              from first sketch to final stitch. A bespoke suit took weeks
              because the tailor was solving for how a specific human body moved
              through space.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
