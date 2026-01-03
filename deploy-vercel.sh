#!/bin/bash

# Vercel Deployment Script
# This script helps deploy your app to Vercel

echo "🚀 Vercel Deployment Helper"
echo "============================"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed."
    echo "   Install it with: npm i -g vercel"
    exit 1
fi

echo "✅ Vercel CLI found"
echo ""

# Check if user is logged in
if ! vercel whoami &> /dev/null; then
    echo "⚠️  Not logged in to Vercel"
    echo "   Running: vercel login"
    vercel login
fi

echo "✅ Logged in to Vercel"
echo ""

# Check for environment variables
echo "📋 Checking environment variables..."
echo ""

if [ -z "$BACKEND_URL" ] && [ -z "$NEXT_PUBLIC_API_URL" ]; then
    echo "⚠️  Warning: BACKEND_URL or NEXT_PUBLIC_API_URL not set"
    echo "   You'll need to set these in Vercel dashboard after deployment"
    echo ""
    read -p "Enter your backend URL (or press Enter to skip): " backend_url
    if [ ! -z "$backend_url" ]; then
        export BACKEND_URL="$backend_url"
        export NEXT_PUBLIC_API_URL="$backend_url"
        echo "✅ Using backend URL: $backend_url"
    fi
fi

if [ -z "$NEXT_PUBLIC_BYTEZ_API_KEY" ]; then
    echo "⚠️  Warning: NEXT_PUBLIC_BYTEZ_API_KEY not set"
    echo "   You'll need to set this in Vercel dashboard"
fi

echo ""
echo "📦 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix errors before deploying."
    exit 1
fi

echo ""
echo "✅ Build successful"
echo ""
echo "🚀 Deploying to Vercel..."
echo ""

# Deploy
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Go to your Vercel dashboard"
echo "   2. Navigate to your project → Settings → Environment Variables"
echo "   3. Add the following variables:"
echo "      - BACKEND_URL (if using external backend)"
echo "      - NEXT_PUBLIC_API_URL"
echo "      - NEXT_PUBLIC_BYTEZ_API_KEY"
echo "   4. Redeploy: vercel --prod"
echo ""

