'use strict';

module.exports = {
  afterCreate(event) {
    strapi.log.info({ action: 'page.created', id: event.result.id, slug: event.result.slug });
  },
  afterUpdate(event) {
    strapi.log.info({ action: 'page.updated', id: event.result.id, slug: event.result.slug });
  },
  afterDelete(event) {
    strapi.log.info({ action: 'page.deleted', id: event.result.id, slug: event.result.slug });
  },
};
