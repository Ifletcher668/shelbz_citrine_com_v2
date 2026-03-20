import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Section, Container } from "@/Components/layout/Section";
import RichContent from "@/Components/shared/RichContent";

const COL_CLASSES = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-3",
  4: "grid-cols-2 md:grid-cols-4",
};

export default function ColumnGroupCms({ data, sectionVariant = "default" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { columns = [] } = data ?? {};

  if (!columns || columns.length === 0) return null;

  const colCount = Math.min(columns.length, 4);
  const gridClass = COL_CLASSES[colCount] ?? COL_CLASSES[2];

  return (
    <Section
      ref={ref}
      variant={sectionVariant}
      background="stone-dark"
      texture={{ variant: "stone", opacity: 0.05 }}
      overlay="vignette"
    >
      <Container>
        <div className={`grid ${gridClass} gap-8`}>
          {columns.map((column, i) => (
            <motion.div
              key={i}
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
