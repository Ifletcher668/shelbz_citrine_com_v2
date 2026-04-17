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
  try {
    const pkgDir = path.dirname(
      _require.resolve("strapi-typed-client/package.json"),
    );
    const binPath = path.join(pkgDir, "dist", "cli", "index.js");
    const url = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
    const args = [binPath, "generate", "--url", url, "--force"];
    if (process.env.STRAPI_API_TOKEN)
      args.push("--token", process.env.STRAPI_API_TOKEN);
    execFileSync("node", args, { stdio: "inherit" });
  } catch {
    // Strapi offline — fall back to committed schema snapshot
    const committed = path.resolve(__dirname, "strapi-schema", "schema-meta.ts");
    const dest = path.join(getStrapiDist(), "schema-meta.ts");
    if (fs.existsSync(committed)) {
      fs.copyFileSync(committed, dest);
    }
  }
}

// client.js dynamically imports schema-meta.js (for validateSchema only).
// The generator writes schema-meta.ts but not .js, causing a webpack warning.
// Copy it once so the module resolver can find it.
function ensureSchemaMetaJs() {
  try {
    const distDir = getStrapiDist();
    const metaTs = path.join(distDir, "schema-meta.ts");
    const metaJs = path.join(distDir, "schema-meta.js");
    if (fs.existsSync(metaTs) && !fs.existsSync(metaJs)) {
      fs.writeFileSync(metaJs, fs.readFileSync(metaTs, "utf-8"), "utf-8");
    }
  } catch {
    /* non-fatal */
  }
}

bootstrapTypes();
ensureSchemaMetaJs();

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

export default withStrapiTypes({
  strapiUrl: process.env.NEXT_PUBLIC_STRAPI_URL,
  token: process.env.STRAPI_API_TOKEN,
})(nextConfig);
