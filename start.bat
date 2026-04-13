@echo off
echo Starting LinearApp...

start cmd /k "cd linear\backend && venv\Scripts\activate && uvicorn app.main:app --reload"
start cmd /k "cd linear\frontend && npm run dev"

echo Both servers are starting in separate windows.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:5173
