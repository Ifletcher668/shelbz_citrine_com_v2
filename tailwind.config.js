/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./Pages/**/*.{js,jsx}",
    "./pages/**/*.{js,jsx}",
    "./Components/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      // Heritage Jewelry Design System - "Candlelit Study Meets Fantasy Craft"
      // UPDATED: Darker, heavier, more metallic dissonance
      colors: {
        // Primary Palette - Base Layers (DARKER + MORE WEIGHT)
        "ink-black": "#08060a", // Almost pure black with purple tint
        "parchment-dark": "#0f0d0e", // Deeper, more ominous
        vellum: "#1a1618", // Charcoal with red undertone

        // Accent Palette - Metallic & Organic (HEAVIER METALS)
        "aged-gold": "#c9a961", // Duller, more tarnished gold
        verdigris: "#2a4039", // Darker oxidized copper
        rust: "#6b3410", // Deeper iron oxide
        "blood-ruby": "#5a1414", // Darker, dried blood

        // Text Hierarchy (LOWER CONTRAST for tension)
        "bone-white": "#e8dfd5", // Slightly yellowed bone
        "ash-grey": "#b0a598", // More muted
        "charcoal-mist": "#6e6559", // Lower visibility
        "sepia-shadow": "#3a352f", // Deeper shadow

        // Utility Colors (METALLIC EDGE)
        obsidian: "#161412", // True volcanic glass
        "amber-glow": "#d97d2e", // Duller ember
        "emerald-deep": "#1f3329", // Forest shadow
        "steel-grey": "#4a4a52", // NEW: Cold metal
        "bronze-patina": "#5c4a3a", // NEW: Aged bronze

        // shadcn/ui compatibility (map to new palette)
        border: "#161412",
        input: "#1a1618",
        ring: "#c9a961",
        background: "#08060a",
        foreground: "#e8dfd5",
        primary: {
          DEFAULT: "#c9a961",
          foreground: "#08060a",
        },
        secondary: {
          DEFAULT: "#2a4039",
          foreground: "#e8dfd5",
        },
        destructive: {
          DEFAULT: "#6b1e1e",
          foreground: "#f4ede4",
        },
        muted: {
          DEFAULT: "#1a1612",
          foreground: "#8a7f73",
        },
        accent: {
          DEFAULT: "#d4af37",
          foreground: "#0d0a07",
        },
        popover: {
          DEFAULT: "#1a1612",
          foreground: "#f4ede4",
        },
        card: {
          DEFAULT: "#1a1612",
          foreground: "#c9bdb1",
        },
      },

      // Typography - "Illuminated Manuscript"
      fontFamily: {
        cinzel: ["Cinzel", "serif"],
        crimson: ["Crimson Pro", "serif"],
        spectral: ["Spectral", "serif"],
        courier: ["Courier Prime", "monospace"],
        // Fallbacks
        serif: ["Crimson Pro", "Georgia", "serif"],
        sans: ["Spectral", "serif"], // Yes, serif for UI!
      },

      // Fluid Typography
      fontSize: {
        "6xl": "clamp(3rem, 8vw, 5rem)",
        "5xl": "clamp(2.5rem, 6vw, 4rem)",
        "4xl": "clamp(2rem, 5vw, 3rem)",
        "3xl": "clamp(1.5rem, 4vw, 2.25rem)",
        "2xl": "clamp(1.25rem, 3vw, 1.875rem)",
        lg: "1.125rem",
        base: "1rem",
        sm: "0.875rem",
        xs: "0.75rem",
      },

      // Line Height
      lineHeight: {
        tight: "1.2",
        relaxed: "1.75",
        loose: "2",
      },

      // Letter Spacing
      letterSpacing: {
        tighter: "-0.05em",
        wide: "0.05em",
        wider: "0.15em",
      },

      // Golden Ratio Spacing
      spacing: {
        "space-1": "0.25rem",
        "space-2": "0.618rem",
        "space-3": "1rem",
        "space-4": "1.618rem",
        "space-5": "2.618rem",
        "space-6": "4.236rem",
        "space-8": "6.854rem",
        "space-10": "11.09rem",
      },

      // Container Widths - Asymmetric
      maxWidth: {
        "container-narrow": "42rem",
        "container-reading": "65ch",
        "container-wide": "90rem",
      },

      // Custom Timing Functions
      transitionTimingFunction: {
        entrance: "cubic-bezier(0.16, 1, 0.3, 1)",
        exit: "cubic-bezier(0.7, 0, 0.84, 0)",
        mystical: "cubic-bezier(0.68, -0.55, 0.27, 1.55)",
      },

      // Background Images
      backgroundImage: {
        parchment:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")",
        vignette:
          "radial-gradient(ellipse at center, transparent 0%, #0d0a07 100%)",
      },

      // Border Radius (minimal - squared edges)
      borderRadius: {
        lg: "0",
        md: "0",
        sm: "0",
      },

      // Animations
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(60px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(100%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.5s ease-out",
        "accordion-up": "accordion-up 0.5s ease-out",
        "fade-in": "fade-in 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-up": "slide-up 0.9s cubic-bezier(0.16, 1, 0.3, 1)",
        shimmer: "shimmer 2s infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
