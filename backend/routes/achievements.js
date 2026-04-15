const express = require('express');
const router = express.Router();
const { getDb } = require('../lib/mongodb');
const authMiddleware = require('../middleware/auth');
const { ACHIEVEMENTS } = require('../data/achievements');
const { ObjectId } = require('mongodb');

// GET /api/achievements
router.get('/', authMiddleware, async (req, res) => {
  try {
    const db = await getDb();
    const userId = new ObjectId(req.user.userId);
    const progress = await db.collection('progress').findOne({ userId });
    const unlocked = progress?.achievements || [];

    const all = ACHIEVEMENTS.map(a => ({
      ...a,
      unlocked: unlocked.includes(a.id),
    }));

    res.json({ achievements: all });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
