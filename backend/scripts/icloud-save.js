'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const {
  ICLOUD_DIR,
  ICLOUD_CURRENT_DIR,
  ICLOUD_BACKUPS_DIR,
  ICLOUD_DB_PATH,
  ICLOUD_UPLOADS_DIR,
  ICLOUD_META_PATH,
  LOCAL_DB_PATH,
  LOCAL_UPLOADS_DIR,
  MAX_BACKUPS,
  ensureICloudDirs,
  checkStrapiRunning,
} = require('./icloud-config');

function copyDirSync(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (entry.name === '.gitkeep') continue;
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function cleanRemovedFiles(src, dest) {
  if (!fs.existsSync(dest)) return;
  for (const entry of fs.readdirSync(dest, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (!fs.existsSync(srcPath)) {
      if (entry.isDirectory()) {
        fs.rmSync(destPath, { recursive: true });
      } else {
        fs.unlinkSync(destPath);
      }
    }
  }
}

function rotateBackup() {
  if (!fs.existsSync(ICLOUD_DB_PATH)) return; // Nothing in current yet

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const username = os.userInfo().username;
  const backupName = `${timestamp}_${username}`;
  const backupDir = path.join(ICLOUD_BACKUPS_DIR, backupName);

  console.log(`[icloud-save] Rotating current to backup: ${backupName}`);
  fs.mkdirSync(backupDir, { recursive: true });

  // Copy current DB to backup
  fs.copyFileSync(ICLOUD_DB_PATH, path.join(backupDir, 'data.db'));
  for (const suffix of ['-wal', '-shm']) {
    const src = ICLOUD_DB_PATH + suffix;
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(backupDir, 'data.db' + suffix));
    }
  }

  // Copy current uploads to backup
  const currentUploads = ICLOUD_UPLOADS_DIR;
  if (fs.existsSync(currentUploads)) {
    copyDirSync(currentUploads, path.join(backupDir, 'uploads'));
  }

  pruneOldBackups();
}

function pruneOldBackups() {
  if (!fs.existsSync(ICLOUD_BACKUPS_DIR)) return;

  const backups = fs.readdirSync(ICLOUD_BACKUPS_DIR)
    .filter(name => {
      const full = path.join(ICLOUD_BACKUPS_DIR, name);
      return fs.statSync(full).isDirectory();
    })
    .sort(); // ISO timestamp prefix ensures chronological sort

  const excess = backups.length - MAX_BACKUPS;
  if (excess > 0) {
    for (const old of backups.slice(0, excess)) {
      console.log(`[icloud-save] Pruning old backup: ${old}`);
      fs.rmSync(path.join(ICLOUD_BACKUPS_DIR, old), { recursive: true });
    }
  }
}

async function save() {
  const force = process.argv.includes('--force');

  // Check Strapi is not running
  const running = await checkStrapiRunning();
  if (running) {
    console.error('[icloud-save] Strapi is running on port 1337.');
    console.error('  Stop Strapi before saving to avoid copying a locked database.');
    process.exit(1);
  }

  // Check local DB exists
  if (!fs.existsSync(LOCAL_DB_PATH)) {
    console.error('[icloud-save] No local database found at', LOCAL_DB_PATH);
    console.error('  Run Strapi at least once to create the database.');
    process.exit(1);
  }

  ensureICloudDirs();

  // Overwrite protection: warn if iCloud has newer data from a different user
  if (!force && fs.existsSync(ICLOUD_META_PATH)) {
    const meta = JSON.parse(fs.readFileSync(ICLOUD_META_PATH, 'utf8'));
    const localModified = fs.statSync(LOCAL_DB_PATH).mtime;
    const icloudSavedAt = new Date(meta.savedAt);
    const currentUser = os.userInfo().username;

    if (icloudSavedAt > localModified && meta.savedBy !== currentUser) {
      console.error('[icloud-save] WARNING: iCloud has newer data!');
      console.error(`  iCloud saved by ${meta.savedBy} at ${meta.savedAt}`);
      console.error(`  Your local DB was last modified at ${localModified.toISOString()}`);
      console.error('  Run `yarn icloud:restore` first if you want their data.');
      console.error('  Pass --force to overwrite anyway.');
      process.exit(1);
    }
  }

  // Rotate current into backups before overwriting
  rotateBackup();

  // Copy database
  console.log('[icloud-save] Copying database...');
  fs.copyFileSync(LOCAL_DB_PATH, ICLOUD_DB_PATH);
  for (const suffix of ['-wal', '-shm']) {
    const localWal = LOCAL_DB_PATH + suffix;
    const icloudWal = ICLOUD_DB_PATH + suffix;
    if (fs.existsSync(localWal)) {
      fs.copyFileSync(localWal, icloudWal);
    } else if (fs.existsSync(icloudWal)) {
      fs.unlinkSync(icloudWal);
    }
  }

  // Copy uploads
  if (fs.existsSync(LOCAL_UPLOADS_DIR)) {
    console.log('[icloud-save] Copying uploads...');
    copyDirSync(LOCAL_UPLOADS_DIR, ICLOUD_UPLOADS_DIR);
    cleanRemovedFiles(LOCAL_UPLOADS_DIR, ICLOUD_UPLOADS_DIR);
  }

  // Write metadata
  const meta = {
    savedAt: new Date().toISOString(),
    savedBy: os.userInfo().username,
    dbSize: fs.statSync(ICLOUD_DB_PATH).size,
  };
  fs.writeFileSync(ICLOUD_META_PATH, JSON.stringify(meta, null, 2));

  console.log('[icloud-save] Done.');
  console.log(`  Saved by: ${meta.savedBy} at ${meta.savedAt}`);
  console.log(`  DB size:  ${(meta.dbSize / 1024).toFixed(1)} KB`);
}

save().catch(err => {
  console.error('[icloud-save] Unexpected error:', err.message);
  process.exit(1);
});
