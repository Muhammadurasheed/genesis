#!/bin/bash

# GenesisOS Backend Setup Script
echo "🔧 Setting up GenesisOS Backend..."

# Check if Python is available
if ! command -v python3 &> /dev/null && ! command -v python &> /dev/null; then
    echo "❌ Python is not installed. Please install Python 3.8+ first."
    exit 1
fi

# Use python3 if available, otherwise use python
PYTHON_CMD="python3"
if ! command -v python3 &> /dev/null; then
    PYTHON_CMD="python"
fi

echo "📍 Using Python: $($PYTHON_CMD --version)"

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "🔄 Creating virtual environment..."
    $PYTHON_CMD -m venv venv
else
    echo "✅ Virtual environment already exists"
fi

# Activate virtual environment and install dependencies
echo "📦 Installing dependencies..."
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    # Windows
    source venv/Scripts/activate
else
    # macOS/Linux
    source venv/bin/activate
fi

# Upgrade pip first
pip install --upgrade pip

# Install requirements
pip install -r requirements.txt

echo "✅ Backend setup complete!"
echo "🚀 To start the backend server:"
echo "   cd backend"
echo "   source venv/bin/activate  # (or venv\\Scripts\\activate on Windows)"
echo "   python run.py"