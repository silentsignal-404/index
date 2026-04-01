# Silent Signal - Deployment Guide

## Deploy to Render (Recommended - Free)

1. **Push your code to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Go to Render.com**:
   - Sign up/login at https://render.com
   - Connect your GitHub account (`silentsignal404`)

3. **Create New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your `silentsignal404/index` repository
   - Use these settings:
     - **Name**: `silent-signal`
     - **Environment**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Plan**: Free

4. **Add Environment Variable**:
   - In the service settings, add:
     - **Key**: `JWT_SECRET`
     - **Value**: `silent-signal-secret-key-2026-production-render`

5. **Deploy**: Click "Create Web Service"

Your site will be live at: `https://silent-signal.onrender.com`

## Alternative: Vercel (Also Free)

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel --prod
   ```

## Alternative: Railway (If GitHub Fixed)

1. **Fix GitHub Connection**:
   - Go to Railway → Account → Integrations
   - Disconnect GitHub completely
   - Reconnect with correct account
   - Make sure to select "All repositories" or specifically `silentsignal404/index`

2. **Deploy**:
   - New Project → Deploy from GitHub
   - Select your repository
   - Add environment variable: `JWT_SECRET`

## Admin Panel Access

Once deployed, access admin at: `https://your-domain.com/changehandim`
- Username: `admin`
- Password: `admin123`

## Features Included

✅ Dynamic content loading from database
✅ Contact form saves to admin panel  
✅ Admin can view all messages
✅ Secure JWT authentication
✅ Rate limiting and security
✅ Health check endpoint
✅ Mobile responsive design
✅ Catppuccin Mocha theme
✅ Terminal aesthetics with animations