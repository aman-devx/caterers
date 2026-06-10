require('dotenv').config();

const path = require('path');
const express = require('express');
const { connectDB } = require('./config/db');
const { authenticate, requireRole } = require('./middleware/auth');
const fs = require('fs');
const { isServerless } = require('./utils/imageStore');
const authRouter = require('./routes/auth');
const caterersRouter = require('./routes/caterers');
const adminRouter = require('./routes/admin');
const catererPortalRouter = require('./routes/catererPortal');
const categoriesRouter = require('./routes/categories');
const searchRouter = require('./routes/search');

if (!process.env.JWT_SECRET) {
  console.warn('Warning: JWT_SECRET not set — using fallback (not for production)');
  process.env.JWT_SECRET = 'caterersnearme-dev-secret-change-in-production';
}

const app = express();

app.use(express.json());

if (!isServerless()) {
  const uploadsPath = path.join(__dirname, 'uploads');
  if (fs.existsSync(uploadsPath)) {
    app.use('/uploads', express.static(uploadsPath));
  }
}

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('Database connection failed:', err.message);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

app.get('/', (req, res) => {
  res.json({ message: 'Caterers Near Me API', version: '4.1.0' });
});

app.use('/api/auth', authRouter);
app.use('/api/caterers', caterersRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/search', searchRouter);
app.use('/api/admin', authenticate, requireRole('admin'), adminRouter);
app.use('/api/caterer', authenticate, requireRole('caterer'), catererPortalRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

module.exports = app;
