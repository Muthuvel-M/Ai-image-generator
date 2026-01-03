# 🎯 Quick Reference - Deployed Backend

## ✅ Backend Status: LIVE

**URL**: `https://ai-video-generator-backend-1-q4my.onrender.com`

| Metric | Value |
|--------|-------|
| Status | ✅ Online |
| Documents | 49 |
| Version | 1.0.0 |
| Platform | Render |

## 🔗 Quick Links

- **API Docs**: https://ai-video-generator-backend-1-q4my.onrender.com/docs
- **Health Check**: https://ai-video-generator-backend-1-q4my.onrender.com/
- **Database Stats**: https://ai-video-generator-backend-1-q4my.onrender.com/api/stats

## 🚀 Quick Setup (Connect Frontend to Deployed Backend)

### Option 1: Run Setup Script
```bash
./setup-production.sh
npm run dev
```

### Option 2: Manual Setup
```bash
# Create .env.local
echo "NEXT_PUBLIC_API_URL=https://ai-video-generator-backend-1-q4my.onrender.com" > .env.local
echo "NEXT_PUBLIC_BYTEZ_API_KEY=dd503548837744513f63fce22c569984" >> .env.local

# Restart frontend
npm run dev
```

## 🧪 Test Commands

```bash
# Health check
curl https://ai-video-generator-backend-1-q4my.onrender.com/

# Database stats
curl https://ai-video-generator-backend-1-q4my.onrender.com/api/stats

# Test search
curl -X POST https://ai-video-generator-backend-1-q4my.onrender.com/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "quantum computing", "top_k": 5}'
```

## 📦 What's Deployed

✅ FastAPI Server  
✅ ChromaDB with 49 documents  
✅ Sentence Transformers (embeddings)  
✅ TTS (Text-to-Speech)  
✅ MoviePy (Video generation)  
✅ All API endpoints  

## ⚠️ Important Notes

1. **Free Tier Limitations**:
   - Backend sleeps after 15 minutes of inactivity
   - First request after sleep takes ~30-60 seconds (cold start)
   - Upgrade to $7/month for always-on

2. **CORS Configuration**:
   - Currently allows: `http://localhost:3000`
   - Update when deploying frontend to Vercel

3. **Environment Variables**:
   - Frontend needs: `NEXT_PUBLIC_API_URL`
   - Set in Vercel dashboard for production

## 🎯 Next Steps

- [ ] Test backend with local frontend
- [ ] Deploy frontend to Vercel
- [ ] Update CORS settings with Vercel URL
- [ ] (Optional) Set up backend warming
- [ ] (Optional) Upgrade Render plan if needed

## 📊 Backend Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/` | GET | Health check |
| `/api/search` | POST | Semantic search |
| `/api/generate-video` | POST | Generate video |
| `/api/feedback` | POST | Save feedback |
| `/api/stats` | GET | Database stats |
| `/docs` | GET | API documentation |
| `/videos/{file}` | GET | Serve videos |

---

**Last Verified**: December 31, 2025  
**Status**: ✅ All systems operational
