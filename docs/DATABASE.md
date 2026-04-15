# Database Schema & Seed Strategy

## Connection: MongoDB Atlas (Free M0)

### Singleton Connection Pattern (CRITICAL for Vercel Serverless)

File: `backend/lib/mongodb.js`

```javascript
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
let client;
let db;

async function getDb() {
  if (db) return db;
  
  if (!uri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }
  
  client = new MongoClient(uri);
  await client.connect();
  db = client.db('elixa');
  console.log('[DB] Connected to MongoDB Atlas');
  return db;
}

module.exports = { getDb };
```

For Vercel serverless, the connection persists across warm invocations within the same instance. Cold starts reconnect.

### Usage in any route:

```javascript
const { getDb } = require('../lib/mongodb');
const { ensureSeeded } = require('../lib/seed');

router.get('/', async (req, res) => {
  try {
    const db = await getDb();
    await ensureSeeded(db);
    
    const modules = await db.collection('modules').find({}).sort({ category: 1, order: 1 }).toArray();
    res.json({ modules });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
```

---

## Database: `elixa`

### Collection 1: `users`

```javascript
{
  _id: ObjectId,
  email: "alice@example.com",       // UNIQUE
  name: "Alice",
  passwordHash: "$2b$10$...",       // bcrypt (10 rounds)
  avatar: "🧠",
  createdAt: ISODate,
  lastLoginAt: ISODate,
  settings: { theme: "dark", difficulty: "beginner" }
}
```
**Indexes:** `{ email: 1 }` unique

### Collection 2: `progress`

One doc per user. All learning state.

```javascript
{
  _id: ObjectId,
  userId: ObjectId,                  // → users._id UNIQUE
  xp: 450,
  level: 5,                         // floor(xp / 100) + 1
  streak: 3,
  lastActiveDate: "2026-04-15",     // YYYY-MM-DD
  modules: {
    "intro-to-ai-ml": { status: "completed", progress: 1.0, completedAt: ISODate },
    "linear-regression": { status: "in-progress", progress: 0.43 }
  },
  completedLessons: ["intro-what-is-ai", "intro-what-is-ml"],
  quizResults: [
    { quizId: "quiz-intro-to-ai-ml", score: 9, total: 10, percentage: 90, passed: true, xpEarned: 50, completedAt: ISODate }
  ],
  gameScores: {
    "overfitting-challenge": { highScore: 2000, timesPlayed: 3 }
  },
  simulationsCompleted: ["spam-detector"],
  achievements: ["first-lesson", "quiz-ace"],
  bookmarks: []
}
```
**Indexes:** `{ userId: 1 }` unique, `{ xp: -1 }` for leaderboard

### Collection 3: `modules`

15 docs. Seeded from `data/modules.js`. Never user-modified.

```javascript
{
  _id: ObjectId,
  moduleId: "linear-regression",
  category: "ml-models",
  title: "Linear Regression",
  description: "Learn linear models, loss functions, gradient descent, and hyperparameters.",
  icon: "📈",
  color: "#3b82f6",
  difficulty: "beginner",
  tier: "interactive",
  estimatedMinutes: 80,
  order: 2,
  prerequisites: ["intro-to-ai-ml"],
  lessonIds: ["linreg-intro", "linreg-loss", "linreg-params-exercise", "linreg-gradient-descent", "linreg-hyperparameters", "linreg-code-lab", "linreg-quiz"],
  quizId: "quiz-linear-regression",
  totalLessons: 7
}
```
**Indexes:** `{ moduleId: 1 }` unique, `{ category: 1, order: 1 }`

### Collection 4: `lessons`

~70 docs. Seeded from `data/lessons.js`.

```javascript
{
  _id: ObjectId,
  lessonId: "linreg-loss",
  moduleId: "linear-regression",
  title: "Loss Functions: MSE & MAE",
  type: "reading",
  estimatedMinutes: 10,
  xpReward: 25,
  order: 2,
  content: { sections: [ /* see CURRICULUM.md for section format */ ] }
}
```
**Indexes:** `{ lessonId: 1 }` unique, `{ moduleId: 1, order: 1 }`

### Collection 5: `quizzes`

15 docs. Seeded from `data/quizzes.js`.

```javascript
{
  _id: ObjectId,
  quizId: "quiz-intro-to-ai-ml",
  moduleId: "intro-to-ai-ml",
  title: "Introduction to AI & ML: Test Your Knowledge",
  timeLimit: 300,
  passingScore: 70,
  xpReward: 50,
  xpBonusPerfect: 100,
  questions: [
    { id: "q1", type: "multiple-choice", question: "...", options: [...], correctIndex: 2, explanation: "..." },
    { id: "q2", type: "true-false", question: "...", correct: true, explanation: "..." }
  ]
}
```
**Indexes:** `{ quizId: 1 }` unique

### Collection 6: `code_snippets`

User-saved code. Created by user actions.

```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  title: "My Linear Regression",
  code: "import numpy as np...",
  language: "python",
  lessonId: "linreg-code-lab",
  createdAt: ISODate
}
```
**Indexes:** `{ userId: 1, createdAt: -1 }`

---

## Auto-Seed Implementation

File: `backend/lib/seed.js`

```javascript
const { MODULES } = require('../data/modules');
const { LESSONS } = require('../data/lessons');
const { QUIZZES } = require('../data/quizzes');

let seeded = false;

async function ensureSeeded(db) {
  if (seeded) return;
  
  try {
    const moduleCount = await db.collection('modules').countDocuments();
    
    if (moduleCount === 0) {
      console.log('[SEED] Database empty. Populating...');
      
      if (MODULES.length > 0) {
        await db.collection('modules').insertMany(MODULES);
        console.log('[SEED] Inserted ' + MODULES.length + ' modules');
      }
      
      if (LESSONS.length > 0) {
        await db.collection('lessons').insertMany(LESSONS);
        console.log('[SEED] Inserted ' + LESSONS.length + ' lessons');
      }
      
      if (QUIZZES.length > 0) {
        await db.collection('quizzes').insertMany(QUIZZES);
        console.log('[SEED] Inserted ' + QUIZZES.length + ' quizzes');
      }
      
      // Create indexes
      await db.collection('modules').createIndex({ moduleId: 1 }, { unique: true });
      await db.collection('modules').createIndex({ category: 1, order: 1 });
      await db.collection('lessons').createIndex({ lessonId: 1 }, { unique: true });
      await db.collection('lessons').createIndex({ moduleId: 1, order: 1 });
      await db.collection('quizzes').createIndex({ quizId: 1 }, { unique: true });
      await db.collection('users').createIndex({ email: 1 }, { unique: true });
      await db.collection('progress').createIndex({ userId: 1 }, { unique: true });
      await db.collection('progress').createIndex({ xp: -1 });
      
      console.log('[SEED] Database ready.');
    }
  } catch (err) {
    console.error('[SEED] Error:', err.message);
  }
  
  seeded = true;
}

module.exports = { ensureSeeded };
```

### Key behaviors:
- **Idempotent**: Only seeds when `modules` collection has 0 documents
- **Fast**: After first check, `seeded = true` flag skips DB query
- **Called everywhere**: Every route's handler calls `ensureSeeded(db)` first
- **Fresh deploy**: Push to Vercel → first request auto-populates everything → works immediately
