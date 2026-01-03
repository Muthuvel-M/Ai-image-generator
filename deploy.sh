#!/bin/bash

# Simple Vercel Deployment Script
# Run this script to deploy your app

echo "🚀 Deploying to Vercel..."
echo ""

# Check if already logged in
if npx vercel whoami &> /dev/null; then
    echo "✅ Already logged in to Vercel"
    USER=$(npx vercel whoami 2>/dev/null)
    echo "   Logged in as: $USER"
    echo ""
else
    echo "⚠️  Not logged in to Vercel"
    echo "   Please login first..."
    echo ""
    npx vercel login
    echo ""
fi

# Build the project first
echo "📦 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix errors before deploying."
    exit 1
fi

echo ""
echo "✅ Build successful"
echo ""

# Deploy
echo "🚀 Deploying to Vercel..."
echo ""
npx vercel --prod

echo ""
echo "✅ Deployment initiated!"
echo ""
echo "📝 Important: After deployment, set these environment variables in Vercel Dashboard:"
echo "   1. Go to: https://vercel.com/dashboard"
echo "   2. Select your project"
echo "   3. Go to Settings → Environment Variables"
echo "   4. Add:"
echo "      - BACKEND_URL = https://ai-video-generator-backend-1-q4my.onrender.com"
echo "      - NEXT_PUBLIC_API_URL = https://ai-video-generator-backend-1-q4my.onrender.com"
echo "      - NEXT_PUBLIC_BYTEZ_API_KEY = (your Bytez API key)"
echo "   5. Redeploy: npx vercel --prod"
echo ""

