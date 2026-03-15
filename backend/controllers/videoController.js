const { readVideos } = require('../services/videoLibraryService');
const { generateVideoProject } = require('../services/videoGenerationService');

async function generateVideo(req, res, next) {
  try {
    const {
      videoIdea,
      title,
      style,
      voice,
      channel,
      mode,
    } = req.body || {};

    if (!videoIdea || typeof videoIdea !== 'string' || !videoIdea.trim()) {
      return res.status(400).json({
        error: 'videoIdea is required',
      });
    }

    const video = await generateVideoProject({
      videoIdea: videoIdea.trim(),
      title: (title || videoIdea).trim(),
      style,
      voice,
      channel,
      mode,
    });

    return res.status(201).json({
      video,
    });
  } catch (error) {
    return next(error);
  }
}

async function listVideos(_req, res, next) {
  try {
    const videos = await readVideos();
    return res.json({ videos });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  generateVideo,
  listVideos,
};
