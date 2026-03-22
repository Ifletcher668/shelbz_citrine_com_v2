import { useState, useEffect } from "react";
import { useFetchClient } from "@strapi/admin/strapi-admin";
import { TEXT_COLOR_SLOTS } from "./color-slots";

export { SEMANTIC_COLOR_NAMES } from "./color-slots";

/** Fallback — heritage theme defaults if Strapi is unreachable */
const DEFAULT_COLORS = TEXT_COLOR_SLOTS.map(({ name, cssVar, defaultHex }) => ({
  name,
  cssVar,
  hex: defaultHex,
}));

// Module-level cache so we only fetch once per admin session
let cachedColors = null;

/**
 * Returns an array of { name, cssVar, hex } for each text-applicable
 * semantic color slot in the active theme.
 *
 * Falls back to heritage defaults if the API is unavailable.
 */
export function useThemeColors() {
  const [colors, setColors] = useState(cachedColors ?? DEFAULT_COLORS);
  const { get } = useFetchClient();

  useEffect(() => {
    if (cachedColors) return; // already fetched this session

    get(
      "/content-manager/collection-types/api::theme.theme" +
        "?filters[is_active][$eq]=true&populate[colors]=*&pagination[pageSize]=1",
    )
      .then(({ data }) => {
        const themeColors = data?.results?.[0]?.colors;
        if (!themeColors) return;

        const resolved = TEXT_COLOR_SLOTS.map(
          ({ field, name, cssVar, defaultHex }) => ({
            name,
            cssVar,
            hex: themeColors[field] ?? defaultHex,
          }),
        );

        cachedColors = resolved;
        setColors(resolved);
      })
      .catch(() => {
        // API unavailable — defaults remain
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return colors;
}
