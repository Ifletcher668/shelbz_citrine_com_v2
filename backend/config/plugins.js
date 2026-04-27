module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: "cloudinary",
      providerOptions: {
        cloud_name: env("CLOUDINARY_NAME"),
        api_key: env("CLOUDINARY_KEY"),
        api_secret: env("CLOUDINARY_SECRET"),
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },
  "css-editor": {
    enabled: true,
    resolve: "./src/plugins/css-editor",
  },
  "wysiwyg-editor": {
    enabled: true,
    resolve: "./src/plugins/wysiwyg-editor",
  },
  "color-picker": {
    enabled: true,
    resolve: "./src/plugins/color-picker",
  },
  "form-layout-editor": {
    enabled: true,
    resolve: "./src/plugins/form-layout-editor",
  },
  "strapi-typed-client": {
    enabled: true,
    resolve: "./src/plugins/strapi-typed-client",
    config: {
      requireAuth: false,
    },
  },
});
