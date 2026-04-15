const express = require('express');
const router = express.Router();
const { getDb } = require('../lib/mongodb');
const { ensureSeeded } = require('../lib/seed');
const authMiddleware = require('../middleware/auth');
const { ObjectId } = require('mongodb');

const CATEGORY_ORDER = [
  { id: 'intro', label: '🤖 Introduction' },
  { id: 'ml-models', label: '📊 ML Models' },
  { id: 'data', label: '📁 Data' },
  { id: 'advanced', label: '🧬 Advanced ML Models' },
  { id: 'real-world', label: '🌍 Real-World ML' },
];

function isLocked(mod, userModules) {
  if (!mod.prerequisites || mod.prerequisites.length === 0) return false;
  return mod.prerequisites.some(preId => {
    const pre = userModules?.[preId];
    return !pre || pre.status !== 'completed';
  });
}

// GET /api/modules — all modules grouped by category with user progress
router.get('/', authMiddleware, async (req, res) => {
  try {
    const db = await getDb();
    await ensureSeeded(db);

    const modules = await db.collection('modules').find({}).sort({ category: 1, order: 1 }).toArray();
    const progress = await db.collection('progress').findOne({ userId: new ObjectId(req.user.userId) });
    const userModules = progress?.modules || {};

    const grouped = CATEGORY_ORDER.map(cat => ({
      id: cat.id,
      label: cat.label,
      modules: modules
        .filter(m => m.category === cat.id)
        .sort((a, b) => a.order - b.order)
        .map(m => {
          const userMod = userModules[m.moduleId];
          const locked = isLocked(m, userModules);
          const completedCount = (progress?.completedLessons || []).filter(lid =>
            m.lessonIds.includes(lid)
          ).length;
          const prog = m.totalLessons > 0 ? completedCount / m.totalLessons : 0;
          let status = 'available';
          if (locked) status = 'locked';
          else if (userMod?.status === 'completed') status = 'completed';
          else if (completedCount > 0) status = 'in-progress';

          return {
            moduleId: m.moduleId,
            title: m.title,
            description: m.description,
            icon: m.icon,
            color: m.color,
            difficulty: m.difficulty,
            tier: m.tier,
            estimatedMinutes: m.estimatedMinutes,
            totalLessons: m.totalLessons,
            progress: parseFloat(prog.toFixed(2)),
            status,
            locked,
            quizId: m.quizId,
          };
        }),
    }));

    res.json({ categories: grouped });
  } catch (err) {
    console.error('GET /modules error:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/modules/:moduleId — single module with lesson list
router.get('/:moduleId', authMiddleware, async (req, res) => {
  try {
    const db = await getDb();
    await ensureSeeded(db);

    const mod = await db.collection('modules').findOne({ moduleId: req.params.moduleId });
    if (!mod) return res.status(404).json({ error: 'Module not found' });

    const lessons = await db.collection('lessons')
      .find({ moduleId: req.params.moduleId })
      .sort({ order: 1 })
      .project({ content: 0 })
      .toArray();

    const progress = await db.collection('progress').findOne({ userId: new ObjectId(req.user.userId) });
    const completedLessons = progress?.completedLessons || [];

    const lessonsWithCompletion = lessons.map(l => ({
      lessonId: l.lessonId,
      title: l.title,
      type: l.type,
      estimatedMinutes: l.estimatedMinutes,
      order: l.order,
      completed: completedLessons.includes(l.lessonId),
    }));

    res.json({
      module: {
        moduleId: mod.moduleId,
        title: mod.title,
        description: mod.description,
        icon: mod.icon,
        color: mod.color,
        difficulty: mod.difficulty,
        tier: mod.tier,
        estimatedMinutes: mod.estimatedMinutes,
        totalLessons: mod.totalLessons,
        prerequisites: mod.prerequisites,
        quizId: mod.quizId,
      },
      lessons: lessonsWithCompletion,
    });
  } catch (err) {
    console.error('GET /modules/:id error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
