#!/bin/bash

# Setup script for AI Video Generator - Challenge 1
# Automates the installation and setup process

set -e  # Exit on error

echo "🚀 AI Video Generator - Setup Script"
echo "===================================="
echo ""

# Check Python version
echo "📋 Checking Python version..."
python3 --version || {
    echo "❌ Python 3 not found! Please install Python 3.10+"
    exit 1
}

# Create virtual environment
echo ""
echo "🐍 Creating Python virtual environment..."
cd backend
if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo "✅ Virtual environment created"
else
    echo "ℹ️  Virtual environment already exists"
fi

# Activate virtual environment
echo ""
echo "⚡ Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo ""
echo "📦 Upgrading pip..."
pip install --upgrade pip

# Install dependencies
echo ""
echo "📥 Installing Python dependencies..."
echo "⚠️  This may take 5-10 minutes and download ~2GB of models..."
echo ""
pip install -r requirements.txt

echo ""
echo "✅ Dependencies installed!"

# Populate database
echo ""
echo "📚 Populating vector database..."
python populate_db.py <<EOF
y
EOF

echo ""
echo "======================================"
echo "✨ Setup Complete!"
echo "======================================"
echo ""
echo "Next steps:"
echo ""
echo "1. Start the backend server:"
echo "   cd backend"
echo "   source venv/bin/activate"
echo "   python mcp_server.py"
echo ""
echo "2. In another terminal, start Next.js frontend:"
echo "   npm run dev"
echo ""
echo "3. Visit http://localhost:3000/search"
echo ""
echo "Happy searching! 🔍"
