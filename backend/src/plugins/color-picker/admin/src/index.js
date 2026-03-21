export default {
  register(app) {
    app.customFields.register({
      name: 'color-picker',
      pluginId: 'color-picker',
      type: 'string',
      intlLabel: {
        id: 'color-picker.label',
        defaultMessage: 'Color',
      },
      intlDescription: {
        id: 'color-picker.description',
        defaultMessage: 'Hex color value with swatch preview and native color picker',
      },
      components: {
        Input: async () => import('./components/ColorPicker'),
      },
    });
  },
};
