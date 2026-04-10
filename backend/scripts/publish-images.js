'use strict';

const fs = require('fs');
const path = require('path');
const { LOCAL_UPLOADS_DIR, checkStrapiRunning } = require('./icloud-config');

const FRONTEND_UPLOADS_DIR = path.resolve(__dirname, '..', '..', 'frontend', 'public', 'uploads');

function copyDirSync(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  let count = 0;
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (entry.name === '.gitkeep') continue;
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      count += copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      count++;
    }
  }
  return count;
}

function cleanRemovedFiles(src, dest) {
  if (!fs.existsSync(dest)) return 0;
  let count = 0;
  for (const entry of fs.readdirSync(dest, { withFileTypes: true })) {
    if (entry.name === '.gitkeep') continue;
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (!fs.existsSync(srcPath)) {
      if (entry.isDirectory()) {
        fs.rmSync(destPath, { recursive: true });
      } else {
        fs.unlinkSync(destPath);
      }
      count++;
    }
  }
  return count;
}

async function publish() {
  const running = await checkStrapiRunning();
  if (running) {
    console.error('[publish-images] Strapi is running on port 1337.');
    console.error('  Stop Strapi before publishing to avoid copying an incomplete upload.');
    process.exit(1);
  }

  if (!fs.existsSync(LOCAL_UPLOADS_DIR)) {
    console.error('[publish-images] No uploads directory found at', LOCAL_UPLOADS_DIR);
    console.error('  Run Strapi at least once to create the uploads directory.');
    process.exit(1);
  }

  const removed = cleanRemovedFiles(LOCAL_UPLOADS_DIR, FRONTEND_UPLOADS_DIR);
  const copied = copyDirSync(LOCAL_UPLOADS_DIR, FRONTEND_UPLOADS_DIR);

  console.log('[publish-images] Done.');
  console.log(`  Copied:  ${copied} file(s)`);
  if (removed > 0) console.log(`  Removed: ${removed} file(s)`);
  console.log(`  Destination: ${FRONTEND_UPLOADS_DIR}`);
  console.log('');
  console.log('  Next: git add frontend/public/uploads/ && git commit');
}

publish().catch(err => {
  console.error('[publish-images] Unexpected error:', err.message);
  process.exit(1);
});
