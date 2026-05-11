# LinearApp

AI-powered mobile wellbeing app for hybrid workers — CPS5007 Team Project.

## Prerequisites

Install these before starting the project:

- [Node.js LTS](https://nodejs.org) with `npm`
- [Python 3.10+](https://python.org)

On Windows, tick **Add Python to PATH** during Python installation. After installing Node.js or Python, close and reopen your terminal so `python` and `npm` are available.

## Fresh Clone / New PC Setup

From a new computer or fresh download:

1. Clone or download the repository.
2. Open a terminal in the project root folder, the same folder that contains `start.bat`.
3. Run the startup script.

PowerShell:

```powershell
.\start.bat
```

Command Prompt:

```bat
start.bat
```

You can also double-click `start.bat`.

The first run may take a few minutes because it creates the backend virtual environment, installs Python packages, downloads the NLTK sentiment data, and installs frontend packages. After setup, it opens two terminal windows:

- Backend API: http://localhost:8000
- Frontend app: http://localhost:3000

## Optional — Enable AI Insights (free)

Insights work out of the box using a local rule-based summary. To upgrade to conversational, AI-generated insights, the app uses **Google Gemini Flash** — it has a genuine free tier with no billing setup required.

1. Go to https://aistudio.google.com/apikey and sign in with any Google account.
2. Click **Create API key** (free, no credit card required).
3. Open `linear/backend/.env` (created automatically on first run from `.env.example`).
4. Paste your key after the `=`:

   ```
   GOOGLE_API_KEY=AIza...
   ```

5. Restart `start.bat`. You should see `AI insights enabled — GOOGLE_API_KEY found.` in the startup log, and the Insights page will switch the badge from `🔒 Local analysis` to `✨ AI generated`.

The key stays on your machine — `.env` is gitignored so it cannot be committed accidentally. If the Gemini API ever fails or the daily free quota is hit, the app silently falls back to the local rule-based summary so nothing breaks.

## What `start.bat` Does

`start.bat` is safe to run again. It checks for:

- `linear/backend/venv` for Python backend dependencies
- `linear/frontend/node_modules` for React frontend dependencies
- Python and npm availability
- The required backend and frontend project folders

To install missing dependencies without starting the servers:

```powershell
.\start.bat --setup-only
```

## Manual Run

Use this if you want to start each server yourself or troubleshoot the script.

### Terminal 1 — Backend

```powershell
cd linear\backend
python -m venv venv
.\venv\Scripts\python.exe -m pip install -r requirements.txt
.\venv\Scripts\python.exe -c "import nltk; nltk.download('vader_lexicon')"
.\venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Backend runs at: http://localhost:8000

### Terminal 2 — Frontend

```powershell
cd linear\frontend
npm install
npm run dev
```

Frontend runs at: http://localhost:3000

## Troubleshooting

- If PowerShell says `start.bat` is not recognized, run `.\start.bat` instead.
- If `python` is not recognized, install Python 3.10+ with **Add Python to PATH**, then reopen the terminal.
- If `npm` is not recognized, install Node.js LTS, then reopen the terminal.
- If dependencies seem broken, delete `linear/backend/venv` and `linear/frontend/node_modules`, then run `.\start.bat` again.
- If port `3000` is already busy, close old frontend terminal windows or use the URL shown in the frontend terminal.

## Notes

- Run the backend and frontend at the same time for the full app to work.
- Do not copy `node_modules` or `venv` between computers; reinstall them on each machine.
- The backend uses a local SQLite database at `linear/backend/linear.db`.
- The frontend API base URL defaults to `http://localhost:8000/api`.
