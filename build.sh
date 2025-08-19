#!/bin/bash

# Django Beefree Demo Build Script

echo "🚀 Setting up Django Beefree Demo..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install npm dependencies
echo "📦 Installing npm dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install npm dependencies"
    exit 1
fi

# Install BeeFree SDK package
echo "📦 Installing BeeFree SDK package..."
npm install @beefree.io/sdk

if [ $? -ne 0 ]; then
    echo "❌ Failed to install BeeFree SDK package"
    exit 1
fi

# Build frontend
echo "🔨 Building frontend assets..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Failed to build frontend assets"
    exit 1
fi

echo "✅ Frontend build completed successfully!"
echo ""
echo "Next steps:"
echo "1. Create a .env file with your BeeFree credentials"
echo "2. Run: make run"
echo ""
echo "For development with hot reloading:"
echo "1. Start Django: python manage.py runserver"
echo "2. Start Vite dev server: npm run dev"
