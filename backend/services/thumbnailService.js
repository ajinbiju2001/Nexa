const fs = require('fs');
const path = require('path');

const {
  ensureStorage,
  thumbnailsDir,
  slugify,
  makeId,
  getPublicUploadPath,
} = require('./videoLibraryService');

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function wrapLines(text, maxLength) {
  const words = String(text || '').split(/\s+/).filter(Boolean);
  const lines = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxLength) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }

  if (current) lines.push(current);
  return lines.slice(0, 4);
}

async function generateThumbnailAsset({ prompt, title, accent = '#8b5cf6' }) {
  ensureStorage();

  const safeTitle = title || prompt || 'Nexa Video';
  const lines = wrapLines(safeTitle, 18);
  const subline = wrapLines(prompt || 'AI-generated content', 30)[0] || 'AI-generated content';
  const filename = `${slugify(safeTitle)}-${makeId()}.svg`;
  const filePath = path.join(thumbnailsDir, filename);

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1080" height="1920" viewBox="0 0 1080 1920" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="120" y1="120" x2="960" y2="1800" gradientUnits="userSpaceOnUse">
      <stop stop-color="#0F172A"/>
      <stop offset="0.55" stop-color="#111827"/>
      <stop offset="1" stop-color="${escapeXml(accent)}"/>
    </linearGradient>
    <radialGradient id="glow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(820 360) rotate(120) scale(640 640)">
      <stop stop-color="${escapeXml(accent)}" stop-opacity="0.9"/>
      <stop offset="1" stop-color="${escapeXml(accent)}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1080" height="1920" rx="48" fill="url(#bg)"/>
  <rect width="1080" height="1920" rx="48" fill="url(#glow)"/>
  <rect x="72" y="72" width="936" height="1776" rx="40" fill="rgba(15,23,42,0.22)" stroke="rgba(255,255,255,0.18)"/>
  <text x="124" y="180" fill="#E2E8F0" font-size="48" font-family="Arial, sans-serif" font-weight="700">NEXA AI</text>
  <text x="124" y="252" fill="#94A3B8" font-size="34" font-family="Arial, sans-serif">Auto-generated thumbnail</text>
  ${lines.map((line, index) => `<text x="124" y="${560 + index * 132}" fill="white" font-size="96" font-family="Arial, sans-serif" font-weight="800">${escapeXml(line)}</text>`).join('\n  ')}
  <rect x="124" y="1170" width="832" height="2" fill="rgba(255,255,255,0.18)"/>
  <text x="124" y="1260" fill="#CBD5E1" font-size="42" font-family="Arial, sans-serif">${escapeXml(subline)}</text>
  <circle cx="874" cy="1540" r="120" fill="rgba(255,255,255,0.08)"/>
  <path d="M835 1454H885L945 1628H895L882 1590H836L822 1628H772L835 1454ZM848 1547H870L859 1511L848 1547Z" fill="white"/>
</svg>`;

  await fs.promises.writeFile(filePath, svg, 'utf8');

  return {
    filePath,
    url: getPublicUploadPath(filePath),
  };
}

module.exports = {
  generateThumbnailAsset,
};
