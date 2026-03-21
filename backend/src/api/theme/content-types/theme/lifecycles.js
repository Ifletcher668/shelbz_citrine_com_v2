'use strict';

/**
 * Theme lifecycles — ensures only one theme can be active at a time.
 * When a theme is saved with is_active: true, all other themes are deactivated.
 */
module.exports = {
  async beforeCreate(event) {
    await deactivateOthers(event);
  },

  async beforeUpdate(event) {
    await deactivateOthers(event);
  },
};

async function deactivateOthers(event) {
  const { data, where } = event.params;

  if (!data.is_active) return;

  // Deactivate all other themes
  await strapi.db.query('api::theme.theme').updateMany({
    where: {
      id: { $not: where?.id ?? 0 },
      is_active: true,
    },
    data: { is_active: false },
  });
}
