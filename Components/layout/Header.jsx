import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

/**
 * Header Component - "Grimoire Navigation"
 * - Sticky header with parchment texture on scroll
 * - Fantasy game aesthetic (no corporate feel)
 * - Serif fonts throughout
 * - Slow, deliberate animations
 */
export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
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

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/blog", label: "Blog" },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-entrance ${
          isScrolled
            ? "bg-parchment-dark/95 backdrop-blur-md border-b border-obsidian shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="section-container">
          <nav className="flex items-center justify-between py-space-4">
            {/* Logo - Ornamental */}
            <Link
              href="/"
              className="group font-cinzel text-xl md:text-2xl tracking-wider text-bone-white hover:text-aged-gold transition-colors duration-500 no-underline"
            >
              <span className="relative">
                HERITAGE
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-aged-gold group-hover:w-full transition-all duration-700 ease-entrance" />
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-space-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group relative font-spectral text-sm text-ash-grey hover:text-bone-white uppercase tracking-wider transition-colors duration-500 no-underline"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-aged-gold group-hover:w-full transition-all duration-500 ease-entrance" />
                </Link>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:block">
              <Link href="/consultation" className="btn-primary">
                Book Consultation
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-space-2 text-ash-grey hover:text-bone-white transition-colors duration-500 border border-obsidian hover:border-aged-gold"
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
            className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-aged-gold to-transparent"
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
              className="fixed inset-0 bg-ink-black/90 backdrop-blur-sm z-40 md:hidden"
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
              className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-parchment border-l-2 border-aged-gold/30 z-50 md:hidden"
              aria-label="Mobile navigation"
            >
              <div className="flex flex-col h-full p-space-6">
                {/* Close button with ornament */}
                <div className="flex justify-between items-start mb-space-8">
                  <span className="font-cinzel text-lg text-bone-white tracking-wider">
                    Menu
                  </span>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-space-2 text-ash-grey hover:text-bone-white transition-colors border border-obsidian hover:border-aged-gold"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-aged-gold/0 via-aged-gold/50 to-aged-gold/0 mb-space-6" />

                {/* Navigation Links */}
                <div className="flex flex-col gap-space-5 flex-grow">
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
                        className="group block font-spectral text-lg text-ash-grey hover:text-bone-white uppercase tracking-wider transition-colors duration-500 py-space-2 no-underline"
                      >
                        <span className="relative inline-block">
                          {link.label}
                          <span className="absolute -bottom-1 left-0 w-0 h-px bg-aged-gold group-hover:w-full transition-all duration-500 ease-entrance" />
                        </span>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-aged-gold/0 via-aged-gold/50 to-aged-gold/0 my-space-6" />

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
                    href="/consultation"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="btn-primary w-full text-center"
                  >
                    Book Consultation
                  </Link>
                </motion.div>

                {/* Bottom ornament */}
                <div className="mt-space-4 flex justify-center">
                  <svg
                    width="40"
                    height="20"
                    viewBox="0 0 40 20"
                    className="text-aged-gold/30"
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
