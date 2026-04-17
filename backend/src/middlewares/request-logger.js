'use strict';

/**
 * Request/response logging middleware.
 * Logs method, path, status, and response time for every HTTP request.
 * Auth-related paths also log an authEvent field for audit purposes.
 */
module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    const start = Date.now();
    await next();
    const duration = Date.now() - start;

    const isAuthPath = ctx.path.includes('/auth/') || ctx.path.includes('/login');

    strapi.log.info({
      method: ctx.method,
      path: ctx.path,
      status: ctx.status,
      duration,
      ...(isAuthPath && { authEvent: 'auth-attempt' }),
    });
  };
};
