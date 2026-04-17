import React, { useEffect } from "react";
import { useGlobals } from "@storybook/preview-api";
import { THEMES } from "../themes";

const STYLE_TAG_ID = "storybook-theme-override";

/**
 * Injects the selected theme's CSS variables into document.head as a <style>
 * tag, exactly mirroring how _document.js links public/theme.css in production.
 * The default theme is an empty string, so globals.css @theme fallbacks apply.
 */
export const ThemeDecorator = (Story: React.ComponentType) => {
  const [globals] = useGlobals();
  const themeId = globals.theme ?? "default";
  const theme = THEMES.find((t) => t.id === themeId) ?? THEMES[0];

  useEffect(() => {
    let styleTag = document.getElementById(
      STYLE_TAG_ID
    ) as HTMLStyleElement | null;
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = STYLE_TAG_ID;
      document.head.appendChild(styleTag);
    }
    styleTag.textContent = theme.css;
  }, [theme]);

  return <Story />;
};
