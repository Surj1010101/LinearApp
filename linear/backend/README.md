---
title: Linear API
emoji: 🌿
colorFrom: indigo
colorTo: green
sdk: docker
app_port: 7860
pinned: false
license: mit
short_description: FastAPI backend for the Linear wellbeing app.
---

# Linear API

FastAPI backend for the [Linear](https://github.com/Surj1010101/LinearApp) wellbeing app.

- `/docs` — interactive Swagger UI
- `/redoc` — ReDoc API reference
- `/healthz` — liveness probe

## Environment variables (set in Space → Settings → Variables and secrets)

| Key | Required | Purpose |
|-----|:--------:|---------|
| `SECRET_KEY` | Yes | Signs JWT auth tokens. |
| `GOOGLE_API_KEY` | No | Enables Gemini-powered insights. |
| `CORS_ORIGINS` | No | Comma-separated allowed origins (default `*`). Set to your Vercel URL. |
| `DATABASE_URL` | No | Optional Postgres URL. SQLite by default (ephemeral on free Spaces). |

Note: free Hugging Face Spaces reset their filesystem on rebuild, so SQLite data
does not persist across deploys. For permanent storage, attach a free Neon /
Supabase Postgres and set `DATABASE_URL`.
