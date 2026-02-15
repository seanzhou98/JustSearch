@echo off

:: Check for virtual environment
if exist "venv" (
    echo 🐍 Activating virtual environment...
    call venv\Scripts\activate
) else if exist ".venv" (
    echo 🐍 Activating virtual environment (.venv)...
    call .venv\Scripts\activate
)

:: Check if uvicorn is installed
python -c "import uvicorn" >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ uvicorn not found. Please run deploy.bat first to install dependencies.
    pause
    exit /b 1
)

echo 🚀 Starting JustSearch...
python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
