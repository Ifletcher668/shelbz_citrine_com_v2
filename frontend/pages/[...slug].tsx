import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from "next";
import Head from "next/head";
import PageLayout from "../Components/layout/PageLayout";
import DefaultPage from "../Components/cms/templates/DefaultPage";
import GalleryPage from "../Components/cms/templates/GalleryPage";
import BlogPage from "../Components/cms/templates/BlogPage";
import { RelationsContext } from "../lib/RelationsContext";
import { MediaContext } from "../lib/MediaContext";
import {
  getPages,
  getPageBySlug,
  extractAllRefs,
  fetchRelationData,
  extractImageUrls,
  fetchMediaData,
  getMediaMetadata,
} from "../lib/strapi-cms/strapiApi";
import type {
  FullMediaMetadata,
  StrapiMediaRecord,
  GetPageBySlugReturn,
} from "../lib/strapi-cms/strapiApi";
import { renderRelations } from "../lib/relation-renderers";
import { logger, logCmsFetch, logBuildPage } from "../lib/logger";

/**
 * CMS-Driven Page (catch-all)
 *
 * Renders any page published in Strapi's "Page" collection type.
 * Supports parent/sub-page hierarchy — a page with slug "2023" whose
 * parent_page relation points to the "gallery" page renders at /gallery/2023.
 * Slugs in Strapi remain short; the full URL path is derived from relations.
 *
 * Statically generated at build time — all slugs must be published
 * before the Netlify build runs.
 *
 * Next.js resolves explicit page files (index.jsx, etc.) before this catch-all.
 */
export default function CmsPage(props: Props) {
  const { page, relations, mediaMap, mediaMetadata } = props;

  if (!page) return null;

  const template = page.page_template?.slug;

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
        {page.custom_css && <style>{`:root {\n${page.custom_css}\n}`}</style>}
      </Head>

      <MediaContext.Provider value={{ mediaMap }}>
        <RelationsContext.Provider value={relations}>
          <PageLayout className="">
            {template === "gallery_page" ? (
              <GalleryPage page={page} mediaMetadata={mediaMetadata} />
            ) : template === "blog_page" ? (
              <BlogPage page={page} />
            ) : (
              <DefaultPage page={page} />
            )}
          </PageLayout>
        </RelationsContext.Provider>
      </MediaContext.Provider>
    </>
  );
}

type PageWithSlug = { slug: string; parent_page?: { slug: string } | null };

/**
 * Build the full URL path for a page based on its parent_page relation.
 * e.g. page { slug: "2023", parent_page: { slug: "gallery" } } → "gallery/2023"
 */
function buildPagePath(page: PageWithSlug): string {
  return page.parent_page ? `${page.parent_page.slug}/${page.slug}` : page.slug;
}

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const pages = await getPages();

    const EXCLUDED_PATHS = ["home", "test"];
    // "test" is a dedicated page served at /test, but with its own config
    // "home" is served at "/" via pages/index.jsx — exclude it here
    const paths = pages
      .filter((page) => !EXCLUDED_PATHS.includes(page.slug))
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
  page: GetPageBySlugReturn;
  relations: Record<string, string>;
  mediaMap: Record<string, StrapiMediaRecord>;
  mediaMetadata: FullMediaMetadata[];
}> = async (context) => {
  const { params } = context;
  try {
    // Strapi slugs are short (e.g. "2023"), not full paths ("gallery/2023").
    // The last segment of the URL path is the actual page slug.
    // The preceding segments come from the parent_page relation.
    const slug = Array.isArray(params?.slug)
      ? params.slug[params.slug.length - 1]
      : (params?.slug ?? "");
    const t0 = Date.now();
    const page = await getPageBySlug(slug);
    logCmsFetch(slug, !!page, Date.now() - t0);

    if (!page) {
      return { notFound: true };
    }

    const refs = extractAllRefs(page);
    const rawRelations = await fetchRelationData(refs);
    const relations = renderRelations(rawRelations as Record<string, object>);

    const imageUrls = extractImageUrls(page);
    const mediaMap = await fetchMediaData(imageUrls);
    const mediaMetadata = await getMediaMetadata();

    logBuildPage(slug, Date.now() - t0);

    return { props: { page, relations, mediaMap, mediaMetadata } };
  } catch (err) {
    const slug = Array.isArray(params?.slug)
      ? params.slug[params.slug.length - 1]
      : (params?.slug ?? "");
    logger.error(`getStaticProps:${slug}`, err as Error);
    return { notFound: true };
  }
};
