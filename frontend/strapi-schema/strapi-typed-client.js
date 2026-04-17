// CJS shim used by Jest (next/jest maps tsconfig paths, which resolves here).
// The real ESM package is handled by next.config.mjs bootstrapTypes() at build time.
module.exports = {
  StrapiClient: class StrapiClient {
    constructor() {}
  },
};
