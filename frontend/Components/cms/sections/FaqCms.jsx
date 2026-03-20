import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/Components/ui/accordion";
import { Section, Container } from "@/Components/layout/Section";
import OrnamentalDivider from "@/Components/ornaments/OrnamentalDivider";

export default function FaqCms({ data }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { items } = data ?? {};

  if (!items || items.length === 0) return null;

  return (
    <Section ref={ref}>
      <Container>
        <div className="flex flex-col gap-12">
          <OrnamentalDivider />
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl mx-auto w-full"
          >
            <Accordion type="single" collapsible>
              <div className="flex flex-col gap-4">
                {items.map((item, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="bg-stone-deeper border border-fog/20 px-6 md:px-10 transition-all duration-700 data-[state=open]:border-pale-gold/40"
                  >
                    <AccordionTrigger className="text-left font-mono text-xs uppercase tracking-widest hover:text-pale-gold transition-colors duration-500 py-6">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-base text-stone-grey pb-6 leading-relaxed">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </div>
            </Accordion>
          </motion.div>
        </div>
      </Container>
    </Section>
  );
}
