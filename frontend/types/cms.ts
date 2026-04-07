/**
 * API response types for the Strapi v5 REST API.
 * Strapi v5 returns flat objects — attributes are NOT nested under `attributes`.
 * These reflect the schema after the Page → Row → Column restructure.
 */

export interface StrapiMediaFormat {
  url: string;
  width: number;
  height: number;
  size: number;
  mime: string;
  name: string;
  hash: string;
  ext: string;
}

export interface StrapiMedia {
  id: number;
  url: string;
  alternativeText?: string | null;
  width?: number | null;
  height?: number | null;
  mime?: string | null;
  size?: number | null;
  name?: string | null;
  formats?: {
    thumbnail?: StrapiMediaFormat;
    small?: StrapiMediaFormat;
    medium?: StrapiMediaFormat;
    large?: StrapiMediaFormat;
  } | null;
}

export interface StrapiColumn {
  id: number;
  column_name?: string | null;
  body?: string | null;
}

export interface StrapiRow {
  id: number;
  __component: "sections.row";
  row_name?: string | null;
  section_id?: string | null;
  columns: StrapiColumn[];
}

export type StrapiPageSection = StrapiRow;

export interface StrapiPage {
  id: number;
  title: string;
  slug: string;
  seo_description?: string | null;
  sections: StrapiPageSection[];
  theme_overrides?: Record<string, unknown> | null;
  publishedAt: string;
}
