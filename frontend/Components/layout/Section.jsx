/**
 * Section — Vertical spacing, background, and optional decorative layer container.
 *
 * WHEN TO USE:
 *   - Top-level page sections (hero, features, CTA, testimonials, etc.)
 *   - Any block needing consistent vertical padding + background color
 *
 * WHEN NOT TO USE:
 *   - Content grouping within a section → use InnerSection
 *   - Horizontal padding / max-width → use Container inside Section
 *
 * COMPOSITION:
 *   PageLayout > Section > Container > InnerSection > content
 *   PageLayout > Section > Container > Reveal > content
 *
 * @example
 * <Section background="stone-dark" overlay="vignette" corners="flourish">
 *   <Container>
 *     <Reveal>Content</Reveal>
 *   </Container>
 * </Section>
 */
import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import BackgroundTexture from "@/Components/shared/BackgroundTexture";
import { FourCornerFlourish } from "@/Components/ornaments/CornerFlourish";

function CornerAccents({ size = 16, color = "pale-gold" }) {
  const colorMap = {
    "pale-gold": "rgba(180, 170, 150, 0.3)",
    "silver-white": "rgba(229, 224, 216, 0.3)",
    fog: "rgba(90, 90, 90, 0.3)",
  };
  const borderColor = colorMap[color] ?? "rgba(180, 170, 150, 0.3)";
  const style = { width: size, height: size, borderColor };
  return (
    <>
      <div className="absolute top-0 left-0 border-t border-l" style={style} />
      <div className="absolute top-0 right-0 border-t border-r" style={style} />
      <div
        className="absolute bottom-0 left-0 border-b border-l"
        style={style}
      />
      <div
        className="absolute bottom-0 right-0 border-b border-r"
        style={style}
      />
    </>
  );
}

/**
 * @type {React.ForwardRefExoticComponent<{
 *   children?: React.ReactNode;
 *   className?: string;
 *   variant?: "default" | "hero";
 *   background?: string;
 *   overlay?: string;
 *   texture?: { variant: string; opacity: number } | false;
 *   corners?: string | false;
 *   cornerSize?: number;
 *   cornerColor?: string;
 *   id?: string;
 *   [key: string]: any;
 * } & React.RefAttributes<HTMLElement>>}
 */
export const Section = forwardRef(
  (
    {
      children,
      className,
      variant = "default",
      background = "void",
      overlay = "none",
      texture = false,
      corners = false,
      cornerSize = 16,
      cornerColor = "pale-gold",
      id,
      ...props
    },
    ref,
  ) => {
    const variantClasses = {
      default: "section",
      hero: "section section-hero",
    };

    const bgClasses = {
      void: "bg-void",
      "stone-dark": "bg-stone-dark",
      "stone-deeper": "bg-stone-deeper",
      transparent: "",
    };

    const overlayClasses = {
      vignette:
        "absolute inset-0 bg-gradient-to-b from-void/60 via-transparent to-void/60 pointer-events-none",
      fog: "absolute inset-0 bg-gradient-to-b from-void/40 via-transparent to-void/40 pointer-events-none",
    };

    const hasDecorations =
      overlay !== "none" || texture !== false || corners !== false;

    return (
      <section
        ref={ref}
        className={cn(
          variantClasses[variant],
          bgClasses[background],
          "relative",
          className,
        )}
        id={id}
        {...props}
      >
        {texture && (
          <BackgroundTexture
            variant={texture.variant}
            opacity={texture.opacity}
          />
        )}
        {overlay !== "none" && (
          <div className={overlayClasses[overlay]} aria-hidden="true" />
        )}
        {corners === "accent" && (
          <CornerAccents size={cornerSize} color={cornerColor} />
        )}
        {corners === "flourish" && <FourCornerFlourish />}
        {hasDecorations ? (
          <div className="relative z-10">{children}</div>
        ) : (
          children
        )}
      </section>
    );
  },
);

Section.displayName = "Section";

/**
 * Container — Horizontal padding + max-width wrapper.
 *
 * WHEN TO USE:
 *   - Inside a Section to constrain content width and add horizontal padding
 *
 * WHEN NOT TO USE:
 *   - Nesting containers → one Container per Section is sufficient
 *
 * COMPOSITION:
 *   PageLayout > Section > Container > InnerSection > content
 *
 * @example
 * <Section>
 *   <Container size="narrow">
 *     <p>Content</p>
 *   </Container>
 * </Section>
 */
export const Container = ({ children, size = "wide", className, ...props }) => {
  const sizeClasses = {
    narrow: "max-w-container-narrow",
    reading: "max-w-container-reading",
    wide: "max-w-container-wide",
  };

  return (
    <div
      className={cn(
        "mx-auto px-space-4 md:px-space-6",
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
