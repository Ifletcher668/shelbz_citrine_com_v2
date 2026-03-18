const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable static export only for production builds
  ...(process.env.NODE_ENV === "production" && { output: "export" }),
  // Disable image optimization for static export (use next/image with unoptimized)
  images: {
    unoptimized: true,
  },
  // Trailing slashes for cleaner URLs on static hosts
  trailingSlash: true,
  // Pin module resolution to this package only — prevents webpack from
  // walking up to parent package.json files in the monorepo and resolving
  // packages (e.g. lightningcss native binaries) from the wrong node_modules.
  webpack(config) {
    config.resolve.modules = [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(__dirname, '../node_modules'),
    ];
    return config;
  },
};

module.exports = nextConfig;
