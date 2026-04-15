const express = require('express');
const router = express.Router();
const { getDb } = require('../lib/mongodb');
const { ensureSeeded } = require('../lib/seed');
const authMiddleware = require('../middleware/auth');
const { getLevel } = require('../lib/xp');
const { ObjectId } = require('mongodb');
const { ACHIEVEMENTS } = require('../data/achievements');

function checkAchievements(progress, newLessonId, moduleId) {
  const unlocked = [];
  const existing = progress.achievements || [];

  const completedLessons = [...(progress.completedLessons || []), newLessonId];
  const completedModules = Object.entries(progress.modules || {})
    .filter(([, v]) => v.status === 'completed')
    .map(([k]) => k);

  const checks = [
    { id: 'first-lesson', condition: completedLessons.length >= 1 },
    { id: 'bookworm', condition: completedLessons.length >= 10 },
    { id: 'ml-explorer', condition: completedModules.includes('intro-to-ai-ml') || moduleId === 'intro-to-ai-ml' },
    { id: 'regression-pro', condition: completedModules.includes('linear-regression') || moduleId === 'linear-regression' },
  ];

  checks.forEach(({ id, condition }) => {
    if (condition && !existing.includes(id)) unlocked.push(id);
  });

  return unlocked;
}

// GET /api/lessons/:lessonId
router.get('/:lessonId', authMiddleware, async (req, res) => {
  try {
    const db = await getDb();
    await ensureSeeded(db);

    const lesson = await db.collection('lessons').findOne({ lessonId: req.params.lessonId });
    if (!lesson) return res.status(404).json({ error: 'Lesson not found' });

    const mod = await db.collection('modules').findOne({ moduleId: lesson.moduleId });
    const progress = await db.collection('progress').findOne({ userId: new ObjectId(req.user.userId) });
    const completed = (progress?.completedLessons || []).includes(lesson.lessonId);

    // Find next/prev lessons in module
    const allLessons = mod ? await db.collection('lessons')
      .find({ moduleId: lesson.moduleId })
      .sort({ order: 1 })
      .project({ lessonId: 1, title: 1, order: 1 })
      .toArray() : [];

    const idx = allLessons.findIndex(l => l.lessonId === lesson.lessonId);
    const prevLesson = idx > 0 ? { lessonId: allLessons[idx - 1].lessonId, title: allLessons[idx - 1].title } : null;
    const nextLesson = idx < allLessons.length - 1 ? { lessonId: allLessons[idx + 1].lessonId, title: allLessons[idx + 1].title } : null;

    res.json({
      lesson: {
        lessonId: lesson.lessonId,
        moduleId: lesson.moduleId,
        moduleTitle: mod?.title || '',
        moduleColor: mod?.color || '#00d4aa',
        title: lesson.title,
        type: lesson.type,
        estimatedMinutes: lesson.estimatedMinutes,
        xpReward: lesson.xpReward,
        content: lesson.content,
      },
      completed,
      prevLesson,
      nextLesson,
      quizId: lesson.type === 'quiz' ? mod?.quizId : null,
    });
  } catch (err) {
    console.error('GET /lessons/:id error:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/lessons/:lessonId/complete
router.post('/:lessonId/complete', authMiddleware, async (req, res) => {
  try {
    const db = await getDb();
    const userId = new ObjectId(req.user.userId);
    const { lessonId } = req.params;

    const lesson = await db.collection('lessons').findOne({ lessonId });
    if (!lesson) return res.status(404).json({ error: 'Lesson not found' });

    const progress = await db.collection('progress').findOne({ userId });
    const alreadyDone = (progress?.completedLessons || []).includes(lessonId);

    if (alreadyDone) {
      return res.json({ xpEarned: 0, totalXp: progress.xp, level: progress.level, moduleProgress: 0, newAchievements: [] });
    }

    const mod = await db.collection('modules').findOne({ moduleId: lesson.moduleId });
    const xpEarned = lesson.xpReward || 0;

    // Calc module progress
    const existingCompleted = progress?.completedLessons || [];
    const newCompleted = [...existingCompleted, lessonId];
    const doneInModule = mod ? mod.lessonIds.filter(lid => newCompleted.includes(lid)).length : 0;
    const moduleProgress = mod ? parseFloat((doneInModule / mod.totalLessons).toFixed(2)) : 0;
    const moduleCompleted = moduleProgress === 1.0;
    const bonusXp = moduleCompleted ? 150 : 0;
    const totalXpEarned = xpEarned + bonusXp;

    const newXp = (progress?.xp || 0) + totalXpEarned;
    const newLevel = getLevel(newXp);

    // Build module status update
    const moduleUpdate = {};
    if (mod) {
      const prevStatus = progress?.modules?.[mod.moduleId]?.status || 'available';
      moduleUpdate[`modules.${mod.moduleId}`] = {
        status: moduleCompleted ? 'completed' : 'in-progress',
        progress: moduleProgress,
        startedAt: progress?.modules?.[mod.moduleId]?.startedAt || new Date(),
        completedAt: moduleCompleted ? new Date() : null,
      };
    }

    // Check achievements
    const newAchievements = checkAchievements(
      { ...progress, completedLessons: newCompleted, modules: { ...progress?.modules, ...(mod ? { [mod.moduleId]: { status: moduleCompleted ? 'completed' : 'in-progress' } } : {}) } },
      lessonId,
      lesson.moduleId
    );

    await db.collection('progress').updateOne(
      { userId },
      {
        $set: {
          xp: newXp,
          level: newLevel,
          ...moduleUpdate,
        },
        $addToSet: {
          completedLessons: lessonId,
          achievements: { $each: newAchievements },
        },
      }
    );

    res.json({
      xpEarned: totalXpEarned,
      totalXp: newXp,
      level: newLevel,
      moduleProgress,
      moduleCompleted,
      bonusXp,
      newAchievements,
    });
  } catch (err) {
    console.error('POST /lessons/complete error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
