#!/bin/bash

# Quick Setup Script for Deployed Backend
# This connects your local frontend to the deployed Render backend

echo "🚀 Setting up environment for deployed backend..."

# Create .env.local with deployed backend URL
cat > .env.local << EOF
# Frontend Environment Variables
# Using deployed Render backend

NEXT_PUBLIC_API_URL=https://ai-video-generator-backend-1-q4my.onrender.com
NEXT_PUBLIC_BYTEZ_API_KEY=dd503548837744513f63fce22c569984
EOF

echo "✅ Created .env.local with production backend URL"
echo ""
echo "📋 Environment Configuration:"
echo "   Backend URL: https://ai-video-generator-backend-1-q4my.onrender.com"
echo "   Bytez API Key: dd503548837744513f63fce22c569984"
echo ""
echo "🧪 Testing backend connection..."

# Test backend
RESPONSE=$(curl -s https://ai-video-generator-backend-1-q4my.onrender.com/)
if [ $? -eq 0 ]; then
    echo "✅ Backend is online!"
    echo "   Response: $RESPONSE"
else
    echo "❌ Backend is not responding"
    exit 1
fi

echo ""
echo "📊 Checking database stats..."
STATS=$(curl -s https://ai-video-generator-backend-1-q4my.onrender.com/api/stats)
echo "   $STATS"

echo ""
echo "🎯 Next Steps:"
echo "   1. Restart your frontend dev server:"
echo "      npm run dev"
echo ""
echo "   2. Open http://localhost:3000"
echo ""
echo "   3. Try a search - it will use the deployed backend!"
echo ""
echo "   4. (Optional) Deploy frontend to Vercel:"
echo "      vercel"
echo ""
echo "✨ Setup complete! Your frontend will now use the deployed backend."
