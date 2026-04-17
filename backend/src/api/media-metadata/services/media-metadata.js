'use strict';

/**
 * media-metadata service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::media-metadata.media-metadata');
