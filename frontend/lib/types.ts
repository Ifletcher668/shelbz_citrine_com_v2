/**
 * Component prop types for the frontend.
 *
 * - `StrapiCms.*` — lean interfaces for what components actually render.
 *                   Relations are pre-populated (no raw IDs).
 *
 * Data-fetching types (`Full*`, `PageSummary`, etc.) live in
 * lib/strapi-cms/strapiApi.ts, which is the source of truth for all CMS data.
 */

// ─── StrapiCms namespace ───────────────────────────────────────────────────
// Lean view-model types — only the fields the frontend actually uses.
// Strapi meta fields (id, documentId, timestamps) are omitted except where
// needed as React keys on component arrays.

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace StrapiCms {
  // ── Media ────────────────────────────────────────────────────────────────

  export interface MediaFile {
    id: number;
    url: string;
    alternativeText: string | null;
    width: number | null;
    height: number | null;
    formats: {
      thumbnail?: { url: string; width: number; height: number };
      small?: { url: string; width: number; height: number };
      medium?: { url: string; width: number; height: number };
      large?: { url: string; width: number; height: number };
    } | null;
  }

  // ── Section components ────────────────────────────────────────────────────

  /** A WYSIWYG column inside a Row section */
  export interface Column {
    id: number;
    body: string | null;
  }

  /** Page section: one to six WYSIWYG columns */
  export interface Row {
    id: number;
    __component: "sections.row";
    section_id: string | null;
    columns: Column[];
  }

  /** Page section: image/video gallery from the media library */
  export interface MediaGallery {
    id: number;
    __component: "sections.media-gallery";
    title: string | null;
    Images: MediaFile[] | null;
  }

  /** Union of all valid page section types */
  export type Section = Row | MediaGallery;

  // ── Navigation components ─────────────────────────────────────────────────

  /** A single nav item — link resolved from page relation, path, or external url */
  export interface NavLink {
    id: number;
    label: string | null;
    path: string | null;
    url: string | null;
    page: { slug: string } | null;
    sub_navigation: Navigation | null;
  }

  /** Logo rendered as an image */
  export interface LogoImage {
    id: number;
    __component: "navigation.logo-image";
    image: MediaFile | null;
    link: string | null;
  }

  /** Logo rendered as styled text */
  export interface LogoText {
    id: number;
    __component: "navigation.logo-text";
    text: string | null;
    link: string | null;
  }

  /** Union of valid header primary slot types */
  export type LogoSlot = LogoImage | LogoText;

  // ── UI components ─────────────────────────────────────────────────────────

  /** Internal or external link attached to a button or CTA */
  export interface ButtonLink {
    id: number;
    type: "internal" | "external";
    page: { slug: string } | null;
    url: string | null;
  }

  // ── Embed content components ──────────────────────────────────────────────

  export interface BulletItem {
    id: number;
    type: "check" | "x";
    title: string;
    description: string | null;
  }

  export interface FaqItem {
    id: number;
    question: string;
    answer: string;
  }

  export interface InputField {
    id: number;
    label: string;
    name: string;
    type:
      | "text"
      | "email"
      | "tel"
      | "number"
      | "url"
      | "date"
      | "time"
      | "textarea";
    placeholder: string | null;
    required: boolean | null;
    help_text: string | null;
  }

  export interface Step {
    id: number;
    icon: string | null;
    title: string;
    description: string | null;
  }

  // ── Theme components ──────────────────────────────────────────────────────

  export interface SemanticColors {
    id: number;
    bg_base: string | null;
    bg_raised: string | null;
    bg_inset: string | null;
    text_muted: string | null;
    text_body: string | null;
    text_heading: string | null;
    accent: string | null;
    interactive: string | null;
    neutral: string | null;
    info: string | null;
    danger: string | null;
    success: string | null;
  }

  export interface Typography {
    id: number;
    google_fonts_url: string | null;
    font_display: string | null;
    font_body: string | null;
    font_ui: string | null;
    font_mono: string | null;
    font_serif: string | null;
    font_sans: string | null;
    text_6xl: string | null;
    text_5xl: string | null;
    text_4xl: string | null;
    text_3xl: string | null;
    text_2xl: string | null;
    text_xl: string | null;
    text_lg: string | null;
    text_md: string | null;
    text_base: string | null;
    text_sm: string | null;
    text_xs: string | null;
  }

  export interface Spacing {
    id: number;
    spacing_1: string | null;
    spacing_2: string | null;
    spacing_3: string | null;
    spacing_4: string | null;
    spacing_5: string | null;
    spacing_6: string | null;
    spacing_8: string | null;
    spacing_10: string | null;
    spacing_12: string | null;
    spacing_16: string | null;
    spacing_20: string | null;
  }

  export interface ThemeLayout {
    id: number;
    container_narrow: string | null;
    container_reading: string | null;
    container_wide: string | null;
    radius_lg: string | null;
    radius_md: string | null;
    radius_sm: string | null;
    timing_souls: string | null;
    timing_sharp: string | null;
    timing_smooth: string | null;
  }

  // ── Content types ─────────────────────────────────────────────────────────

  /** CMS page — slug, SEO fields, composable sections, and parent path context */
  export interface Page {
    slug: string;
    title: string;
    seo_description: string | null;
    theme_overrides: Record<string, string> | null;
    sections: Section[] | null;
    sub_page: { slug: string } | null;
  }

  /** Site header — logo slot, main navigation, and optional CTA button */
  export interface Header {
    primary: LogoSlot[] | null;
    navigation: Navigation | null;
    header_cta: ButtonLink | null;
  }

  /** Site footer — navigation plus brand and contact copy blocks */
  export interface Footer {
    navigation: Navigation | null;
    brand_heading: string | null;
    brand_tagline: string | null;
    brand_description: string | null;
    contact_email: string | null;
    contact_location: string | null;
    contact_service_area: string | null;
    copyright_company_name: string | null;
  }

  /** A named set of nav links with optional nested sub-navigations */
  export interface Navigation {
    name: string;
    links: NavLink[] | null;
  }

  /** Design token theme — all CSS variable groups in one record */
  export interface Theme {
    name: string;
    is_active: boolean;
    colors: SemanticColors;
    typography: Typography;
    spacing: Spacing;
    layout: ThemeLayout;
  }

  /** Named frontend action (maps to a hard-coded handler) */
  export interface Action {
    name: string;
  }

  /** Reusable icon-prefixed bullet list — embeddable via [ref:bullet-list:id] */
  export interface BulletList {
    title: string;
    items: BulletItem[];
  }

  /** Reusable button — fires an action or navigates via a link */
  export interface Button {
    text: string;
    variant: "primary" | "secondary" | "tertiary";
    action: Action | null;
    link: ButtonLink | null;
  }

  /** Reusable contact form with configurable fields — embeddable via [ref:contact-form:id] */
  export interface ContactForm {
    action: "contact" | "consultation";
    submit_label: string | null;
    success_message: string | null;
    layout: unknown | null;
    fields: InputField[];
  }

  /** Reusable FAQ accordion — embeddable via [ref:faq:id] */
  export interface Faq {
    title: string;
    items: FaqItem[];
  }

  /** Reusable ordered step group — embeddable via [ref:step-group:id] */
  export interface StepGroup {
    title: string;
    columns: "col-2" | "col-3" | "col-4" | "col-5" | null;
    steps: Step[] | null;
    cta_text: string | null;
    cta_link: string | null;
  }
}
