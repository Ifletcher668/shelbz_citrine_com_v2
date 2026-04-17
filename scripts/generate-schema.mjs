import { execFileSync } from "child_process";
import fs from "fs";
import path from "path";
import { createRequire } from "module";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const _require = createRequire(import.meta.url);

const pkgDir = path.dirname(
  _require.resolve("strapi-typed-client/package.json"),
);
const binPath = path.join(pkgDir, "dist", "cli", "index.js");
const url = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const args = [binPath, "generate", "--url", url, "--force"];
if (process.env.STRAPI_API_TOKEN)
  args.push("--token", process.env.STRAPI_API_TOKEN);

execFileSync("node", args, { stdio: "inherit" });

const src = path.join(pkgDir, "dist", "schema-meta.ts");
const dest = path.resolve(
  __dirname,
  "..",
  "frontend",
  "strapi-schema",
  "schema-meta.ts",
);
fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.copyFileSync(src, dest);
console.log(
  "Schema written to frontend/strapi-schema/schema-meta.ts — commit this file.",
);
