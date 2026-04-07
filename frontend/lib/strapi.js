const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

/**
 * Base fetch wrapper for the Strapi v5 REST API.
 * Strapi v5 responses: { data: [...], meta: {...} }
 * Attributes are FLAT in v5 — data[0].title, not data[0].attributes.title
 */
async function strapiGet(path) {
  const headers = {};
  if (STRAPI_TOKEN) {
    headers["Authorization"] = `Bearer ${STRAPI_TOKEN}`;
  }
  const res = await fetch(`${STRAPI_URL}/api${path}`, { headers });
  if (!res.ok) {
    throw new Error(
      `Strapi fetch failed: ${res.status} ${res.statusText} — /api${path}`,
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
    "?filters[publishedAt][$notNull]=true" +
    "&fields[0]=slug" +
    "&fields[1]=title" +
    "&pagination[pageSize]=100";

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
    `&populate[sections][on][sections.row][populate][columns]=*`;

  const { data } = await strapiGet(`/pages${qs}`);
  if (!data || data.length === 0) return null;
  return data[0];
}

/**
 * Fetch the published Header single type with primary (logo) and nav_links populated.
 */
export async function getHeader() {
  const qs =
    "?populate[primary][populate]=*" +
    "&populate[nav_links][populate][page][fields][0]=slug" +
    "&populate[nav_links][populate][page][fields][1]=title";

  const { data } = await strapiGet(`/header${qs}`);
  return data ?? null;
}

/**
 * Fetch the Footer single type with all columns populated.
 */
export async function getFooter() {
  const qs = "?populate[columns][populate]=*";

  const { data } = await strapiGet(`/footer${qs}`);
  return data ?? null;
}

/**
 * Resolve a Strapi media URL to a full URL.
 * Strapi stores relative paths like /uploads/image.jpg
 */
export function getStrapiMediaUrl(url) {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  if (url.startsWith("/")) return url;
  return `${STRAPI_URL}${url}`;
}

/**
 * Build a srcset string from a Strapi media object's format variants.
 * Returns null if no format data is available.
 */
export function buildStrapiSrcSet(image) {
  if (!image) return null;
  const entries = [];
  if (image.formats) {
    for (const key of ["thumbnail", "small", "medium", "large"]) {
      const fmt = image.formats[key];
      if (fmt?.url && fmt?.width) {
        entries.push(`${getStrapiMediaUrl(fmt.url)} ${fmt.width}w`);
      }
    }
  }
  if (image.url && image.width) {
    entries.push(`${getStrapiMediaUrl(image.url)} ${image.width}w`);
  }
  return entries.length > 0 ? entries.join(", ") : null;
}

/**
 * Fetch the currently active theme with all token groups populated.
 * Returns null if no active theme exists or Strapi is unavailable.
 */
export async function getActiveTheme() {
  const qs =
    "?filters[is_active][$eq]=true" +
    "&populate[colors]=*" +
    "&populate[typography]=*" +
    "&populate[spacing]=*" +
    "&populate[layout]=*";

  try {
    const { data } = await strapiGet(`/themes${qs}`);
    if (!data || data.length === 0) return null;
    return data[0];
  } catch {
    return null;
  }
}

// ─── Media helpers ────────────────────────────────────────────────────────────

/**
 * Walk any page-data object and collect all /uploads/ image URLs found in
 * markdown image syntax (![...](url)). Returns a deduplicated array of URL strings.
 */
export function extractImageUrls(obj) {
  const urls = new Set();
  const re = /!\[[^\]]*\]\(([^)\s]+)/g;

  function walk(val) {
    if (typeof val === "string") {
      re.lastIndex = 0;
      let m;
      while ((m = re.exec(val)) !== null) {
        if (m[1].startsWith("/uploads/")) urls.add(m[1]);
      }
    } else if (Array.isArray(val)) {
      val.forEach(walk);
    } else if (val && typeof val === "object") {
      Object.values(val).forEach(walk);
    }
  }

  walk(obj);
  return [...urls];
}

/**
 * Fetch full Strapi media objects for a list of /uploads/ URLs.
 * Returns a map of url → StrapiMedia. Silently returns {} on failure.
 */
export async function fetchMediaData(urls) {
  if (!urls.length) return {};
  const filterQs = urls
    .map((url, i) => `filters[url][$in][${i}]=${encodeURIComponent(url)}`)
    .join("&");

  try {
    const response = await strapiGet(
      `/upload/files?${filterQs}&pagination[pageSize]=100`,
    );
    // Upload files API returns a plain array, not { data: [] }
    const files = Array.isArray(response) ? response : (response.data ?? []);
    return Object.fromEntries(
      files.map((m) => {
        const formats = {};
        for (const key of ["thumbnail", "small", "medium", "large"]) {
          if (m.formats?.[key]) {
            formats[key] = { url: m.formats[key].url, width: m.formats[key].width };
          }
        }
        return [
          m.url,
          {
            url: m.url,
            alternativeText: m.alternativeText ?? null,
            width: m.width,
            height: m.height,
            formats,
          },
        ];
      }),
    );
  } catch {
    return {};
  }
}

// ─── Relation embed helpers ────────────────────────────────────────────────────

/**
 * Map from relation type (as used in [ref:type:id]) to Strapi plural API path.
 * Add an entry here whenever a new embeddable content type is created.
 */
const RELATION_API_PATHS = {
  "bullet-list": "bullet-lists",
  faq: "faqs",
  "step-group": "step-groups",
  "contact-form": "contact-forms",
  button: "buttons",
};

// Per-type populate overrides. Types not listed here use the default "populate=*".
// Needed when a type has nested component relations that populate=* won't deep-resolve.
const RELATION_POPULATE = {
  button: "populate[action]=*&populate[link][populate][page][fields][0]=slug",
};

/**
 * Recursively walk any page-data object and collect all [ref:type:id] tokens
 * found in string values. Returns a deduplicated array of { type, id } objects.
 */
export function extractAllRefs(obj) {
  const refs = [];
  const seen = new Set();

  function walk(val) {
    if (typeof val === "string") {
      const re = /\[ref:([\w-]+):(\d+)\]/g;
      let m;
      while ((m = re.exec(val)) !== null) {
        const key = `${m[1]}:${m[2]}`;
        if (!seen.has(key)) {
          seen.add(key);
          refs.push({ type: m[1], id: parseInt(m[2], 10) });
        }
      }
    } else if (Array.isArray(val)) {
      val.forEach(walk);
    } else if (val && typeof val === "object") {
      Object.values(val).forEach(walk);
    }
  }

  walk(obj);
  return refs;
}

/**
 * Fetch raw Strapi data for each { type, id } ref.
 * Returns a map of "type:id" → Strapi flat-response data object.
 * Silently skips unknown types or failed fetches.
 */
export async function fetchRelationData(refs) {
  if (!refs.length) return {};
  const results = {};
  await Promise.all(
    refs.map(async ({ type, id }) => {
      const path = RELATION_API_PATHS[type];
      if (!path) return;
      try {
        const populateQs = RELATION_POPULATE[type] ?? "populate=*";
        const { data } = await strapiGet(
          `/${path}?filters[id][$eq]=${id}&pagination[pageSize]=1&${populateQs}`,
        );
        if (data && data.length > 0) results[`${type}:${id}`] = data[0];
      } catch (error) {
        // silent — the embed placeholder will render as empty
      }
    }),
  );

  return results;
}
