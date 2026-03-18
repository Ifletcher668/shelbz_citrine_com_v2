'use strict';

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application gets registered.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * Auto-grants public read permissions for the page collection
   * so the Next.js frontend can fetch without authentication.
   */
  async bootstrap({ strapi }) {
    const publicRole = await strapi
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'public' } });

    if (!publicRole) return;

    const existing = await strapi
      .query('plugin::users-permissions.permission')
      .findMany({ where: { role: publicRole.id } });

    const hasFind = existing.some((p) => p.action === 'api::page.page.find');
    const hasFindOne = existing.some(
      (p) => p.action === 'api::page.page.findOne'
    );

    const toCreate = [];
    if (!hasFind)
      toCreate.push({ action: 'api::page.page.find', role: publicRole.id });
    if (!hasFindOne)
      toCreate.push({
        action: 'api::page.page.findOne',
        role: publicRole.id,
      });

    for (const perm of toCreate) {
      await strapi
        .query('plugin::users-permissions.permission')
        .create({ data: perm });
    }

    if (toCreate.length > 0) {
      strapi.log.info(
        `[bootstrap] Public permissions granted for page collection (${toCreate.length} added).`
      );
    }
  },
};
