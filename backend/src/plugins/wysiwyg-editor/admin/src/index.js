export default {
  register(app) {
    app.customFields.register({
      name: "wysiwyg-editor",
      pluginId: "wysiwyg-editor",
      type: "richtext",
      intlLabel: {
        id: "wysiwyg-editor.label",
        defaultMessage: "WYSIWYG Editor",
      },
      intlDescription: {
        id: "wysiwyg-editor.description",
        defaultMessage: " markdown editor with toolbar and live preview",
      },
      components: {
        Input: async () => import("./components/WYSIWYGEditor"),
      },
    });
  },
};
