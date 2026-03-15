require('dotenv').config();

const express = require('express');
const cors = require('cors');

const apiRoutes = require('./routes');
const { ensureStorage } = require('./services/videoLibraryService');

const app = express();
const PORT = Number(process.env.BACKEND_PORT || 4000);

ensureStorage();

app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use('/uploads', express.static('uploads'));

app.get('/', (_req, res) => {
  res.json({
    ok: true,
    service: 'nexa-backend',
    message: 'Nexa backend is running.',
    docs: {
      health: '/health',
      api: '/api',
    },
  });
});

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'nexa-backend' });
});

app.get('/api', (_req, res) => {
  res.json({
    ok: true,
    service: 'nexa-backend',
    endpoints: [
      'POST /api/generate-script',
      'POST /api/generate-thumbnail',
      'POST /api/generate-video',
      'GET /api/videos',
    ],
  });
});

app.use('/api', apiRoutes);

app.use((_req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: 'This route does not exist on the Nexa backend.',
  });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Nexa backend running on http://localhost:${PORT}`);
});
