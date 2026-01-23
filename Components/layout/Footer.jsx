import Link from "next/link";
import { Mail } from "lucide-react";
import OrnamentalDivider from "@/Components/ornaments/OrnamentalDivider";

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
    <footer className="bg-parchment-dark border-t border-obsidian">
      <div className="section-container py-space-10">
        {/* Ornamental divider */}
        <OrnamentalDivider />

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-8 mb-space-8">
          {/* Column 1: Brand & Tagline */}
          <div>
            <h3 className="font-cinzel text-2xl text-bone-white mb-space-4 tracking-wider">
              HERITAGE
            </h3>
            <p className="font-crimson text-base text-ash-grey leading-relaxed mb-space-3">
              Ethical craft. Heirloom quality.
            </p>
            <p className="font-crimson text-sm text-charcoal-mist italic leading-relaxed">
              Bridging Indian artisanship with modern design, one bespoke piece
              at a time.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-spectral text-sm uppercase tracking-wider text-charcoal-mist mb-space-4">
              Navigation
            </h4>
            <ul className="space-y-space-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group font-spectral text-sm text-ash-grey hover:text-bone-white transition-colors duration-500 no-underline inline-block"
                  >
                    <span className="relative">
                      {link.label}
                      <span className="absolute -bottom-1 left-0 w-0 h-px bg-aged-gold group-hover:w-full transition-all duration-500 ease-entrance" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h4 className="font-spectral text-sm uppercase tracking-wider text-charcoal-mist mb-space-4">
              Contact
            </h4>
            <div className="space-y-space-3 font-crimson text-sm text-ash-grey">
              <p className="flex items-start gap-space-2">
                <Mail className="w-4 h-4 text-aged-gold mt-0.5 flex-shrink-0" />
                <a
                  href="mailto:info@heritagejewelry.com"
                  className="hover:text-bone-white transition-colors duration-500"
                >
                  info@heritagejewelry.com
                </a>
              </p>
              <p className="text-charcoal-mist">Based in Olympia, WA</p>
              <p className="text-xs text-sepia-shadow italic">
                Serving the Pacific Northwest & nationwide via Zoom
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-aged-gold/0 via-aged-gold/30 to-aged-gold/0 my-space-6" />

        {/* Bottom Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-space-4">
          <p className="font-spectral text-xs text-sepia-shadow tracking-wide">
            &copy; {currentYear} Heritage Jewelry Enterprise. All rights
            reserved.
          </p>

          <p className="font-crimson text-xs text-charcoal-mist italic">
            Crafted in partnership with{" "}
            <a
              href="https://royalkarkhana.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-aged-gold hover:text-amber-glow underline decoration-1 underline-offset-2 transition-colors duration-500"
            >
              Royal Karkhana
            </a>
          </p>
        </div>

        {/* Bottom ornament */}
        <div className="mt-space-6 flex justify-center opacity-30">
          <svg
            width="60"
            height="30"
            viewBox="0 0 60 30"
            className="text-aged-gold"
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
