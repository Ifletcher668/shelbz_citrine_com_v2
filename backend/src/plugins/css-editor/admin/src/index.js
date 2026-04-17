export default {
  register(app) {
    app.customFields.register({
      name: 'css-editor',
      pluginId: 'css-editor',
      type: 'text',
      intlLabel: {
        id: 'css-editor.label',
        defaultMessage: 'CSS Editor',
      },
      intlDescription: {
        id: 'css-editor.description',
        defaultMessage: 'CSS editor with syntax highlighting and autocomplete',
      },
      components: {
        Input: async () => import('./components/CSSEditor'),
      },
    });
  },
};
