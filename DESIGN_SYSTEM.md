# Dark Lux Storefront - Souls-like Design System

## Overview
This design system creates a **brutal, minimalist, gallery-like aesthetic** inspired by:
- Elden Ring / Dark Souls (cold, unforgiving, mysterious)
- Metropolitan Museum (sophisticated, spacious, high-art)
- Behemoth / Imperial Triumphant (dark, artistic, dissonant)

---

## Color Palette

### Active Colors (Use These)
```javascript
// Backgrounds
'void': '#000000'           // Pure black
'stone-dark': '#0a0a0a'     // Almost void
'stone-deeper': '#141414'   // Slight lift

// Neutral Greys
'fog': '#3c3c3c'            // Dark fog
'stone-grey': '#8c8273'     // Desaturated stone
'silver-white': '#e5e0d8'   // Cold silver-white

// Accents
'pale-gold': '#b4aa96'      // Muted gold
'cold-bronze': '#7a6f5d'    // Dark bronze
'steel-blue': '#424852'     // Cold steel
'frost-blue': '#b8c5d6'     // Icy blue (rare)
'deep-crimson': '#4a1a1a'   // Very dark blood
'moss-green': '#2d3a2e'     // Dark moss
```

### Deprecated Colors (Don't Use)
```
❌ ink-black, parchment-dark, vellum
❌ aged-gold, amber-glow, verdigris
❌ bone-white, ash-grey, charcoal-mist, sepia-shadow
❌ blood-ruby, obsidian, emerald-deep
```

---

## Typography

### Active Fonts
```javascript
'font-garamond'   // EB Garamond - Main serif for headings & body
'font-baskerville' // Libre Baskerville - Alternative serif
'font-mono'       // IBM Plex Mono - UI labels, captions, buttons
```

### Font Usage
```jsx
// Headings (ultra-light, gallery style)
<h1 className="font-garamond text-6xl text-silver-white font-light">

// Body text
<p className="font-garamond text-lg text-stone-grey">

// UI Labels, buttons, captions
<span className="font-mono text-[10px] tracking-[0.2em] uppercase text-fog/70">
```

### Deprecated Fonts
```
❌ font-cinzel (too ornate)
❌ font-crimson (too warm)
❌ font-spectral (wrong aesthetic)
```

---

## Components

### Buttons
```jsx
// Primary - Glassmorphism with glow
<button className="btn-primary">
  Book Consultation
</button>

// Secondary - Ghost variant
<button className="btn-secondary">
  Learn More
</button>
```

### Cards
```jsx
<div className="card">
  {/* Glassmorphism with minimal borders */}
</div>
```

### Forms
```jsx
<label className="form-label">Email</label>
<input className="form-input" placeholder="your@email.com" />
<textarea className="form-textarea"></textarea>
```

---

## SVG Background Textures

### Component Usage
```jsx
import BackgroundTexture from "@/Components/shared/BackgroundTexture";

<section className="relative">
  <BackgroundTexture variant="metal" opacity={0.3} />
  {/* Your content */}
</section>
```

### Texture Variants
- **`metal`** - Scratched steel (best for hero/primary sections)
- **`stone`** - Weathered stone cracks (organic feel)
- **`rune`** - Elden Ring circular patterns (mystical)
- **`gallery`** - Horizontal bands (museum walls)

### Recommended Usage
```jsx
// Hero Section - minimal or no texture (performance)
<HeroSection /> // No texture for smooth scroll

// Gallery Section - museum bands
<BackgroundTexture variant="gallery" opacity={0.4} />

// Process Section - metal scratches
<BackgroundTexture variant="metal" opacity={0.3} />

// CTA Section - rune pattern
<BackgroundTexture variant="rune" opacity={0.2} />
```

---

## Utility Classes

### Active Utilities
```css
/* Backgrounds */
.bg-fog-gradient        /* Vertical fog vignette */
.bg-steel-texture       /* Subtle metal scratches */

/* Borders */
.border-souls           /* Minimal border with heavy shadow */
.metallic-border        /* Cold metallic edge */
.tension-border         /* Asymmetric dissonant borders */

/* Text */
.text-metallic-cold     /* Cold metallic gradient */

/* Effects */
.glass                  /* Glassmorphism overlay */
.heavy-shadow           /* Deep black shadows */
.steel-edge             /* Subtle steel border */
.divider-souls          /* Minimalist horizontal divider */
.fog-overlay            /* Radial fog effect */
```

### Deprecated Utilities
```
❌ .bg-parchment
❌ .bg-vignette
❌ .border-aged
❌ .text-metallic-gold
❌ .divider-ornamental
```

---

## Spacing

Use standard Tailwind spacing (4px base):
```jsx
gap-6      // 24px
mb-12      // 48px
p-8        // 32px
```

Avoid custom spacing like:
```
❌ space-1, space-2, space-3 (golden ratio spacing - too ornate)
```

---

## Animation

### Timing Functions
```css
transition-souls  /* cubic-bezier(0.25, 0.1, 0.25, 1) */
transition-sharp  /* cubic-bezier(0.4, 0, 0.6, 1) */
transition-smooth /* cubic-bezier(0.4, 0, 0.2, 1) */
```

### Durations
- Fast interactions: `duration-200` (200ms)
- Standard transitions: `duration-300` (300ms)
- Page elements: `duration-500` to `duration-800`

Keep animations **snappy and precise**, not slow/mystical.

---

## Performance Guidelines

### DO ✓
- Use single SVG grain background
- Apply fog vignette as fixed pseudo-element
- Keep textures at low opacity (0.2-0.4)
- Use `will-change` sparingly
- Minimize backdrop-blur usage

### DON'T ✗
- Use `background-attachment: fixed` (causes scroll jank)
- Layer 4+ backgrounds
- Use high octave fractal noise (>3 octaves)
- Apply blur effects in hero sections
- Stack multiple glassmorphism effects

---

## Migration Checklist

When updating existing components:

1. **Replace old colors:**
   ```bash
   ink-black → void
   bone-white → silver-white
   aged-gold → pale-gold
   ```

2. **Replace old fonts:**
   ```bash
   font-cinzel → font-garamond
   font-crimson → font-garamond
   font-spectral → font-mono (for UI)
   ```

3. **Add SVG texture:**
   ```jsx
   import BackgroundTexture from "@/Components/shared/BackgroundTexture";
   <BackgroundTexture variant="metal" opacity={0.3} />
   ```

4. **Update spacing:**
   ```bash
   space-6 → 12
   space-4 → 6
   gap-space-4 → gap-6
   ```

5. **Simplify animations:**
   - Reduce duration
   - Use `transition-souls` easing
   - Remove overly slow delays

---

## Examples

### Before (Warm/Ornate)
```jsx
<h1 className="font-cinzel text-bone-white text-metallic-gold">
  Custom Rings
</h1>
<p className="font-crimson text-ash-grey italic">
  Handcrafted excellence
</p>
```

### After (Cold/Minimal)
```jsx
<h1 className="font-garamond text-silver-white text-metallic-cold font-light">
  Custom Rings
</h1>
<p className="font-garamond text-stone-grey">
  Handcrafted excellence
</p>
```

---

## Questions?

Check these files for reference:
- `styles/globals.css` - All utility classes
- `tailwind.config.js` - Color/font definitions
- `Components/shared/BackgroundTexture.jsx` - SVG patterns
- `Components/sections/HeroSection.jsx` - Example usage
