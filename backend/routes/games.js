const express = require('express');
const router = express.Router();
const { getDb } = require('../lib/mongodb');
const authMiddleware = require('../middleware/auth');
const { getLevel } = require('../lib/xp');
const { ObjectId } = require('mongodb');

// POST /api/games/score
router.post('/score', authMiddleware, async (req, res) => {
  try {
    const db = await getDb();
    const { gameId, score, metadata } = req.body;
    if (!gameId || score === undefined) return res.status(400).json({ error: 'gameId and score required' });

    const userId = new ObjectId(req.user.userId);
    const progress = await db.collection('progress').findOne({ userId });
    const existing = progress?.gameScores?.[gameId];
    const isNewHighScore = !existing || score > existing.highScore;
    const isFirstPlay = !existing;

    let xpEarned = 0;
    const newAchievements = [];

    if (isFirstPlay) {
      xpEarned = 30;
      if (!(progress?.achievements || []).includes('game-on')) {
        newAchievements.push('game-on');
      }
    }

    const newXp = (progress?.xp || 0) + xpEarned;
    const newLevel = getLevel(newXp);

    const update = {
      $set: {
        xp: newXp,
        level: newLevel,
        [`gameScores.${gameId}.timesPlayed`]: (existing?.timesPlayed || 0) + 1,
        [`gameScores.${gameId}.lastPlayed`]: new Date(),
      },
      $addToSet: { achievements: { $each: newAchievements } },
    };

    if (isNewHighScore) {
      update.$set[`gameScores.${gameId}.highScore`] = score;
      if (metadata) update.$set[`gameScores.${gameId}.metadata`] = metadata;
    }

    await db.collection('progress').updateOne({ userId }, update);

    res.json({ newHighScore: isNewHighScore, xpEarned, totalXp: newXp, newAchievements });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
