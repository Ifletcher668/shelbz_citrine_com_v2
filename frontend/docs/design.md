# Design System Documentation

## Design Philosophy - "Souls-like Gallery Minimalism"

### Core Aesthetic Principles

**Cold, not warm**: Pure blacks (#000000), desaturated greys, metallic accents. No warmth, no comfort—only the stark beauty of stone and metal.

**Minimal, not ornate**: Museum-like spacing, subtle textures, restrained animation. Gallery curation over decorative excess.

**Sophisticated brutalism**: The weight of heritage, the precision of craft. Industrial materials treated with reverence.

**Sharp edges**: Zero border radius, angular corners, no roundness. Everything is deliberate, nothing is softened.

**Performance first**: Lightweight textures, optimized animations, no background-attachment: fixed. Speed is elegance.

### Design Influences

**Game UI References**:
- [**Elden Ring**](https://en.bandainamcoent.eu/elden-ring/elden-ring) - Dark fantasy aesthetic, cryptic elegance, item description prose
- [**Guild Wars 2**](https://www.guildwars2.com/en/) - Clean information hierarchy, metallic UI elements, fantasy meets sophistication
- [**The Elder Scrolls**](https://elderscrolls.bethesda.net/en) - Ancient mysticism, weathered textures, lore-heavy presentation

**Visual Inspiration**:
- **Metropolitan Museum** - Gallery spacing, museum-quality presentation, archival reverence
- **Dark Souls UI** - Minimalist inventory screens, cryptic item descriptions, gothic typography
- **Dark metal aesthetics** - Industrial materials, oxidized finishes, architectural brutalism

### What This Means in Practice

- **Typography**: Cinzel (display) for imperial proclamations, Crimson Text (body) for archival documents, IBM Plex Mono (UI) for technical precision
- **Spacing**: Wide, museum-like breathing room—let content command attention through emptiness
- **Animation**: Fast and purposeful (200-500ms), never floaty or playful
- **Textures**: Subtle grain and vignette, barely perceptible—suggestion over statement
- **Interactions**: Precise hover states, cold metallic highlights, no bouncy or organic motion
- **Color**: Monochromatic foundation with pale gold as the only warmth—a single torch in a vast cavern

---

## Spacing System

### Overview
Our spacing system uses fluid, viewport-responsive values that scale from mobile to desktop. All spacing is defined in `styles/globals.css` using CSS custom properties with `clamp()`.

### Spacing Scale

```css
--spacing-1:  clamp(0.25rem, 0.5vw,  0.5rem);   /* 4px  → 8px   */
--spacing-2:  clamp(0.5rem,  1vw,    0.75rem);  /* 8px  → 12px  */
--spacing-3:  clamp(0.75rem, 1.5vw,  1rem);     /* 12px → 16px  */
--spacing-4:  clamp(1rem,    2vw,    1.25rem);  /* 16px → 20px  */
--spacing-5:  clamp(1.25rem, 2.5vw,  1.5rem);   /* 20px → 24px  */
--spacing-6:  clamp(1.5rem,  3vw,    2rem);     /* 24px → 32px  */
--spacing-8:  clamp(2rem,    4vw,    3rem);     /* 32px → 48px  */
--spacing-10: clamp(2.5rem,  5vw,    4rem);     /* 40px → 64px  */
--spacing-12: clamp(3rem,    6vw,    5rem);     /* 48px → 80px  */
--spacing-16: clamp(4rem,    8vw,    6rem);     /* 64px → 96px  */
--spacing-20: clamp(5rem,    10vw,   8rem);     /* 80px → 128px */
```

### Spacing Hierarchy

Use spacing consistently to create clear visual hierarchy:

#### 1. Section-Level Spacing (`gap-12`, `gap-16`, `gap-20`)
**48-128px fluid range**

Use for:
- Between major section headings and content
- Between major content blocks within a section
- Hero section internal spacing
- Top-level container gaps

```jsx
<div className="flex flex-col gap-12">
  <h2>Section Title</h2>
  <div className="content">...</div>
</div>
```

#### 2. Content Block Spacing (`gap-8`, `gap-10`)
**32-64px fluid range**

Use for:
- Between paragraphs in text blocks
- Between grid items (cards, product cards)
- Between content groups within sections
- Between heading and body text groups
- Card grid gaps

```jsx
<div className="flex flex-col gap-8">
  <p>First paragraph...</p>
  <p>Second paragraph...</p>
  <p>Third paragraph...</p>
</div>

<div className="grid grid-cols-3 gap-8">
  <Card />
  <Card />
  <Card />
</div>
```

#### 3. Component Internal Spacing (`gap-6`)
**24-32px fluid range**

Use for:
- Within individual cards (icon to content, title to description)
- Between form label and input
- Between related UI elements
- Internal card spacing

```jsx
<div className="flex items-start gap-6">
  <Icon />
  <div className="flex flex-col gap-6">
    <h3>Title</h3>
    <p>Description</p>
  </div>
</div>
```

#### 4. Tight Relationships (`gap-4`, `gap-5`)
**16-24px fluid range**

Use for:
- Inline elements (icon + text)
- Button groups
- Tag lists
- Navigation items
- Very closely related elements

```jsx
<a className="inline-flex items-center gap-4">
  <span>Link Text</span>
  <ExternalLink className="w-4 h-4" />
</a>
```

#### 5. Micro Spacing (`gap-2`, `gap-3`)
**8-16px fluid range**

Use for:
- Badge internal padding
- Dense UI elements
- Tightly grouped chips/tags
- Form hints below inputs

### Padding Guidelines

Follow the same hierarchy for padding:

- **Large containers**: `p-10` or `p-12` (40-80px)
- **Cards**: `p-8` (32-48px)
- **Compact cards**: `p-6` (24-32px)
- **Buttons**: `px-12 py-4` or similar
- **Form inputs**: `p-4` (16-20px)

### Common Patterns

#### Page Section
```jsx
<Section>
  <Container>
    <div className="flex flex-col gap-12">
      <h2>Section Title</h2>
      <div className="flex flex-col gap-8">
        {/* Content blocks */}
      </div>
    </div>
  </Container>
</Section>
```

#### Card Grid
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  <Card className="p-8">
    <div className="flex flex-col gap-6">
      <h3>Card Title</h3>
      <p>Card content</p>
    </div>
  </Card>
</div>
```

#### Text Content
```jsx
<div className="flex flex-col gap-8 max-w-4xl">
  <p>First paragraph with proper spacing...</p>
  <p>Second paragraph with proper spacing...</p>
  <p>Third paragraph with proper spacing...</p>
</div>
```

### Don't Mix Spacing Scales

Avoid jumping between spacing scales without reason. Follow the hierarchy:

```jsx
// ❌ Bad - inconsistent spacing
<div className="flex flex-col gap-5">
  <h2>Title</h2>
  <div className="flex flex-col gap-7">
    <p>Text</p>
  </div>
</div>

// ✅ Good - consistent hierarchy
<div className="flex flex-col gap-12">
  <h2>Title</h2>
  <div className="flex flex-col gap-8">
    <p>Text</p>
  </div>
</div>
```

## Typography Scale

### Font Sizes

```css
--text-6xl:   clamp(3.5rem,  8vw, 5.5rem);     /* Hero titles */
--text-5xl:   clamp(3rem,    6vw, 4.5rem);     /* Page titles */
--text-4xl:   clamp(2.25rem, 5vw, 3.5rem);     /* Section headers */
--text-3xl:   clamp(1.75rem, 4vw, 2.5rem);     /* Subsection headers */
--text-2xl:   clamp(1.5rem,  3vw, 2rem);       /* Card titles */
--text-xl:    clamp(1.4rem,  2.8vw, 1.8rem);   /* Large body text */
--text-lg:    clamp(1.375rem, 2.5vw, 1.5rem);  /* Body text */
--text-md:    clamp(1.25rem, 2vw, 1.375rem);   /* Medium body text */
--text-base:  1.25rem;                          /* Base size */
--text-sm:    1.125rem;                         /* Small text */
--text-xs:    1rem;                             /* Extra small */
```

### Line Height Scale

```css
--leading-none:     1;      /* Tight titles */
--leading-tight:    1.25;   /* Headers */
--leading-snug:     1.375;  /* Subheaders */
--leading-normal:   1.5;    /* Standard */
--leading-relaxed:  1.625;  /* Body text (default) */
--leading-loose:    2;      /* Airy spacing */
```

## Color System

### Primary Colors

```css
--color-void:           #000000;  /* Pure black background */
--color-stone-dark:     #0a0a0a;  /* Near black */
--color-stone-deeper:   #141414;  /* Dark grey */
--color-fog:            #5a5a5a;  /* Mid grey */
--color-stone-grey:     #8c8273;  /* Body text */
--color-silver-white:   #e5e0d8;  /* Headers, bright text */
--color-pale-gold:      #b4aa96;  /* Accent, highlights */
```

### Semantic Colors

```css
--color-steel-blue:     #424852;  /* Secondary elements */
--color-frost-blue:     #b8c5d6;  /* Cool highlights */
--color-deep-crimson:   #4a1a1a;  /* Destructive actions */
--color-moss-green:     #2d3a2e;  /* Success states */
--color-cold-bronze:    #291d0466; /* Button backgrounds */
```

## Component Patterns

### Buttons

Use consistent padding and spacing:

```jsx
// Primary
<button className="btn-primary">
  Button Text
</button>

// Secondary
<button className="btn-secondary">
  Button Text
</button>
```

### Cards

Standard card with proper spacing:

```jsx
<div className="bg-stone-deeper border border-fog/20 heavy-shadow p-8">
  <div className="flex flex-col gap-6">
    <h3>Card Title</h3>
    <p>Card content with proper spacing</p>
  </div>
</div>
```

### Forms

```jsx
<div className="flex flex-col gap-6">
  <label className="form-label">Label Text</label>
  <input className="form-input" />
</div>
```

## Implementation Notes

1. **Always use the spacing scale** - Don't use arbitrary values like `gap-7` or `gap-11`
2. **Follow the hierarchy** - Larger gaps for major sections, smaller for related content
3. **Be consistent** - Use the same spacing for similar elements across pages
4. **Fluid by default** - All spacing scales with viewport automatically
5. **Trust the system** - The values are designed to work together harmoniously

## Reference Implementation

See `Pages/about.jsx` for a complete example of proper spacing hierarchy implementation.
