@echo off
REM FlexPro v2 - Local Startup Script for Windows
REM این اسکریپت Backend و Frontend را به صورت همزمان اجرا می‌کند

echo.
echo ======================================
echo    FlexPro v2 - Local Environment
echo ======================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed
    echo Please install Python 3.8+ from python.org
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo Error: Node.js is not installed
    echo Please install Node.js from nodejs.org
    pause
    exit /b 1
)

echo [OK] Python and Node.js are installed
echo.

REM Start Backend
echo [1/2] Starting Backend (FastAPI + SQLite)...
cd flexpro-ai-service

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo Creating Python virtual environment...
    python -m venv venv
)

REM Activate virtual environment and install dependencies
call venv\Scripts\activate.bat

if not exist ".dependencies_installed" (
    echo Installing backend dependencies...
    pip install -r requirements.txt >nul 2>&1
    echo. > .dependencies_installed
)

REM Start backend in a new window
echo Starting FastAPI server...
start "FlexPro Backend" cmd /k "venv\Scripts\activate.bat && python -m app.main"

cd ..

REM Wait a bit for backend to start
timeout /t 3 /nobreak >nul

echo [OK] Backend started on http://localhost:8000
echo.

REM Start Frontend
echo [2/2] Starting Frontend (React + Vite)...

REM Install frontend dependencies if needed
if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
)

echo Starting Vite dev server...
echo.
echo ======================================
echo  FlexPro v2 is now running!
echo ======================================
echo.
echo  Backend:  http://localhost:8000
echo    Docs:   http://localhost:8000/docs
echo    Health: http://localhost:8000/health
echo.
echo  Frontend: http://localhost:5173
echo.
echo  Database: flexpro-ai-service\flexpro.db
echo.
echo  Press Ctrl+C in this window to stop Frontend
echo  Close the Backend window to stop Backend
echo ======================================
echo.

REM Start frontend (this keeps the window open)
call npm run dev

pause
