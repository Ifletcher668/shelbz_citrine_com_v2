/**
 * API response types for the Strapi v5 REST API.
 * Strapi v5 returns flat objects — attributes are NOT nested under `attributes`.
 * These reflect the schema after the Page → Row → Column restructure.
 */

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
