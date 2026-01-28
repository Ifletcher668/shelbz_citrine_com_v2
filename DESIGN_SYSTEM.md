# Dark Lux Storefront - Souls-like Design System

## Overview
This design system creates a **brutal, minimalist, gallery-like aesthetic** inspired by:
- Elden Ring / Dark Souls (cold, unforgiving, mysterious)
- Metropolitan Museum (sophisticated, spacious, high-art)
- Behemoth / Imperial Triumphant (dark, artistic, dissonant)

**Current Status:** Lead-gen site. E-commerce functionality planned for future.

---

## Color Palette

### Active Colors (Use These)
```javascript
// Backgrounds
'void': '#000000'           // Pure black - main background
'stone-dark': '#0a0a0a'     // Almost void - cards, elevated surfaces
'stone-deeper': '#141414'   // Slight lift - form backgrounds

// Neutral Greys
'fog': '#5a5a5a'            // Medium-dark fog - body text, metadata
'stone-grey': '#8c8273'     // Desaturated stone - secondary text
'silver-white': '#e5e0d8'   // Cold silver-white - headings, high contrast text

// Accents
'pale-gold': '#b4aa96'      // Muted gold - CTAs, highlights, required field markers
'cold-bronze': '#291d0466'  // Dark bronze with opacity - subtle backgrounds
'steel-blue': '#424852'     // Cold steel - secondary buttons
'frost-blue': '#b8c5d6'     // Icy blue (rare highlights)
'deep-crimson': '#4a1a1a'   // Very dark blood (destructive actions)
'moss-green': '#2d3a2e'     // Dark moss (success states)
```

### shadcn/ui Semantic Colors (For UI Components)
These map your brand colors to shadcn/ui component expectations:
```javascript
'border': 'rgba(60, 60, 60, 0.2)'
'input': '#0a0a0a'
'ring': '#b4aa96'
'background': '#000000'
'foreground': '#e5e0d8'
'primary': '#b4aa96'
'secondary': '#424852'
'destructive': '#4a1a1a'
'muted': '#141414'
'accent': '#b4aa96'
'popover': '#0a0a0a'
'card': '#0a0a0a'
```

### Deprecated Colors (REMOVED - Don't Use)
```
❌ ink-black → use 'void'
❌ parchment, parchment-dark, vellum → use 'stone-dark' or 'stone-deeper'
❌ aged-gold, amber-glow → use 'pale-gold'
❌ bone-white → use 'silver-white'
❌ ash-grey, charcoal-mist, sepia-shadow → use 'fog' or 'stone-grey'
❌ verdigris, blood-ruby, obsidian, emerald-deep → not in use
```

---

## Typography

### Active Fonts (Current Implementation)
```javascript
'font-display'  // Cinzel - Display headings, UI labels
'font-body'     // Crimson Text - Body text, readable content
'font-ui'       // Cinzel - UI elements, buttons
'font-mono'     // IBM Plex Mono - Code, technical, form labels
```

**Note:** Earlier docs referenced Garamond/Baskerville, but the actual implementation uses Cinzel and Crimson Text.

### Font Usage
```jsx
// Headings (sharp, game-like)
<h1 className="font-display text-6xl text-silver-white font-light">

// Body text (highly legible serif)
<p className="font-body text-lg text-stone-grey">

// UI Labels, buttons, form labels
<label className="font-mono text-[10px] tracking-[0.2em] uppercase text-fog">
```

### Fluid Typography Scale
All type scales use `clamp()` for responsive sizing:
```javascript
'text-6xl': 'clamp(3.5rem, 8vw, 5.5rem)'     // Hero headlines
'text-5xl': 'clamp(3rem, 6vw, 4.5rem)'       
'text-4xl': 'clamp(2.25rem, 5vw, 3.5rem)'    
'text-3xl': 'clamp(1.75rem, 4vw, 2.5rem)'    
'text-2xl': 'clamp(1.5rem, 3vw, 2rem)'       
'text-xl': 'clamp(1.4rem, 2.8vw, 1.8rem)'    
'text-lg': 'clamp(1.375rem, 2.5vw, 1.5rem)'  // Body paragraphs (22-24px)
'text-base': '1.25rem' (20px)                 // Bold choice for luxury
'text-sm': '1.125rem' (18px)
'text-xs': '1rem' (16px)
```

---

## Spacing System

### Golden Ratio Fluid Spacing
Uses `clamp()` for viewport-responsive gaps:
```javascript
'space-1': 'clamp(0.25rem, 0.5vw, 0.375rem)'      // 4-6px - micro
'space-2': 'clamp(0.5rem, 1vw, 0.75rem)'          // 8-12px
'space-3': 'clamp(0.75rem, 1.5vw, 1rem)'          // 12-16px
'space-4': 'clamp(1.25rem, 2vw + 0.5rem, 1.618rem)' // 20-26px (φ)
'space-5': 'clamp(2rem, 3vw + 0.75rem, 2.618rem)'   // 32-42px (φ²)
'space-6': 'clamp(3rem, 4vw + 1rem, 4.236rem)'      // 48-68px (φ³)
'space-8': 'clamp(4.5rem, 6vw + 1.5rem, 6.854rem)'  // 72-110px (φ⁴)
'space-10': 'clamp(6rem, 8vw + 2rem, 11.09rem)'     // 96-178px (φ⁵)
'space-12': 'clamp(7rem, 10vw + 2.5rem, 14rem)'     // 112-224px (φ⁶)
```

### Usage Best Practices
- **Use `gap` on flex/grid containers** instead of margins on children
- Prefer `gap-space-*` utilities for consistent spacing
- Use `p-space-*` and `py-space-*` for internal padding

---

## Layout System

### Container Widths
```javascript
'container-narrow': '56rem'    // Blog posts, forms
'container-reading': '65ch'    // Optimal reading width
'container-wide': '90rem'      // Full-width sections
```

### Section Pattern
```jsx
<Section className="py-space-6">
  <Container size="wide">
    {/* Content */}
  </Container>
</Section>
```

### Components Available
- `<Section>` - Vertical spacing wrapper
- `<Container>` - Horizontal max-width wrapper with props: `size="narrow|reading|wide"`

---

## Components

### Buttons
```jsx
// Primary - Bronze with rune pattern overlay
<button className="btn-primary">
  Book a Consultation
</button>

// Secondary - Ghost variant (transparent, outline)
<button className="btn-secondary">
  Learn More
</button>
```

Both buttons include:
- Rune pattern overlay (`::before`)
- Shimmer animation on hover (`::after`)
- 44px minimum touch target
- Proper focus states

### Cards
```jsx
<div className="card">
  {/* Glassmorphic with subtle glow on hover */}
</div>
```

Features:
- `backdrop-filter: blur(20px)`
- Gradient overlay on hover
- Border transitions

### Forms
```jsx
<label className="form-label">Full Name</label>
<input className="form-input" type="text" />

<textarea className="form-textarea" />

<select className="form-select">
  <option>Choose...</option>
</select>
```

All form inputs:
- Minimal bottom border (not full border)
- Focus state with pale-gold accent
- 44px minimum height (accessibility)
- Glassmorphic background

---

## Animations

### Timing Functions
```javascript
'souls': 'cubic-bezier(0.25, 0.1, 0.25, 1)'  // Precise, linear
'sharp': 'cubic-bezier(0.4, 0, 0.6, 1)'      // Quick snap
'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)'     // Gentle ease
```

### Keyframe Animations
```javascript
'fade-in': '1.2s cubic-bezier(0.16, 1, 0.3, 1)'
'slide-up': '0.9s cubic-bezier(0.16, 1, 0.3, 1)'
'accordion-down/up': '0.5s ease-out'
'shimmer': '2s infinite'
```

### Usage with Framer Motion
```jsx
<motion.div
  initial={{ opacity: 0, y: 60 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ 
    duration: 0.9, 
    ease: [0.16, 1, 0.3, 1] 
  }}
>
```

---

## Border Radius

**Brutalist approach:** Sharp edges everywhere
```javascript
'rounded-lg': '0'
'rounded-md': '0'
'rounded-sm': '0'
```

---

## Textures & Backgrounds

### Grain Texture
Applied to `<body>` via inline SVG data URL:
- Fractal noise with `baseFrequency='0.9'` and `numOctaves='3'`
- Opacity: `0.05` (subtle, not overwhelming)
- Optimized for performance (not `background-attachment: fixed`)

### Fog Vignette
Applied as fixed `::before` pseudo-element on `<body>`:
- Gradient from top/bottom: `rgba(0,0,0,0.6)` → transparent
- Fixed positioning, pointer-events: none
- Z-index: 1 (content above at z-index: 2)

### Background Classes
```javascript
'bg-grain-heavy'   // Heavy texture overlay
'bg-fog-vignette'  // Gradient vignette
```

---

## Accessibility

### Minimum Sizes
- **Touch targets:** 44px minimum (buttons, inputs)
- **Text:** 20px base (1.25rem) for luxury readability

### Focus States
- All interactive elements have custom focus ring
- `box-shadow: 0 0 0 1px rgba(180, 170, 150, 0.4)`

### Color Contrast
⚠️ **Known Issue:** `fog` (#5a5a5a) on `void` (#000000) may not meet WCAG AA.
- Use `stone-grey` or `silver-white` for critical text
- Reserve `fog` for metadata, timestamps, less critical content

---

## File Structure

```
Components/
├── forms/              # Form-specific components
├── layout/             # Header, Footer, Section, Container
├── ornaments/          # CornerFlourish, decorative elements
├── pages/home/         # Homepage sections (Hero, CTA, Gallery, etc.)
├── shared/             # ProductCard, CartDrawer, TooltipHelp
└── ui/                 # Radix UI primitives (49 components)

Pages/
├── index.jsx           # Homepage
├── about.jsx
├── consultation.jsx
├── blog/
│   ├── index.jsx
│   └── [slug].jsx
└── _app.js, _document.js

styles/
└── globals.css         # Tailwind v4 theme + custom CSS

context/
└── CartContext.jsx     # Cart state (for future e-commerce)

data/
├── products.js         # Product catalog (15 items)
└── blog.js             # Blog posts (3 placeholder)
```

---

## Tech Stack

- **Framework:** Next.js 15.5.10 (Pages Router, static export)
- **Styling:** Tailwind CSS 4.1.18 (CSS-first config in `globals.css`)
- **Animation:** Framer Motion 12.29.2
- **UI Primitives:** Radix UI (accordion, dialog, dropdown, etc.)
- **Forms:** React Hook Form + Zod validation
- **Icons:** Lucide React

---

## Design Principles

1. **Brutal Minimalism:** Sharp edges, no rounded corners, no gradients (except subtle accents)
2. **Gallery Spacing:** Generous whitespace, golden ratio proportions
3. **Cold Palette:** Desaturated, muted tones - no warmth
4. **Precision Over Friendliness:** Video game UI aesthetic, not friendly SaaS
5. **Performance First:** Lightweight textures, optimized animations
6. **Accessibility Aware:** 44px touch targets, semantic HTML, focus states
7. **Mobile-First:** Fluid typography and spacing scale with viewport

---

## Future Considerations

- **E-commerce:** Product pages, collections, checkout flow (data exists, UI doesn't)
- **Blog CMS:** Contentful integration (currently placeholder posts)
- **Image Optimization:** Next.js Image (currently disabled for static export)
- **React 19:** Blocked by Radix UI compatibility
- **Error Boundaries:** None exist - should add for production
- **Analytics/Monitoring:** No error logging service integrated

---

## Quick Reference

### Most Common Classes
```jsx
// Text
text-silver-white    // Headings
text-stone-grey      // Body paragraphs
text-fog             // Metadata
text-pale-gold       // Accents, CTAs

// Backgrounds
bg-void              // Page background
bg-stone-dark        // Cards, mobile menu
bg-stone-deeper      // Forms, elevated surfaces

// Spacing
gap-space-4          // Standard component gaps
py-space-6           // Section padding
p-space-8            // Card padding

// Fonts
font-display         // Headings, UI
font-body            // Paragraphs
font-mono            // Labels, buttons
```

---

**Last Updated:** 2026-01-27 (Post Tailwind v4 migration, deprecated color cleanup)
