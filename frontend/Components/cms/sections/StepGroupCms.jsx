import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import {
  Calendar,
  Gem,
  PenTool,
  Hammer,
  Package,
  Star,
  Truck,
  Mail,
  Phone,
  Clock,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { Section, Container } from "@/Components/layout/Section";
import OrnamentalDivider from "@/Components/ornaments/OrnamentalDivider";
import RichContent from "@/Components/shared/RichContent";

const ICON_MAP = {
  calendar: Calendar,
  gem: Gem,
  "pen-tool": PenTool,
  hammer: Hammer,
  package: Package,
  star: Star,
  truck: Truck,
  mail: Mail,
  phone: Phone,
  clock: Clock,
  "check-circle": CheckCircle,
  "arrow-right": ArrowRight,
};

const COL_CLASSES = {
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-3",
  4: "grid-cols-2 md:grid-cols-4",
  5: "grid-cols-1 md:grid-cols-5",
};

export default function StepGroupCms({ data }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { columns = "5", steps = [], cta_text, cta_link } = data ?? {};

  if (!steps || steps.length === 0) return null;

  return (
    <Section ref={ref} background="void" className="overflow-hidden">
      <Container>
        <div className="flex flex-col gap-12">
          <OrnamentalDivider />

          <div className="relative max-w-6xl mx-auto w-full">
            {/* Desktop timeline connector */}
            <div className="hidden md:block absolute top-10 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pale-gold/30 to-transparent" />

            <div
              className={`grid ${COL_CLASSES[columns] ?? COL_CLASSES["5"]} gap-16 md:gap-8`}
            >
              {steps.map((step, index) => {
                const Icon = ICON_MAP[step.icon] ?? ArrowRight;
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
                    <div className="flex flex-row md:flex-col items-start md:items-center gap-6 md:gap-0">
                      <div className="relative z-10 flex-shrink-0">
                        <div className="w-20 h-20 bg-stone-deeper border border-fog/20 heavy-shadow group hover:border-pale-gold transition-all duration-700 flex items-center justify-center">
                          <Icon className="w-7 h-7 text-pale-gold group-hover:scale-110 transition-transform duration-700" />
                        </div>
                        <div className="absolute -top-1 -right-2 w-7 h-7 bg-deep-body border border-pale-gold text-silver-white text-xs font-mono font-medium shadow-lg flex items-center justify-center">
                          {index + 1}
                        </div>
                      </div>

                      {/* Mobile vertical connector */}
                      {index < steps.length - 1 && (
                        <div className="md:hidden absolute left-10 top-16 w-px h-full bg-pale-gold/20" />
                      )}

                      <div className="flex flex-col gap-3 md:mt-8 md:text-center flex-1">
                        <h3 className="font-mono text-md font-medium uppercase tracking-wide">
                          {step.title}
                        </h3>
                        {step.description && (
                          <div className="text-sm prose-heritage">
                            <RichContent body={step.description} />
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {cta_text && cta_link && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-center"
            >
              <Link href={cta_link} className="btn-primary">
                {cta_text}
              </Link>
            </motion.div>
          )}
        </div>
      </Container>
    </Section>
  );
}
