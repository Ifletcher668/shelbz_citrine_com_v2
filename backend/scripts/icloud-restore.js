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
  checkStrapiRunning,
} = require('./icloud-config');

function copyDirSync(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.name.endsWith('.icloud')) {
      console.warn(`[icloud-restore] WARNING: Skipping evicted file: ${entry.name}`);
      console.warn('  Open Finder and click the file to download it from iCloud first.');
      continue;
    }
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

async function restore() {
  // Parse --backup flag
  const backupFlagIndex = process.argv.indexOf('--backup');
  const backupName = backupFlagIndex !== -1 ? process.argv[backupFlagIndex + 1] : null;

  // Determine source directory
  const sourceDir = backupName
    ? path.join(ICLOUD_BACKUPS_DIR, backupName)
    : ICLOUD_CURRENT_DIR;
  const sourceDbPath = path.join(sourceDir, 'data.db');
  const sourceUploadsDir = path.join(sourceDir, 'uploads');

  // Check Strapi is not running
  const running = await checkStrapiRunning();
  if (running) {
    console.error('[icloud-restore] Strapi is running on port 1337.');
    console.error('  Stop Strapi before restoring to avoid overwriting a live database.');
    process.exit(1);
  }

  // Validate backup name if provided
  if (backupName && !fs.existsSync(sourceDir)) {
    console.error(`[icloud-restore] Backup not found: ${backupName}`);
    console.error(`  Available backups in ${ICLOUD_BACKUPS_DIR}:`);
    if (fs.existsSync(ICLOUD_BACKUPS_DIR)) {
      for (const b of fs.readdirSync(ICLOUD_BACKUPS_DIR).sort().reverse()) {
        console.error(`    ${b}`);
      }
    } else {
      console.error('    (none)');
    }
    process.exit(1);
  }

  // Check source DB exists
  if (!fs.existsSync(sourceDbPath)) {
    if (checkICloudEviction(sourceDbPath)) {
      console.error('[icloud-restore] Database file has been evicted by iCloud (not downloaded locally).');
      console.error('  Open Finder and navigate to:');
      console.error('    ' + sourceDir);
      console.error('  Click data.db to download it, then re-run this script.');
      process.exit(1);
    }
    if (backupName) {
      console.error(`[icloud-restore] No database found in backup: ${backupName}`);
    } else {
      console.error('[icloud-restore] No database found in iCloud current.');
      console.error('  Has anyone run `yarn icloud:save` yet?');
    }
    process.exit(1);
  }

  // Show metadata
  if (!backupName && fs.existsSync(ICLOUD_META_PATH)) {
    const meta = JSON.parse(fs.readFileSync(ICLOUD_META_PATH, 'utf8'));
    console.log('[icloud-restore] Restoring from latest save:');
    console.log(`  Saved by: ${meta.savedBy}`);
    console.log(`  Saved at: ${meta.savedAt}`);
    console.log(`  DB size:  ${(meta.dbSize / 1024).toFixed(1)} KB`);
  } else if (backupName) {
    console.log(`[icloud-restore] Restoring from backup: ${backupName}`);
  }

  // Ensure local .tmp directory exists
  const tmpDir = path.dirname(LOCAL_DB_PATH);
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

  // Copy database
  console.log('[icloud-restore] Copying database...');
  fs.copyFileSync(sourceDbPath, LOCAL_DB_PATH);
  for (const suffix of ['-wal', '-shm']) {
    const srcWal = sourceDbPath + suffix;
    const localWal = LOCAL_DB_PATH + suffix;
    if (fs.existsSync(srcWal)) {
      fs.copyFileSync(srcWal, localWal);
    } else if (fs.existsSync(localWal)) {
      fs.unlinkSync(localWal);
    }
  }

  // Copy uploads
  if (fs.existsSync(sourceUploadsDir)) {
    console.log('[icloud-restore] Copying uploads...');
    copyDirSync(sourceUploadsDir, LOCAL_UPLOADS_DIR);
  }

  console.log('[icloud-restore] Done. You can now run: yarn backend');
}

restore().catch(err => {
  console.error('[icloud-restore] Unexpected error:', err.message);
  process.exit(1);
});
