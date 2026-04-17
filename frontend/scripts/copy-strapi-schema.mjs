import fs from "fs";
import path from "path";
import { createRequire } from "module";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const _require = createRequire(import.meta.url);

const committed = path.resolve(__dirname, "..", "strapi-schema", "types.d.ts");
const pkgDir = path.dirname(_require.resolve("strapi-typed-client/package.json"));
const dest = path.join(pkgDir, "dist", "types.d.ts");

if (fs.existsSync(committed)) {
  fs.copyFileSync(committed, dest);
}
