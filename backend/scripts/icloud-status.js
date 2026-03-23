'use strict';

const fs = require('fs');
const path = require('path');
const {
  ICLOUD_DIR,
  ICLOUD_CURRENT_DIR,
  ICLOUD_BACKUPS_DIR,
  ICLOUD_DB_PATH,
  ICLOUD_UPLOADS_DIR,
  ICLOUD_META_PATH,
  LOCAL_DB_PATH,
  LOCAL_UPLOADS_DIR,
  checkICloudEviction,
} = require('./icloud-config');

function fileInfo(filePath) {
  if (checkICloudEviction(filePath)) return 'EVICTED (not downloaded — open Finder to download)';
  if (!fs.existsSync(filePath)) return 'NOT FOUND';
  const stat = fs.statSync(filePath);
  return `${(stat.size / 1024).toFixed(1)} KB, modified ${stat.mtime.toISOString()}`;
}

function countFiles(dir) {
  if (!fs.existsSync(dir)) return 0;
  return fs.readdirSync(dir).filter(f => !f.startsWith('.') && f !== '.gitkeep').length;
}

console.log('=== iCloud Sync Status ===\n');

console.log('Local:');
console.log(`  DB:      ${fileInfo(LOCAL_DB_PATH)}`);
console.log(`  Uploads: ${countFiles(LOCAL_UPLOADS_DIR)} file(s) in ${LOCAL_UPLOADS_DIR}`);

console.log('\niCloud (current):');
console.log(`  Dir:     ${ICLOUD_CURRENT_DIR}`);
console.log(`  DB:      ${fileInfo(ICLOUD_DB_PATH)}`);
console.log(`  Uploads: ${countFiles(ICLOUD_UPLOADS_DIR)} file(s)`);

if (fs.existsSync(ICLOUD_META_PATH)) {
  const meta = JSON.parse(fs.readFileSync(ICLOUD_META_PATH, 'utf8'));
  console.log(`\nLast save: ${meta.savedAt} by ${meta.savedBy}`);
} else {
  console.log('\nNo save metadata found. Run `yarn icloud:save` to create the initial snapshot.');
}

console.log('\nBackups:');
if (!fs.existsSync(ICLOUD_BACKUPS_DIR)) {
  console.log('  (none)');
} else {
  const backups = fs.readdirSync(ICLOUD_BACKUPS_DIR)
    .filter(name => {
      const full = path.join(ICLOUD_BACKUPS_DIR, name);
      return fs.statSync(full).isDirectory();
    })
    .sort()
    .reverse();

  if (backups.length === 0) {
    console.log('  (none)');
  } else {
    for (const backup of backups) {
      const dbPath = path.join(ICLOUD_BACKUPS_DIR, backup, 'data.db');
      const size = fs.existsSync(dbPath)
        ? `${(fs.statSync(dbPath).size / 1024).toFixed(1)} KB`
        : 'DB missing';
      console.log(`  ${backup}  (${size})`);
    }
    console.log(`\n  To restore a backup: yarn icloud:restore --backup <name>`);
  }
}
