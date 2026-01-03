# 🚀 Vercel Deployment Guide

This guide explains how to deploy both the frontend and backend to Vercel.

## 📋 Prerequisites

1. **Vercel CLI installed**: `npm i -g vercel`
2. **Vercel account**: Sign up at [vercel.com](https://vercel.com)

## 🎯 Deployment Options

You have two options for deploying:

### Option 1: Frontend on Vercel + Backend on External Service (Recommended)

This is the **recommended approach** because:
- Backend dependencies (ChromaDB, TTS, MoviePy) are heavy and may exceed Vercel's limits
- External backend (Render, Railway, etc.) provides better performance for ML workloads
- Easier to manage and scale separately

**Steps:**

1. **Deploy Backend** (if not already deployed):
   - Deploy to Render, Railway, or similar service
   - Note the backend URL (e.g., `https://your-backend.onrender.com`)

2. **Deploy Frontend to Vercel**:
   ```bash
   # Login to Vercel
   vercel login
   
   # Deploy
   vercel
   
   # Set environment variables in Vercel dashboard:
   # - BACKEND_URL=https://your-backend.onrender.com
   # - NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
   # - NEXT_PUBLIC_BYTEZ_API_KEY=your-bytez-key
   ```

### Option 2: Both Frontend and Backend on Vercel

**⚠️ Warning**: This approach has limitations:
- Serverless functions have 10s timeout (Hobby) or 60s (Pro)
- Large dependencies may cause deployment issues
- ChromaDB and vector embeddings may be slow in serverless

**Steps:**

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Set Environment Variables** in Vercel Dashboard:
   - `NEXT_PUBLIC_BYTEZ_API_KEY` - Your Bytez API key
   - `CORS_ORIGINS` - Your Vercel domain (e.g., `https://your-app.vercel.app`)

## 🔧 Configuration Files

### `vercel.json`
- Configures Next.js framework
- Sets up Python serverless functions (if using Option 2)
- Defines routing rules

### `app/api/[...path]/route.js`
- Next.js API route that proxies requests to backend
- Works with both local and external backends

### `api/index.py` (Option 2 only)
- Vercel serverless function entry point
- Wraps FastAPI app with Mangum

## 🌍 Environment Variables

Set these in your Vercel project settings:

| Variable | Description | Required |
|----------|-------------|----------|
| `BACKEND_URL` | External backend URL (Option 1) | Option 1 |
| `NEXT_PUBLIC_API_URL` | Public API URL for frontend | Yes |
| `NEXT_PUBLIC_BYTEZ_API_KEY` | Bytez API key for video generation | Yes |
| `CORS_ORIGINS` | Allowed CORS origins (comma-separated) | Option 2 |

## 📝 Deployment Steps

### Step 1: Prepare Your Project

```bash
# Make sure dependencies are installed
npm install

# Build locally to check for errors
npm run build
```

### Step 2: Deploy with Vercel CLI

```bash
# Initial deployment
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account/team)
# - Link to existing project? No (first time) or Yes (updates)
# - Project name? (your-project-name)
# - Directory? ./
# - Override settings? No
```

### Step 3: Set Environment Variables

After deployment, set environment variables:

```bash
# Via CLI
vercel env add BACKEND_URL
vercel env add NEXT_PUBLIC_API_URL
vercel env add NEXT_PUBLIC_BYTEZ_API_KEY

# Or via Vercel Dashboard:
# 1. Go to your project
# 2. Settings → Environment Variables
# 3. Add each variable
```

### Step 4: Redeploy

```bash
# Redeploy to apply environment variables
vercel --prod
```

## 🧪 Testing Deployment

1. **Check Frontend**: Visit your Vercel URL
2. **Test API**: 
   ```bash
   curl https://your-app.vercel.app/api/stats
   ```
3. **Check Logs**:
   ```bash
   vercel logs
   ```

## 🔍 Troubleshooting

### Issue: API routes return 500 errors

**Solution**: 
- Check that `BACKEND_URL` is set correctly
- Verify backend is accessible from Vercel
- Check Vercel function logs: `vercel logs`

### Issue: CORS errors

**Solution**:
- Update `CORS_ORIGINS` in backend to include your Vercel domain
- Check backend CORS configuration in `backend/mcp_server.py`

### Issue: Serverless function timeout

**Solution**:
- Upgrade to Vercel Pro (60s timeout)
- Or use external backend (Option 1)

### Issue: Large dependencies fail to deploy

**Solution**:
- Use external backend for heavy ML workloads
- Or optimize dependencies (remove unused packages)

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Python Runtime](https://vercel.com/docs/functions/runtimes/python)

## 🎉 Success!

Once deployed, your app will be available at:
- **Production**: `https://your-project.vercel.app`
- **Preview**: `https://your-project-git-branch.vercel.app`

