# LinearApp
AI-powered mobile wellbeing app for hybrid workers — CPS5007 Team Project

---

## Prerequisites

Install these before anything else:

- [Node.js](https://nodejs.org) (LTS version 18+)
- [Python](https://python.org) (version 3.10+) — check "Add Python to PATH" during install

---

## Quick Start (One Command)

> Make sure you've done the first-time setup below before using this.

Double-click `start.bat` — or run in terminal:

```bat
start.bat
```

This opens two windows automatically: one for the backend, one for the frontend.

---

## First-Time Setup + Manual Run

You need **two terminals open at the same time** — one for the backend, one for the frontend.

### Terminal 1 — Backend (FastAPI)

```bash
cd linear/backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# If NLTK errors on first run, download required data
python -c "import nltk; nltk.download('vader_lexicon')"

# Start the backend
uvicorn app.main:app --reload
```

Backend runs at: http://localhost:8000

---

### Terminal 2 — Frontend (React + Vite)

```bash
cd linear/frontend

# Install dependencies
npm install

# Start dev server (browser)
npm run dev

# Start dev server (mobile / accessible on network)
npm run dev -- --host

# Build for production
npm run build
```

Frontend runs at: http://localhost:5173

---

## Notes

- Run both terminals at the same time for the full app to work
- Never copy `node_modules` between machines — always run `npm install` fresh
- The database is a local SQLite file at `linear/backend/linear.db` — no extra database setup needed
- To share your local frontend with a phone on the same WiFi, use `npm run dev -- --host`
