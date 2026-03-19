/**
 * Global Constants for Shelbz Citrine
 *
 * Central location for all magic strings, numbers, and configuration values.
 * Import from this file instead of hardcoding values throughout the app.
 */

// ============================================
// Site Configuration
// ============================================

export const SITE_CONFIG = {
  name: "Heritage Jewelry",
  url: "https://heritagejewelry.com",
  email: "contact@heritagejewelry.com",
  phone: "(360) 555-0123", // Update with actual phone
  location: "Olympia, WA",
};

// ============================================
// Color System (Design Tokens)
// ============================================

/**
 * Active color classes from design system
 * Use these instead of hardcoding color names
 */
export const COLORS = {
  // Backgrounds
  BG_PRIMARY: "bg-void",
  BG_ELEVATED: "bg-stone-dark",
  BG_FORM: "bg-stone-deeper",

  // Text
  TEXT_PRIMARY: "text-silver-white",
  TEXT_SECONDARY: "text-stone-grey",
  TEXT_MUTED: "text-fog",
  TEXT_ACCENT: "text-pale-gold",

  // Borders
  BORDER_DEFAULT: "border-fog/20",
  BORDER_FOCUS: "border-pale-gold/40",
  BORDER_ACCENT: "border-pale-gold",

  // Special
  ACCENT: "text-pale-gold",
  GRADIENT_ACCENT: "from-pale-gold to-silver-white",
};

// ============================================
// Typography
// ============================================

export const FONTS = {
  DISPLAY: "font-display", // Cinzel - Headings
  BODY: "font-body", // Crimson Text - Paragraphs
  UI: "font-ui", // Cinzel - UI elements
  MONO: "font-mono", // IBM Plex Mono - Labels, code
};

// ============================================
// Spacing (Golden Ratio - Fluid)
// NOTE: These override Tailwind defaults via --spacing-* variables
// Use p-1, m-1, gap-1 utilities - they now use our golden ratio scale
// ============================================

export const SPACING = {
  // Tailwind utility classes (p-1, m-1, etc.)
  MICRO: "1", // 4px → 6px
  SMALL: "2", // 8px → 12px
  MEDIUM: "3", // 12px → 16px
  NORMAL: "4", // 20px → 26px (φ)
  LARGE: "5", // 32px → 42px (φ²)
  XL: "6", // 48px → 68px (φ³)
  XXL: "8", // 72px → 110px (φ⁴)
  XXXL: "10", // 96px → 178px (φ⁵)
  MASSIVE: "12", // 112px → 224px
};

// ============================================
// Animations
// ============================================

/**
 * Standard animation timings and easings
 * Inspired by Souls games - precise, not slow
 */
export const ANIMATIONS = {
  // Timing functions (cubic-bezier values)
  EASE_DEFAULT: [0.25, 0.1, 0.25, 1], // browser default
  SOULS_TIMING: [0.16, 1, 0.3, 1], // site identity easing
  SHARP_TIMING: [0.4, 0, 0.6, 1],
  SMOOTH_TIMING: [0.4, 0, 0.2, 1],

  // Durations (milliseconds)
  INSTANT: 200,
  FAST: 300,
  NORMAL: 500,
  SLOW: 800,

  // Common animation delays
  STAGGER_DELAY: 0.15, // For staggered list animations

  // Scroll detection threshold
  SCROLL_THRESHOLD: 0.01,
};

// ============================================
// Forms
// ============================================

export const FORMS = {
  // Netlify Forms configuration
  CONSULTATION_FORM_NAME: "consultation",
  BOT_FIELD_NAME: "bot-field",

  // File uploads
  MAX_PHOTOS: 5,
  MAX_FILE_SIZE_MB: 5,
  MAX_FILE_SIZE_BYTES: 5 * 1024 * 1024, // 5MB
  ACCEPTED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp"],

  // Text inputs
  MAX_VISION_LENGTH: 500,
  MAX_NAME_LENGTH: 100,
  MAX_EMAIL_LENGTH: 100,
  MAX_PHONE_LENGTH: 20,

  // Validation
  MIN_BUDGET: 1000,
  MAX_BUDGET: 50000,
};

// ============================================
// Form Options (Dropdown Values)
// ============================================

export const FORM_OPTIONS = {
  consultationType: [
    { value: "zoom", label: "Zoom (Free)" },
    { value: "in-person", label: "In-Person (Olympia, WA)" },
  ],

  budgetRange: [
    { value: "2k-4k", label: "$2,000 - $4,000", min: 2000, max: 4000 },
    { value: "4k-7k", label: "$4,000 - $7,000", min: 4000, max: 7000 },
    { value: "7k-10k", label: "$7,000 - $10,000", min: 7000, max: 10000 },
    { value: "10k+", label: "$10,000+", min: 10000, max: null },
    {
      value: "flexible",
      label: "Flexible / Let's Discuss",
      min: null,
      max: null,
    },
  ],

  metalPreference: [
    { value: "14kt-gold", label: "14kt Gold" },
    { value: "18kt-gold", label: "18kt Gold" },
    { value: "platinum", label: "Platinum" },
    { value: "rose-gold", label: "Rose Gold" },
    { value: "white-gold", label: "White Gold" },
    { value: "not-sure", label: "Not Sure Yet" },
  ],

  fingerSize: [
    { value: "know", label: "I know my size" },
    { value: "measure", label: "I need to measure" },
    { value: "not-sure", label: "Not sure" },
  ],

  whichFinger: [
    { value: "ring", label: "Ring Finger" },
    { value: "middle", label: "Middle Finger" },
    { value: "index", label: "Index Finger" },
    { value: "pinky", label: "Pinky Finger" },
    { value: "other", label: "Other" },
  ],

  stoneType: [
    { value: "black-spinel", label: "Black Spinel (Recommended)" },
    { value: "black-diamond", label: "Black Diamond" },
    { value: "other-dark", label: "Other Dark Stone" },
    { value: "colored", label: "Colored Gemstone" },
    { value: "not-sure", label: "Not Sure / Need Guidance" },
  ],
};

// ============================================
// External Links
// ============================================

export const EXTERNAL_LINKS = {
  // Tools
  RING_SIZER: "https://www.bluenile.com/ring-sizer",

  // Inspiration / Partners
  ROYAL_KARKHANA: "https://royalkarkhana.com/",

  // Social media (update with actual links)
  INSTAGRAM: "https://instagram.com/heritagejewelry",
  PINTEREST: "https://pinterest.com/heritagejewelry",
};

// ============================================
// Product Collections
// ============================================

export const COLLECTIONS = {
  ADVENTURER: "adventurer",
  BRIDAL: "bridal",
  LEGENDARY: "legendary",
};

export const COLLECTION_INFO = {
  [COLLECTIONS.ADVENTURER]: {
    name: "Adventurer",
    priceRange: "$85 - $650",
    description: "Entry pieces for those beginning their journey",
  },
  [COLLECTIONS.BRIDAL]: {
    name: "Bridal",
    priceRange: "$265 - $4,200",
    description: "Black spinel engagement rings and wedding bands",
  },
  [COLLECTIONS.LEGENDARY]: {
    name: "Legendary",
    priceRange: "$1,800+",
    description: "Museum-quality showcase pieces",
  },
};

// ============================================
// Product Categories
// ============================================

export const CATEGORIES = {
  RINGS: "rings",
  PENDANTS: "pendants",
  EARRINGS: "earrings",
  BRACELETS: "bracelets",
  DICE: "dice",
  BLADES: "blades",
  TEXTILES: "textiles",
};

// ============================================
// Layout Breakpoints (Tailwind defaults)
// ============================================

export const BREAKPOINTS = {
  SM: 640, // px
  MD: 768, // px
  LG: 1024, // px
  XL: 1280, // px
  XXL: 1536, // px
};

// ============================================
// Component Variants
// ============================================

export const SECTION_VARIANTS = {
  DEFAULT: "default",
  HERO: "hero",
};

export const CONTAINER_SIZES = {
  NARROW: "narrow", // 56rem
  READING: "reading", // 65ch
  WIDE: "wide", // 90rem
};

export const BUTTON_VARIANTS = {
  PRIMARY: "primary",
  SECONDARY: "secondary",
};

// ============================================
// Accessibility
// ============================================

export const A11Y = {
  MIN_TOUCH_TARGET: 44, // px - WCAG 2.1 Level AAA
  FOCUS_RING_WIDTH: 1, // px
  FOCUS_RING_OPACITY: 0.4,
};

// ============================================
// Performance
// ============================================

export const PERFORMANCE = {
  IMAGE_QUALITY: 85, // JPEG quality (0-100)
  LAZY_LOAD_OFFSET: 200, // px before viewport
  DEBOUNCE_DELAY: 300, // ms for input debouncing
};

// ============================================
// Blog
// ============================================

export const BLOG = {
  POSTS_PER_PAGE: 10,
  EXCERPT_LENGTH: 150, // characters
};

// ============================================
// Cart (Future E-Commerce)
// ============================================

export const CART = {
  LOCAL_STORAGE_KEY: "shelbzCitrineCart",
  MAX_QUANTITY: 99,
  CURRENCY: "USD",
  CURRENCY_SYMBOL: "$",
};

// ============================================
// Meta / SEO
// ============================================

export const SEO = {
  DEFAULT_TITLE: "Custom Black Spinel Engagement Rings | Heritage Jewelry",
  DEFAULT_DESCRIPTION:
    "Bespoke black spinel engagement rings handcrafted by seventh-generational Indian artisans. Ethical sourcing, free consultation. Olympia, WA & nationwide via Zoom.",
  DEFAULT_OG_IMAGE: "/og-image.jpg",
  TWITTER_HANDLE: "@heritagejewelry",
};
