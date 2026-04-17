/**
 * Smoke Test Page
 *
 * Fetches the "test" slug from Strapi and renders it through the full
 * DynamicZone pipeline. Used by CI (`next build`) to verify CMS data
 * populates correctly before a Netlify deploy.
 *
 * This page must exist in Strapi (slug: "test") with at least one
 * sections.row and one sections.media-gallery to be meaningful,
 * but returns { notFound: true } if absent so builds still succeed.
 */
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";
import PageLayout from "../Components/layout/PageLayout";
import DynamicZone from "../Components/cms/DynamicZone";
import { RelationsContext } from "../lib/RelationsContext";
import { MediaContext } from "../lib/MediaContext";
import {
  getPageBySlug,
  extractAllRefs,
  fetchRelationData,
  extractImageUrls,
  fetchMediaData,
} from "../lib/strapi-cms/strapiApi";
import type {
  GetPageBySlugReturn,
  StrapiMediaRecord,
} from "../lib/strapi-cms/strapiApi";
import { renderRelations } from "../lib/relation-renderers";
import { logger, logCmsFetch, logBuildPage } from "../lib/logger";

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export default function TestPage({ page, relations, mediaMap }: Props) {
  if (!page) return null;

  return (
    <>
      <Head>
        <title>Smoke Test | Shelbz Citrine</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <MediaContext.Provider value={mediaMap}>
        <RelationsContext.Provider value={relations}>
          <PageLayout className="">
            <DynamicZone sections={page.sections} />
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
}> = async () => {
  try {
    const t0 = Date.now();
    const page = await getPageBySlug("test");
    logCmsFetch("test", !!page, Date.now() - t0);
    if (!page) {
      return { notFound: true };
    }

    const refs = extractAllRefs(page);
    const rawRelations = await fetchRelationData(refs);
    const relations = renderRelations(rawRelations as Record<string, object>);

    const imageUrls = extractImageUrls(page);
    const mediaMap = await fetchMediaData(imageUrls);
    logBuildPage("test", Date.now() - t0);

    return { props: { page, relations, mediaMap } };
  } catch (err) {
    logger.error("test/getStaticProps", err as Error);
    return { notFound: true };
  }
};
