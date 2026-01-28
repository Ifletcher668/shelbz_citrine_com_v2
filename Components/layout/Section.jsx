/**
 * Section Layout Component
 *
 * Standardized section wrapper for consistent spacing and layout patterns.
 * Uses the design system's .section CSS class for vertical spacing.
 */
export const Section = ({
  children,
  className = "",
  variant = "default",
  background = "void",
  ...props
}) => {
  const variantClasses = {
    default: "section",
    hero: "section section-hero",
  };

  const bgClasses = {
    void: "bg-void",
    "stone-dark": "bg-stone-dark",
    transparent: "",
  };

  return (
    <section
      className={`${variantClasses[variant]} ${bgClasses[background]} ${className}`}
      {...props}
    >
      {children}
    </section>
  );
};

/**
 * Container Layout Component
 *
 * Standardized container for consistent max-width and horizontal padding.
 * Uses the design system's spacing tokens and max-width values.
 *
 * @param {string} size - "narrow" | "reading" | "wide" (default: "wide")
 */
export const Container = ({
  children,
  size = "wide",
  className = "",
  ...props
}) => {
  const sizeClasses = {
    narrow: "max-w-container-narrow",
    reading: "max-w-container-reading",
    wide: "max-w-container-wide",
  };

  return (
    <div
      className={`mx-auto px-space-4 md:px-space-6 ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
