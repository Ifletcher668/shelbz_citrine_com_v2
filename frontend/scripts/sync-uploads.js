"use strict";

const fs = require("fs");
const path = require("path");

const STRAPI_URL = process.env.STRAPI_URL ?? "http://localhost:1337";
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;
const OUT_DIR = path.resolve("out");

const headers = STRAPI_TOKEN
  ? { Authorization: `Bearer ${STRAPI_TOKEN}` }
  : {};

async function fetchAllUploads() {
  const files = [];
  let page = 1;
  const pageSize = 100;

  while (true) {
    const res = await fetch(
      `${STRAPI_URL}/api/upload/files?pagination[page]=${page}&pagination[pageSize]=${pageSize}`,
      { headers },
    );
    if (!res.ok) throw new Error(`Failed to fetch uploads: ${res.status}`);

    const data = await res.json();
    const batch = Array.isArray(data) ? data : (data.data ?? []);
    files.push(...batch);

    if (batch.length < pageSize) break;
    page++;
  }

  return files;
}

async function downloadFile(url, destPath) {
  const res = await fetch(url, { headers });
  if (!res.ok) {
    console.warn(`  Skipping ${url} — ${res.status}`);
    return;
  }
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  const buffer = await res.arrayBuffer();
  fs.writeFileSync(destPath, Buffer.from(buffer));
}

async function main() {
  console.log(`Syncing uploads from ${STRAPI_URL}...`);

  const uploads = await fetchAllUploads();
  console.log(`Found ${uploads.length} files`);

  const urls = new Set();
  for (const file of uploads) {
    if (file.url) urls.add(file.url);
    for (const fmt of Object.values(file.formats ?? {})) {
      if (fmt?.url) urls.add(fmt.url);
    }
  }

  let count = 0;
  for (const url of urls) {
    const fullUrl = url.startsWith("http") ? url : `${STRAPI_URL}${url}`;
    const relativePath = url.startsWith("http") ? new URL(url).pathname : url;
    const destPath = path.join(OUT_DIR, relativePath);
    await downloadFile(fullUrl, destPath);
    count++;
    if (count % 10 === 0) console.log(`  Downloaded ${count}/${urls.size}`);
  }

  console.log(`Done — ${count} files written to out/`);
}

main().catch((err) => {
  console.error("sync-uploads failed:", err);
  process.exit(1);
});
