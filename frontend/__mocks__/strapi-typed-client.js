/**
 * Jest manual mock for strapi-typed-client.
 * The real package is ESM-only and cannot be processed by Jest's CJS transform.
 * Tests only need the StrapiClient constructor (created in strapiClient.js);
 * all type exports are erased by SWC at compile time.
 */
module.exports = {
  StrapiClient: class StrapiClient {
    constructor() {}
  },
};
