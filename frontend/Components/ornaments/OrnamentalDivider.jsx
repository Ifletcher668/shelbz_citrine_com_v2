import { motion } from "framer-motion";

const SIZE_CLASSES = {
  full: "w-full",
  lg: "w-3/4 mx-auto",
  md: "w-[200px] mx-auto",
  sm: "w-[80px] mx-auto",
};

/**
 * Ornamental divider with a center circle-and-diamond motif.
 * size: "full" | "lg" (75%) | "md" (200px, default) | "sm" (60px, subtle colophon mark)
 */
export default function OrnamentalDivider({ className = "", size = "md" }) {
  return (
    <div
      className={`flex items-center justify-center ${SIZE_CLASSES[size]} ${className}`}
      aria-hidden="true"
    >
      <svg
        width="100%"
        viewBox="0 0 200 40"
        className="text-pale-gold opacity-60"
      >
        <line
          x1="10"
          y1="20"
          x2="80"
          y2="20"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <line
          x1="120"
          y1="20"
          x2="190"
          y2="20"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <circle cx="100" cy="20" r="4" fill="currentColor" />
        <circle
          cx="100"
          cy="20"
          r="8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        />
        <path d="M 88 20 L 90 18 L 92 20 L 90 22 Z" fill="currentColor" />
        <path d="M 108 20 L 110 18 L 112 20 L 110 22 Z" fill="currentColor" />
      </svg>
    </div>
  );
}

// Variant: Simple line with center diamond
export function SimpleDivider({ className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0 }}
      animate={{ opacity: 1, scaleX: 1 }}
      transition={{ duration: 0.8, delay: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      className={`max-w-xs mx-auto ${className}`}
    >
      <div className="h-px bg-linear-to-r from-transparent via-pale-gold/30 to-transparent relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-pale-gold/50" />
      </div>
    </motion.div>
  );
}

export function DividerLine({ className = "" }) {
  return (
    <div
      className={`h-px bg-linear-to-r from-aged-gold/0 via-aged-gold/30 to-aged-gold/0 ${className}`}
    />
  );
}

// Variant: Triple line ornament
export function TripleDivider({ className = "" }) {
  return (
    <div
      className={`flex flex-col items-center gap-6 ${className}`}
      aria-hidden="true"
    >
      <SimpleDivider />
      <SimpleDivider />
      <SimpleDivider />
    </div>
  );
}
