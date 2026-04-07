/**
 * Frontend action registry.
 *
 * Maps action names (stored in Strapi's Action content type) to functions.
 * Button elements with data-action="name" are wired via event delegation.
 *
 * To add a new action:
 *   1. Create it in Strapi Admin → Actions (name must match the key here)
 *   2. Add the key + function below
 */
const ACTIONS = {
  "scroll-to-top": () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  },

  "copy-email": () => {
    navigator.clipboard.writeText("hello@shelbzcitrine.com").catch(() => {});
  },

  "open-contact-form": () => {
    const el = document.querySelector("[data-contact-form]");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  },

  "open-treasure-chest": () => {
    const el = document.querySelector("[data-treasure-chest]");
    if (el) {
      el.classList.add("is-open");
    }
  },
};

/**
 * Wire up global click delegation for [data-action] buttons.
 * Call once on app mount.
 */
export function initActionButtons() {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    const fn = ACTIONS[btn.dataset.action];
    if (fn) fn(e);
  });
}
