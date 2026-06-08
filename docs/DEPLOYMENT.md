# Deployment Guide

This Phase 1 build is designed for fast public deployment without advanced infrastructure.

## Backend: Railway or Render

Recommended defaults for a reliable public demo:

```env
ENVIRONMENT=production
LLM_PROVIDER=demo
VECTOR_PROVIDER=local
CORS_ORIGINS=https://your-vercel-app.vercel.app
```

Optional AI provider configuration:

```env
LLM_PROVIDER=openai
OPENAI_API_KEY=your_key
OPENAI_MODEL=gpt-4.1-mini
```

The backend exposes:

- `GET /health`
- `POST /agent/run`
- `GET /agent/tools`
- `GET /knowledge/sources`
- `GET /reports/demo`
- `GET /trace`

### Railway

Railway can deploy from the root `Dockerfile`.

1. Create a Railway project from the GitHub repo.
2. Select Dockerfile deployment.
3. Add the environment variables above.
4. Confirm `/health` returns `200`.

### Render

Render can use `render.yaml` or a manual Docker web service.

1. Create a new Web Service.
2. Runtime: Docker.
3. Health check path: `/health`.
4. Add environment variables.

## Frontend: Vercel

The frontend lives in `frontend/`.

```env
NEXT_PUBLIC_API_BASE_URL=https://your-backend-url
```

Vercel settings:

- Framework preset: Next.js
- Root directory: `frontend`
- Build command: `npm run build`
- Output: default Next.js output

## Vector DB: Qdrant Cloud Later

Phase 1 defaults to `VECTOR_PROVIDER=local` for reliability. The backend already isolates retrieval behind a provider boundary, so Qdrant Cloud can be added later without changing the frontend contract.

Future configuration target:

```env
VECTOR_PROVIDER=qdrant
QDRANT_URL=https://your-cluster.qdrant.tech
QDRANT_API_KEY=your_key
```

## Local Development

Backend:

```bash
uv sync
uv run uvicorn app.main:app --reload
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`.
