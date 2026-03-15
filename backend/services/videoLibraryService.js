const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const uploadsDir = path.resolve(process.cwd(), 'uploads');
const videosDir = path.join(uploadsDir, 'videos');
const thumbnailsDir = path.join(uploadsDir, 'thumbnails');
const audioDir = path.join(uploadsDir, 'audio');
const tempDir = path.join(uploadsDir, 'temp');
const metadataPath = path.join(videosDir, 'videos.json');

function ensureStorage() {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  if (!fs.existsSync(videosDir)) {
    fs.mkdirSync(videosDir, { recursive: true });
  }

  if (!fs.existsSync(thumbnailsDir)) {
    fs.mkdirSync(thumbnailsDir, { recursive: true });
  }

  if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
  }

  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  if (!fs.existsSync(metadataPath)) {
    fs.writeFileSync(metadataPath, JSON.stringify([], null, 2));
  }
}

async function readVideos() {
  ensureStorage();
  const raw = await fs.promises.readFile(metadataPath, 'utf8');
  return JSON.parse(raw);
}

async function writeVideos(videos) {
  ensureStorage();
  await fs.promises.writeFile(metadataPath, JSON.stringify(videos, null, 2));
}

function slugify(value) {
  return String(value || 'video')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'video';
}

function makeId() {
  return crypto.randomBytes(6).toString('hex');
}

function getPublicUploadPath(filePath) {
  const relativePath = path.relative(uploadsDir, filePath).split(path.sep).join('/');
  return `/uploads/${relativePath}`;
}

async function addVideo(video) {
  const videos = await readVideos();
  videos.unshift(video);
  await writeVideos(videos);
  return video;
}

module.exports = {
  ensureStorage,
  readVideos,
  writeVideos,
  addVideo,
  slugify,
  makeId,
  getPublicUploadPath,
  uploadsDir,
  videosDir,
  thumbnailsDir,
  audioDir,
  tempDir,
  metadataPath,
};
