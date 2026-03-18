import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { marked } from "marked";
import { Section, Container } from "@/Components/layout/Section";

const alignmentClasses = {
  left: "text-left",
  center: "text-center mx-auto",
  right: "text-right ml-auto",
};

export default function TextBlockCms({ data }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { heading, body, alignment = "center" } = data;

  return (
    <Section ref={ref}>
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className={`flex flex-col gap-space-12 ${alignmentClasses[alignment]}`}
        >
          {heading && (
            <h2 className="text-4xl md:text-5xl font-display">{heading}</h2>
          )}
          {body && (
            <div dangerouslySetInnerHTML={{ __html: marked.parse(body) }} />
          )}
        </motion.div>
      </Container>
    </Section>
  );
}
