const { MODULES } = require('../data/modules');
const { LESSONS } = require('../data/lessons');
const { QUIZZES } = require('../data/quizzes');

let seeded = false;

async function ensureSeeded(db) {
  if (seeded) return;

  try {
    const moduleCount = await db.collection('modules').countDocuments();

    if (moduleCount === 0) {
      console.log('[SEED] Database empty — populating...');

      await db.collection('modules').insertMany(MODULES);
      console.log(`[SEED] ✓ ${MODULES.length} modules inserted`);

      await db.collection('lessons').insertMany(LESSONS);
      console.log(`[SEED] ✓ ${LESSONS.length} lessons inserted`);

      await db.collection('quizzes').insertMany(QUIZZES);
      console.log(`[SEED] ✓ ${QUIZZES.length} quizzes inserted`);

      // Create indexes
      await db.collection('modules').createIndex({ moduleId: 1 }, { unique: true });
      await db.collection('modules').createIndex({ category: 1, order: 1 });
      await db.collection('lessons').createIndex({ lessonId: 1 }, { unique: true });
      await db.collection('lessons').createIndex({ moduleId: 1, order: 1 });
      await db.collection('quizzes').createIndex({ quizId: 1 }, { unique: true });
      await db.collection('users').createIndex({ email: 1 }, { unique: true });
      await db.collection('progress').createIndex({ userId: 1 }, { unique: true });
      await db.collection('progress').createIndex({ xp: -1 });

      console.log('[SEED] ✓ Indexes created. Database ready.');
    }
  } catch (err) {
    console.error('[SEED] Error during seeding:', err.message);
  }

  seeded = true;
}

async function reseed(db) {
  seeded = false;
  await db.collection('modules').deleteMany({});
  await db.collection('lessons').deleteMany({});
  await db.collection('quizzes').deleteMany({});
  await ensureSeeded(db);
}

module.exports = { ensureSeeded, reseed };
