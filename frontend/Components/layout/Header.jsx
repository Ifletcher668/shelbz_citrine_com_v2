import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import BackgroundTexture from "../shared/BackgroundTexture";
import { SimpleDivider } from "../ornaments/OrnamentalDivider";
import {
  getStrapiMediaUrl,
  buildStrapiSrcSet,
} from "../../lib/strapi-cms/strapiApi";
import { useNavigation } from "../../lib/NavigationContext";

/**
 * Header Component
 * - Sticky header with parchment texture on scroll
 * - Fantasy game aesthetic (no corporate feel)
 * - Serif fonts throughout
 * - Slow, deliberate animations
 */

const FALLBACK_PRIMARY = { type: "text", text: "Shelbz Citrine", link: "/" };

// Stagger parent for the three header items (logo → nav → cta)
const headerRowVariants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.4, // let the header slide mostly into place first
      staggerChildren: 0.14,
    },
  },
};

// Each top-level item fades + slides in from left
const headerItemVariants = {
  hidden: { opacity: 0, x: -18 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

// The nav block orchestrates its own child stagger (no self-animation so
// nav link opacity doesn't double-multiply with the container)
const navBlockVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

// Each individual nav link / dropdown trigger
const navLinkVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  },
};

/**
 * Resolve a nav-link to { href, label, subNavigation, isExternal }.
 * Priority: page relation → path (internal) → url (external)
 * isExternal=true means it should open in a new tab.
 */
function resolveLink(link) {
  const href = link.page
    ? link.page.slug === "home"
      ? "/"
      : `/${link.page.slug}`
    : link.path
      ? link.path
      : (link.url ?? "#");
  const isExternal = !link.page && !link.path && !!link.url;
  return {
    href,
    label: link.label || link.page?.title || "",
    subNavigation: link.sub_navigation ?? null,
    isExternal,
  };
}

function resolveLinks(links) {
  return (links ?? []).map(resolveLink);
}

function LogoContent({ primaryItem }) {
  if (
    primaryItem?.__component === "navigation.logo-image" &&
    primaryItem.image
  ) {
    return (
      <img
        src={getStrapiMediaUrl(primaryItem.image.url)}
        srcSet={buildStrapiSrcSet(primaryItem.image) ?? undefined}
        sizes="(max-width: 768px) 80px, 120px"
        alt={primaryItem.image.alternativeText || "Logo"}
        width={primaryItem.image.width || 120}
        height={primaryItem.image.height || 40}
        className="object-contain"
      />
    );
  }
  return (
    <>
      {primaryItem?.__component === "navigation.logo-text"
        ? primaryItem.text
        : FALLBACK_PRIMARY.text}
      <SimpleDivider className="mt-1" />
    </>
  );
}

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openSubNav, setOpenSubNav] = useState(null);
  const cmsData = useNavigation();
  const headerRef = useRef(null);
  const subNavRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0.01);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Keep --header-height in sync with the actual rendered header height
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const observer = new ResizeObserver(([entry]) => {
      document.documentElement.style.setProperty(
        "--header-height",
        `${entry.contentRect.height}px`,
      );
    });
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  // Close sub-nav dropdown when clicking outside
  useEffect(() => {
    if (!openSubNav) return;
    const handleMouseDown = (e) => {
      if (subNavRef.current && !subNavRef.current.contains(e.target)) {
        setOpenSubNav(null);
      }
    };
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [openSubNav]);

  const navigationEntry = cmsData?.navigation ?? null;
  const navLinks = resolveLinks(navigationEntry?.links);

  const primaryItem = cmsData?.primary?.[0] ?? null;
  const logoLink = primaryItem?.link || FALLBACK_PRIMARY.link;
  const logoIsExternal = logoLink.startsWith("http");
  const headerCta = cmsData?.header_cta ?? null;
  const ctaLink = headerCta
    ? headerCta.type === "internal" && headerCta.page?.slug
      ? `/${headerCta.page.slug}`
      : (headerCta.url ?? "")
    : "";
  const ctaText = headerCta?.page?.title ?? "";
  const shouldShowCTA = !!ctaLink;

  return (
    <>
      <motion.header
        ref={headerRef}
        initial={{ y: "-100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 ease-entrance ${
          isScrolled
            ? "bg-stone-dark/95 backdrop-blur-md border-b border-fog/20 shadow-lg"
            : "bg-transparent"
        }`}
      >
        <BackgroundTexture variant="rune" opacity={0.0032} />
        <div className="px-6 lg:px-10">
          <motion.nav
            variants={headerRowVariants}
            initial="hidden"
            animate="visible"
            className="flex items-center justify-between gap-6 py-4"
          >
            {/* Logo - Ornamental */}
            <motion.div variants={headerItemVariants} className="shrink-0">
              {logoIsExternal ? (
                <a
                  href={logoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group text-2xl md:text-3xl tracking-wider hover:text-pale-gold transition-colors duration-500 no-underline"
                >
                  <LogoContent primaryItem={primaryItem} />
                </a>
              ) : (
                <Link
                  href={logoLink}
                  className="group text-2xl md:text-3xl tracking-wider hover:text-pale-gold transition-colors duration-500 no-underline"
                >
                  <LogoContent primaryItem={primaryItem} />
                </Link>
              )}
            </motion.div>

            {/* Navigation — hidden on mobile; each link staggers in */}
            <motion.div
              ref={subNavRef}
              variants={navBlockVariants}
              className="hidden md:flex flex-wrap items-center justify-center gap-x-8 gap-y-2 flex-1"
            >
              {navLinks.map((link, i) =>
                link.subNavigation ? (
                  <motion.div
                    key={i}
                    variants={navLinkVariants}
                    className="relative"
                  >
                    <button
                      onClick={() =>
                        setOpenSubNav(
                          openSubNav === link.subNavigation.id
                            ? null
                            : link.subNavigation.id,
                        )
                      }
                      className="group flex items-center gap-1 font-mono text-base text-stone-grey hover:text-silver-white uppercase tracking-wider transition-colors duration-500"
                      aria-expanded={openSubNav === link.subNavigation.id}
                      aria-haspopup="true"
                    >
                      {link.label}
                      <ChevronDown
                        className={`w-3 h-3 transition-transform duration-300 ${
                          openSubNav === link.subNavigation.id
                            ? "rotate-180"
                            : ""
                        }`}
                      />
                    </button>
                    <div
                      className={`absolute top-full left-0 mt-2 min-w-[160px] bg-stone-dark border border-fog/20 shadow-lg z-50 transition-all duration-300 origin-top ${
                        openSubNav === link.subNavigation.id
                          ? "opacity-100 scale-y-100 pointer-events-auto"
                          : "opacity-0 scale-y-95 pointer-events-none"
                      }`}
                    >
                      {resolveLinks(link.subNavigation.links).map(
                        (subLink, j) =>
                          subLink.isExternal ? (
                            <a
                              key={j}
                              href={subLink.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => setOpenSubNav(null)}
                              className="block px-4 py-2 font-mono text-sm text-stone-grey hover:text-silver-white hover:bg-fog/5 uppercase tracking-wider transition-colors duration-300 no-underline"
                            >
                              {subLink.label}
                            </a>
                          ) : (
                            <Link
                              key={j}
                              href={subLink.href}
                              onClick={() => setOpenSubNav(null)}
                              className="block px-4 py-2 font-mono text-sm text-stone-grey hover:text-silver-white hover:bg-fog/5 uppercase tracking-wider transition-colors duration-300 no-underline"
                            >
                              {subLink.label}
                            </Link>
                          ),
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key={i} variants={navLinkVariants}>
                    {link.isExternal ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group font-mono text-base text-stone-grey hover:text-silver-white uppercase tracking-wider transition-colors duration-500 no-underline"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="group font-mono text-base text-stone-grey hover:text-silver-white uppercase tracking-wider transition-colors duration-500 no-underline"
                      >
                        {link.label}
                      </Link>
                    )}
                  </motion.div>
                ),
              )}
            </motion.div>

            {/* CTA — desktop only */}
            {shouldShowCTA && (
              <motion.div
                variants={headerItemVariants}
                className="hidden md:block shrink-0"
              >
                <Link
                  href={ctaLink}
                  className="group relative inline-flex items-center justify-center
                    px-7 py-3 overflow-hidden no-underline
                    [clip-path:polygon(12px_0%,100%_0%,calc(100%-12px)_100%,0%_100%)]
                    bg-gradient-to-r from-aged-gold/70 via-pale-gold to-aged-gold/70
                    hover:from-pale-gold hover:via-silver-white hover:to-pale-gold
                    font-display text-sm tracking-[0.12em] uppercase text-void
                    transition-all duration-500
                    hover:shadow-[0_0_25px_rgba(180,170,150,0.5),0_0_50px_rgba(180,170,150,0.15)]"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none"
                  />
                  <span className="relative z-10">{ctaText}</span>
                </Link>
              </motion.div>
            )}

            {/* Mobile hamburger */}
            <motion.div variants={headerItemVariants} className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-1 text-stone-grey hover:text-silver-white transition-colors duration-500 border border-fog/20 hover:border-pale-gold"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </motion.div>
          </motion.nav>
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

                <div className="h-px bg-linear-to-r from-pale-gold via-pale-gold/50 to-pale-gold/0 mb-10" />

                <div className="flex flex-col gap-6 grow">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: index * 0.1,
                        duration: 0.6,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      {link.subNavigation ? (
                        <>
                          <button
                            onClick={() =>
                              setOpenSubNav(
                                openSubNav === link.subNavigation.id
                                  ? null
                                  : link.subNavigation.id,
                              )
                            }
                            className="flex items-center justify-between w-full font-mono text-lg text-stone-grey hover:text-silver-white uppercase tracking-wider transition-colors duration-500 py-1"
                          >
                            {link.label}
                            <ChevronDown
                              className={`w-4 h-4 transition-transform duration-300 ${
                                openSubNav === link.subNavigation.id
                                  ? "rotate-180"
                                  : ""
                              }`}
                            />
                          </button>
                          {/* CSS grid trick for height: 0 → auto without motion.div */}
                          <div
                            className="overflow-hidden transition-all duration-400"
                            style={{
                              display: "grid",
                              gridTemplateRows:
                                openSubNav === link.subNavigation.id
                                  ? "1fr"
                                  : "0fr",
                            }}
                          >
                            <div className="min-h-0 pl-4 flex flex-col gap-3 pt-3 pb-1">
                              {resolveLinks(link.subNavigation.links).map(
                                (subLink, j) =>
                                  subLink.isExternal ? (
                                    <a
                                      key={j}
                                      href={subLink.href}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        setOpenSubNav(null);
                                      }}
                                      className="font-mono text-base text-stone-grey hover:text-silver-white uppercase tracking-wider transition-colors duration-500 py-1 no-underline"
                                    >
                                      {subLink.label}
                                    </a>
                                  ) : (
                                    <Link
                                      key={j}
                                      href={subLink.href}
                                      onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        setOpenSubNav(null);
                                      }}
                                      className="font-mono text-base text-stone-grey hover:text-silver-white uppercase tracking-wider transition-colors duration-500 py-1 no-underline"
                                    >
                                      {subLink.label}
                                    </Link>
                                  ),
                              )}
                            </div>
                          </div>
                        </>
                      ) : link.isExternal ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="group block font-mono text-lg text-stone-grey hover:text-silver-white uppercase tracking-wider transition-colors duration-500 py-1 no-underline"
                        >
                          {link.label}
                        </a>
                      ) : (
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
                      )}
                    </motion.div>
                  ))}
                </div>

                <div className="h-px bg-linear-to-r from-aged-gold/0 via-aged-gold/50 to-aged-gold/0 my-10" />

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
