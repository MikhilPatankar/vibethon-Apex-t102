const express = require('express');
const router = express.Router();
const { getDb } = require('../lib/mongodb');
const authMiddleware = require('../middleware/auth');
const { getLevel } = require('../lib/xp');
const { ObjectId } = require('mongodb');

// GET /api/progress
router.get('/', authMiddleware, async (req, res) => {
  try {
    const db = await getDb();
    const userId = new ObjectId(req.user.userId);
    const progress = await db.collection('progress').findOne({ userId });

    if (!progress) return res.status(404).json({ error: 'Progress not found' });

    const quizResults = progress.quizResults || [];
    const passedQuizzes = quizResults.filter(q => q.passed).length;
    const avgScore = quizResults.length > 0
      ? Math.round(quizResults.reduce((sum, q) => sum + q.percentage, 0) / quizResults.length)
      : 0;

    res.json({
      xp: progress.xp,
      level: progress.level,
      streak: progress.streak,
      lastActiveDate: progress.lastActiveDate,
      modules: progress.modules,
      completedLessons: progress.completedLessons,
      quizResults: progress.quizResults,
      gameScores: progress.gameScores,
      simulationsCompleted: progress.simulationsCompleted,
      achievements: progress.achievements,
      stats: {
        totalLessonsCompleted: (progress.completedLessons || []).length,
        totalQuizzesPassed: passedQuizzes,
        totalGamesPlayed: Object.keys(progress.gameScores || {}).length,
        totalSimulations: (progress.simulationsCompleted || []).length,
        averageQuizScore: avgScore,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
