#!/bin/bash

echo "🚀 Starting JustSearch Deployment..."

# Check if settings.json exists, if not create from example
if [ ! -f "backend/settings.json" ]; then
    echo "📝 Creating default settings.json..."
    cp backend/settings.json.example backend/settings.json
fi

# Create user_data directory if not exists
mkdir -p user_data

# Function to run with docker
run_docker() {
    echo "🐳 Docker found. Building and starting containers..."
    
    if command -v docker-compose &> /dev/null; then
        docker-compose up -d --build
    else
        docker compose up -d --build
    fi
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Deployment successful!"
        echo "🌍 Access JustSearch at: http://localhost:8000"
    else
        echo "❌ Docker deployment failed."
        exit 1
    fi
}

# Check if Docker is installed
if command -v docker &> /dev/null; then
    run_docker
else
    echo "⚠️ Docker not found. Falling back to local python environment..."
    
    # Check python
    if ! command -v python3 &> /dev/null; then
        echo "❌ Python3 not found. Please install Docker or Python3."
        exit 1
    fi

    echo "🐍 Setting up local environment..."
    if [ ! -d "venv" ]; then
        echo "Creating virtual environment..."
        python3 -m venv venv
    fi
    
    echo "Activating virtual environment..."
    source venv/bin/activate
    
    echo "📦 Installing dependencies..."
    pip install --upgrade pip
    pip install -r backend/requirements.txt
    
    echo "🌐 Installing Playwright browsers..."
    playwright install chromium
    
    # Run the application using run.sh
    if [ -f "./run.sh" ]; then
        ./run.sh
    else
        echo "🚀 Starting server..."
        python3 -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
    fi
fi
