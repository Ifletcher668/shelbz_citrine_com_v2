# Spacing System Guide

## Overview

This project uses a **fluid spacing system** with viewport-responsive tokens that scale smoothly between mobile and desktop. All spacing uses `gap` on flex/grid containers instead of margins on children.

---

## Spacing Tokens

All spacing tokens use CSS `clamp()` to scale fluidly with viewport width:

| Token | Mobile (375px) | Desktop (1440px+) | Use Case |
|-------|----------------|-------------------|----------|
| `space-1` | 4px | 6px | Icon gaps, tight inline elements |
| `space-2` | 8px | 12px | Button padding, small gaps |
| `space-3` | 12px | 16px | Input padding, badge spacing |
| `space-4` | 20px | 26px | Default gap - cards, form fields |
| `space-5` | 32px | 42px | Card internal padding |
| `space-6` | 48px | 68px | Section internal spacing |
| `space-8` | 72px | 110px | Section gaps - between major sections |
| `space-10` | 96px | 178px | Hero padding, dramatic spacing |
| `space-12` | 112px | 224px | Extreme macro spacing (rare) |

---

## Core Principles

### 1. **Gap Over Margins**

✅ **DO:** Use `gap` on flex/grid containers
```jsx
<div className="flex flex-col gap-space-4">
  <Card />
  <Card />
</div>
```

❌ **DON'T:** Use margins on children
```jsx
<div>
  <Card className="mb-space-4" />
  <Card className="mb-space-4" />
</div>
```

**Why?**
- Gaps are predictable - every child gets the same spacing
- Margins are unpredictable - last child needs special handling
- Gaps don't collapse like margins do
- Changing spacing happens in one place

---

### 2. **Fluid Spacing Scales Automatically**

No breakpoint jumps - spacing scales smoothly:

```css
gap-space-6: gap: clamp(3rem, 4vw + 1rem, 4.236rem);
                   └─48px  └─responsive   └─68px
```

Mobile gets 48px, desktop gets 68px, everything in between scales proportionally.

---

## Common Patterns

### Vertical Layouts (Stack)
```jsx
<div className="flex flex-col gap-space-4">
  <h2>Title</h2>
  <p>Description</p>
  <Button />
</div>
```

### Horizontal Layouts (Flex)
```jsx
<div className="flex items-center justify-between gap-space-3">
  <Logo />
  <nav className="flex items-center gap-space-2">
    <Link>About</Link>
    <Link>Blog</Link>
  </nav>
</div>
```

### Grid Layouts
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-6">
  <Card />
  <Card />
  <Card />
</div>
```

### Centering
```jsx
<div className="flex items-center justify-center gap-space-4">
  <Icon />
  <span>Text</span>
</div>
```

---

## Usage by Context

### Component Internal Spacing
```jsx
<div className="p-space-5">
  <div className="flex flex-col gap-space-3">
    <h3>Title</h3>
    <p>Description</p>
  </div>
</div>
```

### Form Fields
```jsx
<form className="flex flex-col gap-space-4">
  <input />
  <input />
  <button />
</form>
```

### Card Grid
```jsx
<Section>
  <Container>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-space-6">
      <Card className="p-space-5">
        <div className="flex flex-col gap-space-4">
          <h3>Title</h3>
          <p>Description</p>
        </div>
      </Card>
    </div>
  </Container>
</Section>
```

### Hero Section
```jsx
<Section variant="hero">
  <Container>
    <div className="flex flex-col gap-space-6 items-center text-center">
      <h1>Headline</h1>
      <p>Subheading</p>
      <div className="flex flex-col sm:flex-row gap-space-4">
        <Button />
        <Button />
      </div>
    </div>
  </Container>
</Section>
```

### Icon + Text Pattern
```jsx
<div className="flex items-center gap-space-2">
  <Icon className="w-5 h-5" />
  <span>Text</span>
</div>
```

---

## Section & Container Components

These semantic components are kept for page-level structure:

### Section
```jsx
<Section variant="hero" background="stone-dark" className="relative">
  {/* Section handles py-space-6 automatically */}
</Section>
```

**Props:**
- `variant`: "default" | "hero"
- `background`: "void" | "stone-dark" | "transparent"

### Container
```jsx
<Container size="narrow" className="relative z-10">
  {/* Container handles max-width and horizontal padding */}
</Container>
```

**Props:**
- `size`: "narrow" | "reading" | "wide" (default)

---

## Migration Checklist

When creating new components:

- [ ] Use `gap-space-*` on flex/grid containers (not margins on children)
- [ ] Use Tailwind IntelliSense-friendly classes
- [ ] No arbitrary gap values - use design system tokens
- [ ] Spacing scales appropriately on mobile/desktop
- [ ] Use `<Section>` and `<Container>` for page structure
- [ ] No `space-y-*` classes (use `flex flex-col gap-space-*` instead)

---

## Examples from the Codebase

### Before (Fixed Spacing)
```jsx
<div className="mb-8">
  <h2 className="mb-6">Title</h2>
  <div className="grid md:grid-cols-2 gap-12">
    <div className="p-10">
      <h3 className="mb-4">Feature</h3>
      <p>Description</p>
    </div>
  </div>
</div>
```

### After (Fluid Spacing with Gap)
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-space-8">
  <div className="p-space-5">
    <div className="flex flex-col gap-space-4">
      <h3>Feature</h3>
      <p>Description</p>
    </div>
  </div>
</div>
```

**Benefits:**
- No margins to manage
- Spacing scales fluidly with viewport
- Consistent across entire site
- Tailwind IntelliSense works

---

## Quick Reference

**Most Common Patterns:**

```jsx
// Vertical stack
<div className="flex flex-col gap-space-4">

// Horizontal flex
<div className="flex items-center gap-space-3">

// Grid
<div className="grid grid-cols-1 md:grid-cols-2 gap-space-6">

// Centered content
<div className="flex items-center justify-center gap-space-2">

// Responsive flex direction
<div className="flex flex-col sm:flex-row gap-space-4">
```

---

## Tailwind Config Reference

The spacing tokens are defined in `tailwind.config.js` and automatically work with all Tailwind utilities:

```javascript
spacing: {
  "space-1": "clamp(0.25rem, 0.5vw, 0.375rem)",
  "space-2": "clamp(0.5rem, 1vw, 0.75rem)",
  "space-3": "clamp(0.75rem, 1.5vw, 1rem)",
  "space-4": "clamp(1.25rem, 2vw + 0.5rem, 1.618rem)",
  "space-5": "clamp(2rem, 3vw + 0.75rem, 2.618rem)",
  "space-6": "clamp(3rem, 4vw + 1rem, 4.236rem)",
  "space-8": "clamp(4.5rem, 6vw + 1.5rem, 6.854rem)",
  "space-10": "clamp(6rem, 8vw + 2rem, 11.09rem)",
  "space-12": "clamp(7rem, 10vw + 2.5rem, 14rem)",
}
```

These work with:
- `gap-space-*`
- `p-space-*` / `px-space-*` / `py-space-*`
- `m-space-*` (but avoid margins on children!)
- `space-x-space-*` / `space-y-space-*` (deprecated - use gap instead)

---

## Benefits of This System

✅ **Smooth scaling** - No breakpoint jumps  
✅ **Consistent spacing** - Design system enforced  
✅ **Less CSS** - Gap replaces margin management  
✅ **Tailwind IntelliSense** - Full autocomplete support  
✅ **Golden ratio preserved** - Aesthetic harmony at all sizes  
✅ **Performance** - Native CSS, no JavaScript calculations  

---

## Philosophy

**Spacing should be:**
- Predictable (gap on parents)
- Consistent (design tokens)
- Fluid (scales with viewport)
- Simple (vanilla Tailwind)

That's it. No abstractions needed.
