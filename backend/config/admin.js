module.exports = ({ env }) => ({
  auth: {
    secret: env("ADMIN_JWT_SECRET"),
  },
  apiToken: {
    salt: env("API_TOKEN_SALT"),
    secrets: {
      encryptionKey: env("ENCRYPTION_KEY"),
    },
  },
  transfer: {
    token: {
      salt: env("TRANSFER_TOKEN_SALT"),
    },
  },
  flags: {
    nps: env.bool("FLAG_NPS", true),
    promoteEE: env.bool("FLAG_PROMOTE_EE", true),
  },
  preview: {
    enabled: true,
    config: {
      allowedOrigins: env("FRONTEND_URL", "http://localhost:3000"),
      async handler(uid, { documentId, locale, status }) {
        if (uid !== "api::page.page") return null;

        const doc = await strapi.documents(uid).findOne({
          documentId,
          fields: ["slug"],
          populate: { parent_page: { fields: ["slug"] } },
          status,
        });

        if (!doc?.slug) return null;

        const pagePath = doc.parent_page
          ? `${doc.parent_page.slug}/${doc.slug}`
          : doc.slug;

        const hookUrl = env("NETLIFY_PREVIEW_SERVER_HOOK");
        const base = env("FRONTEND_URL", "http://localhost:3000");

        try {
          const hookRes = await fetch(hookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ uid, documentId, status, locale }),
          });

          if (hookRes.ok) {
            const data = await hookRes.json();
            const serverBase = data?.url?.replace(/\/$/, "");
            if (serverBase) return `${serverBase}/${pagePath}/`;
          }
        } catch (err) {
          strapi.log.warn(`[preview] Netlify hook failed: ${err.message}`);
        }

        return `${base}/${pagePath}/`;
      },
    },
  },
});
