import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import BackgroundTexture from "@/Components/shared/BackgroundTexture";
import { SimpleDivider } from "@/Components/ornaments/OrnamentalDivider";
import { getHeader, getStrapiMediaUrl } from "@/lib/strapi";

/**
 * Header Component - "Grimoire Navigation"
 * - Sticky header with parchment texture on scroll
 * - Fantasy game aesthetic (no corporate feel)
 * - Serif fonts throughout
 * - Slow, deliberate animations
 */

const FALLBACK_PRIMARY = { type: "text", text: "Shelbz Citrine", link: "/" };

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cmsData, setCmsData] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0.01);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    getHeader()
      .then(setCmsData)
      .catch(() => {});
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const navLinks = cmsData?.nav_links?.length
    ? cmsData.nav_links.map((link) => ({
        href: link.page ? `/${link.page.slug}` : link.url,
        label: link.label || link.page?.title || "",
      }))
    : []; //TODO: Add telemetry

  const primaryItem = cmsData?.primary?.[0] ?? null;
  const logoLink = primaryItem?.link || FALLBACK_PRIMARY.link;
  const ctaText = cmsData?.cta_text || "";
  const ctaLink = cmsData?.cta_link || "";
  const shouldShowCTA = ctaText !== "" && ctaLink !== "";
  // TODO: add telemetry

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-entrance ${
          isScrolled
            ? "bg-stone-dark/95 backdrop-blur-md border-b border-fog/20 shadow-lg"
            : "bg-transparent"
        }`}
      >
        <BackgroundTexture variant="rune" opacity={0.0032} />
        <div className="section-container">
          <nav className="flex items-center justify-between py-5">
            {/* Logo - Ornamental */}
            <Link
              href={logoLink}
              className="group text-xl md:text-2xl tracking-wider hover:text-pale-gold transition-colors duration-500 no-underline"
            >
              {primaryItem?.__component === "navigation.logo-image" &&
              primaryItem.image ? (
                <Image
                  src={getStrapiMediaUrl(primaryItem.image.url)}
                  alt={primaryItem.image.alternativeText || "Logo"}
                  width={primaryItem.image.width || 120}
                  height={primaryItem.image.height || 40}
                  className="object-contain"
                />
              ) : (
                <>
                  {primaryItem?.__component === "navigation.logo-text"
                    ? primaryItem.text
                    : FALLBACK_PRIMARY.text}
                  <SimpleDivider className="mt-1" />
                </>
              )}
            </Link>

            {/* Desktop Navigation */}

            <div className="hidden md:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group font-mono text-base text-stone-grey hover:text-silver-white uppercase tracking-wider transition-colors duration-500 no-underline"
                >
                  {link.label}

                  <SimpleDivider className="mt-1" />
                </Link>
              ))}
            </div>

            {/* Desktop CTA */}
            {shouldShowCTA && (
              <div className="hidden md:block">
                <Link href={ctaLink} className="btn-primary">
                  {ctaText}
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-1 text-stone-grey hover:text-silver-white transition-colors duration-500 border border-fog/20 hover:border-pale-gold"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </nav>
        </div>

        {/* Decorative border when scrolled */}
        {isScrolled && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-aged-gold to-transparent"
          />
        )}
      </motion.header>

      {/* Mobile Menu - Slide-in Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop with vignette */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="fixed inset-0 bg-void/90 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-vignette" />
            </motion.div>

            {/* Slide-in Menu - Parchment Style */}
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                type: "tween",
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-stone-dark border-l-2 border-pale-gold/30 z-50 md:hidden"
              aria-label="Mobile navigation"
            >
              <div className="flex flex-col h-full p-10">
                {/* Close button with ornament */}
                <div className="flex justify-between items-start mb-12">
                  <span className="text-lg tracking-wider">Menu</span>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1 text-stone-grey hover:text-silver-white transition-colors border border-fog/20 hover:border-pale-gold"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Divider */}
                <div className="h-px bg-linear-to-r from-pale-gold via-pale-gold/50 to-pale-gold/0 mb-10" />

                {/* Navigation Links */}
                <div className="flex flex-col gap-6 grow">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: index * 0.1,
                        duration: 0.6,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="group block font-mono text-lg text-stone-grey hover:text-silver-white uppercase tracking-wider transition-colors duration-500 py-1 no-underline"
                      >
                        <span className="relative inline-block">
                          {link.label}
                          <span className="absolute -bottom-1 left-0 w-0 h-px bg-pale-gold group-hover:w-full transition-all duration-500 ease-entrance" />
                        </span>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-aged-gold/0 via-aged-gold/50 to-aged-gold/0 my-10" />

                {/* Mobile CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.4,
                    duration: 0.6,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <Link
                    href={ctaLink}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="btn-primary w-full text-center"
                  >
                    {ctaText}
                  </Link>
                </motion.div>

                {/* Bottom ornament */}
                <div className="mt-5 flex justify-center">
                  <svg
                    width="40"
                    height="20"
                    viewBox="0 0 40 20"
                    className="text-pale-gold/30"
                  >
                    <circle cx="20" cy="10" r="2" fill="currentColor" />
                    <circle
                      cx="20"
                      cy="10"
                      r="5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="0.5"
                    />
                  </svg>
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
