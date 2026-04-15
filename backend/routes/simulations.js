const express = require('express');
const router = express.Router();
const { getDb } = require('../lib/mongodb');
const authMiddleware = require('../middleware/auth');
const { getLevel } = require('../lib/xp');
const { ObjectId } = require('mongodb');

// POST /api/simulations/complete
router.post('/complete', authMiddleware, async (req, res) => {
  try {
    const db = await getDb();
    const { simulationId } = req.body;
    if (!simulationId) return res.status(400).json({ error: 'simulationId required' });

    const userId = new ObjectId(req.user.userId);
    const progress = await db.collection('progress').findOne({ userId });
    const alreadyDone = (progress?.simulationsCompleted || []).includes(simulationId);

    if (alreadyDone) {
      return res.json({ xpEarned: 0, totalXp: progress.xp, newAchievements: [] });
    }

    const xpEarned = 40;
    const newXp = (progress?.xp || 0) + xpEarned;
    const newLevel = getLevel(newXp);
    const newAchievements = [];

    if (!(progress?.achievements || []).includes('sim-runner')) {
      newAchievements.push('sim-runner');
    }

    await db.collection('progress').updateOne(
      { userId },
      {
        $set: { xp: newXp, level: newLevel },
        $addToSet: {
          simulationsCompleted: simulationId,
          achievements: { $each: newAchievements },
        },
      }
    );

    res.json({ xpEarned, totalXp: newXp, newAchievements });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
