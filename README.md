# Linear — Wellbeing for Hybrid Workers

A full-stack web app that helps hybrid workers track mood, energy, stress, screen time, hydration, and meals — then turns those signals into AI-generated insights and personalised recommendations.

**Live demo:** _add your Vercel URL here once deployed_
**API:** _add your Render URL here once deployed_

---

## Highlights

- **Daily check-in flow** — mood, energy, stress, hours worked, screen time, hydration, meals, and free-text journal.
- **AI insights** — Google Gemini (free tier) summarises patterns across recent check-ins. Falls back to a local rule-based summary when the key is missing or quota is exhausted, so the app never breaks.
- **Sentiment + keyword extraction** — NLTK VADER tags each journal entry and surfaces themes.
- **Recommendations** — exercise, nutrition, and screen-break suggestions tailored to the latest check-in.
- **Dashboard charts** — mood / energy / stress trends with toggleable metrics (Recharts).
- **Auth** — JWT-based register / login with bcrypt-hashed passwords.
- **GDPR** — one-click data export (JSON) and account deletion.
- **PWA** — installable, offline-capable shell via Workbox.

## Tech Stack

| Layer        | Tools                                                                 |
|--------------|-----------------------------------------------------------------------|
| Frontend     | React 18, TypeScript, Vite 6, React Router 7, Axios, Recharts, vite-plugin-pwa |
| Backend      | FastAPI, SQLAlchemy 2, Pydantic v2, Uvicorn                           |
| Database     | SQLite (dev) / Postgres (prod, via `DATABASE_URL`)                    |
| AI / NLP     | Google Gemini 2.5 Flash, NLTK VADER                                   |
| Auth         | JWT (python-jose), bcrypt                                             |
| Hosting      | Vercel (frontend) + Render (backend)                                  |

## Repository Layout

```
linear/
  backend/      FastAPI app (app/, requirements.txt, .env.example)
  frontend/     Vite + React app (src/, package.json, .env.example)
render.yaml     Backend Blueprint for Render
vercel.json     Build config for Vercel
start.bat       Windows one-click local launcher
```

---

## Run Locally

### Prerequisites

- [Node.js 20+](https://nodejs.org) and `npm`
- [Python 3.11+](https://python.org) (tick **Add Python to PATH** on Windows)

### Quick start (Windows)

```powershell
.\start.bat
```

The first run creates the venv, installs dependencies, downloads the NLTK lexicon, and opens both servers. Re-running is idempotent. Use `.\start.bat --setup-only` to install without launching.

### Manual

**Backend** (terminal 1):

```bash
cd linear/backend
python -m venv venv
# Windows: .\venv\Scripts\python -m pip install -r requirements.txt
# macOS/Linux:
./venv/bin/pip install -r requirements.txt
./venv/bin/python -c "import nltk; nltk.download('vader_lexicon')"
cp .env.example .env   # then fill in SECRET_KEY (see below)
./venv/bin/uvicorn app.main:app --reload --port 8000
```

**Frontend** (terminal 2):

```bash
cd linear/frontend
npm install
cp .env.example .env   # default VITE_API_URL points at localhost:8000
npm run dev
```

Open <http://localhost:3000>.

### Environment variables

**Backend** (`linear/backend/.env`):

| Variable        | Required | Purpose                                                                 |
|-----------------|:--------:|-------------------------------------------------------------------------|
| `SECRET_KEY`    | Yes      | Signs JWTs. Generate with `python -c "import secrets; print(secrets.token_urlsafe(48))"`. |
| `GOOGLE_API_KEY`| No       | Enables Gemini-powered insights ([get one free](https://aistudio.google.com/apikey)). Falls back to local rules if unset. |
| `DATABASE_URL`  | No       | Defaults to SQLite. Set to a Postgres URL in production.                |
| `CORS_ORIGINS`  | No       | Comma-separated allowed origins. Defaults to `*` for local dev.         |

**Frontend** (`linear/frontend/.env`):

| Variable       | Purpose                                                         |
|----------------|-----------------------------------------------------------------|
| `VITE_API_URL` | Base URL of the backend, including `/api` (default `http://localhost:8000/api`). |

`.env` is gitignored. Never commit secrets — only the `.env.example` templates are tracked.

---

## Deploy

### Backend — Render

1. Push this repo to GitHub.
2. In Render, click **New → Blueprint** and point it at the repo. Render reads `render.yaml`.
3. After the service is created, add the secret env vars in the dashboard:
   - `SECRET_KEY` — generate as above.
   - `GOOGLE_API_KEY` — optional, for AI insights.
   - `CORS_ORIGINS` — your Vercel URL, e.g. `https://linear-app.vercel.app`.
4. Render builds, downloads the NLTK lexicon, and starts `uvicorn` on the free plan. Healthcheck: `/healthz`.

> The free Render web service spins down after inactivity; the first request after idle will be slow (~30s cold start). Hitting `/healthz` from a cron keeps it warm if needed.

### Frontend — Vercel

1. Import the repo into Vercel — it detects `vercel.json` at the root and builds from `linear/frontend`.
2. In **Project Settings → Environment Variables**, add:
   - `VITE_API_URL` = `https://<your-render-service>.onrender.com/api`
3. Deploy. The SPA fallback (rewrite rule in `vercel.json`) handles React Router routes.

After both are up, set `CORS_ORIGINS` on the backend to your Vercel URL and redeploy the backend.

---

## API Surface

All endpoints are namespaced under `/api`:

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/checkins              list user check-ins
POST   /api/checkins              create one (returns sentiment + keywords)
GET    /api/dashboard/summary     aggregated stats
GET    /api/dashboard/trends      mood/energy/stress over time
GET    /api/insights              past AI summaries
POST   /api/insights/generate     new AI summary (Gemini → local fallback)
GET    /api/insights/status       { aiEnabled: bool }
GET    /api/recommendations       tailored suggestions
GET    /api/users/me              profile
PUT    /api/users/me              update profile
GET    /api/users/me/export       GDPR data export
DELETE /api/users/me              GDPR account delete
GET    /healthz                   liveness probe
```

Interactive docs auto-served at `/docs` (Swagger) and `/redoc` when the backend is running.

---

## Troubleshooting

- `start.bat not recognized` → run `.\start.bat` in PowerShell.
- `python` / `npm` not recognized → install Node 20+ / Python 3.11+, then reopen the terminal.
- Cold-start lag on the deployed API → free Render web services sleep after 15 minutes; first request wakes them.
- Reset local dependencies → delete `linear/backend/venv` and `linear/frontend/node_modules`, re-run `start.bat`.

## License

MIT — see [LICENSE](LICENSE).
