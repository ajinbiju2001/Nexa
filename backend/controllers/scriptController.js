const { generateShortScript } = require('../services/openaiService');

async function generateScript(req, res, next) {
  try {
    const { videoIdea } = req.body;

    if (!videoIdea || typeof videoIdea !== 'string' || !videoIdea.trim()) {
      return res.status(400).json({
        error: 'videoIdea is required',
      });
    }

    const result = await generateShortScript(videoIdea.trim());

    return res.json({
      script: result.script,
      provider: result.provider,
      warning: result.warning || undefined,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  generateScript,
};
