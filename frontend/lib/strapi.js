const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

/**
 * Base fetch wrapper for the Strapi v5 REST API.
 * Strapi v5 responses: { data: [...], meta: {...} }
 * Attributes are FLAT in v5 — data[0].title, not data[0].attributes.title
 */
async function strapiGet(path) {
  const res = await fetch(`${STRAPI_URL}/api${path}`);
  if (!res.ok) {
    throw new Error(
      `Strapi fetch failed: ${res.status} ${res.statusText} — /api${path}`
    );
  }
  return res.json();
}

/**
 * Fetch all published pages (slug + title only).
 * Used in getStaticPaths to enumerate routes.
 */
export async function getPages() {
  const qs =
    '?filters[publishedAt][$notNull]=true' +
    '&fields[0]=slug' +
    '&fields[1]=title' +
    '&pagination[pageSize]=100';

  const { data } = await strapiGet(`/pages${qs}`);
  return data ?? [];
}

/**
 * Fetch a single published page by slug, with all sections populated.
 * Used in getStaticProps to build the full page.
 */
export async function getPageBySlug(slug) {
  const qs =
    `?filters[slug][$eq]=${encodeURIComponent(slug)}` +
    `&filters[publishedAt][$notNull]=true` +
    `&populate[sections][populate]=*`;

  const { data } = await strapiGet(`/pages${qs}`);
  if (!data || data.length === 0) return null;
  return data[0];
}

/**
 * Resolve a Strapi media URL to a full URL.
 * Strapi stores relative paths like /uploads/image.jpg
 */
export function getStrapiMediaUrl(url) {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${STRAPI_URL}${url}`;
}
