/**
 * GlobalSVGDefs - Single source of SVG pattern definitions
 * Renders once in the app root to avoid duplicate IDs
 */
export default function GlobalSVGDefs() {
  return (
    <svg
      width="0"
      height="0"
      style={{ position: "absolute", visibility: "hidden" }}
      aria-hidden="true"
    >
      <defs>
        {/* Metal Scratch Texture - TESTING: SUPER OBSCENE VISIBILITY */}
        <pattern
          id="metal-scratches"
          x="0"
          y="0"
          width="200"
          height="200"
          patternUnits="userSpaceOnUse"
        >
          {/* MASSIVE RED base fill - you CANNOT miss this */}
          <rect
            x="0"
            y="0"
            width="200"
            height="200"
            fill="rgba(255, 0, 0, 0.5)"
          />

          {/* THICK BRIGHT GOLD horizontal scratches */}
          <line
            x1="0"
            y1="20"
            x2="200"
            y2="22"
            stroke="rgba(255, 215, 0, 0.9)"
            strokeWidth="8"
          />
          <line
            x1="0"
            y1="45"
            x2="200"
            y2="44"
            stroke="rgba(255, 215, 0, 0.8)"
            strokeWidth="6"
          />
          <line
            x1="0"
            y1="78"
            x2="200"
            y2="80"
            stroke="rgba(255, 215, 0, 0.9)"
            strokeWidth="8"
          />
          <line
            x1="0"
            y1="110"
            x2="200"
            y2="108"
            stroke="rgba(255, 215, 0, 0.8)"
            strokeWidth="6"
          />
          <line
            x1="0"
            y1="155"
            x2="200"
            y2="157"
            stroke="rgba(255, 215, 0, 0.9)"
            strokeWidth="8"
          />

          {/* THICK WHITE diagonal scratches */}
          <line
            x1="0"
            y1="0"
            x2="200"
            y2="30"
            stroke="rgba(255, 255, 255, 0.9)"
            strokeWidth="5"
          />
          <line
            x1="50"
            y1="0"
            x2="200"
            y2="80"
            stroke="rgba(255, 255, 255, 0.9)"
            strokeWidth="6"
          />
          <line
            x1="0"
            y1="100"
            x2="150"
            y2="200"
            stroke="rgba(255, 255, 255, 0.9)"
            strokeWidth="5"
          />
        </pattern>

        {/* Stone Texture - INCREASED VISIBILITY */}
        <pattern
          id="stone-texture"
          x="0"
          y="0"
          width="300"
          height="300"
          patternUnits="userSpaceOnUse"
        >
          {/* Cracks - more visible */}
          <path
            d="M 50,20 Q 80,40 100,25 T 150,30"
            stroke="rgba(180, 170, 150, 0.18)"
            strokeWidth="0.8"
            fill="none"
          />
          <path
            d="M 200,80 Q 220,100 240,90 T 280,95"
            stroke="rgba(180, 170, 150, 0.15)"
            strokeWidth="0.7"
            fill="none"
          />
          <path
            d="M 30,150 Q 50,170 80,160 T 120,165"
            stroke="rgba(180, 170, 150, 0.12)"
            strokeWidth="0.6"
            fill="none"
          />
          <path
            d="M 180,220 Q 200,240 230,230 T 270,235"
            stroke="rgba(180, 170, 150, 0.16)"
            strokeWidth="0.8"
            fill="none"
          />
          {/* Speckles - more visible */}
          <circle cx="75" cy="50" r="0.8" fill="rgba(180, 170, 150, 0.12)" />
          <circle cx="140" cy="90" r="0.6" fill="rgba(180, 170, 150, 0.1)" />
          <circle cx="95" cy="180" r="1" fill="rgba(180, 170, 150, 0.14)" />
          <circle cx="250" cy="120" r="0.5" fill="rgba(180, 170, 150, 0.08)" />
          <circle cx="40" cy="260" r="0.7" fill="rgba(180, 170, 150, 0.11)" />
        </pattern>

        {/* Rune Pattern (Elden Ring style) - INCREASED VISIBILITY */}
        <pattern
          id="rune-pattern"
          x="0"
          y="0"
          width="400"
          height="400"
          patternUnits="userSpaceOnUse"
        >
          <circle
            cx="200"
            cy="200"
            r="80"
            stroke="rgba(180, 170, 150, 0.15)"
            strokeWidth="0.8"
            fill="none"
          />
          <circle
            cx="200"
            cy="200"
            r="60"
            stroke="rgba(180, 170, 150, 0.12)"
            strokeWidth="0.6"
            fill="none"
          />
          <circle
            cx="200"
            cy="200"
            r="100"
            stroke="rgba(180, 170, 150, 0.1)"
            strokeWidth="0.7"
            fill="none"
          />
          <line
            x1="200"
            y1="120"
            x2="200"
            y2="140"
            stroke="rgba(180, 170, 150, 0.12)"
            strokeWidth="0.8"
          />
          <line
            x1="200"
            y1="260"
            x2="200"
            y2="280"
            stroke="rgba(180, 170, 150, 0.12)"
            strokeWidth="0.8"
          />
          <line
            x1="120"
            y1="200"
            x2="140"
            y2="200"
            stroke="rgba(180, 170, 150, 0.12)"
            strokeWidth="0.8"
          />
          <line
            x1="260"
            y1="200"
            x2="280"
            y2="200"
            stroke="rgba(180, 170, 150, 0.12)"
            strokeWidth="0.8"
          />
          <line
            x1="160"
            y1="160"
            x2="175"
            y2="175"
            stroke="rgba(180, 170, 150, 0.1)"
            strokeWidth="0.6"
          />
          <line
            x1="225"
            y1="225"
            x2="240"
            y2="240"
            stroke="rgba(180, 170, 150, 0.1)"
            strokeWidth="0.6"
          />
          <line
            x1="240"
            y1="160"
            x2="225"
            y2="175"
            stroke="rgba(180, 170, 150, 0.1)"
            strokeWidth="0.6"
          />
          <line
            x1="175"
            y1="225"
            x2="160"
            y2="240"
            stroke="rgba(180, 170, 150, 0.1)"
            strokeWidth="0.6"
          />
        </pattern>

        {/* Gallery Bands - INCREASED VISIBILITY */}
        <pattern
          id="gallery-bands"
          x="0"
          y="0"
          width="100"
          height="800"
          patternUnits="userSpaceOnUse"
        >
          <rect
            x="0"
            y="0"
            width="100"
            height="200"
            fill="rgba(180, 170, 150, 0.03)"
          />
          <rect
            x="0"
            y="200"
            width="100"
            height="200"
            fill="rgba(140, 130, 115, 0.01)"
          />
          <rect
            x="0"
            y="400"
            width="100"
            height="200"
            fill="rgba(180, 170, 150, 0.04)"
          />
          <rect
            x="0"
            y="600"
            width="100"
            height="200"
            fill="rgba(140, 130, 115, 0.015)"
          />
        </pattern>
      </defs>
    </svg>
  );
}
