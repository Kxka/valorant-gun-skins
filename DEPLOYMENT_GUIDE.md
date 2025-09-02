# Deployment Guide: Cloudflare Frontend + Railway Backend

Your project is configured for deployment with **Cloudflare Pages** (frontend) and **Railway** (backend).

## 📋 Prerequisites

1. **Cloudflare Account**: Sign up at [cloudflare.com](https://cloudflare.com)
2. **Railway Account**: Sign up at [railway.app](https://railway.app)
3. **Git Repository**: Push your code to GitHub/GitLab

## 🚂 Step 1: Deploy Backend to Railway

### 1.1 Install Railway CLI
```bash
npm install -g @railway/cli
```

### 1.2 Login to Railway
```bash
railway login
```
- Choose your preferred login method (GitHub recommended)
- Complete authentication in browser

### 1.3 Deploy Backend
```bash
# Navigate to project root
cd C:\Users\Akkinson\OneDrive\Coding\valorantgunskins

# Initialize Railway project
railway init

# Deploy the backend
railway up
```

### 1.4 Get Railway URL
After deployment, Railway will provide a URL like:
```
https://valorantgunskins-production-a1b2c3.up.railway.app
```
**📝 SAVE THIS URL - you'll need it for the frontend!**

## ☁️ Step 2: Deploy Frontend to Cloudflare Pages

### 2.1 Update API URL
1. Edit `frontend/.env.production`
2. Replace `YOUR_RAILWAY_URL` with your actual Railway URL:
```env
REACT_APP_API_URL=https://your-railway-url.railway.app/api
```

### 2.2 Build Frontend
```bash
cd frontend
npm run build
```

### 2.3 Deploy to Cloudflare Pages

**Option A: Via Cloudflare Dashboard (Recommended)**
1. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Click "Pages" → "Create a project"
3. Connect your Git repository
4. Configure build settings:
   - **Build command**: `cd frontend && npm run build`
   - **Build output directory**: `frontend/build`
   - **Root directory**: `/` (project root)

**Option B: Via CLI**
```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy from frontend/build directory
cd frontend/build
wrangler pages deploy . --project-name valorant-skins
```

## 🔄 Step 3: Test Your Deployment

1. **Test Backend**: Visit `https://your-railway-url.railway.app/api/health`
2. **Test Frontend**: Visit your Cloudflare Pages URL
3. **Test Integration**: Check if frontend can fetch data from backend

## 📁 File Configuration Summary

Your project is already configured with:

✅ **Frontend Configuration**:
- `frontend/.env.production` - API URL configuration
- `frontend/package.json` - Build scripts ready
- `frontend/src/api.ts` - API client configured

✅ **Backend Configuration**:
- `railway.json` - Railway deployment config
- `Procfile` - Process configuration
- `package.json` - Start scripts configured
- `backend/server.js` - CORS enabled for cross-origin requests

## 🚨 Important Notes

1. **Environment Variables**: Update `.env.production` with your actual Railway URL
2. **CORS**: Backend already configured to accept requests from any origin
3. **API Routes**: All API endpoints are prefixed with `/api/`
4. **Static Files**: Images served from backend `/images` route

## 🔧 Troubleshooting

**Frontend not loading data?**
- Check `.env.production` has correct Railway URL
- Verify API URL in Network tab of browser dev tools

**Backend not starting?**
- Check Railway logs: `railway logs`
- Ensure all dependencies are in `package.json`

**CORS errors?**
- Backend already has CORS enabled
- Check if API URL is correct in frontend

## 🔄 Future Updates

To update your deployments:

**Backend (Railway)**:
```bash
git push  # Railway auto-deploys on git push
```

**Frontend (Cloudflare)**:
```bash
git push  # Cloudflare auto-builds and deploys
```

---

🎉 **That's it!** Your Valorant gun skins website will be live with:
- ⚡ Fast frontend on Cloudflare's global CDN
- 🚂 Scalable backend on Railway
- 🔄 Automatic deployments on git push