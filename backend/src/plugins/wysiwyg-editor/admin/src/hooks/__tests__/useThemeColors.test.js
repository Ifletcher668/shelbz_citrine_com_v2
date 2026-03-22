/**
 * Tests for useThemeColors hook.
 *
 * The hook has a module-level cache (cachedColors). To isolate tests that care
 * about fetch behavior, we use jest.isolateModules() + jest.doMock() to get a
 * fresh module instance with a cleared cache for each test.
 *
 * React instance sharing: jest.isolateModules loads a fresh copy of every module
 * including React itself, which causes "invalid hook call" when renderHook uses
 * a different React instance. We fix this by explicitly passing the pre-loaded
 * React instance into each isolated registry via jest.doMock('react', ...).
 */
import { renderHook, waitFor } from "@testing-library/react";
import { TEXT_COLOR_SLOTS } from "../color-slots";

// Expected default colors — mirrors DEFAULT_COLORS in useThemeColors.js
const DEFAULT_COLORS = TEXT_COLOR_SLOTS.map(({ name, cssVar, defaultHex }) => ({
  name,
  cssVar,
  hex: defaultHex,
}));

/**
 * Returns a fresh copy of useThemeColors with a cleared module-level cache,
 * using the given `get` mock as the fetch implementation.
 *
 * Uses jest.isolateModules to reset cachedColors between tests.
 * Pins the shared React instance to avoid "multiple React copies" hook errors.
 */
function loadHook(getMock) {
  // Capture the already-loaded React before entering the isolated registry
  const sharedReact = require("react");

  let mod;
  jest.isolateModules(() => {
    // Force the isolated registry to use the same React instance as renderHook
    jest.doMock("react", () => sharedReact);
    jest.doMock("@strapi/admin/strapi-admin", () => ({
      useFetchClient: () => ({ get: getMock }),
    }));
    mod = require("../useThemeColors");
  });
  return mod.useThemeColors;
}

// ─── Default / fallback colors ────────────────────────────────────────────────

describe("useThemeColors — defaults and fallbacks", () => {
  afterEach(() => jest.clearAllMocks());

  test("returns default colors synchronously before any fetch resolves", () => {
    const get = jest.fn().mockReturnValue(new Promise(() => {})); // never resolves
    const useThemeColors = loadHook(get);

    const { result } = renderHook(() => useThemeColors());

    expect(result.current).toEqual(DEFAULT_COLORS);
  });

  test("returns default colors when API fetch rejects", async () => {
    const get = jest.fn().mockRejectedValue(new Error("Network error"));
    const useThemeColors = loadHook(get);

    const { result } = renderHook(() => useThemeColors());

    expect(result.current).toEqual(DEFAULT_COLORS); // immediate default

    await waitFor(() => expect(get).toHaveBeenCalledTimes(1));

    expect(result.current).toEqual(DEFAULT_COLORS); // still default after rejection
  });

  test("returns default colors when API returns no results", async () => {
    const get = jest.fn().mockResolvedValue({ data: { results: [] } });
    const useThemeColors = loadHook(get);

    const { result } = renderHook(() => useThemeColors());

    await waitFor(() => expect(get).toHaveBeenCalledTimes(1));

    expect(result.current).toEqual(DEFAULT_COLORS);
  });

  test("returns default colors when results[0].colors is missing", async () => {
    const get = jest
      .fn()
      .mockResolvedValue({ data: { results: [{ colors: null }] } });
    const useThemeColors = loadHook(get);

    const { result } = renderHook(() => useThemeColors());

    await waitFor(() => expect(get).toHaveBeenCalledTimes(1));

    expect(result.current).toEqual(DEFAULT_COLORS);
  });
});

// ─── Resolved theme colors ────────────────────────────────────────────────────

describe("useThemeColors — resolved theme colors", () => {
  afterEach(() => jest.clearAllMocks());

  test("returns resolved colors when API returns a full active theme", async () => {
    const fakeThemeColors = {};
    TEXT_COLOR_SLOTS.forEach(({ field }) => {
      fakeThemeColors[field] = "#ff0000";
    });

    const get = jest.fn().mockResolvedValue({
      data: { results: [{ colors: fakeThemeColors }] },
    });
    const useThemeColors = loadHook(get);

    const { result } = renderHook(() => useThemeColors());

    await waitFor(() => {
      expect(result.current.every((c) => c.hex === "#ff0000")).toBe(true);
    });

    expect(result.current).toHaveLength(TEXT_COLOR_SLOTS.length);
  });

  test("each resolved color has name, cssVar, and hex", async () => {
    const fakeThemeColors = {};
    TEXT_COLOR_SLOTS.forEach(({ field }) => {
      fakeThemeColors[field] = "#123abc";
    });

    const get = jest.fn().mockResolvedValue({
      data: { results: [{ colors: fakeThemeColors }] },
    });
    const useThemeColors = loadHook(get);

    const { result } = renderHook(() => useThemeColors());

    await waitFor(() => expect(get).toHaveBeenCalledTimes(1));

    for (const c of result.current) {
      expect(typeof c.name).toBe("string");
      expect(typeof c.cssVar).toBe("string");
      expect(typeof c.hex).toBe("string");
    }
  });

  test("falls back to defaultHex for fields missing from API response", async () => {
    // Only provide accent — all other fields are absent
    const get = jest.fn().mockResolvedValue({
      data: { results: [{ colors: { accent: "#abcdef" } }] },
    });
    const useThemeColors = loadHook(get);

    const { result } = renderHook(() => useThemeColors());

    await waitFor(() => expect(get).toHaveBeenCalledTimes(1));

    const resolvedAccent = result.current.find((c) => c.name === "accent");
    expect(resolvedAccent.hex).toBe("#abcdef");

    const textMutedSlot = TEXT_COLOR_SLOTS.find((s) => s.field === "text_muted");
    const resolvedMuted = result.current.find((c) => c.name === "text-muted");
    expect(resolvedMuted.hex).toBe(textMutedSlot.defaultHex);
  });

  test("resolved colors preserve cssVar from TEXT_COLOR_SLOTS", async () => {
    const fakeThemeColors = {};
    TEXT_COLOR_SLOTS.forEach(({ field }) => {
      fakeThemeColors[field] = "#000000";
    });

    const get = jest.fn().mockResolvedValue({
      data: { results: [{ colors: fakeThemeColors }] },
    });
    const useThemeColors = loadHook(get);

    const { result } = renderHook(() => useThemeColors());

    await waitFor(() => expect(get).toHaveBeenCalledTimes(1));

    for (const slot of TEXT_COLOR_SLOTS) {
      const resolved = result.current.find((c) => c.name === slot.name);
      expect(resolved).toBeDefined();
      expect(resolved.cssVar).toBe(slot.cssVar);
    }
  });
});

// ─── API endpoint ─────────────────────────────────────────────────────────────

describe("useThemeColors — API endpoint", () => {
  afterEach(() => jest.clearAllMocks());

  test("fetches from the content-manager theme endpoint", async () => {
    const get = jest.fn().mockResolvedValue({ data: { results: [] } });
    const useThemeColors = loadHook(get);

    renderHook(() => useThemeColors());

    await waitFor(() => expect(get).toHaveBeenCalledTimes(1));

    const [url] = get.mock.calls[0];
    expect(url).toContain(
      "/content-manager/collection-types/api::theme.theme",
    );
    expect(url).toContain("filters[is_active][$eq]=true");
    expect(url).toContain("populate[colors]=*");
  });

  test("requests only 1 result via pagination", async () => {
    const get = jest.fn().mockResolvedValue({ data: { results: [] } });
    const useThemeColors = loadHook(get);

    renderHook(() => useThemeColors());

    await waitFor(() => expect(get).toHaveBeenCalledTimes(1));

    const [url] = get.mock.calls[0];
    expect(url).toContain("pagination[pageSize]=1");
  });
});

// ─── Module-level cache ───────────────────────────────────────────────────────

describe("useThemeColors — caching", () => {
  afterEach(() => jest.clearAllMocks());

  test("does not re-fetch on re-render after cache is populated", async () => {
    const fakeColors = {};
    TEXT_COLOR_SLOTS.forEach(({ field }) => {
      fakeColors[field] = "#aabbcc";
    });
    const get = jest.fn().mockResolvedValue({
      data: { results: [{ colors: fakeColors }] },
    });
    const useThemeColors = loadHook(get);

    const { rerender } = renderHook(() => useThemeColors());

    await waitFor(() => expect(get).toHaveBeenCalledTimes(1));

    // Re-render same hook instance — cache is set, no second fetch
    rerender();
    expect(get).toHaveBeenCalledTimes(1);
  });

  test("second hook instance in same module shares cache — no second fetch", async () => {
    const fakeColors = {};
    TEXT_COLOR_SLOTS.forEach(({ field }) => {
      fakeColors[field] = "#112233";
    });
    const get = jest.fn().mockResolvedValue({
      data: { results: [{ colors: fakeColors }] },
    });
    const useThemeColors = loadHook(get);

    // First instance
    renderHook(() => useThemeColors());
    await waitFor(() => expect(get).toHaveBeenCalledTimes(1));

    // Second instance from the same module — should read from cache immediately
    const { result } = renderHook(() => useThemeColors());
    expect(get).toHaveBeenCalledTimes(1); // no additional fetch

    expect(result.current.every((c) => c.hex === "#112233")).toBe(true);
  });
});

// ─── SEMANTIC_COLOR_NAMES re-export ──────────────────────────────────────────

describe("SEMANTIC_COLOR_NAMES re-export from useThemeColors", () => {
  test("re-exports SEMANTIC_COLOR_NAMES from color-slots", () => {
    let mod;
    const sharedReact = require("react");
    jest.isolateModules(() => {
      jest.doMock("react", () => sharedReact);
      jest.doMock("@strapi/admin/strapi-admin", () => ({
        useFetchClient: () => ({ get: jest.fn() }),
      }));
      mod = require("../useThemeColors");
    });

    expect(Array.isArray(mod.SEMANTIC_COLOR_NAMES)).toBe(true);
    expect(mod.SEMANTIC_COLOR_NAMES).toContain("accent");
    expect(mod.SEMANTIC_COLOR_NAMES).toContain("text-muted");
    expect(mod.SEMANTIC_COLOR_NAMES).toContain("info");
  });
});
