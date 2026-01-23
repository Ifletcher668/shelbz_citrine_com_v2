import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/Components/ui/accordion";
import OrnamentalDivider from "@/Components/ornaments/OrnamentalDivider";

/**
 * FAQ Section - "Questions & Answers"
 * Heavy accordion with metallic styling
 */
export default function FAQSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const faqs = [
    {
      question: "How much does a custom ring cost?",
      answer:
        "Custom rings typically range from $2,000 to $7,000, depending on the metal choice (14kt gold, 18kt gold, platinum, or palladium), gemstone size, and design complexity. During your free consultation, we'll discuss your budget and provide a detailed quote.",
    },
    {
      question: "How long does it take?",
      answer:
        "From design approval to delivery, expect 4-8 weeks. This includes gem selection, collaborative design refinement, handcrafting by our artisans at Royal Karkhana in India, quality inspection, and insured shipping. We'll send approval photos before the piece ships.",
    },
    {
      question: "What if I'm not in Olympia?",
      answer:
        "No problem! We offer Zoom consultations for clients nationwide. You can view gems virtually, discuss designs in real-time, and receive your finished piece via insured shipping anywhere in the US. Many of our happiest clients have never met us in person.",
    },
    {
      question: "Can I see the ring before it ships?",
      answer:
        "Absolutely. We send detailed approval photos from multiple angles before shipping any piece. You'll see exactly what you're getting and can request adjustments if needed. Your satisfaction is guaranteed before the ring leaves the workshop.",
    },
    {
      question: "What metals do you offer?",
      answer:
        "We work exclusively with precious metals: 14kt gold, 18kt gold (yellow, white, or rose), platinum, and palladium. Unlike mass-market jewelry, we never use nickel fillers or hollow construction. Every piece is solid, hypoallergenic, and built to last generations.",
    },
  ];

  return (
    <section ref={ref} className="section bg-ink-black relative">
      {/* Heavy vignette */}
      <div className="absolute inset-0 bg-vignette opacity-80" />

      <div className="section-container relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-space-6"
        >
          <h2 className="font-cinzel text-4xl md:text-5xl text-bone-white leading-tight mb-space-4">
            Questions & Answers
          </h2>
          <p className="font-crimson text-lg text-ash-grey max-w-2xl mx-auto">
            Everything you need to know about our bespoke jewelry process.
          </p>
        </motion.div>

        <OrnamentalDivider />

        {/* FAQ Accordion - HEAVY STYLING */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto mt-space-8"
        >
          <Accordion type="single" collapsible className="space-y-space-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-vellum metallic-border heavy-shadow px-space-6 transition-all duration-700 data-[state=open]:border-aged-gold"
              >
                <AccordionTrigger className="text-left font-spectral text-base text-bone-white hover:text-aged-gold py-space-5 uppercase tracking-wide transition-colors duration-500">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="font-crimson text-base text-ash-grey pb-space-5 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        {/* Bottom ornament */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-space-8 flex justify-center"
        >
          <svg
            width="80"
            height="40"
            viewBox="0 0 80 40"
            className="text-aged-gold/30"
          >
            <line
              x1="0"
              y1="20"
              x2="30"
              y2="20"
              stroke="currentColor"
              strokeWidth="1"
            />
            <line
              x1="50"
              y1="20"
              x2="80"
              y2="20"
              stroke="currentColor"
              strokeWidth="1"
            />
            <circle cx="40" cy="20" r="3" fill="currentColor" />
            <circle
              cx="40"
              cy="20"
              r="7"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
          </svg>
        </motion.div>
      </div>
    </section>
  );
}
