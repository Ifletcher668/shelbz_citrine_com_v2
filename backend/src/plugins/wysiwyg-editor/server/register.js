"use strict";
module.exports = ({ strapi }) => {
  strapi.customFields.register({
    name: "wysiwyg-editor",
    plugin: "wysiwyg-editor",
    type: "richtext",
  });
};
