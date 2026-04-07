const fs = require("fs");
const path = require("path");

const src = path.resolve(__dirname, "../../backend/types/generated");
const dst = path.resolve(__dirname, "../types/strapi-generated");

if (!fs.existsSync(src)) {
  console.error(`Source not found: ${src}`);
  process.exit(1);
}

fs.mkdirSync(dst, { recursive: true });

for (const file of ["contentTypes.d.ts", "components.d.ts"]) {
  fs.copyFileSync(path.join(src, file), path.join(dst, file));
  console.log(`✓ Copied ${file}`);
}
