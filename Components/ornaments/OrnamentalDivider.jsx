import { motion, useInView } from "framer-motion";

export default function OrnamentalDivider() {
  return (
    <div className="my-16 flex items-center justify-center">
      <svg
        width="200"
        height="40"
        viewBox="0 0 200 40"
        className="text-pale-gold opacity-60"
        aria-hidden="true"
      >
        {/* Left line */}
        <line
          x1="10"
          y1="20"
          x2="80"
          y2="20"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
        />

        {/* Right line */}
        <line
          x1="120"
          y1="20"
          x2="190"
          y2="20"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
        />

        {/* Center ornament - Diamond with circle */}
        <circle cx="100" cy="20" r="4" fill="currentColor" />
        <circle
          cx="100"
          cy="20"
          r="8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        />

        {/* Small flanking diamonds */}
        <path d="M 88 20 L 90 18 L 92 20 L 90 22 Z" fill="currentColor" />
        <path d="M 108 20 L 110 18 L 112 20 L 110 22 Z" fill="currentColor" />
      </svg>
    </div>
  );
}

// Variant: Simple line with center diamond
export function SimpleDivider(props) {
  const { className } = props;

  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0 }}
      animate={{ opacity: 1, scaleX: 1 }}
      transition={{ duration: 0.8, delay: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      className={`max-w-xs mx-auto ${className}`}
    >
      <div className="h-px bg-gradient-to-r from-transparent via-pale-gold/30 to-transparent relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-pale-gold/50" />
      </div>
    </motion.div>
  );
}

// Variant: Triple line ornament
export function TripleDivider() {
  return (
    <div className="my-12 flex flex-col items-center gap-1" aria-hidden="true">
      <SimpleDivider />
      <SimpleDivider />
      <SimpleDivider />
    </div>
  );
}
