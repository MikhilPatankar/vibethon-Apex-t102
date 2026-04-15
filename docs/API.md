# API Specification

All routes are Express.js routers mounted under `backend/routes/`.
Auth-protected routes use the `authMiddleware` from `backend/middleware/auth.js`.

**Base URL:** `http://localhost:5000` (dev) / `https://elixa-api.vercel.app` (prod)

---

## Auth Middleware

File: `backend/middleware/auth.js`

```javascript
const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userId, email, name }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = authMiddleware;
```

---

## Auth Routes (`backend/routes/auth.js`)

### POST `/api/auth/register`

```
Request:  { "email": "alice@example.com", "name": "Alice", "password": "mypassword123" }
Response: { "token": "jwt...", "user": { "id": "...", "email": "...", "name": "..." } }
Errors:   400 "All fields required", 409 "Email already registered"
```

**Logic:**
1. Validate: email, name (2-50 chars), password (6+ chars)
2. Check email uniqueness in `users`
3. `bcrypt.hash(password, 10)`
4. Insert into `users` (email, name, passwordHash, avatar: "🧠", createdAt, lastLoginAt)
5. Create empty `progress` doc: `{ userId, xp: 0, level: 1, streak: 0, ... }`
6. Sign JWT: `{ userId: user._id, email, name }`, expiresIn: '7d'
7. Return token + user

### POST `/api/auth/login`

```
Request:  { "email": "...", "password": "..." }
Response: { "token": "jwt...", "user": { "id": "...", "email": "...", "name": "..." } }
Errors:   401 "Invalid email or password"
```

**Logic:**
1. Find user by email
2. `bcrypt.compare(password, user.passwordHash)`
3. Update `lastLoginAt`
4. Update streak in `progress`:
   - Same day → no change
   - Yesterday → streak + 1
   - Older → reset to 1
5. Sign JWT, return

### POST `/api/auth/logout`

```
Response: { "message": "Logged out" }
```
Client-side: remove token from localStorage. No backend action needed.

### GET `/api/auth/me` (auth required)

```
Headers:  Authorization: Bearer <token>
Response: { "user": { "id", "email", "name", "avatar" }, "progress": { "xp", "level", "streak" } }
```

---

## Module Routes (`backend/routes/modules.js`)

### GET `/api/modules` (auth required)

Returns all 15 modules grouped by category, with user's progress overlaid.

```
Response: {
  "categories": [
    {
      "id": "intro",
      "label": "🤖 Introduction",
      "modules": [{
        "moduleId": "intro-to-ai-ml",
        "title": "Introduction to AI & ML",
        "description": "...",
        "icon": "🤖", "color": "#00d4aa",
        "difficulty": "beginner", "tier": "interactive",
        "estimatedMinutes": 40, "totalLessons": 5,
        "progress": 0.6, "status": "in-progress", "locked": false
      }]
    }
  ]
}
```

**Lock logic:**
```javascript
function isLocked(mod, userModules) {
  if (!mod.prerequisites || mod.prerequisites.length === 0) return false;
  return mod.prerequisites.some(preId => {
    const pre = userModules[preId];
    return !pre || pre.status !== 'completed';
  });
}
```

**Category order + labels:**
```javascript
const CATEGORY_ORDER = [
  { id: "intro", label: "🤖 Introduction" },
  { id: "ml-models", label: "📊 ML Models" },
  { id: "data", label: "📁 Data" },
  { id: "advanced", label: "🧬 Advanced ML Models" },
  { id: "real-world", label: "🌍 Real-World ML" }
];
```

### GET `/api/modules/:moduleId` (auth required)

```
Response: {
  "module": { moduleId, title, description, color, estimatedMinutes, totalLessons },
  "lessons": [
    { "lessonId": "...", "title": "...", "type": "reading", "estimatedMinutes": 10, "order": 1, "completed": true }
  ]
}
```

---

## Lesson Routes (`backend/routes/lessons.js`)

### GET `/api/lessons/:lessonId` (auth required)

```
Response: {
  "lesson": { lessonId, moduleId, title, type, estimatedMinutes, xpReward, content: { sections: [...] } },
  "completed": false,
  "nextLesson": { "lessonId": "...", "title": "..." } | null,
  "prevLesson": { "lessonId": "...", "title": "..." } | null
}
```

**Next/Prev logic:** Query module's `lessonIds` array, find current position, return adjacent lessons.

### POST `/api/lessons/:lessonId/complete` (auth required)

```
Response: {
  "xpEarned": 25,
  "totalXp": 475,
  "level": 5,
  "moduleProgress": 0.57,
  "moduleCompleted": false,
  "newAchievements": ["first-lesson"]
}
```

**Logic:**
1. Check if lessonId already in `completedLessons` → if yes, return `{ xpEarned: 0, ... }` (no double XP)
2. Add lessonId to `progress.completedLessons` array
3. Get lesson's xpReward → add to `progress.xp`
4. Recalculate level: `Math.floor(xp / 100) + 1`
5. Get parent module → count completed lessons → calculate progress (done/total)
6. If progress === 1.0 → set module status "completed", add module bonus 150 XP
7. Check achievements (first-lesson, bookworm, ml-explorer, regression-pro)
8. Add any new achievements to `progress.achievements`
9. Return results

---

## Quiz Routes (`backend/routes/quiz.js`)

### GET `/api/quiz/:quizId` (auth required)

Returns questions WITHOUT correct answers.

```
Response: {
  "quiz": {
    "quizId": "...", "title": "...", "timeLimit": 300,
    "questions": [
      { "id": "q1", "type": "multiple-choice", "question": "...", "options": [...] }
    ]
  },
  "previousBest": { "score": 8, "total": 10 } | null
}
```

**IMPORTANT:** Strip `correctIndex`, `correct`, and `explanation` from questions before sending.

### POST `/api/quiz/submit` (auth required)

```
Request:  { "quizId": "quiz-intro-to-ai-ml", "answers": { "q1": 2, "q2": true, "q3": 0 }, "timeTaken": 145 }
Response: {
  "score": 8, "total": 10, "percentage": 80, "passed": true,
  "xpEarned": 50, "totalXp": 525,
  "results": [
    { "id": "q1", "correct": true, "userAnswer": 2, "correctAnswer": 2, "explanation": "..." }
  ],
  "newAchievements": ["perfectionist"]
}
```

**Logic:**
1. Fetch quiz from DB (with answers)
2. Grade each question:
   - `multiple-choice`: `answers[id] === question.correctIndex`
   - `true-false`: `answers[id] === question.correct`
3. Calculate percentage
4. Award XP: 50 if passed (≥70%), 100 if perfect (100%)
5. Push to `progress.quizResults`
6. Check achievements: perfectionist (100%), speed-demon (timeTaken < 120)
7. Mark quiz lesson as completed
8. Return results WITH explanations

---

## Game Routes (`backend/routes/games.js`)

### POST `/api/games/score` (auth required)

```
Request:  { "gameId": "overfitting-challenge", "score": 2000 }
Response: { "newHighScore": true, "xpEarned": 30, "totalXp": 555 }
```

**Logic:**
1. Check existing high score in `progress.gameScores[gameId]`
2. If first play → award 30 XP, check "game-on" achievement
3. If `score > existingHighScore` → update high score, return `newHighScore: true`
4. Increment `timesPlayed`

---

## Simulation Routes (`backend/routes/simulations.js`)

### POST `/api/simulations/complete` (auth required)

```
Request:  { "simulationId": "spam-detector" }
Response: { "xpEarned": 40, "totalXp": 595, "newAchievements": ["sim-runner"] }
```

**Logic:**
1. Check if already in `simulationsCompleted` → skip XP
2. Add to array, award 40 XP
3. Check "sim-runner" achievement

---

## Progress Routes (`backend/routes/progress.js`)

### GET `/api/progress` (auth required)

```
Response: {
  "xp": 595, "level": 6, "streak": 3,
  "modules": { ... }, "completedLessons": [...],
  "quizResults": [...], "gameScores": { ... },
  "simulationsCompleted": [...], "achievements": [...],
  "stats": {
    "totalLessonsCompleted": 15,
    "totalQuizzesPassed": 3,
    "totalGamesPlayed": 2,
    "totalSimulations": 1,
    "averageQuizScore": 85
  }
}
```

---

## Leaderboard Routes (`backend/routes/leaderboard.js`)

### GET `/api/leaderboard` (auth required)

```
Response: {
  "leaders": [
    { "rank": 1, "name": "Alice", "avatar": "🧠", "xp": 2500, "level": 26, "lessonsCompleted": 45, "achievementCount": 8 }
  ],
  "currentUser": { "rank": 5, "xp": 595 }
}
```

**MongoDB aggregation:**
```javascript
const leaders = await db.collection('progress').aggregate([
  { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'user' } },
  { $unwind: '$user' },
  { $sort: { xp: -1 } },
  { $limit: 20 },
  { $project: {
    name: '$user.name', avatar: '$user.avatar',
    xp: 1, level: 1,
    lessonsCompleted: { $size: { $ifNull: ['$completedLessons', []] } },
    achievementCount: { $size: { $ifNull: ['$achievements', []] } }
  }}
]).toArray();
```

---

## Achievement Routes (`backend/routes/achievements.js`)

### GET `/api/achievements` (auth required)

Returns all 10 achievements with locked/unlocked status.

```
Response: {
  "achievements": [
    { "id": "first-lesson", "title": "First Steps", "icon": "🎯", "description": "Complete your first lesson", "unlocked": true, "unlockedAt": "..." },
    { "id": "quiz-ace", "title": "Quiz Ace", "icon": "💯", "description": "Score 100% on any quiz", "unlocked": false }
  ]
}
```
