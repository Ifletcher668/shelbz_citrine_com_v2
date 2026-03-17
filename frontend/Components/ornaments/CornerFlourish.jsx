/**
 * Corner Flourish
 * Decorative corner ornaments for cards, headers, etc.
 * Inspired by illuminated manuscripts and fantasy game UI
 */

// Top-left corner flourish
export default function CornerFlourish({ position = 'top-left', className = '' }) {
  const positionClasses = {
    'top-left': 'top-0 left-0',
    'top-right': 'top-0 right-0 rotate-90',
    'bottom-left': 'bottom-0 left-0 -rotate-90',
    'bottom-right': 'bottom-0 right-0 rotate-180',
  };

  return (
    <svg
      width="60"
      height="60"
      viewBox="0 0 60 60"
      className={`absolute ${positionClasses[position]} opacity-20 pointer-events-none ${className}`}
      aria-hidden="true"
    >
      {/* Ornamental curves */}
      <path
        d="M 0,0 Q 15,15 0,30"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        className="text-pale-gold"
      />
      <path
        d="M 0,0 Q 15,15 30,0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        className="text-pale-gold"
      />

      {/* Small accent dots */}
      <circle cx="10" cy="10" r="1.5" fill="currentColor" className="text-pale-gold" />
      <circle cx="5" cy="15" r="1" fill="currentColor" className="text-pale-gold" />
      <circle cx="15" cy="5" r="1" fill="currentColor" className="text-pale-gold" />
    </svg>
  );
}

// All four corners variant
export function FourCornerFlourish({ className = '' }) {
  return (
    <>
      <CornerFlourish position="top-left" className={className} />
      <CornerFlourish position="top-right" className={className} />
      <CornerFlourish position="bottom-left" className={className} />
      <CornerFlourish position="bottom-right" className={className} />
    </>
  );
}

// Gothic-style corner ornament
export function GothicCorner({ position = 'top-left', className = '' }) {
  const positionClasses = {
    'top-left': 'top-0 left-0',
    'top-right': 'top-0 right-0 scale-x-[-1]',
    'bottom-left': 'bottom-0 left-0 scale-y-[-1]',
    'bottom-right': 'bottom-0 right-0 scale-[-1]',
  };

  return (
    <svg
      width="80"
      height="80"
      viewBox="0 0 80 80"
      className={`absolute ${positionClasses[position]} opacity-30 pointer-events-none ${className}`}
      aria-hidden="true"
    >
      {/* Gothic arch shape */}
      <path
        d="M 0,40 Q 20,10 40,0 L 40,40 Z"
        fill="currentColor"
        className="text-pale-gold/10"
      />
      <path
        d="M 0,40 Q 20,10 40,0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        className="text-pale-gold"
      />

      {/* Inner decorative lines */}
      <path
        d="M 5,38 Q 20,15 35,5"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
        className="text-pale-gold/50"
      />
    </svg>
  );
}
