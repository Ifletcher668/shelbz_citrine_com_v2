/**
 * InnerSection — Content grouping within a Section.
 *
 * WHEN TO USE:
 *   - Grouping content with consistent flex/gap layout inside a Container
 *   - Applying optional width constraints or center alignment to a content block
 *
 * WHEN NOT TO USE:
 *   - Top-level page sections → use Section
 *   - Horizontal padding / max-width → use Container inside Section
 *
 * COMPOSITION:
 *   PageLayout > Section > Container > InnerSection > content
 *
 * @example
 * <InnerSection gap="loose" width="narrow" align="center">
 *   <SectionHeader heading="Title" subtitle="Subtitle" />
 *   <Reveal><p>Content</p></Reveal>
 * </InnerSection>
 */
import { cn } from "@/lib/utils";

const gapClasses = {
  tight: "gap-6",
  normal: "gap-8",
  loose: "gap-12",
};

const widthClasses = {
  narrow: "max-w-4xl mx-auto",
  reading: "max-w-container-reading mx-auto",
  full: "",
};

const alignClasses = {
  left: "",
  center: "items-center text-center",
};

export default function InnerSection({
  children,
  as: Tag = "div",
  gap = "normal",
  width = "full",
  align = "left",
  className,
  ...props
}) {
  return (
    <Tag
      className={cn(
        "flex flex-col",
        gapClasses[gap],
        widthClasses[width],
        alignClasses[align],
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
