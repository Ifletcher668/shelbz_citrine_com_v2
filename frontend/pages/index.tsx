import Head from "next/head";
import PageLayout from "../Components/layout/PageLayout";
import { RelationsContext } from "../lib/RelationsContext";
import { MediaContext } from "../lib/MediaContext";
import {
  getPageBySlug,
  extractAllRefs,
  fetchRelationData,
  extractImageUrls,
  fetchMediaData,
  GetPageBySlugReturn,
  FullMediaMetadata,
  StrapiMediaRecord,
  getMediaMetadata,
} from "../lib/strapi-cms/strapiApi";
import { renderRelations } from "../lib/relation-renderers";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { logBuildPage, logCmsFetch, logger } from "../lib/logger";
import GalleryPage from "../Components/cms/templates/GalleryPage";
import BlogPage from "../Components/cms/templates/BlogPage";
import DefaultPage from "../Components/cms/templates/DefaultPage";
import { sanitizeCSS } from "../lib/utils";

/**
 * Root page — always served at "/".
 * Fetches the Strapi page with slug "home".
 */
type Props = InferGetStaticPropsType<typeof getStaticProps>;

export default function HomePage(props: Props) {
  const { page, relations, mediaMap, mediaMetadata } = props;
  if (!page) return null;

  let ComponentByPageTemplate;

  switch (page.page_template?.slug) {
    case "gallery_page":
      ComponentByPageTemplate = () => (
        <GalleryPage page={page} mediaMetadata={mediaMetadata} />
      );
    case "blog_page":
      ComponentByPageTemplate = () => <BlogPage page={page} />;
    case "default_page":
    default:
      ComponentByPageTemplate = () => <DefaultPage page={page} />;
  }

  const sanitizedCss = sanitizeCSS(page.custom_css);

  return (
    <>
      <Head>
        <title>{`${page.title} | Shelbz Citrine`}</title>
        {page.seo_description && (
          <meta name="description" content={page.seo_description} />
        )}
        <meta property="og:title" content={`${page.title} | Shelbz Citrine`} />
        {page.seo_description && (
          <meta property="og:description" content={page.seo_description} />
        )}
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://shelbzcitrine.com/" />
        {page.custom_css && <style>{sanitizedCss}</style>}
      </Head>

      <MediaContext.Provider value={{ mediaMap }}>
        <RelationsContext.Provider value={relations}>
          <PageLayout className="">
            <ComponentByPageTemplate />
          </PageLayout>
        </RelationsContext.Provider>
      </MediaContext.Provider>
    </>
  );
}

export const getStaticProps: GetStaticProps<{
  page: GetPageBySlugReturn;
  relations: Record<string, string>;
  mediaMap: Record<string, StrapiMediaRecord>;
  mediaMetadata: FullMediaMetadata[];
}> = async (context) => {
  try {
    const slug = "home";
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
    logger.error(`getStaticProps:${"home"}`, err as Error);
    return { notFound: true };
  }
};
