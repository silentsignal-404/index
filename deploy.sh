#!/bin/bash

echo "🚀 Silent Signal Deployment Setup"
echo "=================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing Git repository..."
    git init
fi

# Add all files
echo "📦 Adding files to Git..."
git add .

# Commit
echo "💾 Creating commit..."
git commit -m "Deploy: Silent Signal CTF website with admin panel"

echo ""
echo "✅ Git setup complete!"
echo ""
echo "🌐 Next steps:"
echo "1. Create a GitHub repository"
echo "2. Push your code:"
echo "   git remote add origin https://github.com/yourusername/silent-signal.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3. Deploy on Railway:"
echo "   - Go to railway.app"
echo "   - Sign up with GitHub"
echo "   - Create new project from your repo"
echo "   - Set JWT_SECRET environment variable"
echo "   - Deploy!"
echo ""
echo "🔒 Admin Panel: https://your-app.railway.app/changehandim"
echo "🔑 Default credentials: admin / admin123 (CHANGE IMMEDIATELY!)"