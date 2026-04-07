import Head from "next/head";
import PageLayout from "@/Components/layout/PageLayout";
import DynamicZone from "@/Components/cms/DynamicZone";
import { RelationsContext } from "@/lib/RelationsContext";
import {
  getPages,
  getPageBySlug,
  extractAllRefs,
  fetchRelationData,
} from "@/lib/strapi";
import { renderRelations } from "@/lib/relation-renderers";

/**
 * CMS-Driven Page
 *
 * Renders any page published in Strapi's "Page" collection type.
 * Statically generated at build time — all slugs must be published
 * before the Netlify build runs.
 *
 * Next.js resolves explicit page files (about.jsx, process.jsx, etc.)
 * before this catch-all, so existing pages are unaffected.
 */
export default function CmsPage({ page, relations = {} }) {
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
        <link rel="canonical" href={`https://shelbzcitrine.com/${page.slug}`} />
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

export async function getStaticPaths() {
  try {
    const pages = await getPages();
    // "home" is served at "/" via pages/index.jsx — exclude it here
    const paths = pages
      .filter((page) => page.slug !== "home")
      .map((page) => ({ params: { slug: page.slug } }));

    return { paths, fallback: false };
  } catch (err) {
    // Strapi unavailable at build time — return empty paths, build succeeds
    console.error(
      "[getStaticPaths] Could not fetch pages from Strapi:",
      err.message,
    );
    return { paths: [], fallback: false };
  }
}

export async function getStaticProps({ params }) {
  try {
    const page = await getPageBySlug(params.slug);

    if (!page) {
      return { notFound: true };
    }

    const refs = extractAllRefs(page);
    const rawRelations = await fetchRelationData(refs);
    const relations = renderRelations(rawRelations);
    console.log("meep", relations, rawRelations);

    return { props: { page, relations } };
  } catch (err) {
    console.error(
      `[getStaticProps] Could not fetch page "${params.slug}":`,
      err.message,
    );
    return { notFound: true };
  }
}
