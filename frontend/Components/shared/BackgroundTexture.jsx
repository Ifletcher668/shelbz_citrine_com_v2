/**
 * BackgroundTexture - Souls-like texture overlays
 * Using CSS gradients with PREDICTABLE, mathematically clean patterns
 * Rune pattern uses actual SVG file for complex mystical geometry
 * At opacity: 1, these patterns glow with brilliant gold
 */
export default function BackgroundTexture({
  variant = "metal",
  opacity = 0.5,
  className = "",
}) {
  const variants = {
    // Metal scratches - horizontal + diagonal crosshatch (PREDICTABLE)
    // Creates clean grid of scratches every 80px horizontal, 100px diagonal
    metal: {
      backgroundImage:
        "repeating-linear-gradient(0deg, transparent, transparent 80px, rgba(255, 215, 100, 1) 80px, rgba(255, 215, 100, 1) 81px), repeating-linear-gradient(45deg, transparent, transparent 100px, rgba(255, 200, 80, 0.8) 100px, rgba(255, 200, 80, 0.8) 101px), repeating-linear-gradient(-45deg, transparent, transparent 100px, rgba(255, 190, 70, 0.6) 100px, rgba(255, 190, 70, 0.6) 101px)",
    },

    // Stone texture - irregular diagonal cracks (PREDICTABLE)
    // 3 different angles at different intervals create organic stone look
    stone: {
      backgroundImage:
        "repeating-linear-gradient(23deg, transparent, transparent 120px, rgba(255, 215, 100, 1) 120px, rgba(255, 215, 100, 1) 121px), repeating-linear-gradient(67deg, transparent, transparent 95px, rgba(255, 200, 80, 0.8) 95px, rgba(255, 200, 80, 0.8) 96px), repeating-linear-gradient(-34deg, transparent, transparent 140px, rgba(255, 190, 70, 0.6) 140px, rgba(255, 190, 70, 0.6) 141px)",
    },

    // Rune pattern - ACTUAL SVG FILE with mystical geometry
    // Using direct image file instead of CSS gradients for complex pattern
    rune: {
      backgroundImage: "url(/rune-pattern.svg)",
      backgroundSize: "800px 800px",
      backgroundRepeat: "repeat",
    },

    // Gallery bands - wide horizontal stripes (PREDICTABLE)
    // Alternating bands every 150px create museum wall aesthetic
    gallery: {
      backgroundImage:
        "repeating-linear-gradient(0deg, rgba(255, 215, 100, 1) 0px, rgba(255, 215, 100, 1) 150px, rgba(255, 200, 80, 0.7) 150px, rgba(255, 200, 80, 0.7) 300px)",
    },
  };

  const variantStyle = variants[variant] || variants.metal;

  // To make opacity work, we wrap in a container with opacity
  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        opacity: opacity,
      }}
      aria-hidden="true"
    >
      <div className="absolute inset-0" style={variantStyle} />
    </div>
  );
}
