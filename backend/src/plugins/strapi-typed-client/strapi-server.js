'use strict';

/**
 * Local CJS wrapper for strapi-typed-client plugin.
 *
 * The npm package ships as pure ESM, which Strapi's require()-based plugin
 * loader cannot handle. This file reimplements the same schema endpoint that
 * the `strapi-types generate` CLI expects:
 *
 *   GET /api/strapi-typed-client/schema
 *   GET /api/strapi-typed-client/schema-hash
 *
 * The response shape matches the package's ApiClient expectations exactly.
 */

const crypto = require('crypto');

// Fields added automatically by Strapi — excluded from generated types
const SYSTEM_FIELDS = ['createdAt', 'updatedAt', 'publishedAt'];
const PRIVATE_FIELDS = ['createdBy', 'updatedBy'];

function filterAttributes(attributes) {
  const skip = new Set([...SYSTEM_FIELDS, ...PRIVATE_FIELDS]);
  const filtered = {};

  for (const [name, attr] of Object.entries(attributes)) {
    if (skip.has(name)) continue;
    if (attr.private) continue;
    if (attr.type === 'relation') {
      const target = attr.target || '';
      if (target.startsWith('admin::')) continue;
      if (target.startsWith('plugin::') && !target.includes('users-permissions')) continue;
    }
    filtered[name] = attr;
  }

  return filtered;
}

function extractContentType(ct) {
  const uid = ct.uid;
  if (!uid.startsWith('api::') && !uid.includes('users-permissions')) return null;

  return {
    uid,
    kind: ct.kind || 'collectionType',
    collectionName: ct.collectionName,
    info: {
      singularName: ct.info?.singularName || '',
      pluralName: ct.info?.pluralName || '',
      displayName: ct.info?.displayName || '',
      description: ct.info?.description,
    },
    attributes: filterAttributes(ct.attributes || {}),
  };
}

function extractComponent(component) {
  return {
    uid: component.uid,
    category: component.category || component.uid.split('.')[0],
    info: {
      displayName: component.info?.displayName || '',
      description: component.info?.description,
    },
    attributes: filterAttributes(component.attributes || {}),
  };
}

function normalizeObject(obj) {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(normalizeObject);
  if (typeof obj === 'object') {
    const sorted = {};
    for (const key of Object.keys(obj).sort()) {
      sorted[key] = normalizeObject(obj[key]);
    }
    return sorted;
  }
  return obj;
}

function computeSchemaHash(data) {
  const json = JSON.stringify(normalizeObject(data));
  return crypto.createHash('sha256').update(json).digest('hex');
}

function extractSchema(strapi) {
  const contentTypes = {};
  const components = {};

  for (const [uid, ct] of Object.entries(strapi.contentTypes)) {
    const extracted = extractContentType(ct);
    if (extracted) contentTypes[uid] = extracted;
  }

  for (const [uid, component] of Object.entries(strapi.components)) {
    const extracted = extractComponent(component);
    if (extracted) components[uid] = extracted;
  }

  return { contentTypes, components };
}

module.exports = () => ({
  routes: {
    'content-api': {
      type: 'content-api',
      routes: [
        {
          method: 'GET',
          path: '/schema',
          handler: 'schema.getSchema',
          config: { auth: false },
        },
        {
          method: 'GET',
          path: '/schema-hash',
          handler: 'schema.getSchemaHash',
          config: { auth: false },
        },
      ],
    },
  },

  controllers: {
    schema: ({ strapi }) => ({
      async getSchema(ctx) {
        const schema = extractSchema(strapi);
        const hash = computeSchemaHash({ schema, endpoints: [], extraTypes: [] });
        ctx.body = {
          schema,
          endpoints: [],
          pluginEndpoints: [],
          extraTypes: [],
          hash,
          generatedAt: new Date().toISOString(),
        };
      },

      async getSchemaHash(ctx) {
        const schema = extractSchema(strapi);
        const hash = computeSchemaHash({ schema, endpoints: [], extraTypes: [] });
        ctx.body = {
          hash,
          generatedAt: new Date().toISOString(),
        };
      },
    }),
  },
});
