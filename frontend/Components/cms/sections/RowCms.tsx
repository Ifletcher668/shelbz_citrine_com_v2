import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Section, Container } from "@/Components/layout/Section";
import RichContent from "@/Components/shared/RichContent";
import type { StrapiRow } from "@/types/cms";

interface RowCmsProps {
  data: StrapiRow | undefined;
  sectionVariant?: "hero" | "default";
}

export default function RowCms({ data, sectionVariant = "default" }: RowCmsProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const columns = data?.columns ?? [];

  if (columns.length === 0) return null;

  return (
    <Section
      ref={ref}
      variant={sectionVariant}
      background="stone-dark"
      texture={{ variant: "stone", opacity: 0.05 }}
      overlay="vignette"
    >
      <Container>
        <div className={`grid grid-cols-1 md:grid-cols-${columns.length} gap-8`}>
          {columns.map((column, i) => (
            <motion.div
              key={column.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.9,
                delay: i * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <RichContent body={column.body} />
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
