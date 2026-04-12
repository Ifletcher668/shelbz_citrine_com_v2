import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../ui/accordion";
import OrnamentalDivider from "../../ornaments/OrnamentalDivider";

/**
 * FAQ Section - "Questions & Answers"
 * Heavy accordion with metallic styling
 * Literary voice: Direct answers with Popova depth + Rothfuss technical precision
 */
export default function FAQSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const faqs = [
    {
      question: "How much does a custom ring actually cost?",
      answer:
        "Black spinel engagement rings: $2,000–$7,000, depending on metal (14kt gold, 18kt gold, platinum, palladium), stone size (typically 1.5–4ct for center stones), and design complexity. Bezel settings cost less than intricate granulation work. During your free consultation, we discuss your budget first—then design within it. No bait-and-switch pricing.",
    },
    {
      question: "How long does the process take from sketch to shipping?",
      answer:
        "4–8 weeks on average. Week 1: Consultation and design approval. Weeks 2–6: Hand-forging at Royal Karkhana in Jaipur (we send progress photos at key stages: initial metalwork, stone setting, polishing). Week 7: Quality inspection and approval photos sent to you. Week 8: Insured international shipping via DHL. Rush orders (weddings, anniversaries) can sometimes be expedited for an additional fee.",
    },
    {
      question: "I'm not in Olympia. Can we still work together?",
      answer:
        "Yes. Most of our clients work with us remotely via Zoom. We ship gemstone samples for in-person viewing (you return them after selection), conduct design consultations over video call, and deliver the finished piece via insured shipping. Our furthest client to date: Auckland, New Zealand. Our closest: three blocks from our Olympia studio (they still preferred Zoom).",
    },
    {
      question: "What if I don't like the ring when it arrives?",
      answer:
        "You approve the ring before it ships. We send high-resolution photos from 6+ angles, plus video of the piece rotating under different lighting. If anything looks off, we adjust it—no charge, no argument. Once you confirm approval, we ship. Upon arrival, you have 7 days to inspect in person. If there's a discrepancy between photos and reality (there never has been), we remake it or refund in full.",
    },
    {
      question: "Why black spinel instead of black diamond?",
      answer:
        "Black spinel is harder (Mohs 7.5-8 vs. treated black diamond at 10, but natural black diamonds are rarely gem-quality), rarer (most 'black diamonds' are heavily treated or synthetic), and more affordable (1/10th the price for better clarity). Historically, black spinel was used in crown jewels and Victorian mourning jewelry. It's also less brittle than diamond for daily wear. If you want black diamond for the prestige, we can source it—but we'll explain why spinel is the smarter choice.",
    },
    {
      question: "What metals do you work with, and why does it matter?",
      answer:
        "14kt gold (58.3% pure gold, alloyed with copper/silver/zinc for durability), 18kt gold (75% pure gold, softer but richer color), platinum (95% pure, hypoallergenic, heaviest), and palladium (95% pure, hypoallergenic, lighter than platinum, naturally white). We never use nickel fillers (common in cheap white gold, causes skin reactions). We never use hollow construction or plating. Your ring is solid precious metal, period.",
    },
    {
      question: "Can I bring my own design or just describe what I want?",
      answer:
        "Both. If you have sketches, Pinterest boards, or an heirloom piece you want reimagined, bring them. If you have zero visual ideas and just know 'I want something dark and understated,' that's fine too. We ask questions: What's your dominant hand? Do you type/climb/lift weights? Do you want people to notice the ring or not? Your answers guide the design. The artisan sketches in real-time during the consultation—you collaborate, not spectate.",
    },
    {
      question: "What does 'seventh-generational artisan' actually mean?",
      answer:
        "It means the metalworker who forges your ring learned the trade from their father, who learned from their father, seven generations back. The workshops in India and Thailand have been operated by multigenerational artisan families for over a century. They don't advertise. They don't have a website. They work exclusively through partnerships like ours. This isn't a marketing claim—it's documented lineage.",
    },
    {
      question:
        "Are the gemstones actually ethically sourced, or is that just branding?",
      answer:
        "Our gemstones come from artisanal miners in India and Thailand—sourced directly by our in-house gemmologist who's been visiting these sites for 30+ years. No middlemen. No conflict zones. No child labor. We can name the mining cooperatives. The stones are untreated (no heat, no irradiation, no fracture-filling) and come with certificates of origin. If you want to verify the supply chain, we'll give you contact information. This is documentation, not marketing.",
    },
    {
      question: "What if the ring needs repairs or resizing years later?",
      answer:
        "We offer lifetime repair services for any ring we create. Resizing (if the design allows it—some settings can't be resized without compromising structure): $150–$400 depending on complexity. Stone re-setting or re-polishing: quoted on a case-by-case basis. If you're local to Olympia, bring it in. If not, we provide insured shipping labels both ways. The artisans who made your ring can repair it—they keep records of every commission.",
    },
  ];

  return (
    <section ref={ref} className="section bg-void relative">
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
                Frequently Asked Questions
              </h2>
              <p className="text-lg">
                The questions we get asked most often, answered without the
                sales-speak. If your question isn't here, ask during your
                consultation—we'll add it to this list.
              </p>
            </div>
          </motion.div>

          <OrnamentalDivider />

          {/* FAQ Accordion - HEAVY STYLING */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl mx-auto"
          >
            <Accordion type="single" collapsible>
              <div className="flex flex-col gap-8">
                {faqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="bg-stone-deeper border border-fog/20 heavy-shadow px-6 md:px-10 transition-all duration-700 data-[state=open]:border-pale-gold"
                  >
                    <AccordionTrigger className="text-left font-mono text-sm hover:text-pale-gold uppercase tracking-wide transition-colors duration-500">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-md text-fog pb-8">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </div>
            </Accordion>
          </motion.div>

          {/* Bottom context - Robbins tangent */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <p className="text-sm text-fog italic">
              "The FAQ genre exists because modern commerce trains us to
              anticipate objections before they arise. We'd rather you just ask.
              But since everyone Googles before booking consultations, here's
              the information you're looking for—unvarnished."
            </p>
          </motion.div>

          {/* Bottom ornament */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex justify-center"
          >
            <svg
              width="80"
              height="40"
              viewBox="0 0 80 40"
              className="text-pale-gold/30"
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
      </div>
    </section>
  );
}
