import { motion } from "framer-motion";
import Link from "next/link";
import { Section, Container } from "@/Components/layout/Section";
import { SimpleDivider } from "@/Components/ornaments/OrnamentalDivider";

export default function HeroCms({ data }) {
  const { headline, subheadline, cta_text, cta_link } = data;

  return (
    <Section variant="hero" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-void/60 to-void" />
      <Container className="relative z-10 text-center">
        <div className="flex flex-col items-center gap-12">
          {headline && (
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.2,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="text-center"
            >
              {headline}
            </motion.h1>
          )}
          {subheadline && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.4,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="text-xl max-w-4xl text-stone-grey"
            >
              {subheadline}
            </motion.p>
          )}
          {cta_text && cta_link && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.6,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <Link href={cta_link} className="btn-primary">
                {cta_text}
              </Link>
            </motion.div>
          )}
          <SimpleDivider />
        </div>
      </Container>
    </Section>
  );
}
