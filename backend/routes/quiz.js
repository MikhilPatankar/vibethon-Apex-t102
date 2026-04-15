const express = require('express');
const router = express.Router();
const { getDb } = require('../lib/mongodb');
const { ensureSeeded } = require('../lib/seed');
const authMiddleware = require('../middleware/auth');
const { getLevel } = require('../lib/xp');
const { ObjectId } = require('mongodb');

// GET /api/quiz/:quizId — questions WITHOUT answers
router.get('/:quizId', authMiddleware, async (req, res) => {
  try {
    const db = await getDb();
    await ensureSeeded(db);

    const quiz = await db.collection('quizzes').findOne({ quizId: req.params.quizId });
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

    const progress = await db.collection('progress').findOne({ userId: new ObjectId(req.user.userId) });
    const previousResults = (progress?.quizResults || []).filter(r => r.quizId === quiz.quizId);
    const previousBest = previousResults.length > 0
      ? previousResults.reduce((best, r) => r.percentage > best.percentage ? r : best, previousResults[0])
      : null;

    // Strip answers before sending
    const sanitizedQuestions = quiz.questions.map(q => {
      const { correctIndex, correct, explanation, ...safe } = q;
      return safe;
    });

    res.json({
      quiz: {
        quizId: quiz.quizId,
        moduleId: quiz.moduleId,
        title: quiz.title,
        timeLimit: quiz.timeLimit,
        passingScore: quiz.passingScore,
        questions: sanitizedQuestions,
      },
      previousBest: previousBest ? { score: previousBest.score, total: previousBest.total, percentage: previousBest.percentage, passed: previousBest.passed } : null,
    });
  } catch (err) {
    console.error('GET /quiz error:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/quiz/submit
router.post('/submit', authMiddleware, async (req, res) => {
  try {
    const db = await getDb();
    const { quizId, answers, timeTaken } = req.body;
    if (!quizId || !answers) return res.status(400).json({ error: 'quizId and answers required' });

    const quiz = await db.collection('quizzes').findOne({ quizId });
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

    // Grade
    let correct = 0;
    const results = quiz.questions.map(q => {
      let isCorrect = false;
      let correctAnswer;

      if (q.type === 'multiple-choice') {
        isCorrect = answers[q.id] === q.correctIndex;
        correctAnswer = q.correctIndex;
      } else if (q.type === 'true-false') {
        isCorrect = answers[q.id] === q.correct;
        correctAnswer = q.correct;
      }

      if (isCorrect) correct++;
      return {
        id: q.id,
        correct: isCorrect,
        userAnswer: answers[q.id],
        correctAnswer,
        explanation: q.explanation,
      };
    });

    const total = quiz.questions.length;
    const percentage = Math.round((correct / total) * 100);
    const passed = percentage >= quiz.passingScore;
    const isPerfect = percentage === 100;
    const isSpeedDemon = timeTaken && timeTaken < 120;

    // XP
    let xpEarned = 0;
    if (passed) xpEarned += quiz.xpReward;
    if (isPerfect) xpEarned += quiz.xpBonusPerfect;

    const userId = new ObjectId(req.user.userId);
    const progress = await db.collection('progress').findOne({ userId });

    // Only award XP if this is the first time passing
    const alreadyPassed = (progress?.quizResults || []).some(r => r.quizId === quizId && r.passed);
    if (alreadyPassed) xpEarned = 0;

    const newXp = (progress?.xp || 0) + xpEarned;
    const newLevel = getLevel(newXp);

    const newAchievements = [];
    const existing = progress?.achievements || [];
    if (isPerfect && !existing.includes('perfectionist')) newAchievements.push('perfectionist');
    if (isSpeedDemon && !existing.includes('speed-demon')) newAchievements.push('speed-demon');

    // If passed: also mark the quiz lesson complete + update module progress
    let moduleUpdate = {};
    let lessonIdToComplete = null;
    if (passed) {
      const quizLesson = await db.collection('lessons').findOne({ moduleId: quiz.moduleId, type: 'quiz' });
      if (quizLesson) {
        lessonIdToComplete = quizLesson.lessonId;
        const alreadyLessonDone = (progress?.completedLessons || []).includes(lessonIdToComplete);
        if (!alreadyLessonDone) {
          // Recalculate module progress with this lesson included
          const mod = await db.collection('modules').findOne({ moduleId: quiz.moduleId });
          if (mod) {
            const existingCompleted = progress?.completedLessons || [];
            const newCompleted = [...existingCompleted, lessonIdToComplete];
            const doneInModule = mod.lessonIds.filter(lid => newCompleted.includes(lid)).length;
            const moduleProgress = parseFloat((doneInModule / mod.totalLessons).toFixed(2));
            const moduleCompleted = moduleProgress === 1.0;
            moduleUpdate[`modules.${mod.moduleId}`] = {
              status: moduleCompleted ? 'completed' : 'in-progress',
              progress: moduleProgress,
              startedAt: progress?.modules?.[mod.moduleId]?.startedAt || new Date(),
              completedAt: moduleCompleted ? new Date() : null,
            };
            // Achievement: check for module completion
            if (moduleCompleted && !existing.includes('module-master')) {
              newAchievements.push('module-master');
            }
          }
        }
      }
    }

    const updateOp = {
      $set: { xp: newXp, level: newLevel, ...moduleUpdate },
      $push: {
        quizResults: {
          quizId,
          score: correct,
          total,
          percentage,
          passed,
          timeTaken: timeTaken || null,
          xpEarned,
          completedAt: new Date(),
        },
      },
      $addToSet: { achievements: { $each: newAchievements } },
    };

    // Add quiz lesson to completedLessons if not already there
    if (lessonIdToComplete && !(progress?.completedLessons || []).includes(lessonIdToComplete)) {
      updateOp.$addToSet.completedLessons = lessonIdToComplete;
    }

    await db.collection('progress').updateOne({ userId }, updateOp);

    res.json({ score: correct, total, percentage, passed, xpEarned, totalXp: newXp, level: newLevel, results, newAchievements });
  } catch (err) {
    console.error('POST /quiz/submit error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
