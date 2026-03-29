# Silent Signal CTF Team Website & Admin Backend

A complete full-stack solution for managing the Silent Signal CTF team website with a hidden admin panel.

## 🚀 Features

### Frontend Website
- **Dark Catppuccin Mocha Theme** - Elite cybersecurity aesthetic
- **Interactive Terminal Elements** - Signal waves, particles, custom cursor
- **Responsive Design** - Works perfectly on all devices
- **Dynamic Content** - All content loaded from backend API
- **Smooth Animations** - Professional scroll effects and transitions

### Hidden Admin Backend
- **Secret Admin Access** - Only accessible via hidden URL
- **Complete CRUD Operations** - Manage all website content
- **Secure Authentication** - JWT-based admin login system
- **RESTful API** - Clean API endpoints for all operations
- **SQLite Database** - Lightweight, file-based database
- **Real-time Updates** - Changes reflect immediately on website

## 📋 What You Can Manage

- **Team Members** - Names, roles, skills, descriptions
- **Achievements** - CTF wins, rankings, insights, signal strength
- **Timeline Events** - Competition history with learning notes
- **Philosophy Quotes** - Team mottos and principles
- **Skills** - Team capabilities with percentage ratings

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Server
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

### 3. Access the Application
- **Website**: http://localhost:3000
- **🔒 Hidden Admin Panel**: http://localhost:3000/changehandim

### 4. Default Admin Credentials
- **Username**: `admin`
- **Password**: `admin123`

⚠️ **Important**: Change the default password immediately after first login!

## 🔒 Security Features

### Hidden Admin Access
- **Secret URL**: Admin panel only accessible via `/changehandim`
- **No Public Links**: No visible links or references to admin panel
- **JWT Authentication** - Secure token-based auth
- **Rate Limiting** - Prevents API abuse
- **Input Validation** - Protects against malicious input
- **CORS Protection** - Configurable cross-origin requests
- **Password Hashing** - bcrypt for secure password storage

## 🗄️ Database

The application uses SQLite with the following tables:
- `admins` - Admin user accounts
- `members` - Team member profiles
- `achievements` - CTF achievements and wins
- `timeline` - Competition timeline events
- `philosophy` - Team philosophy quotes
- `skills` - Team skill ratings

Database file: `silent_signal.db` (created automatically)

## 🔧 API Endpoints

### Public Endpoints (for website)
- `GET /api/public/members` - Get all team members
- `GET /api/public/achievements` - Get all achievements
- `GET /api/public/timeline` - Get timeline events
- `GET /api/public/philosophy` - Get philosophy quotes
- `GET /api/public/skills` - Get team skills

### Admin Endpoints (protected)
- `POST /api/auth/login` - Admin login
- `GET/POST/PUT/DELETE /api/admin/members` - Manage members
- `GET/POST/PUT/DELETE /api/admin/achievements` - Manage achievements
- `GET/POST/PUT/DELETE /api/admin/timeline` - Manage timeline
- `GET/POST/PUT/DELETE /api/admin/philosophy` - Manage philosophy
- `GET/POST/PUT/DELETE /api/admin/skills` - Manage skills

## 🎨 Customization

### Colors (Catppuccin Mocha)
The website uses the Catppuccin Mocha color palette:
- **Base**: #1e1e2e (Background)
- **Surface**: #313244 (Cards)
- **Blue**: #89b4fa (Primary accent)
- **Mauve**: #cba6f7 (Secondary accent)
- **Green**: #a6e3a1 (Success/achievements)
- **Red**: #f38ba8 (Danger/alerts)

### Environment Variables
Create a `.env` file for production:
```env
PORT=3000
JWT_SECRET=your-super-secure-secret-key
NODE_ENV=production
```

## 📱 Admin Panel Features

### Dashboard
- Quick overview of all content counts
- Easy navigation to different sections
- Real-time statistics

### Team Management
- Add/edit/delete team members
- Manage skills with levels (0-100)
- Upload avatar letters
- Rich text descriptions

### Achievement Tracking
- Record CTF competition results
- Signal strength indicators (1-4 bars)
- Mark achievements as active/inactive
- Detailed insights for each achievement

### Timeline Management
- Chronological event tracking
- Learning notes for each competition
- Easy date and result management

### Philosophy & Skills
- Manage team quotes and mottos
- Skill percentage tracking
- Reorderable content

## 🚀 Deployment

### Production Setup
1. Set environment variables
2. Use a process manager like PM2:
```bash
npm install -g pm2
pm2 start server.js --name "silent-signal"
```

### Database Backup
```bash
# Backup database
cp silent_signal.db backup_$(date +%Y%m%d).db

# Restore database
cp backup_20260329.db silent_signal.db
```

## 🔐 Admin Access Instructions

1. Navigate to: `http://your-domain.com/changehandim`
2. Enter admin credentials
3. Manage all website content through the admin panel
4. Changes appear immediately on the main website

**Note**: The admin panel URL (`/changehandim`) should be kept secret and only shared with authorized team members.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - Feel free to use this for your own CTF team!

## 🆘 Support

If you encounter any issues:
1. Check the console for error messages
2. Verify all dependencies are installed
3. Ensure the database file has proper permissions
4. Check that the port (3000) is available

---

**Built with ❤️ for the Silent Signal CTF Team**

*"We don't make noise. We send signals."*