# 🚀 Deploy to Vercel - Run These Commands

## Step 1: Login to Vercel (Interactive - Opens Browser)

```bash
npx vercel login
```

This will:
- Open your browser
- Ask you to log in to Vercel (or create an account)
- Authorize the CLI

## Step 2: Deploy Your Project

```bash
npx vercel --prod
```

Follow the prompts:
- **Set up and deploy?** → Yes
- **Which scope?** → Select your account
- **Link to existing project?** → No (first time) or Yes (if updating)
- **Project name?** → `ai-image-generator` (or your preferred name)
- **Directory?** → `./` (current directory)
- **Override settings?** → No

## Step 3: Set Environment Variables

After deployment, go to Vercel Dashboard:

1. Visit: https://vercel.com/dashboard
2. Click on your project
3. Go to **Settings** → **Environment Variables**
4. Add these variables:

| Variable Name | Value |
|--------------|-------|
| `BACKEND_URL` | `https://ai-video-generator-backend-1-q4my.onrender.com` |
| `NEXT_PUBLIC_API_URL` | `https://ai-video-generator-backend-1-q4my.onrender.com` |
| `NEXT_PUBLIC_BYTEZ_API_KEY` | `dd503548837744513f63fce22c569984` |

5. Click **Save** for each variable
6. Make sure to select **Production**, **Preview**, and **Development** for each

## Step 4: Redeploy

```bash
npx vercel --prod
```

Or trigger a redeploy from the Vercel Dashboard.

## Step 5: Update Backend CORS

Update your backend CORS to allow your Vercel domain:

1. Get your Vercel URL (e.g., `https://ai-image-generator.vercel.app`)
2. Update `backend/mcp_server.py` CORS settings or set `CORS_ORIGINS` environment variable on Render

## ✅ Done!

Your app will be live at: `https://your-project-name.vercel.app`

---

## 🎯 Quick Command (All-in-One)

Or use the deployment script:

```bash
./deploy.sh
```

This script will:
- Check if you're logged in
- Build your project
- Deploy to Vercel
- Show you what to do next

