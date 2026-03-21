'use strict';

/**
 * Unit tests for backend/src/api/theme/content-types/theme/lifecycles.js
 *
 * The lifecycle module uses `strapi` as a global (injected by Strapi at runtime).
 * We mock it here before requiring the module under test.
 *
 * Verifies:
 * - is_active: false → no updateMany call (no-op)
 * - is_active: true on beforeCreate → deactivates all other themes
 * - is_active: true on beforeUpdate → deactivates all themes except the current id
 * - is_active: true with no where.id (new create) → $not: 0 fallback
 */

const LIFECYCLE_PATH = '../src/api/theme/content-types/theme/lifecycles';

function makeStrapi(updateManyMock = jest.fn()) {
  return {
    db: {
      query: jest.fn(() => ({ updateMany: updateManyMock })),
    },
  };
}

function loadLifecycles(strapiMock) {
  // Strapi injects `strapi` as a global; replicate that here
  global.strapi = strapiMock;
  // Clear the module cache so each test gets a fresh require
  jest.resetModules();
  return require(LIFECYCLE_PATH);
}

// ─── is_active: false ────────────────────────────────────────────────────────

describe('when is_active is false', () => {
  test('beforeCreate does not call updateMany', async () => {
    const updateMany = jest.fn();
    const lifecycles = loadLifecycles(makeStrapi(updateMany));
    await lifecycles.beforeCreate({ params: { data: { is_active: false } } });
    expect(updateMany).not.toHaveBeenCalled();
  });

  test('beforeUpdate does not call updateMany', async () => {
    const updateMany = jest.fn();
    const lifecycles = loadLifecycles(makeStrapi(updateMany));
    await lifecycles.beforeUpdate({ params: { data: { is_active: false }, where: { id: 2 } } });
    expect(updateMany).not.toHaveBeenCalled();
  });

  test('missing is_active field (undefined) does not call updateMany', async () => {
    const updateMany = jest.fn();
    const lifecycles = loadLifecycles(makeStrapi(updateMany));
    await lifecycles.beforeCreate({ params: { data: {} } });
    expect(updateMany).not.toHaveBeenCalled();
  });
});

// ─── is_active: true on create ───────────────────────────────────────────────

describe('when is_active is true on beforeCreate', () => {
  test('calls updateMany on the theme collection', async () => {
    const updateMany = jest.fn();
    const strapi = makeStrapi(updateMany);
    const lifecycles = loadLifecycles(strapi);

    await lifecycles.beforeCreate({ params: { data: { is_active: true } } });

    expect(strapi.db.query).toHaveBeenCalledWith('api::theme.theme');
    expect(updateMany).toHaveBeenCalledTimes(1);
  });

  test('deactivates all themes (no where.id → $not: 0)', async () => {
    const updateMany = jest.fn();
    const lifecycles = loadLifecycles(makeStrapi(updateMany));

    await lifecycles.beforeCreate({ params: { data: { is_active: true } } });

    expect(updateMany).toHaveBeenCalledWith({
      where: { id: { $not: 0 }, is_active: true },
      data: { is_active: false },
    });
  });
});

// ─── is_active: true on update ───────────────────────────────────────────────

describe('when is_active is true on beforeUpdate', () => {
  test('excludes the current theme id from deactivation', async () => {
    const updateMany = jest.fn();
    const lifecycles = loadLifecycles(makeStrapi(updateMany));

    await lifecycles.beforeUpdate({
      params: { data: { is_active: true }, where: { id: 5 } },
    });

    expect(updateMany).toHaveBeenCalledWith({
      where: { id: { $not: 5 }, is_active: true },
      data: { is_active: false },
    });
  });

  test('sets is_active: false on the deactivated themes', async () => {
    const updateMany = jest.fn();
    const lifecycles = loadLifecycles(makeStrapi(updateMany));

    await lifecycles.beforeUpdate({
      params: { data: { is_active: true }, where: { id: 3 } },
    });

    const [call] = updateMany.mock.calls;
    expect(call[0].data).toEqual({ is_active: false });
  });
});

// ─── Strapi query target ─────────────────────────────────────────────────────

test('always queries the api::theme.theme collection', async () => {
  const updateMany = jest.fn();
  const strapi = makeStrapi(updateMany);
  const lifecycles = loadLifecycles(strapi);

  await lifecycles.beforeCreate({ params: { data: { is_active: true } } });

  expect(strapi.db.query).toHaveBeenCalledWith('api::theme.theme');
});
