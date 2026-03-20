/**
 * Embeddable relation types for the WYSIWYG toolbar picker.
 *
 * Each entry will produce a SingleSelect dropdown in the toolbar.
 * Selecting an entry inserts [ref:type:id] at the cursor position.
 *
 * Fields:
 *   type         — matches the "type" in [ref:type:id] and RELATION_API_PATHS in lib/strapi.js
 *   label        — shown as the dropdown placeholder
 *   apiPath      — Strapi plural API path, e.g. "bullet-lists" → /api/bullet-lists
 *   displayField — which field of each entry to show as the option label
 */
export const RELATION_TYPES = [
  {
    type: "bullet-list",
    label: "Bullet List",
    apiPath: "bullet-lists",
    displayField: "title",
  },
];
