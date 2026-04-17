import React from "react";
import { NavigationContext } from "../../lib/NavigationContext";
import { FooterDataContext } from "../../lib/FooterDataContext";
import type { FullHeader, FullFooter } from "../../lib/strapi-cms/strapiApi";

/**
 * Mock navigation data matching the shape Header.jsx reads from NavigationContext.
 * Mirrors what getHeader() returns from Strapi.
 */
const mockNavigationData = {
  primary: [
    {
      id: 1,
      __component: "navigation.logo-text",
      text: "Shelbz Citrine",
      link: "/",
    },
  ],
  navigation: {
    name: "Primary",
    links: [
      { id: 1, label: "Process", path: "/process", url: null, page: null, sub_navigation: null },
      { id: 2, label: "Consultation", path: "/consultation", url: null, page: null, sub_navigation: null },
      { id: 3, label: "About", path: "/about", url: null, page: null, sub_navigation: null },
    ],
  },
  header_cta: {
    id: 1,
    type: "internal",
    page: { slug: "consultation" },
    url: null,
  },
};

/**
 * Mock footer data matching the shape Footer.jsx reads from FooterDataContext.
 */
const mockFooterData = {
  navigation: null,
  brand_heading: "Shelbz Citrine",
  brand_tagline: "Multigenerational artisans. Ethical sourcing.",
  brand_description:
    "For seven generations, we have forged pieces that outlast their wearers — heritage jewelry built to become heirlooms.",
  contact_email: "hello@shelbzcitrine.com",
  contact_location: "United States",
  contact_service_area: "Worldwide",
  copyright_company_name: "Shelbz Citrine",
};

/**
 * Wraps every story with the two global context providers that Header and
 * Footer depend on. Uses minimal mock data so components render without
 * needing a live Strapi instance.
 *
 * RelationsContext and MediaContext are NOT included here — only RichContent
 * stories need them and add their own story-level decorators.
 *
 * CartContext is NOT included here — only CartDrawer stories need it.
 */
export const ContextDecorator = (Story: React.ComponentType) => (
  <NavigationContext.Provider value={mockNavigationData as unknown as FullHeader}>
    <FooterDataContext.Provider value={mockFooterData as unknown as FullFooter}>
      <Story />
    </FooterDataContext.Provider>
  </NavigationContext.Provider>
);
