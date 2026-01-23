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
      // Heritage Jewelry Design System - "Souls-like Gallery Minimalism"
      // Elden Ring × Dark Souls × Metropolitan Museum × Behemoth
      colors: {
        // Primary Palette - Void & Stone
        void: "#000000", // Pure black void
        "stone-dark": "#0a0a0a", // Almost void
        "stone-deeper": "#141414", // Slight lift from void

        // Neutral Greys - Cold & Desaturated
        fog: "#3c3c3c", // Dark fog
        "stone-grey": "#8c8273", // Desaturated stone
        "silver-white": "#e5e0d8", // Cold silver-white

        // Accent Colors - Muted Metals
        "pale-gold": "#b4aa96", // Desaturated gold
        "cold-bronze": "#291d0466", // Dark bronze
        "steel-blue": "#424852", // Cold steel

        // Sparse Accent Touches
        "frost-blue": "#b8c5d6", // Icy blue (for rare highlights)
        "deep-crimson": "#4a1a1a", // Very dark blood
        "moss-green": "#2d3a2e", // Dark moss

        // shadcn/ui compatibility (mapped to new Souls palette)
        border: "rgba(60, 60, 60, 0.2)",
        input: "#0a0a0a",
        ring: "#b4aa96",
        background: "#000000",
        foreground: "#e5e0d8",
        primary: {
          DEFAULT: "#b4aa96",
          foreground: "#000000",
        },
        secondary: {
          DEFAULT: "#424852",
          foreground: "#e5e0d8",
        },
        destructive: {
          DEFAULT: "#4a1a1a",
          foreground: "#e5e0d8",
        },
        muted: {
          DEFAULT: "#141414",
          foreground: "#8c8273",
        },
        accent: {
          DEFAULT: "#b4aa96",
          foreground: "#000000",
        },
        popover: {
          DEFAULT: "#0a0a0a",
          foreground: "#e5e0d8",
        },
        card: {
          DEFAULT: "#0a0a0a",
          foreground: "#8c8273",
        },
      },

      // Typography - Brutalist Gallery
      fontFamily: {
        garamond: ["EB Garamond", "Cormorant Garamond", "Georgia", "serif"],
        baskerville: ["Libre Baskerville", "Baskerville", "serif"],
        mono: ["IBM Plex Mono", "Courier New", "monospace"],
        // Fallbacks
        serif: ["EB Garamond", "Georgia", "serif"],
        sans: ["IBM Plex Mono", "monospace"], // Monospace for UI elements
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

      // Custom Timing Functions - Precise & Linear
      transitionTimingFunction: {
        souls: "cubic-bezier(0.25, 0.1, 0.25, 1)",
        sharp: "cubic-bezier(0.4, 0, 0.6, 1)",
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },

      // Background Images
      backgroundImage: {
        "grain-heavy":
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.4' numOctaves='6' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E\")",
        "fog-vignette":
          "linear-gradient(to bottom, rgba(0, 0, 0, 0.9) 0%, transparent 20%, transparent 80%, rgba(0, 0, 0, 0.9) 100%)",
      },

      // Border Radius - Brutalist (sharp edges)
      borderRadius: {
        lg: "0",
        md: "0",
        sm: "0",
        none: "0",
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
