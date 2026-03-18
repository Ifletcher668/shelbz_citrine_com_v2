/**
 * SectionHeader — Centered heading + optional subtitle pattern.
 *
 * WHEN TO USE:
 *   - Section introduction with a heading and optional subtitle
 *   - As the first child of InnerSection to title the content block below
 *
 * WHEN NOT TO USE:
 *   - Single-line labels or card headings → use heading tags directly
 *   - Full hero headings → build inline in the hero section for full control
 *
 * COMPOSITION:
 *   PageLayout > Section > Container > InnerSection > SectionHeader
 *
 * @example
 * <SectionHeader
 *   heading="Our Process"
 *   subtitle="From vision to reality in three stages."
 *   divider
 * />
 */
import { cn } from "@/lib/utils";
import OrnamentalDivider from "@/Components/ornaments/OrnamentalDivider";

const widthClasses = {
  narrow: "max-w-4xl mx-auto",
  reading: "max-w-container-reading mx-auto",
  full: "",
};

export default function SectionHeader({
  heading,
  subtitle,
  headingAs: HeadingTag = "h2",
  headingSize = "text-4xl md:text-5xl",
  width = "narrow",
  divider = false,
  className,
  ...props
}) {
  return (
    <div
      className={cn("text-center", widthClasses[width], className)}
      {...props}
    >
      <HeadingTag className={cn("font-display", headingSize)}>
        {heading}
      </HeadingTag>
      {subtitle && (
        <p className="mt-4 text-stone-grey text-lg">{subtitle}</p>
      )}
      {divider && <OrnamentalDivider className="mt-6" />}
    </div>
  );
}
