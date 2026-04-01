const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'silent-signal-secret-key-2026-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Initialize SQLite Database
const db = new sqlite3.Database('./silent_signal.db');

// Create tables
db.serialize(() => {
  // Admin users table
  db.run(`CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Team members table
  db.run(`CREATE TABLE IF NOT EXISTS members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    alias TEXT,
    role TEXT NOT NULL,
    description TEXT,
    skills TEXT, -- JSON array of skills
    avatar_letter TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Achievements table
  db.run(`CREATE TABLE IF NOT EXISTS achievements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    rank TEXT NOT NULL,
    year TEXT NOT NULL,
    insight TEXT,
    signal_strength INTEGER DEFAULT 3,
    is_active BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Timeline events table
  db.run(`CREATE TABLE IF NOT EXISTS timeline (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    title TEXT NOT NULL,
    result TEXT NOT NULL,
    learning TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Philosophy quotes table
  db.run(`CREATE TABLE IF NOT EXISTS philosophy (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quote TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Skills table
  db.run(`CREATE TABLE IF NOT EXISTS skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    percentage INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Contact messages table
  db.run(`CREATE TABLE IF NOT EXISTS contact_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Insert default admin user (password: admin123)
  const hashedPassword = bcrypt.hashSync('admin123', 10);
  db.run(`INSERT OR IGNORE INTO admins (username, password) VALUES (?, ?)`, 
    ['admin', hashedPassword]);

  // Insert default data
  insertDefaultData();
});

function insertDefaultData() {
  // Default members
  db.run(`INSERT OR IGNORE INTO members (name, alias, role, description, skills, avatar_letter) VALUES 
    (?, ?, ?, ?, ?, ?)`, [
    'Pankaj Kshetri', 'baje', 'Web Exploitation & OSINT Specialist',
    'Focused on uncovering hidden surfaces through Web Exploitation and OSINT. Specializes in reconnaissance and information extraction, turning digital breadcrumbs into actionable intelligence.',
    JSON.stringify([
      { name: 'Web Exploitation', level: 95 },
      { name: 'OSINT', level: 92 }
    ]),
    'P'
  ]);

  db.run(`INSERT OR IGNORE INTO members (name, alias, role, description, skills, avatar_letter) VALUES 
    (?, ?, ?, ?, ?, ?)`, [
    'Diwas Awasthi', '', 'Pwn & Web Exploitation Specialist',
    'Precision-driven exploitation specialist working in Pwn and Web domains. Breaks systems at their core, finding vulnerabilities in the deepest layers of software architecture.',
    JSON.stringify([
      { name: 'Binary Exploitation', level: 90 },
      { name: 'Web Exploitation', level: 88 }
    ]),
    'D'
  ]);

  // Default achievement
  db.run(`INSERT OR IGNORE INTO achievements (name, rank, year, insight, signal_strength, is_active) VALUES 
    (?, ?, ?, ?, ?, ?)`, [
    'TexSaw CTF 2026',
    '83rd',
    'Currently Active - 83rd/510 teams',
    'First major CTF operation. Demonstrating systematic approach to multi-domain challenges while building team coordination protocols.',
    3,
    1
  ]);

  // Default timeline
  db.run(`INSERT OR IGNORE INTO timeline (date, title, result, learning) VALUES 
    (?, ?, ?, ?)`, [
    'March 27-29, 2026',
    'TexSaw CTF 2026',
    'Currently Active - 83rd/510 teams',
    'First major CTF operation. Learning team dynamics, challenge prioritization, and developing systematic approaches to multi-domain cybersecurity challenges.'
  ]);

  // Default philosophy
  const philosophyQuotes = [
    'We don\'t make noise. We send signals.',
    'Every vulnerability tells a story.',
    'Precision over volume.'
  ];
  
  philosophyQuotes.forEach((quote, index) => {
    db.run(`INSERT OR IGNORE INTO philosophy (quote, order_index) VALUES (?, ?)`, [quote, index]);
  });
}
// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Auth Routes
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  db.get('SELECT * FROM admins WHERE username = ?', [username], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, username: user.username });
  });
});

// Public API Routes (for frontend)
app.get('/api/public/members', (req, res) => {
  db.all('SELECT * FROM members ORDER BY created_at', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    const members = rows.map(member => ({
      ...member,
      skills: JSON.parse(member.skills || '[]')
    }));
    
    res.json(members);
  });
});

app.get('/api/public/achievements', (req, res) => {
  db.all('SELECT * FROM achievements ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

app.get('/api/public/timeline', (req, res) => {
  db.all('SELECT * FROM timeline ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

app.get('/api/public/philosophy', (req, res) => {
  db.all('SELECT * FROM philosophy ORDER BY order_index', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

// Contact form submission (public)
app.post('/api/public/contact', (req, res) => {
  const { name, email, message } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  db.run(`INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)`,
    [name, email, message],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ message: 'Message transmitted successfully', id: this.lastID });
    }
  );
});

// Admin API Routes (protected) - Members
app.get('/api/admin/members', authenticateToken, (req, res) => {
  db.all('SELECT * FROM members ORDER BY created_at', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    const members = rows.map(member => ({
      ...member,
      skills: JSON.parse(member.skills || '[]')
    }));
    
    res.json(members);
  });
});

app.post('/api/admin/members', authenticateToken, (req, res) => {
  const { name, alias, role, description, skills, avatar_letter } = req.body;
  
  if (!name || !role) {
    return res.status(400).json({ error: 'Name and role are required' });
  }

  const skillsJson = JSON.stringify(skills || []);
  
  db.run(`INSERT INTO members (name, alias, role, description, skills, avatar_letter, updated_at) 
          VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
    [name, alias || '', role, description || '', skillsJson, avatar_letter || name.charAt(0)],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ id: this.lastID, message: 'Member created successfully' });
    }
  );
});

// Admin API Routes - Achievements
app.get('/api/admin/achievements', authenticateToken, (req, res) => {
  db.all('SELECT * FROM achievements ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

app.post('/api/admin/achievements', authenticateToken, (req, res) => {
  const { name, rank, year, insight, signal_strength, is_active } = req.body;
  
  if (!name || !rank || !year) {
    return res.status(400).json({ error: 'Name, rank, and year are required' });
  }

  db.run(`INSERT INTO achievements (name, rank, year, insight, signal_strength, is_active, updated_at) 
          VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
    [name, rank, year, insight || '', signal_strength || 3, is_active || 0],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ id: this.lastID, message: 'Achievement created successfully' });
    }
  );
});

// Admin API Routes - Messages
app.get('/api/admin/messages', authenticateToken, (req, res) => {
  db.all('SELECT * FROM contact_messages ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

app.delete('/api/admin/messages/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM contact_messages WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.json({ message: 'Message deleted successfully' });
  });
});

// Serve admin panel (hidden route)
app.get('/changehandim', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Serve main website
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Silent Signal Backend running on port ${PORT}`);
  console.log(`🌐 Website: http://localhost:${PORT}`);
  console.log(`🔒 Admin Panel: http://localhost:${PORT}/changehandim`);
  console.log(`🔑 Default admin credentials: admin / admin123`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('✅ Database connection closed.');
    }
    process.exit(0);
  });
});