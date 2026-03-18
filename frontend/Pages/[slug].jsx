import Head from "next/head";
import PageLayout from "@/Components/layout/PageLayout";
import DynamicZone from "@/Components/cms/DynamicZone";
import { getPages, getPageBySlug } from "@/lib/strapi";

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
export default function CmsPage({ page }) {
  if (!page) return null;

  return (
    <>
      <Head>
        <title>{page.title} | Heritage Jewelry</title>
        {page.seo_description && (
          <meta name="description" content={page.seo_description} />
        )}
        <meta
          property="og:title"
          content={`${page.title} | Heritage Jewelry`}
        />
        {page.seo_description && (
          <meta property="og:description" content={page.seo_description} />
        )}
        <meta property="og:type" content="website" />
        <link
          rel="canonical"
          href={`https://heritagejewelry.com/${page.slug}`}
        />
      </Head>

      <PageLayout>
        <DynamicZone sections={page.sections} />
      </PageLayout>
    </>
  );
}

export async function getStaticPaths() {
  try {
    const pages = await getPages();
    const paths = pages.map((page) => ({
      params: { slug: page.slug },
    }));

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

    return { props: { page } };
  } catch (err) {
    console.error(
      `[getStaticProps] Could not fetch page "${params.slug}":`,
      err.message,
    );
    return { notFound: true };
  }
}
