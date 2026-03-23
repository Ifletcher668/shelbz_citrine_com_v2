'use strict';

const path = require('path');
const fs = require('fs');
const net = require('net');
const os = require('os');

const ICLOUD_DIR = path.join(
  os.homedir(),
  'Library',
  'Mobile Documents',
  'com~apple~CloudDocs',
  'shelbz_citrine_com_cms_data'
);

const ICLOUD_CURRENT_DIR = path.join(ICLOUD_DIR, 'current');
const ICLOUD_BACKUPS_DIR = path.join(ICLOUD_DIR, 'backups');
const ICLOUD_DB_PATH = path.join(ICLOUD_CURRENT_DIR, 'data.db');
const ICLOUD_UPLOADS_DIR = path.join(ICLOUD_CURRENT_DIR, 'uploads');
const ICLOUD_META_PATH = path.join(ICLOUD_DIR, 'meta.json');

const LOCAL_DB_PATH = path.join(__dirname, '..', '.tmp', 'data.db');
const LOCAL_UPLOADS_DIR = path.join(__dirname, '..', 'public', 'uploads');

const MAX_BACKUPS = 5;

function ensureICloudDirs() {
  for (const dir of [ICLOUD_DIR, ICLOUD_CURRENT_DIR, ICLOUD_BACKUPS_DIR, ICLOUD_UPLOADS_DIR]) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
}

function checkICloudEviction(filePath) {
  const dir = path.dirname(filePath);
  const base = path.basename(filePath);
  const placeholder = path.join(dir, `.${base}.icloud`);
  return fs.existsSync(placeholder);
}

function checkStrapiRunning() {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(1000);
    socket.on('connect', () => { socket.destroy(); resolve(true); });
    socket.on('timeout', () => { socket.destroy(); resolve(false); });
    socket.on('error', () => { socket.destroy(); resolve(false); });
    socket.connect(1337, '127.0.0.1');
  });
}

module.exports = {
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
  checkICloudEviction,
  checkStrapiRunning,
};
