/**
 * Components Barrel Export
 *
 * Central export file for all reusable components.
 * Allows clean imports: import { Section, Header } from '@/Components';
 *
 * Organized by category for better discoverability.
 */

// ============================================
// Layout Components
// ============================================

export { Section, Container } from "./layout/Section";
export { default as Header } from "./layout/Header";
export { default as Footer } from "./layout/Footer";

// ============================================
// Shared Components
// ============================================

export { default as ProductCard } from "./shared/ProductCard";
export { default as CartDrawer } from "./shared/CartDrawer";
export { default as TooltipHelp } from "./shared/TooltipHelp";
export { default as BackgroundTexture } from "./shared/BackgroundTexture";
export { default as GlobalSVGDefs } from "./shared/GlobalSVGDefs";

// ============================================
// Form Components
// ============================================

// Note: Consultation form is currently implemented inline in Pages/consultation.jsx
// No reusable form components at this time

// ============================================
// Ornamental Components
// ============================================

export {
  FourCornerFlourish,
  TwoCornerFlourish,
  GothicCorner,
} from "./ornaments/CornerFlourish";

export { default as SimpleDivider } from "./ornaments/OrnamentalDivider";

// ============================================
// Homepage Sections
// ============================================

export { default as HeroSection } from "./pages/home/HeroSection";
export { default as ProblemSolutionSection } from "./pages/home/ProblemSolutionSection";
export { default as ProcessSection } from "./pages/home/ProcessSection";
export { default as GallerySection } from "./pages/home/GallerySection";
export { default as FAQSection } from "./pages/home/FAQSection";
export { default as CTASection } from "./pages/home/CTASection";

// ============================================
// UI Components (Radix/shadcn)
// Note: These are available but not commonly used directly.
// Import from @/Components/ui/* when needed.
// ============================================

// Export commonly used UI components for convenience
export { Button } from "./ui/button";
export { Input } from "./ui/input";
export { Textarea } from "./ui/textarea";
export { Label } from "./ui/label";
export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "./ui/accordion";
export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
