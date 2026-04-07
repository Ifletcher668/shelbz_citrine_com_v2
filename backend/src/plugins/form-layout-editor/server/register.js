'use strict';
module.exports = ({ strapi }) => {
  strapi.customFields.register({
    name: 'form-layout-editor',
    plugin: 'form-layout-editor',
    type: 'json',
  });
};
