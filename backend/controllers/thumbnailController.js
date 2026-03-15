const { generateThumbnailAsset } = require('../services/thumbnailService');

async function generateThumbnail(req, res, next) {
  try {
    const { prompt, title, accent } = req.body || {};

    if (!prompt && !title) {
      return res.status(400).json({
        error: 'prompt or title is required',
      });
    }

    const thumbnail = await generateThumbnailAsset({
      prompt: prompt || title,
      title: title || prompt,
      accent,
    });

    return res.json({
      thumbnailUrl: thumbnail.url,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  generateThumbnail,
};
