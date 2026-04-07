import Head from "next/head";
import PageLayout from "@/Components/layout/PageLayout";
import DynamicZone from "@/Components/cms/DynamicZone";
import { RelationsContext } from "@/lib/RelationsContext";
import {
  getPageBySlug,
  extractAllRefs,
  fetchRelationData,
} from "@/lib/strapi";
import { renderRelations } from "@/lib/relation-renderers";

/**
 * Root page — always served at "/".
 * Fetches the Strapi page with slug "home".
 */
export default function HomePage({ page, relations = {} }) {
  if (!page) return null;

  const overrideEntries =
    page.theme_overrides && typeof page.theme_overrides === "object"
      ? Object.entries(page.theme_overrides)
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
        <link rel="canonical" href="https://shelbzcitrine.com/" />
        {overrideEntries.length > 0 && (
          <style>{`:root {\n${overrideEntries.map(([k, v]) => `  ${k}: ${v};`).join("\n")}\n}`}</style>
        )}
      </Head>

      <RelationsContext.Provider value={relations}>
        <PageLayout>
          <DynamicZone sections={page.sections} />
        </PageLayout>
      </RelationsContext.Provider>
    </>
  );
}

export async function getStaticProps() {
  try {
    const page = await getPageBySlug("home");

    if (!page) {
      return { notFound: true };
    }

    const refs = extractAllRefs(page);
    const rawRelations = await fetchRelationData(refs);
    const relations = renderRelations(rawRelations);

    return { props: { page, relations } };
  } catch (err) {
    console.error("[getStaticProps] Could not fetch home page:", err.message);
    return { notFound: true };
  }
}
