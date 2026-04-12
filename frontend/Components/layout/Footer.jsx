import Link from "next/link";
import { Mail } from "lucide-react";
import OrnamentalDivider, {
  DividerLine,
} from "../ornaments/OrnamentalDivider";
import BackgroundTexture from "../shared/BackgroundTexture";
import { useFooterData } from "../../lib/FooterDataContext";

/**
 * Footer Component - "Manuscript Colophon"
 * Dark academia aesthetic with ornamental dividers.
 * Layout is hardcoded; copy is sourced from Strapi.
 * Navigation is sourced from the Footer's own navigation relation in Strapi.
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();
  const footerData = useFooterData();

  const navLinks = footerData?.navigation?.links?.length
    ? footerData.navigation.links.map((link) => {
        let href;
        if (link.page) {
          href = link.page.slug === "home" ? "/" : `/${link.page.slug}`;
        } else if (link.path) {
          href = link.path;
        } else {
          href = link.url ?? "#";
        }
        return {
          href,
          label: link.label || link.page?.title || "",
          isExternal: !link.page && !link.path && !!link.url,
        };
      })
    : [];

  if (!footerData) {
    console.warn(
      "[Footer] footerData is null — Strapi footer content is missing or failed to load.",
    );
  } else {
    const missingFields = [
      "brand_heading",
      "brand_tagline",
      "brand_description",
      "contact_email",
      "contact_location",
      "contact_service_area",
      "copyright_company_name",
    ].filter((key) => !footerData[key]);
    if (missingFields.length) {
      console.warn("[Footer] Missing CMS fields:", missingFields.join(", "));
    }
  }

  const brandHeading = footerData?.brand_heading;
  const brandTagline = footerData?.brand_tagline;
  const brandDescription = footerData?.brand_description;
  const contactEmail = footerData?.contact_email;
  const contactLocation = footerData?.contact_location;
  const contactServiceArea = footerData?.contact_service_area;
  const copyrightCompanyName = footerData?.copyright_company_name;

  return (
    <footer className="bg-stone-dark border-t border-fog/20 overflow-hidden relative">
      <div className="section-container py-10">
        <OrnamentalDivider className="mb-10" />

        <BackgroundTexture variant="rune" opacity={0.0032} />

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Column 1: Brand & Tagline */}
          <div className="flex flex-col gap-3">
            <h3 className="text-2xl mb-2 tracking-wider">{brandHeading}</h3>
            <p className="text-md">{brandTagline}</p>
            <p className="text-sm text-fog italic">{brandDescription}</p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-mono text-sm uppercase tracking-wider mb-5">
              Navigation
            </h4>
            <ul className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  {link.isExternal ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group font-mono text-sm text-stone-grey hover:text-silver-white transition-colors duration-500 no-underline inline-block"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="group font-mono text-sm text-stone-grey hover:text-silver-white transition-colors duration-500 no-underline inline-block"
                    >
                      <span className="relative">
                        {link.label}
                        <span className="absolute -bottom-1 left-0 w-0 h-px bg-pale-gold group-hover:w-full transition-all duration-500 ease-entrance" />
                      </span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h4 className="font-mono text-sm uppercase tracking-wider text-fog mb-5">
              Contact
            </h4>
            <div className="flex flex-col gap-3 text-sm text-stone-grey">
              <p className="flex items-center gap-1 hover:text-silver-white transition-colors duration-500">
                <Mail className="w-4 h-4 text-pale-gold mt-0.5 shrink-0" />
                {contactEmail ? (
                  <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
                ) : null}
              </p>
              <p className="text-fog">{contactLocation}</p>
              <p className="text-xs text-fog/90 italic">{contactServiceArea}</p>
            </div>
          </div>
        </div>

        <DividerLine className="my-10" />

        {/* Bottom Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-5">
          <p className="font-mono text-xs text-fog/90 tracking-wide">
            &copy; {currentYear} {copyrightCompanyName}. All rights reserved.
          </p>

          {/* TODO: Still hardcoded */}
          <p className="text-xs text-fog italic">
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

        <OrnamentalDivider size="sm" className="mt-10" />
      </div>
    </footer>
  );
}
