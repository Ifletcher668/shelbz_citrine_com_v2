/**
 * Embeddable relation types for the WYSIWYG toolbar "Components" picker.
 *
 * Each entry produces a sub-option under the "Components" dropdown in the toolbar.
 * Selecting an entry inserts [ref:type:id] at the cursor position.
 *
 * Fields:
 *   type         — matches the "type" in [ref:type:id] and RELATION_API_PATHS in lib/strapi.js
 *   label        — shown as the sub-option label within the Components dropdown
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
  {
    type: "faq",
    label: "FAQ",
    apiPath: "faqs",
    displayField: "title",
  },
  {
    type: "step-group",
    label: "Step Group",
    apiPath: "step-groups",
    displayField: "title",
  },
  {
    type: "contact-form",
    label: "Contact Form",
    apiPath: "contact-forms",
    displayField: "title",
  },
  {
    type: "button",
    label: "Button",
    apiPath: "buttons",
    displayField: "title",
  },
  // Future component types go here:
  // { type: "modal", label: "Modal", apiPath: "modals", displayField: "title" },
];
