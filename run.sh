#!/bin/bash

# Check for virtual environment
if [ -d "venv" ]; then
    echo "🐍 Activating virtual environment..."
    source venv/bin/activate
elif [ -d ".venv" ]; then
    echo "🐍 Activating virtual environment (.venv)..."
    source .venv/bin/activate
fi

# Check if uvicorn is installed
if ! command -v uvicorn &> /dev/null; then
    echo "❌ uvicorn not found. Please run ./deploy.sh first to install dependencies."
    exit 1
fi

echo "🚀 Starting JustSearch..."
python3 -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
