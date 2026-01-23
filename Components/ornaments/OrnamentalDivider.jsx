/**
 * Ornamental Divider
 * Decorative section separator with fantasy/manuscript aesthetic
 * Usage: <OrnamentalDivider /> between major sections
 */
export default function OrnamentalDivider() {
  return (
    <div className="my-space-8 flex items-center justify-center">
      <svg
        width="200"
        height="40"
        viewBox="0 0 200 40"
        className="text-aged-gold opacity-60"
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
        <circle
          cx="100"
          cy="20"
          r="4"
          fill="currentColor"
        />
        <circle
          cx="100"
          cy="20"
          r="8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        />

        {/* Small flanking diamonds */}
        <path
          d="M 88 20 L 90 18 L 92 20 L 90 22 Z"
          fill="currentColor"
        />
        <path
          d="M 108 20 L 110 18 L 112 20 L 110 22 Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}

// Variant: Simple line with center diamond
export function SimpleDivider() {
  return (
    <div className="divider-ornamental" aria-hidden="true" />
  );
}

// Variant: Triple line ornament
export function TripleDivider() {
  return (
    <div className="my-space-6 flex flex-col items-center gap-space-1" aria-hidden="true">
      <div className="w-32 h-px bg-aged-gold/30" />
      <div className="w-48 h-px bg-aged-gold/60" />
      <div className="w-32 h-px bg-aged-gold/30" />
    </div>
  );
}
