const express = require('express');

const scriptController = require('../controllers/scriptController');
const thumbnailController = require('../controllers/thumbnailController');
const videoController = require('../controllers/videoController');

const router = express.Router();

router.post('/generate-script', scriptController.generateScript);
router.post('/generate-thumbnail', thumbnailController.generateThumbnail);
router.post('/generate-video', videoController.generateVideo);
router.get('/videos', videoController.listVideos);

module.exports = router;
