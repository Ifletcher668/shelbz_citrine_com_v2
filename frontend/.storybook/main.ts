import type { StorybookConfig } from "@storybook/react-webpack5";
import path from "path";
import type { RuleSetRule } from "webpack";

const config: StorybookConfig = {
  stories: [
    "../stories/**/*.stories.@(js|jsx|ts|tsx|mdx)",
    "../Components/**/*.stories.@(js|jsx|ts|tsx|mdx)",
  ],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-a11y",
  ],
  framework: {
    name: "@storybook/react-webpack5",
    options: {},
  },
  staticDirs: ["../public"],
  webpackFinal: async (config) => {
    config.module = config.module ?? { rules: [] };
    config.module.rules = config.module.rules ?? [];

    // ── TypeScript + JSX via SWC ───────────────────────────────────────────────
    config.module.rules.push({
      test: /\.(ts|tsx|js|jsx)$/,
      exclude: /node_modules/,
      use: [
        {
          loader: "swc-loader",
          options: {
            jsc: {
              parser: { syntax: "typescript", tsx: true, dynamicImport: true },
              transform: { react: { runtime: "automatic" } },
              target: "es2017",
            },
          },
        },
      ],
    });

    // ── PostCSS / Tailwind v4 ──────────────────────────────────────────────────
    // Remove the default CSS rule(s) added by @storybook/builder-webpack5
    // (which use style-loader+css-loader without PostCSS), then add our own
    // rule that includes postcss-loader with @tailwindcss/postcss.
    config.module.rules = (config.module.rules as RuleSetRule[]).filter(
      (rule) => {
        if (!rule || typeof rule !== "object") return true;
        // Remove any rule that matches .css and does NOT already have postcss-loader
        if (rule.test instanceof RegExp && rule.test.test(".css")) return false;
        return true;
      }
    );

    config.module.rules.push({
      test: /\.css$/,
      use: [
        "style-loader",
        { loader: "css-loader", options: { url: false } },
        {
          loader: "postcss-loader",
          options: {
            postcssOptions: {
              plugins: [["@tailwindcss/postcss", {}]],
            },
          },
        },
      ],
    });

    // ── Next.js shims ──────────────────────────────────────────────────────────
    config.resolve = config.resolve ?? {};
    config.resolve.alias = {
      ...config.resolve.alias,
      "next/link": path.resolve(__dirname, "./mocks/next-link.tsx"),
      "next/image": path.resolve(__dirname, "./mocks/next-image.tsx"),
      "next/navigation": path.resolve(__dirname, "./mocks/next-navigation.ts"),
      "next/router": path.resolve(__dirname, "./mocks/next-router.ts"),
    };

    return config;
  },
  docs: {
    autodocs: "tag",
  },
};

export default config;
