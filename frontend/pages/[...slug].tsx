import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from "next";
import Head from "next/head";
import PageLayout from "../Components/layout/PageLayout";
import DynamicZone from "../Components/cms/DynamicZone";
import { RelationsContext } from "../lib/RelationsContext";
import { MediaContext } from "../lib/MediaContext";
import {
  getPages,
  getPageBySlug,
  extractAllRefs,
  fetchRelationData,
  extractImageUrls,
  fetchMediaData,
} from "../lib/strapi-cms/strapiApi";
import type { FullPage, StrapiMediaRecord } from "../lib/strapi-cms/strapiApi";
import type { StrapiCms } from "../lib/types";
import { renderRelations } from "../lib/relation-renderers";

/**
 * CMS-Driven Page (catch-all)
 *
 * Renders any page published in Strapi's "Page" collection type.
 * Supports parent/sub-page hierarchy — a page with slug "2023" whose
 * sub_page relation points to the "gallery" page renders at /gallery/2023.
 * Slugs in Strapi remain short; the full URL path is derived from relations.
 *
 * Statically generated at build time — all slugs must be published
 * before the Netlify build runs.
 *
 * Next.js resolves explicit page files (index.jsx, etc.) before this catch-all.
 */

type PageWithSlug = { slug: string; sub_page?: { slug: string } | null };

/**
 * Build the full URL path for a page based on its sub_page (parent) relation.
 * e.g. page { slug: "2023", sub_page: { slug: "gallery" } } → "gallery/2023"
 */
function buildPagePath(page: PageWithSlug): string {
  return page.sub_page ? `${page.sub_page.slug}/${page.slug}` : page.slug;
}

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export default function CmsPage({ page, relations, mediaMap }: Props) {
  if (!page) return null;

  const overrideEntries =
    page.theme_overrides && typeof page.theme_overrides === "object"
      ? Object.entries(page.theme_overrides as Record<string, string>)
      : [];

  return (
    <>
      <Head>
        <title>{page.title} | Shelbz Citrine</title>
        {page.seo_description && (
          <meta name="description" content={page.seo_description} />
        )}
        <meta property="og:title" content={`${page.title} | Shelbz Citrine`} />
        {page.seo_description && (
          <meta property="og:description" content={page.seo_description} />
        )}
        <meta property="og:type" content="website" />
        <link
          rel="canonical"
          href={`https://shelbzcitrine.com/${buildPagePath(page)}`}
        />
        {overrideEntries.length > 0 && (
          <style>{`:root {\n${overrideEntries.map(([k, v]) => `  ${k}: ${v};`).join("\n")}\n}`}</style>
        )}
      </Head>

      <MediaContext.Provider value={mediaMap}>
        <RelationsContext.Provider value={relations}>
          <PageLayout className="">
            <DynamicZone
              sections={page.sections as StrapiCms.Section[] | null}
            />
          </PageLayout>
        </RelationsContext.Provider>
      </MediaContext.Provider>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const pages = await getPages();
    // "home" is served at "/" via pages/index.jsx — exclude it here
    const paths = pages
      .filter((page) => page.slug !== "home")
      .map((page) => ({ params: { slug: buildPagePath(page).split("/") } }));

    return { paths, fallback: false };
  } catch (err) {
    // Strapi unavailable at build time — return empty paths, build succeeds
    console.error(
      "[getStaticPaths] Could not fetch pages from Strapi:",
      (err as Error).message,
    );
    return { paths: [], fallback: false };
  }
};

export const getStaticProps: GetStaticProps<{
  page: FullPage | null;
  relations: Record<string, string>;
  mediaMap: Record<string, StrapiMediaRecord>;
}> = async ({ params }) => {
  try {
    // Strapi slugs are short (e.g. "2023"), not full paths ("gallery/2023").
    // The last segment of the URL path is the actual page slug.
    // The preceding segments come from the sub_page (parent) relation.
    const slug = Array.isArray(params?.slug)
      ? params.slug[params.slug.length - 1]
      : (params?.slug ?? "");
    const page = await getPageBySlug(slug);
    if (!page) {
      return { notFound: true };
    }

    const refs = extractAllRefs(page);
    const rawRelations = await fetchRelationData(refs);
    const relations = renderRelations(rawRelations as Record<string, object>);

    const imageUrls = extractImageUrls(page);
    const mediaMap = await fetchMediaData(imageUrls);

    return { props: { page, relations, mediaMap } };
  } catch (err) {
    const slug = Array.isArray(params?.slug)
      ? params.slug[params.slug.length - 1]
      : (params?.slug ?? "");
    console.error(
      `[getStaticProps] Could not fetch page "${slug}":`,
      (err as Error).message,
    );
    return { notFound: true };
  }
};
