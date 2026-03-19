# Components Directory

This directory contains all reusable React components for shelbz-citrine.com

## Organization

```
Components/
├── layout/         # Core layout components (Header, Footer, Section, Container)
├── pages/home/     # Homepage-specific sections
├── shared/         # Reusable utility components
├── forms/          # Form components
├── ornaments/      # Decorative elements (corner flourishes, dividers)
├── ui/             # Radix UI primitives (49 components)
└── index.js        # Barrel export (use this for imports!)
```

## Usage

### Recommended: Use Barrel Exports

```javascript
// ✅ Good - Clean imports from barrel
import { Section, Container, Header } from "@/Components";

// ❌ Avoid - Direct imports (harder to refactor)
import { Section } from "@/Components/layout/Section";
import Header from "@/Components/layout/Header";
```

## Core Components

### Layout

#### Section

Standardized section wrapper with consistent vertical spacing.

```jsx
<Section variant="hero" background="stone-dark">
  {children}
</Section>
```

**Props:**

- `variant`: `"default"` | `"hero"` (adds extra top padding for hero sections)
- `background`: `"void"` | `"stone-dark"` | `"transparent"`
- `className`: Additional CSS classes

#### Container

Standardized container for max-width and horizontal padding.

```jsx
<Container size="reading">{children}</Container>
```

**Props:**

- `size`: `"narrow"` (56rem) | `"reading"` (65ch) | `"wide"` (90rem)
- `className`: Additional CSS classes

**Common Pattern:**

```jsx
<Section variant="hero">
  <Container size="wide">
    <h1>Content</h1>
  </Container>
</Section>
```

### Shared

#### BackgroundTexture

SVG texture overlay for sections.

```jsx
<BackgroundTexture variant="grain" opacity={0.05} />
```

**Props:**

- `variant`: `"grain"` | `"rune"` | `"fog"` (default: `"grain"`)
- `opacity`: Number between 0-1 (default: 0.05)

**Note:** Keep opacity low (0.02-0.05) to avoid performance issues.

#### TooltipHelp

Inline help tooltip using Radix UI.

```jsx
<TooltipHelp tooltip="Ring sizes typically range from 4-12">
  Ring Size
</TooltipHelp>
```

**Props:**

- `tooltip`: String - Help text to display
- `children`: React node - Trigger element

#### CartDrawer

Slide-in cart drawer (for future e-commerce).

```jsx
<CartDrawer />
```

Automatically manages its own open/close state via CartContext.

### Forms

#### ConsultationForm

Multi-step consultation booking form with Netlify Forms integration.

```jsx
<ConsultationForm />
```

**Features:**

- 3-step wizard (Contact → Ring Details → Vision/Photos)
- Zod validation
- File upload (up to 5 images, 5MB each)
- Progress bar
- Netlify Forms submission

**Note:** Uses constants from `lib/constants.js` (FORMS.\*)

### Ornaments

#### FourCornerFlourish

Decorative corner accents (top-left, top-right, bottom-left, bottom-right).

```jsx
<FourCornerFlourish />
```

Absolute positioned, so parent needs `relative`.

#### SimpleDivider

Horizontal ornamental divider.

```jsx
<SimpleDivider className="my-space-6" />
```

### Homepage Sections

All homepage sections are self-contained (no props):

- `HeroSection` - Hero with headline, subtitle, CTA
- `ProblemSolutionSection` - Problem/solution messaging
- `ProcessSection` - How custom orders work
- `GallerySection` - Portfolio gallery grid
- `FAQSection` - Accordion FAQ
- `CTASection` - Final call-to-action

**Usage:**

```jsx
// Pages/index.jsx
import {
  HeroSection,
  ProblemSolutionSection,
  ProcessSection,
  GallerySection,
  FAQSection,
  CTASection,
} from "@/Components";

export default function Home() {
  return (
    <>
      <HeroSection />
      <ProblemSolutionSection />
      <ProcessSection />
      <GallerySection />
      <FAQSection />
      <CTASection />
    </>
  );
}
```

## UI Components (Radix/shadcn)

The `ui/` directory contains 49 Radix UI primitives styled with shadcn patterns.

**Common ones:**

- `Button` - Primary/secondary button variants
- `Input`, `Textarea`, `Label` - Form inputs
- `Dialog` - Modal dialogs
- `Accordion` - Collapsible sections
- `Card` - Card container

**Usage:**

```jsx
import { Button, Dialog, DialogTrigger, DialogContent } from "@/Components";

<Dialog>
  <DialogTrigger asChild>
    <Button variant="primary">Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
    </DialogHeader>
    {content}
  </DialogContent>
</Dialog>;
```

**Note:** Most UI components support `variant` prop with shadcn standard variants.

## Design System Integration

All components use design system tokens from:

- `lib/constants.js` - Colors, spacing, animations, form config
- `lib/animations.js` - Framer Motion animation presets
- `lib/validation.js` - Form validation utilities

### Colors

Use semantic color constants:

```jsx
import { COLORS } from "@/lib/constants";

<div className={COLORS.BG_PRIMARY}>
  {" "}
  {/* bg-void */}
  <h1 className={COLORS.TEXT_PRIMARY}>Heading</h1> {/* text-silver-white */}
  <p className={COLORS.TEXT_SECONDARY}>Body text</p> {/* text-stone-grey */}
</div>;
```

### Animations

Use animation presets:

```jsx
import { fadeInUp } from "@/lib/animations";

<motion.div {...fadeInUp(0.2)}>Content</motion.div>;
```

## Component Guidelines

### DO ✓

- Use PropTypes for all components
- Add JSDoc comments with examples
- Import from barrel (`@/Components`)
- Use constants from `lib/constants.js`
- Use animation presets from `lib/animations.js`
- Follow Souls-like design (sharp, fast, minimal)
- Keep component files focused (single responsibility)

### DON'T ✗

- Hardcode colors (use design tokens)
- Hardcode animation timings (use presets)
- Create slow animations (>800ms)
- Use rounded corners (brutalist design = sharp edges)
- Stack multiple background textures (performance)
- Use `console.log` in production code

## Adding New Components

1. **Create the component** in appropriate directory
2. **Add PropTypes** and JSDoc comments
3. **Export from index.js** (barrel file)
4. **Document in this README** if it's a commonly used component
5. **Use constants** from `lib/constants.js` instead of magic values

**Example template:**

```jsx
import PropTypes from "prop-types";
import { COLORS, SPACING } from "@/lib/constants";

/**
 * Component description
 *
 * @component
 * @example
 * <MyComponent variant="primary">Content</MyComponent>
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Description
 * @param {"primary"|"secondary"} props.variant - Description
 */
export default function MyComponent({ children, variant = "primary" }) {
  return <div className={`component ${variant}`}>{children}</div>;
}

MyComponent.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(["primary", "secondary"]),
};
```

## Future Improvements

- [ ] Add Storybook for component showcase
- [ ] Add unit tests (Jest + React Testing Library)
- [ ] Convert to TypeScript for better type safety
- [ ] Add visual regression testing
- [ ] Create component usage analytics

## Questions?

See `DESIGN_SYSTEM.md` for design tokens and patterns.
See `.claude.md` for overall project context and AI guidelines.
