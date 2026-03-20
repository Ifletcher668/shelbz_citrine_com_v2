import { useState, useEffect } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import OrnamentalDivider from "@/Components/ornaments/OrnamentalDivider";
import BackgroundTexture from "@/Components/shared/BackgroundTexture";
import RichContent from "@/Components/shared/RichContent";
import { getFooter } from "@/lib/strapi";

/**
 * Footer Component - "Manuscript Colophon"
 * Dark academia aesthetic with ornamental dividers
 *
 * Columns are CMS-driven via the Footer single type (dynamic zone).
 * Column types: footer.brand-column, footer.links-column,
 *               footer.contact-column, footer.richtext-column
 */

function BrandColumn({ title, tagline, description }) {
  return (
    <div>
      {title && <h3 className="text-2xl mb-5 tracking-wider">{title}</h3>}
      {tagline && <p className="text-md mb-2">{tagline}</p>}
      {description && <p className="text-sm text-fog italic">{description}</p>}
    </div>
  );
}

function LinksColumn({ heading, links = [] }) {
  return (
    <div>
      {heading && (
        <h4 className="font-mono text-sm uppercase tracking-wider mb-5">
          {heading}
        </h4>
      )}
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.url}>
            <Link
              href={link.url}
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
  );
}

function ContactColumn({ heading, email, location, note }) {
  return (
    <div>
      {heading && (
        <h4 className="font-mono text-sm uppercase tracking-wider text-fog mb-5">
          {heading}
        </h4>
      )}
      <div className="space-y-3 text-sm text-stone-grey">
        {email && (
          <p className="flex items-start gap-5">
            <Mail className="w-4 h-4 text-pale-gold mt-0.5 flex-shrink-0" />
            <a
              href={`mailto:${email}`}
              className="hover:text-silver-white transition-colors duration-500"
            >
              {email}
            </a>
          </p>
        )}
        {location && <p className="text-fog">{location}</p>}
        {note && <p className="text-xs text-fog/90 italic">{note}</p>}
      </div>
    </div>
  );
}

function RichtextColumn({ heading, body }) {
  return (
    <div>
      {heading && (
        <h4 className="font-mono text-sm uppercase tracking-wider mb-5">
          {heading}
        </h4>
      )}
      {body && <RichContent body={body} className="text-sm text-stone-grey" />}
    </div>
  );
}

function FooterColumn({ column }) {
  switch (column.__component) {
    case "footer.brand-column":
      return <BrandColumn {...column} />;
    case "footer.links-column":
      return <LinksColumn {...column} />;
    case "footer.contact-column":
      return <ContactColumn {...column} />;
    case "footer.richtext-column":
      return <RichtextColumn {...column} />;
    default:
      return null;
  }
}

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [cmsData, setCmsData] = useState(null);

  useEffect(() => {
    getFooter()
      .then(setCmsData)
      .catch(() => {});
  }, []);

  const columns = cmsData?.columns ?? [];
  const copyrightEntity = cmsData?.copyright_entity ?? null;
  const partnerName = cmsData?.partner_name ?? null;
  const partnerUrl = cmsData?.partner_url ?? null;

  return (
    <footer className="bg-stone-dark border-t border-fog/20 overflow-hidden relative">
      <div className="section-container py-10">
        <OrnamentalDivider />

        <BackgroundTexture variant="rune" opacity={0.0032} />

        {/* Main Footer Content */}
        {columns.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {columns.map((column) => (
              <FooterColumn key={column.id} column={column} />
            ))}
          </div>
        )}

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-aged-gold/0 via-aged-gold/30 to-aged-gold/0 my-10" />

        {/* Bottom Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-5">
          {copyrightEntity && (
            <p className="font-mono text-xs text-fog/90 tracking-wide">
              &copy; {currentYear} {copyrightEntity}. All rights reserved.
            </p>
          )}

          {partnerName && partnerUrl && (
            <p className="text-xs text-fog italic">
              Crafted in partnership with{" "}
              <a
                href={partnerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pale-gold hover:text-amber-glow underline decoration-1 underline-offset-2 transition-colors duration-500"
              >
                {partnerName}
              </a>
            </p>
          )}
        </div>

        {/* Bottom ornament */}
        <div className="mt-10 flex justify-center opacity-30">
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
