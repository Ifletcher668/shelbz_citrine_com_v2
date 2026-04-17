import type { Preview } from "@storybook/react";
import "../styles/globals.css";
import { ThemeDecorator } from "./decorators/ThemeDecorator";
import { ContextDecorator } from "./decorators/ContextDecorator";
import { THEMES } from "./themes";

const preview: Preview = {
  decorators: [ThemeDecorator, ContextDecorator],
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    // Disabled: theme system uses CSS custom properties, not background switcher
    backgrounds: {
      disable: true,
    },
    viewport: {
      viewports: {
        mobile: {
          name: "Mobile",
          styles: { width: "390px", height: "844px" },
        },
        tablet: {
          name: "Tablet",
          styles: { width: "768px", height: "1024px" },
        },
        desktop: {
          name: "Desktop",
          styles: { width: "1280px", height: "900px" },
        },
        wide: {
          name: "Wide",
          styles: { width: "1920px", height: "1080px" },
        },
      },
    },
  },
  globalTypes: {
    theme: {
      name: "Theme",
      description: "Active CSS variable theme from Strapi",
      defaultValue: "default",
      toolbar: {
        icon: "paintbrush",
        items: THEMES.map((t) => ({ value: t.id, title: t.name })),
        showName: true,
        dynamicTitle: true,
      },
    },
  },
};

export default preview;
