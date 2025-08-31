# Cloudflare Pages Deployment Guide

## Setup Steps

### 1. Connect Repository to Cloudflare Pages
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Pages** section
3. Click **Create a project**
4. Connect to your GitHub repository: `valorantgunskins`

### 2. Build Configuration
Set these build settings in Cloudflare Pages:

- **Build command:** `cd frontend && npm run build`
- **Build output directory:** `frontend/build`
- **Root directory:** `/` (leave blank)
- **Node.js version:** `18` or `20`

### 3. Environment Variables
If your app uses environment variables, add them in the Pages settings:
- `REACT_APP_API_URL` - Your backend API URL
- Any other `REACT_APP_*` variables your app needs

### 4. Custom Domain (Optional)
1. In Pages project settings, go to **Custom domains**
2. Add your domain and follow DNS configuration steps

## Features Configured
- ✅ Single Page Application routing (`_redirects` file)
- ✅ Production build optimization
- ✅ Static asset serving

## Important Notes
- The `_redirects` file ensures React Router works correctly
- All routes fallback to `index.html` for client-side routing
- Build process automatically runs on git pushes to main branch
- Backend API should be deployed separately (current setup assumes external backend)

## Next Steps After Deployment
1. Update frontend API calls to use production backend URL
2. Configure CORS on backend to allow Cloudflare Pages domain
3. Test all functionality on the deployed site