# Nexa Content Studio

Nexa Content Studio is a Next.js dashboard for generating short-form AI video projects. It includes a frontend dashboard, an Express backend, local asset storage, script generation, thumbnail generation, and a local-first video pipeline.

## What it does

- Generate short video scripts from an idea
- Create branded vertical thumbnails
- Save generated projects to a video library
- Run in paid mode with OpenAI or in free/local mode with Ollama
- Render local MP4 videos when FFmpeg is installed

## Tech stack

- Next.js 14
- React 18
- TypeScript
- Express
- OpenAI SDK
- Ollama for local open-source models
- FFmpeg for video rendering

## Project structure

```text
nexa-content-studio/
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   └── server.js
├── public/
├── src/
│   ├── app/
│   └── components/
└── uploads/
    ├── audio/
    ├── thumbnails/
    └── videos/
```

## Install

```bash
npm install
```

## Environment

Copy [.env.example](/Users/ajinb/Desktop/nexa-content-studio/.env.example) to `.env` and choose one of the modes below.

### Free local mode with Ollama

```env
BACKEND_PORT=4000
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api
NEXA_AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_MODEL=llama3.2:3b
NEXA_FREE_MODE=false
```

### Built-in fallback mode

This mode works without OpenAI, Ollama, or paid APIs. It generates a local demo script and saves projects, but the script quality is simpler.

```env
BACKEND_PORT=4000
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api
NEXA_FREE_MODE=true
NEXA_AI_PROVIDER=auto
```

### OpenAI mode

```env
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4.1-mini
BACKEND_PORT=4000
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api
NEXA_FREE_MODE=false
NEXA_AI_PROVIDER=auto
```

## Run the app

Start the backend:

```bash
npm run backend:start
```

Start the frontend in another terminal:

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

## Free local AI setup

Install Ollama:

```bash
brew install ollama
ollama pull llama3.2:3b
ollama serve
```

With that running, Nexa can generate scripts locally for free.

## Local video rendering

Install FFmpeg to render MP4 files:

```bash
brew install ffmpeg
```

Without FFmpeg, Nexa still saves the script, thumbnail, and project metadata, but the video entry will stay in a partial state and no MP4 will be created.

On macOS, Nexa can also use the built-in `say` command for simple narration if available.

## API routes

Backend base URL:

```text
http://localhost:4000/api
```

Available routes:

- `POST /generate-script`
- `POST /generate-thumbnail`
- `POST /generate-video`
- `GET /videos`

Health checks:

- `GET /`
- `GET /health`
- `GET /api`

## Main pages

- `/dashboard` - overview and stats
- `/create` - generate a new video project
- `/library` - browse saved generated projects
- `/thumbnails` - thumbnail tools UI
- `/channels` - channel management UI
- `/settings` - app settings UI

## Current behavior

- `/create` calls the backend and saves generated projects
- `/library` loads real project metadata from `uploads/videos/videos.json`
- thumbnails are stored in `uploads/thumbnails`
- videos are stored in `uploads/videos`

## Notes

- `.env` is ignored by Git and should stay local
- `node_modules` and `.next` are ignored by Git
- Google Fonts optimization may warn during local builds if network access is restricted

## Build

```bash
npm run build
```

## GitHub

Remote repository:

```text
https://github.com/ajinbiju2001/Nexa.git
```
