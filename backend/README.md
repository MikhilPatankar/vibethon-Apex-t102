# Elixa — Backend

Express 5 REST API for the Elixa ML education platform. Handles authentication, lesson/module delivery, progress tracking, quiz scoring, leaderboard, and achievements. Persists data in MongoDB Atlas.

---

## Setup

### Prerequisites

- Node.js v18+
- MongoDB Atlas cluster (free tier M0 is sufficient)

### Install and run

```bash
npm install
```

Create `.env` in this directory (copy from `.env.example`):

```env
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/?appName=Elixa
JWT_SECRET=<random-string-at-least-32-chars>
FRONTEND_URL=http://localhost:3000
PORT=5000
NODE_ENV=development
```

```bash
npm run dev      # node --watch (auto-restart on file changes)
npm run start    # production
```

The API runs at `http://localhost:5000`. On first start, the database is seeded automatically with 15 modules, all lessons, and quizzes.

---

## Project Structure

```
backend/
├── index.js              Entry point: Express app, middleware, route mounting
├── middleware/
│   └── auth.js           JWT verification middleware
├── lib/
│   ├── mongodb.js        MongoDB connection singleton
│   ├── seed.js           ensureSeeded() + reseed() helpers
│   └── auth.js           Token utilities
├── routes/
│   ├── auth.js           POST /register, POST /login, GET /me
│   ├── modules.js        GET /modules, GET /modules/:id
│   ├── lessons.js        GET /lessons/:id, POST /lessons/:id/complete
│   ├── quiz.js           GET /quiz/:id, POST /quiz/:id/submit
│   ├── progress.js       GET /progress
│   ├── leaderboard.js    GET /leaderboard
│   ├── achievements.js   GET /achievements
│   ├── games.js          POST /games/:id/score
│   └── simulations.js    POST /simulations/:id/complete
└── data/
    ├── modules.js        15 module definitions with metadata
    ├── lessons.js        All lesson content (sections, interactives, code labs)
    ├── quizzes.js        Quiz questions and correct answers
    └── achievements.js   Achievement definitions
```

---

## API Reference

All authenticated routes require the header:

```
Authorization: Bearer <token>
```

### Authentication

| Method | Endpoint | Auth | Body | Returns |
|---|---|---|---|---|
| POST | `/api/auth/register` | No | `{ name, email, password, avatar }` | `{ token, user }` |
| POST | `/api/auth/login` | No | `{ email, password }` | `{ token, user }` |
| GET | `/api/auth/me` | Yes | — | `{ user, progress }` |

### Modules

| Method | Endpoint | Auth | Returns |
|---|---|---|---|
| GET | `/api/modules` | Yes | All modules grouped by category with user progress |
| GET | `/api/modules/:moduleId` | Yes | Module + lessons with completion status |

### Lessons

| Method | Endpoint | Auth | Body | Returns |
|---|---|---|---|---|
| GET | `/api/lessons/:lessonId` | Yes | — | Full lesson content |
| POST | `/api/lessons/:lessonId/complete` | Yes | — | `{ xpEarned, newXp, newLevel, achievements }` |

### Quiz

| Method | Endpoint | Auth | Body | Returns |
|---|---|---|---|---|
| GET | `/api/quiz/:quizId` | Yes | — | Questions (correct index hidden) |
| POST | `/api/quiz/:quizId/submit` | Yes | `{ answers: [0,2,1,...] }` | `{ score, total, percentage, passed, xpEarned }` |

### Progress

| Method | Endpoint | Auth | Returns |
|---|---|---|---|
| GET | `/api/progress` | Yes | Full progress document (XP, level, streak, stats, quiz results) |

### Leaderboard

| Method | Endpoint | Auth | Returns |
|---|---|---|---|
| GET | `/api/leaderboard` | Yes | `{ leaders: [...], currentUser: { rank, xp } }` |

### Achievements

| Method | Endpoint | Auth | Returns |
|---|---|---|---|
| GET | `/api/achievements` | Yes | All achievements with `unlocked: true/false` per user |

### Dev / Admin

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api` | No | Health check |
| GET | `/api/seed` | No | Drop and re-insert modules, lessons, quizzes (does not affect users or progress) |

---

## Data Model

### User

```js
{
  _id, name, email, passwordHash,
  avatar,              // emoji string
  createdAt
}
```

### Progress (one document per user)

```js
{
  userId,
  xp,                  // total XP earned
  level,               // derived: Math.floor(xp / 100) + 1
  streak,              // days in a row with activity
  lastActivityDate,
  completedLessons,    // [lessonId, ...]
  completedModules,    // [moduleId, ...]
  achievements,        // [achievementId, ...]
  quizResults,         // [{ quizId, score, total, percentage, passed, xpEarned }]
  stats: {
    totalLessonsCompleted,
    totalQuizzesPassed,
    totalXpEarned
  }
}
```

### Module

```js
{
  moduleId, title, icon, description, category,
  difficulty,          // beginner | intermediate | advanced
  estimatedHours,
  color,               // CSS color for UI accents
  prerequisites,       // [moduleId, ...]
  order,
  quizId
}
```

### Lesson

```js
{
  lessonId, moduleId, title,
  type,                // reading | interactive | code-lab | game | quiz
  estimatedMinutes,
  xpReward,
  order,
  content: {
    sections: [
      { type: 'heading', level: 2, text: '...' },
      { type: 'text', body: '...' },
      { type: 'code', language: 'python', code: '...' },
      { type: 'callout', style: 'tip|warning|note', body: '...' },
      { type: 'list', style: 'unordered', items: [...] },
      { type: 'key-takeaways', points: [...] },
      { type: 'check-understanding', question, options, correctIndex, explanation }
    ]
  }
}
```

---

## Seeding

On startup, `ensureSeeded()` checks if the `modules` collection is empty. If so, it inserts all data and creates indexes. This runs once and is idempotent.

To force a reseed (e.g. after updating lesson content):

```bash
curl http://localhost:5000/api/seed
```

Only `modules`, `lessons`, and `quizzes` collections are dropped and re-created. User accounts and progress records are untouched.

---

## Dependencies

| Package | Purpose |
|---|---|
| `express` 5 | HTTP framework |
| `mongodb` 7 | Native MongoDB driver |
| `jsonwebtoken` 9 | JWT signing and verification |
| `bcryptjs` 3 | Password hashing |
| `cors` 2 | Cross-origin request handling |
| `dotenv` 17 | Environment variable loading |
| `cookie-parser` 1 | Cookie support |
