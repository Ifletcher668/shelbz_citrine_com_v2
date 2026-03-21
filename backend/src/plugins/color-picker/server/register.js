'use strict';

module.exports = ({ strapi }) => {
  strapi.customFields.register({
    name: 'color-picker',
    plugin: 'color-picker',
    type: 'string',
  });
};
