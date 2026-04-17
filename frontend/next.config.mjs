import { execFileSync } from "child_process";
import fs from "fs";
import { createRequire } from "module";
import path from "path";
import { fileURLToPath } from "url";
import { withStrapiTypes } from "strapi-typed-client/next";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const _require = createRequire(import.meta.url);

function getStrapiDist() {
  const pkgJsonPath = _require.resolve("strapi-typed-client/package.json");
  return path.join(path.dirname(pkgJsonPath), "dist");
}

// Synchronously generate types on every startup so they are fresh before
// Next.js page compilation begins. withStrapiTypes starts an async SSE
// watcher that loses the race against compilation, so we eagerly generate here.
function bootstrapTypes() {
  if (process.env.NODE_ENV === "development") {
    const pkgDir = path.dirname(
      _require.resolve("strapi-typed-client/package.json"),
    );
    const binPath = path.join(pkgDir, "dist", "cli", "index.js");
    const url = process.env.NEXT_PUBLIC_STRAPI_URL;
    const args = [binPath, "generate", "--url", url, "--force"];

    if (process.env.STRAPI_API_TOKEN) {
      args.push("--token", process.env.STRAPI_API_TOKEN);
    }

    execFileSync("node", args, { stdio: "inherit" });
  } else {
    // Strapi will be offline — fall back to committed schema snapshot
    const distDir = getStrapiDist();
    const schemaDir = path.resolve(__dirname, "strapi-schema");
    const filesToCopy = [
      "types.d.ts",
      "index.js",
      "client.js",
      "types.js",
      "schema-meta.js",
    ];
    for (const file of filesToCopy) {
      const src = path.join(schemaDir, file);
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, path.join(distDir, file));
      }
    }
  }
}

bootstrapTypes();

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
      path.resolve(__dirname, "node_modules"),
      path.resolve(__dirname, "../node_modules"),
    ];
    return config;
  },
};

// Only use the SSE watcher in dev — in build/CI our bootstrapTypes() fallback
// already placed the committed types.d.ts, and withStrapiTypes would just try
// (and fail) to re-fetch from a Strapi that isn't running.
export default process.env.NODE_ENV === "development"
  ? withStrapiTypes({
      strapiUrl: process.env.NEXT_PUBLIC_STRAPI_URL,
      token: process.env.STRAPI_API_TOKEN,
    })(nextConfig)
  : nextConfig;
