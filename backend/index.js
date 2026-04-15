require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const moduleRoutes = require('./routes/modules');
const lessonRoutes = require('./routes/lessons');
const quizRoutes = require('./routes/quiz');
const progressRoutes = require('./routes/progress');
const leaderboardRoutes = require('./routes/leaderboard');
const gameRoutes = require('./routes/games');
const simulationRoutes = require('./routes/simulations');
const achievementRoutes = require('./routes/achievements');
const { getDb } = require('./lib/mongodb');
const { ensureSeeded } = require('./lib/seed');
const { reseed } = require('./lib/seed');

const app = express();

// ── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://localhost:3000',
    'http://localhost:3001',
  ],
  credentials: true,
}));
app.use(express.json({ limit: '2mb' }));

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/simulations', simulationRoutes);
app.use('/api/achievements', achievementRoutes);

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/api', (req, res) => {
  res.json({ status: 'ok', name: 'Elixa API', version: '1.0.0', timestamp: new Date().toISOString() });
});

// ── Dev: force reseed ─────────────────────────────────────────────────────────
app.get('/api/seed', async (req, res) => {
  try {
    const db = await getDb();
    await reseed(db);
    res.json({ message: 'Database reseeded successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── 404 fallback ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

// ── Error handler ─────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ── Startup: connect DB + seed ────────────────────────────────────────────────
async function start() {
  try {
    const db = await getDb();
    await ensureSeeded(db);
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`[SERVER] Elixa API running on http://localhost:${PORT}`);
      console.log(`[SERVER] Health: http://localhost:${PORT}/api`);
    });
  } catch (err) {
    console.error('[SERVER] Failed to start:', err);
    process.exit(1);
  }
}

// Only listen in dev — Vercel uses module.exports
if (process.env.NODE_ENV !== 'production') {
  start();
} else {
  // For Vercel: still seed on first request
  getDb().then(db => ensureSeeded(db)).catch(console.error);
}

module.exports = app;
