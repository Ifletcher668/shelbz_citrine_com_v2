export default {
  register(app) {
    app.customFields.register({
      name: 'form-layout-editor',
      pluginId: 'form-layout-editor',
      type: 'json',
      intlLabel: {
        id: 'form-layout-editor.label',
        defaultMessage: 'Form Layout',
      },
      intlDescription: {
        id: 'form-layout-editor.description',
        defaultMessage: 'Visual editor for arranging form fields into rows and columns',
      },
      components: {
        Input: async () => import('./components/FormLayoutEditor'),
      },
    });
  },
};
