const express = require('express');
const router = express.Router();
const { getDb } = require('../lib/mongodb');
const authMiddleware = require('../middleware/auth');
const { getLevel } = require('../lib/xp');
const { ObjectId } = require('mongodb');

// GET /api/leaderboard
router.get('/', authMiddleware, async (req, res) => {
  try {
    const db = await getDb();

    const leaders = await db.collection('progress').aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      { $sort: { xp: -1 } },
      { $limit: 20 },
      {
        $project: {
          name: '$user.name',
          avatar: '$user.avatar',
          xp: 1,
          level: 1,
          lessonsCompleted: { $size: { $ifNull: ['$completedLessons', []] } },
          achievementCount: { $size: { $ifNull: ['$achievements', []] } },
          userId: 1,
        },
      },
    ]).toArray();

    const ranked = leaders.map((l, i) => ({ ...l, rank: i + 1, _id: undefined, userId: undefined }));

    // Find current user's rank
    const userId = new ObjectId(req.user.userId);
    const userProgress = await db.collection('progress').findOne({ userId });
    const allAbove = await db.collection('progress').countDocuments({ xp: { $gt: userProgress?.xp || 0 } });
    const currentUserRank = allAbove + 1;

    res.json({ leaders: ranked, currentUser: { rank: currentUserRank, xp: userProgress?.xp || 0 } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
