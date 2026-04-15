const express = require('express');
const router = express.Router();
const { getDb } = require('../lib/mongodb');
const { hashPassword, verifyPassword, createToken } = require('../lib/auth');
const { updateStreak, getLevel } = require('../lib/xp');
const { ObjectId } = require('mongodb');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
      return res.status(400).json({ error: 'Email, name, and password are required' });
    }
    if (name.length < 2 || name.length > 50) {
      return res.status(400).json({ error: 'Name must be 2–50 characters' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const db = await getDb();
    const existing = await db.collection('users').findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const passwordHash = await hashPassword(password);
    const now = new Date();

    const userResult = await db.collection('users').insertOne({
      email: email.toLowerCase(),
      name,
      passwordHash,
      avatar: '🧠',
      createdAt: now,
      lastLoginAt: now,
      settings: { theme: 'dark', difficulty: 'beginner' },
    });

    const userId = userResult.insertedId;

    await db.collection('progress').insertOne({
      userId,
      xp: 0,
      level: 1,
      streak: 1,
      lastActiveDate: now.toISOString().split('T')[0],
      modules: {},
      completedLessons: [],
      quizResults: [],
      gameScores: {},
      simulationsCompleted: [],
      achievements: [],
      bookmarks: [],
    });

    const token = createToken({ userId: userId.toString(), email: email.toLowerCase(), name });
    res.status(201).json({ token, user: { id: userId.toString(), email: email.toLowerCase(), name, avatar: '🧠' } });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const db = await getDb();
    const user = await db.collection('users').findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const now = new Date();
    const progress = await db.collection('progress').findOne({ userId: user._id });
    const { streak, lastActiveDate } = updateStreak(
      progress?.lastActiveDate,
      progress?.streak || 0
    );

    await db.collection('users').updateOne({ _id: user._id }, { $set: { lastLoginAt: now } });
    await db.collection('progress').updateOne({ userId: user._id }, { $set: { streak, lastActiveDate } });

    const token = createToken({ userId: user._id.toString(), email: user.email, name: user.name });
    res.json({ token, user: { id: user._id.toString(), email: user.email, name: user.name, avatar: user.avatar } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

// GET /api/auth/me
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);

    const db = await getDb();
    const user = await db.collection('users').findOne({ _id: new ObjectId(decoded.userId) });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const progress = await db.collection('progress').findOne({ userId: user._id });
    res.json({
      user: { id: user._id.toString(), email: user.email, name: user.name, avatar: user.avatar },
      progress: { xp: progress?.xp || 0, level: progress?.level || 1, streak: progress?.streak || 0 },
    });
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;
