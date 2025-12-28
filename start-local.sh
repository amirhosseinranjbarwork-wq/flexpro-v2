#!/bin/bash

# FlexPro v2 - Local Startup Script
# این اسکریپت Backend و Frontend را به صورت همزمان اجرا می‌کند

echo "🚀 Starting FlexPro v2 Local Environment..."
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Error: Python 3 is not installed"
    echo "Please install Python 3.8+ from python.org"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed"
    echo "Please install Node.js from nodejs.org"
    exit 1
fi

echo "✅ Python and Node.js are installed"
echo ""

# Start Backend
echo "📦 Starting Backend (FastAPI + SQLite)..."
cd flexpro-ai-service

# Check if virtual environment exists, create if not
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install backend dependencies
if [ ! -f ".dependencies_installed" ]; then
    echo "Installing backend dependencies..."
    pip install -r requirements.txt > /dev/null 2>&1
    touch .dependencies_installed
fi

# Start backend in background
echo "Starting FastAPI server on http://localhost:8000"
python -m app.main > ../backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

cd ..

# Wait for backend to start
echo "Waiting for backend to be ready..."
sleep 3

# Check if backend is running
if curl -s http://localhost:8000/health > /dev/null; then
    echo "✅ Backend is running!"
else
    echo "⚠️  Backend might not be fully ready yet, continuing..."
fi

echo ""

# Start Frontend
echo "🎨 Starting Frontend (React + Vite)..."

# Install frontend dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

# Start frontend (this will keep the script running)
echo "Starting Vite dev server on http://localhost:5173"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ FlexPro v2 is now running!"
echo ""
echo "📊 Backend:  http://localhost:8000"
echo "    Docs:    http://localhost:8000/docs"
echo "    Health:  http://localhost:8000/health"
echo ""
echo "🎨 Frontend: http://localhost:5173"
echo ""
echo "🗄️  Database: flexpro-ai-service/flexpro.db"
echo ""
echo "Press Ctrl+C to stop all services"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Trap Ctrl+C to cleanup
trap "echo ''; echo '🛑 Stopping FlexPro v2...'; kill $BACKEND_PID 2>/dev/null; exit" INT TERM

# Start frontend (foreground)
npm run dev

# Cleanup on exit
kill $BACKEND_PID 2>/dev/null
