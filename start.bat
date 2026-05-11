@echo off
setlocal

cd /d "%~dp0"

echo Starting LinearApp...
echo.

if /I "%~1"=="--help" goto :help

set "PYTHON_CMD=python"
where python >nul 2>nul
if errorlevel 1 (
    where py >nul 2>nul
    if errorlevel 1 (
        echo ERROR: Python was not found. Install Python 3.10+ and tick "Add Python to PATH".
        exit /b 1
    )
    set "PYTHON_CMD=py -3"
)

where npm >nul 2>nul
if errorlevel 1 (
    echo ERROR: npm was not found. Install Node.js LTS, then open a new terminal.
    exit /b 1
)

if not exist "linear\backend\requirements.txt" (
    echo ERROR: Cannot find linear\backend\requirements.txt. Run this from the project root.
    exit /b 1
)

if not exist "linear\frontend\package.json" (
    echo ERROR: Cannot find linear\frontend\package.json. Run this from the project root.
    exit /b 1
)

if not exist "linear\backend\venv\Scripts\python.exe" (
    echo Creating backend virtual environment...
    %PYTHON_CMD% -m venv "linear\backend\venv"
    if errorlevel 1 goto :error
) else (
    echo Backend virtual environment found.
)

echo Ensuring backend dependencies are installed...
"linear\backend\venv\Scripts\python.exe" -m pip install --disable-pip-version-check -r "linear\backend\requirements.txt"
if errorlevel 1 goto :error

"linear\backend\venv\Scripts\python.exe" -c "import nltk.data; nltk.data.find('sentiment/vader_lexicon.zip')" >nul 2>nul
if errorlevel 1 (
    echo Downloading backend NLTK sentiment data...
    "linear\backend\venv\Scripts\python.exe" -c "import nltk; raise SystemExit(0 if nltk.download('vader_lexicon', quiet=True) else 1)"
    if errorlevel 1 goto :error
) else (
    echo Backend NLTK sentiment data found.
)

if not exist "linear\backend\.env" (
    if exist "linear\backend\.env.example" (
        copy /Y "linear\backend\.env.example" "linear\backend\.env" >nul
        echo Created linear\backend\.env from template.
    )
)

findstr /R /B "GOOGLE_API_KEY=." "linear\backend\.env" >nul 2>nul
if errorlevel 1 goto :ai_disabled
echo AI insights enabled - GOOGLE_API_KEY found.
goto :ai_done
:ai_disabled
echo.
echo [optional] AI insights are disabled - no GOOGLE_API_KEY set.
echo            Insights will use the local rule-based fallback.
echo            To enable, paste a free key from aistudio.google.com/apikey
echo            into linear\backend\.env, then re-run start.bat.
echo.
:ai_done

if not exist "linear\frontend\node_modules" (
    echo Installing frontend dependencies...
    pushd "linear\frontend"
    if errorlevel 1 goto :error

    if exist "package-lock.json" (
        call npm ci
    ) else (
        call npm install
    )
    if errorlevel 1 (
        popd
        goto :error
    )
    popd
) else (
    echo Frontend dependencies found.
)

if /I "%~1"=="--setup-only" (
    echo.
    echo Setup complete. Run .\start.bat to launch the app.
    exit /b 0
)

echo.
echo Launching backend and frontend in separate windows...

start "LinearApp Backend" /D "%~dp0linear\backend" cmd /k "call venv\Scripts\activate.bat && python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000"
start "LinearApp Frontend" /D "%~dp0linear\frontend" cmd /k "npm run dev"

echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:3000
echo.
echo If you are using PowerShell, run this as .\start.bat, not start.bat.
exit /b 0

:help
echo Usage:
echo   .\start.bat              Set up missing dependencies and start the app
echo   .\start.bat --setup-only Set up missing dependencies without starting servers
exit /b 0

:error
echo.
echo Startup failed. Check the error above, fix it, then run .\start.bat again.
exit /b 1
