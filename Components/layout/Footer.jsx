import Link from "next/link";
import { Mail } from "lucide-react";
import OrnamentalDivider from "@/Components/ornaments/OrnamentalDivider";
import BackgroundTexture from "@/Components/shared/BackgroundTexture";

/**
 * Footer Component - "Manuscript Colophon"
 * Dark academia aesthetic with ornamental dividers
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/blog", label: "Blog" },
    { href: "/consultation", label: "Book Consultation" },
  ];

  return (
    <footer className="bg-stone-dark border-t border-fog/20 overflow-hidden relative">
      <div className="section-container py-12">
        <OrnamentalDivider />

        <BackgroundTexture variant="rune" opacity={0.0032} />

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-16">
          {/* Column 1: Brand & Tagline */}
          <div>
            <h3 className="font-garamond text-2xl text-silver-white mb-6 tracking-wider">
              HERITAGE
            </h3>
            <p className="font-garamond text-base text-stone-grey leading-relaxed mb-3">
              Ethical craft. Heirloom quality.
            </p>
            <p className="font-garamond text-sm text-fog italic leading-relaxed">
              Bridging Indian artisanship with modern design, one bespoke piece
              at a time.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-mono text-sm uppercase tracking-wider text-fog mb-6">
              Navigation
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group font-mono text-sm text-stone-grey hover:text-silver-white transition-colors duration-500 no-underline inline-block"
                  >
                    <span className="relative">
                      {link.label}
                      <span className="absolute -bottom-1 left-0 w-0 h-px bg-pale-gold group-hover:w-full transition-all duration-500 ease-entrance" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h4 className="font-mono text-sm uppercase tracking-wider text-fog mb-6">
              Contact
            </h4>
            <div className="space-y-3 font-garamond text-sm text-stone-grey">
              <p className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-pale-gold mt-0.5 flex-shrink-0" />
                <a
                  href="mailto:info@heritagejewelry.com"
                  className="hover:text-silver-white transition-colors duration-500"
                >
                  info@heritagejewelry.com
                </a>
              </p>
              <p className="text-fog">Based in Olympia, WA</p>
              <p className="text-xs text-fog/70 italic">
                Serving the Pacific Northwest & nationwide via Zoom
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-aged-gold/0 via-aged-gold/30 to-aged-gold/0 my-12" />

        {/* Bottom Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="font-mono text-xs text-fog/70 tracking-wide">
            &copy; {currentYear} Heritage Jewelry Enterprise. All rights
            reserved.
          </p>

          <p className="font-garamond text-xs text-fog italic">
            Crafted in partnership with{" "}
            <a
              href="https://royalkarkhana.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pale-gold hover:text-amber-glow underline decoration-1 underline-offset-2 transition-colors duration-500"
            >
              Royal Karkhana
            </a>
          </p>
        </div>

        {/* Bottom ornament */}
        <div className="mt-12 flex justify-center opacity-30">
          <svg
            width="60"
            height="30"
            viewBox="0 0 60 30"
            className="text-pale-gold"
          >
            <circle cx="30" cy="15" r="2" fill="currentColor" />
            <circle
              cx="30"
              cy="15"
              r="6"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
            <line
              x1="10"
              y1="15"
              x2="20"
              y2="15"
              stroke="currentColor"
              strokeWidth="0.5"
            />
            <line
              x1="40"
              y1="15"
              x2="50"
              y2="15"
              stroke="currentColor"
              strokeWidth="0.5"
            />
          </svg>
        </div>
      </div>
    </footer>
  );
}
