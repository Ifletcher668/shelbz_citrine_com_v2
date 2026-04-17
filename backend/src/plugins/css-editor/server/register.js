'use strict';
module.exports = ({ strapi }) => {
  strapi.customFields.register({
    name: 'css-editor',
    plugin: 'css-editor',
    type: 'text',
  });
};
