/**
 * Relation renderers — convert raw Strapi data into HTML strings for embed.
 *
 * Each renderer takes the flat Strapi v5 data object for one entry and returns
 * an HTML string. The returned string is injected by parseWithRelations() into
 * the position where [ref:type:id] appeared in the markdown.
 *
 * To add a new embeddable type:
 *   1. Create the Strapi content type
 *   2. Add its plural API path to RELATION_API_PATHS in lib/strapi.js
 *   3. Add a renderer function here and register it in RENDERERS
 */

// ─── Shared SVGs (kept local to avoid coupling to marked-extensions) ──────────

const ICON_X = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;

const ICON_CHECK = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 18 4 13"/></svg>`;

// ─── Bullet List ──────────────────────────────────────────────────────────────

function renderBulletItem({ type, title, description }) {
  const icon = type === "check" ? ICON_CHECK : ICON_X;
  const desc = description
    ? `<p class="md-bullet-description">${description}</p>`
    : "";
  return (
    `<div class="md-bullet md-bullet-${type}">` +
    `<span class="md-bullet-icon">${icon}</span>` +
    `<div class="md-bullet-content">` +
    `<span class="md-bullet-text">${title}</span>` +
    `${desc}` +
    `</div>` +
    `</div>`
  );
}

function renderBulletList(data) {
  const items = (data.items ?? []).map(renderBulletItem).join("\n");
  return `<div class="md-bullet-list">\n${items}\n</div>`;
}

// ─── Registry ─────────────────────────────────────────────────────────────────

const RENDERERS = {
  "bullet-list": renderBulletList,
};

/**
 * Convert a map of raw Strapi data objects into a map of rendered HTML strings.
 *
 * @param {Record<string, object>} rawRelations - e.g. { "bullet-list:42": {...} }
 * @returns {Record<string, string>} - e.g. { "bullet-list:42": "<div>...</div>" }
 */
export function renderRelations(rawRelations) {
  const html = {};
  for (const [key, data] of Object.entries(rawRelations)) {
    const type = key.split(":")[0];
    const renderer = RENDERERS[type];
    if (renderer) html[key] = renderer(data);
  }
  return html;
}
