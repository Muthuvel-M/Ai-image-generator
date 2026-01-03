# ⚡ Quick Start: Deploy to Vercel

## 🎯 Fastest Way to Deploy

### Option 1: Frontend on Vercel + Backend on Render (Recommended)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel

# 4. Set environment variables in Vercel Dashboard:
#    - BACKEND_URL=https://ai-video-generator-backend-1-q4my.onrender.com
#    - NEXT_PUBLIC_API_URL=https://ai-video-generator-backend-1-q4my.onrender.com
#    - NEXT_PUBLIC_BYTEZ_API_KEY=your-key-here

# 5. Redeploy
vercel --prod
```

### Option 2: Use Deployment Script

```bash
./deploy-vercel.sh
```

## ✅ What's Configured

- ✅ Next.js frontend ready for Vercel
- ✅ API proxy routes (`/app/api/[...path]/route.js`)
- ✅ Environment variable support
- ✅ CORS configuration updated
- ✅ All frontend API calls use relative paths

## 🔗 Your Deployed URLs

After deployment:
- **Frontend**: `https://your-project.vercel.app`
- **Backend**: Your existing Render backend (or set `BACKEND_URL`)

## 📝 Environment Variables Needed

Set these in Vercel Dashboard → Project → Settings → Environment Variables:

| Variable | Value | Required |
|----------|-------|----------|
| `BACKEND_URL` | Your backend URL | Yes |
| `NEXT_PUBLIC_API_URL` | Same as BACKEND_URL | Yes |
| `NEXT_PUBLIC_BYTEZ_API_KEY` | Your Bytez API key | Yes |

## 🐛 Troubleshooting

**API calls fail?**
- Check `BACKEND_URL` is set correctly
- Verify backend is accessible
- Check Vercel logs: `vercel logs`

**CORS errors?**
- Update backend CORS to include your Vercel domain
- Check `backend/mcp_server.py` CORS settings

## 📚 Full Documentation

See `VERCEL_DEPLOYMENT.md` for detailed instructions.

