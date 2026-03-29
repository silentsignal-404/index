# 🚀 Free Deployment Guide for Silent Signal

## Option 1: Railway (Recommended) ⭐

### Step 1: Prepare Your Code
```bash
# Initialize git repository
git init
git add .
git commit -m "Initial commit - Silent Signal CTF website"
```

### Step 2: Deploy to Railway
1. **Sign up**: Go to [railway.app](https://railway.app) and sign up with GitHub
2. **Create Project**: Click "New Project" → "Deploy from GitHub repo"
3. **Connect Repository**: 
   - Push your code to GitHub first
   - Select your repository
4. **Environment Variables**: Add these in Railway dashboard:
   ```
   JWT_SECRET=your-super-secure-secret-key-here-change-this
   NODE_ENV=production
   ```
5. **Deploy**: Railway will automatically build and deploy!

### Step 3: Access Your Site
- **Website**: `https://your-app-name.railway.app`
- **Admin Panel**: `https://your-app-name.railway.app/changehandim`

---

## Option 2: Render.com (Alternative)

### Step 1: Prepare for Render
1. Push code to GitHub
2. Go to [render.com](https://render.com) and sign up

### Step 2: Create Web Service
1. **New Web Service** → Connect GitHub repo
2. **Settings**:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
3. **Environment Variables**:
   ```
   JWT_SECRET=your-super-secure-secret-key
   NODE_ENV=production
   ```

---

## Option 3: Vercel (Serverless)

⚠️ **Note**: Requires slight modifications for serverless

### Step 1: Install Vercel CLI
```bash
npm i -g vercel
```

### Step 2: Create vercel.json
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/server.js"
    }
  ]
}
```

### Step 3: Deploy
```bash
vercel --prod
```

---

## Option 4: Heroku (Free tier ended, but still popular)

### Step 1: Install Heroku CLI
```bash
# Install Heroku CLI from heroku.com/cli
```

### Step 2: Deploy
```bash
heroku create your-app-name
git push heroku main
heroku config:set JWT_SECRET=your-secret-key
```

---

## 🔧 Pre-Deployment Checklist

### ✅ Required Files Created:
- [x] `railway.json` - Railway configuration
- [x] `.gitignore` - Ignore sensitive files
- [x] Updated `package.json` with engines
- [x] Environment variable setup

### ✅ Security Setup:
1. **Change Default Password**: 
   - Login to admin panel
   - Change from `admin/admin123` to something secure

2. **Set Strong JWT Secret**:
   ```bash
   # Generate a strong secret
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

3. **Environment Variables**:
   ```
   JWT_SECRET=your-generated-secret-here
   NODE_ENV=production
   ```

---

## 🌐 Custom Domain (Optional)

### Railway:
1. Go to your project settings
2. Add custom domain
3. Update DNS records as instructed

### Render:
1. Project settings → Custom Domains
2. Add your domain
3. Configure DNS

---

## 📊 Database Persistence

### Important Notes:
- **Railway**: SQLite files persist between deployments
- **Render**: Files may reset on redeploy (consider upgrading for persistence)
- **Vercel**: Not suitable for SQLite (use serverless DB)

### For Production:
Consider upgrading to PostgreSQL for better persistence:
```bash
# Railway provides free PostgreSQL
# Add to your project and update connection string
```

---

## 🚀 Quick Deploy Commands

### Railway (Easiest):
```bash
# 1. Push to GitHub
git add .
git commit -m "Deploy Silent Signal"
git push origin main

# 2. Connect on railway.app
# 3. Set JWT_SECRET environment variable
# 4. Deploy automatically!
```

### Render:
```bash
# 1. Push to GitHub
git add .
git commit -m "Deploy Silent Signal"
git push origin main

# 2. Create web service on render.com
# 3. Connect repo and deploy
```

---

## 🔍 Post-Deployment Testing

1. **Website**: Visit your deployed URL
2. **Admin Panel**: Go to `/changehandim`
3. **Test Features**:
   - Contact form submission
   - Admin login
   - Content management
   - Database persistence

---

## 🆘 Troubleshooting

### Common Issues:

1. **Build Fails**: Check Node.js version compatibility
2. **Database Issues**: Ensure SQLite is supported on platform
3. **Environment Variables**: Double-check JWT_SECRET is set
4. **Port Issues**: Use `process.env.PORT` (already configured)

### Logs:
- **Railway**: View logs in dashboard
- **Render**: Check build and runtime logs
- **Vercel**: Use `vercel logs`

---

## 💰 Cost Breakdown

### Free Tiers:
- **Railway**: 500 hours/month free
- **Render**: 750 hours/month free
- **Vercel**: Unlimited for personal projects

### Recommended: Railway
- Best Node.js support
- SQLite works perfectly
- Easy custom domains
- Great free tier

---

**Ready to deploy? Start with Railway for the easiest experience!** 🚀