const fs = require('fs');
const path = require('path');

const { generateShortScript } = require('./openaiService');
const { generateThumbnailAsset } = require('./thumbnailService');
const { runCommand, hasCommand } = require('./commandService');
const {
  ensureStorage,
  videosDir,
  audioDir,
  tempDir,
  slugify,
  makeId,
  getPublicUploadPath,
  addVideo,
} = require('./videoLibraryService');

async function createNarrationAudio({ script, title, voice }) {
  ensureStorage();

  const baseName = `${slugify(title)}-${makeId()}`;
  const sayOutput = path.join(audioDir, `${baseName}.aiff`);
  const ffmpegOutput = path.join(audioDir, `${baseName}.m4a`);
  const scriptText = String(script || '').replace(/\s+/g, ' ').trim();

  if (process.platform === 'darwin' && await hasCommand('say', '-v')) {
    const macVoice = voice === 'male' ? 'Daniel' : 'Samantha';
    await runCommand('say', ['-v', macVoice, '-o', sayOutput, scriptText]);

    if (await hasCommand('ffmpeg')) {
      await runCommand('ffmpeg', ['-y', '-i', sayOutput, ffmpegOutput]);
      return { filePath: ffmpegOutput, durationFallback: 30, provider: 'say' };
    }

    return { filePath: sayOutput, durationFallback: 30, provider: 'say' };
  }

  if (await hasCommand('ffmpeg')) {
    await runCommand('ffmpeg', [
      '-y',
      '-f',
      'lavfi',
      '-i',
      'sine=frequency=220:duration=30',
      '-c:a',
      'aac',
      ffmpegOutput,
    ]);
    return { filePath: ffmpegOutput, durationFallback: 30, provider: 'tone' };
  }

  return { filePath: null, durationFallback: 30, provider: 'none' };
}

async function renderVideo({ title, audioPath }) {
  ensureStorage();

  const outputPath = path.join(videosDir, `${slugify(title)}-${makeId()}.mp4`);

  if (!(await hasCommand('ffmpeg'))) {
    return {
      filePath: null,
      warning: 'FFmpeg is not installed. Nexa saved the generated script and thumbnail, but could not render a video yet.',
    };
  }

  const args = audioPath
    ? [
        '-y',
        '-f',
        'lavfi',
        '-i',
        'color=c=#111827:s=1080x1920:d=30',
        '-i',
        audioPath,
        '-c:v',
        'libx264',
        '-t',
        '30',
        '-pix_fmt',
        'yuv420p',
        '-c:a',
        'aac',
        '-shortest',
        outputPath,
      ]
    : [
        '-y',
        '-f',
        'lavfi',
        '-i',
        'color=c=#111827:s=1080x1920:d=30',
        '-f',
        'lavfi',
        '-i',
        'anullsrc=channel_layout=stereo:sample_rate=44100',
        '-c:v',
        'libx264',
        '-t',
        '30',
        '-pix_fmt',
        'yuv420p',
        '-c:a',
        'aac',
        '-shortest',
        outputPath,
      ];

  await runCommand('ffmpeg', args);

  return {
    filePath: outputPath,
    warning: null,
  };
}

function inferCategory(mode, style) {
  if (mode === 'cartoon' || style === 'cartoon') {
    return 'Cartoon Story';
  }
  if (mode === 'custom') {
    return 'Custom Ideas';
  }
  return 'AI Tools';
}

async function generateVideoProject(input) {
  const {
    videoIdea,
    title,
    style = 'stock',
    voice = 'female',
    channel = 'AI Tools Shorts',
    mode = 'ai',
  } = input;

  const scriptResult = await generateShortScript(videoIdea);
  const resolvedTitle = title || videoIdea || 'Nexa Generated Video';
  const thumbnail = await generateThumbnailAsset({
    prompt: videoIdea,
    title: resolvedTitle,
    accent: style === 'cartoon' ? '#f59e0b' : '#6366f1',
  });
  const narration = await createNarrationAudio({
    script: scriptResult.script,
    title: resolvedTitle,
    voice,
  });
  const renderedVideo = await renderVideo({
    title: resolvedTitle,
    audioPath: narration.filePath,
  });

  const warnings = [scriptResult.warning, renderedVideo.warning].filter(Boolean);
  const metadata = {
    id: makeId(),
    title: resolvedTitle,
    category: inferCategory(mode, style),
    channel,
    created_date: new Date().toISOString(),
    video_path: renderedVideo.filePath ? getPublicUploadPath(renderedVideo.filePath) : null,
    thumbnail_path: thumbnail.url,
    script: scriptResult.script,
    provider: scriptResult.provider,
    status: renderedVideo.filePath ? 'ready' : 'partial',
    warnings,
  };

  await addVideo(metadata);

  return metadata;
}

module.exports = {
  generateVideoProject,
};
