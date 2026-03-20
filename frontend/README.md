# Shelbz Citrine

**A digital manuscript for bespoke jewelry consultation** — combining dark academia aesthetics, fantasy game UI, and multigenerational Indian craftsmanship.

---

## 🎨 Design Philosophy

**What This Is:**

- A digital grimoire / illuminated tome
- Dark academia meets fantasy RPG (Guild Wars 2, Elden Ring, Elder Scrolls)
- Artisan portfolio aesthetic (slow, deliberate, craft-focused)

**What This Is NOT:**

- Corporate SaaS landing page
- Sterile minimalism
- Fast-paced, "modern" e-commerce

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production (static export for Netlify)
npm run build

# The build output will be in the `out/` directory
```

---

## 📁 Project Structure

```
heritage-jewelry/
├── Components/
│   ├── layout/
│   │   ├── Header.jsx          # Fantasy-themed navigation
│   │   └── Footer.jsx          # Dark academia footer
│   ├── sections/               # Landing page sections
│   │   ├── HeroSection.jsx
│   │   ├── ProblemSolutionSection.jsx
│   │   ├── ProcessSection.jsx
│   │   ├── GallerySection.jsx
│   │   ├── FAQSection.jsx
│   │   └── CTASection.jsx
│   ├── forms/
│   │   └── ConsultationForm.jsx # Multi-step booking form
│   ├── ornaments/              # SVG decorative elements
│   │   ├── OrnamentalDivider.jsx
│   │   └── CornerFlourish.jsx
│   └── ui/                     # shadcn/ui components
├── Pages/
│   ├── index.jsx               # Landing page
│   ├── consultation.jsx        # Booking form page
│   ├── about.jsx               # Mission & values
│   └── blog/
│       ├── index.jsx           # Blog listing
│       └── [slug].jsx          # Individual posts
├── styles/
│   └── globals.css             # Custom design system
├── tailwind.config.js          # Golden ratio spacing, custom colors
└── next.config.js              # Static export config
```

---

## 🎨 Design System

### Color Palette - "Candlelit Study"

```css
/* Backgrounds */
--ink-black: #0d0a07; /* Main (warm black, not pure #000) */
--parchment-dark: #1a1612; /* Cards */
--vellum: #2b2520; /* Elevated surfaces */

/* Accents */
--aged-gold: #d4af37; /* Primary (tarnished gold) */
--blood-ruby: #6b1e1e; /* CTAs (deep garnet) */
--verdigris: #3d5a4c; /* Secondary (oxidized copper) */
--amber-glow: #ff9b42; /* Hover states (candlelight) */

/* Text */
--bone-white: #f4ede4; /* Headings */
--ash-grey: #c9bdb1; /* Body */
--charcoal-mist: #8a7f73; /* Secondary text */
```

### Typography - "Illuminated Manuscript"

```css
/* Display - Headings, Quotes */
font-family: "Cinzel", serif; /* Renaissance serif */

/* Body - Reading */
font-family: "Crimson Pro", serif; /* Old-style serif */

/* UI - Buttons, Labels */
font-family: "Spectral", serif; /* Yes, serif buttons! */

/* Monospace - Technical */
font-family: "Courier Prime", monospace;
```

### Spacing - Golden Ratio (φ = 1.618)

```css
--space-1: 0.25rem; /* 4px */
--space-2: 0.618rem; /* ~10px */
--space-3: 1rem; /* 16px */
--space-4: 1.618rem; /* ~26px */
--space-5: 2.618rem; /* ~42px */
--space-6: 4.236rem; /* ~68px */
--space-8: 6.854rem; /* ~110px */
--space-10: 11.09rem; /* ~177px */
```

---

## 🎭 Animation Principles

**Slow & Sorcerous** — No 200-300ms corporate animations.

```css
/* Custom Timing Functions */
--ease-entrance: cubic-bezier(0.16, 1, 0.3, 1); /* Slow start, smooth end */
--ease-exit: cubic-bezier(0.7, 0, 0.84, 0); /* Smooth start, abrupt end */
--ease-mystical: cubic-bezier(0.68, -0.55, 0.27, 1.55); /* Slight overshoot */
```

**All animations:** 500ms-1200ms duration  
**Hover states:** 600-700ms  
**Page transitions:** 1200ms

---

## 📦 Tech Stack

- **Next.js 15** — Static Site Generation (SSG)
- **Tailwind CSS** — Custom design system
- **Framer Motion** — Slow, deliberate animations
- **Netlify** — Free hosting + form handling
- **Contentful** (future) — Headless CMS for blog

---

## 🎯 SEO Checklist

- [x] Semantic HTML5
- [x] Unique title/meta for each page
- [x] Open Graph + Twitter Card tags
- [x] Structured data (JSON-LD)
- [x] Sitemap.xml (auto-generated)
- [x] Image optimization (WebP, lazy loading)
- [x] Accessibility (WCAG 2.1 AA)

---

## 📝 Content Strategy

### Blog Topics (Launch with 10 posts)

1. "What Is Black Spinel? The Gemstone Everyone Mistakes for Onyx"
2. "14kt vs. 18kt Gold: What Jewelers Won't Tell You About Nickel Fillers"
3. "How a Ring Is Made: From Jaipur Workshop to Your Finger"
4. "Zircon: The Ancient Gem With a PR Problem"
5. "Handmade vs. Etsy 'Handmade'"
6. "Ethical Gemstone Sourcing: Why Your Diamond Might Fund Conflict"
7. "The Lost Art of Kundan Setting"
8. "Palladium vs. Platinum"
9. "Why We Don't Sell Pre-Made Jewelry"
10. "The Mystery Box Economy"

---

## 🚀 Deployment (Netlify)

### 1. Connect GitHub Repo

```
Build command: npm run build
Publish directory: out
```

### 2. Netlify Forms Setup

Add `data-netlify="true"` to consultation form (already configured).

### 3. Environment Variables

```env
NEXT_PUBLIC_SITE_URL=https://heritagejewelry.com
```

### 4. Deploy!

Push to `main` branch → Netlify auto-deploys.

---

## 🎨 Visual References

Study these sites for aesthetic direction:

- [Guild Wars 2](https://www.guildwars2.com/en/) — Texture, ornamental borders
- [Devran Dogaroglu](https://www.devrandogaroglu.com/) — Asymmetric layouts
- [Kate Vass Galerie](https://www.katevassgalerie.com/) — Serif-heavy, muted palette
- [Elden Ring](https://en.bandainamcoent.eu/elden-ring/elden-ring) — Weathered metal, fantasy typography
- [Elder Scrolls](https://elderscrolls.bethesda.net/en) — Old-world fonts, parchment textures

---

## 🛠️ Development Notes

### Adding New Pages

1. Create in `Pages/` directory
2. Use layout components:
   ```jsx
   import Header from "@/Components/layout/Header";
   import Footer from "@/Components/layout/Footer";
   ```
3. Add SEO meta tags in `<Head>`

### Adding Ornamental Elements

```jsx
import OrnamentalDivider from '@/Components/ornaments/OrnamentalDivider';
import CornerFlourish from '@/Components/ornaments/CornerFlourish';

<OrnamentalDivider />
<div className="card">
  <CornerFlourish position="top-left" />
  {/* Card content */}
</div>
```

### Using Custom Spacing

```jsx
<div className="py-space-10">      {/* Section padding */}
  <h2 className="mb-space-6">      {/* Heading margin */}
    <p className="mt-space-4">     {/* Paragraph spacing */}
```

---

## 📈 Success Metrics (First 6 Months)

**Traffic:**

- Month 1: 500 visitors
- Month 6: 5,000 visitors
- 40% organic search by Month 6

**Conversions:**

- 10 → 30 consultation bookings/month
- 200+ email subscribers

---

## 🤝 Partnership

Jewelry crafted in partnership with [Royal Karkhana](https://royalkarkhana.com) — 7th generation artisans in Jaipur, India.

---

## 📄 License

Proprietary. All rights reserved.

---

**Built with candlelight and code.** 📜✨
