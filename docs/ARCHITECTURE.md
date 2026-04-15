# Architecture

## Monorepo — Decoupled Frontend & Backend

```
elixa.vercel.app           → Frontend (Next.js)    ← Vercel Project 1
elixa-api.vercel.app       → Backend  (Express.js) ← Vercel Project 2
MongoDB Atlas (Free M0)    → Cloud database
```

**Same GitHub repo. Two Vercel deployments. Independent scaling.**

Frontend calls backend via `NEXT_PUBLIC_API_URL` env var. Backend handles all DB logic, auth, and data. Frontend is purely UI.

---

## Tech Stack

| Layer | Technology | Location |
|-------|-----------|----------|
| **Frontend** | Next.js 14 (App Router) + React 18 | `frontend/` |
| **Styling** | CSS Modules + globals.css | `frontend/` |
| **Backend** | Express.js | `backend/` |
| **Database** | MongoDB Atlas (Free M0) | Cloud |
| **DB Driver** | mongodb native driver 6.x | `backend/` |
| **Auth** | bcryptjs + jsonwebtoken | `backend/` |
| **CORS** | cors package | `backend/` |
| **Python (browser)** | Pyodide 0.24.x (CDN) | `frontend/` |
| **ML Inference** | TensorFlow.js 4.x (CDN) | `frontend/` |
| **Fonts** | Google Fonts (Inter + JetBrains Mono) | `frontend/` |
| **Deployment** | Vercel (×2) | Both |

---

## Environment Variables

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```
Production: `NEXT_PUBLIC_API_URL=https://elixa-api.vercel.app`

### Backend (`backend/.env`)
```env
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/elixa?retryWrites=true&w=majority
JWT_SECRET=your-random-secret-string-min-32-chars
FRONTEND_URL=http://localhost:3000
PORT=5000
```
Production: `FRONTEND_URL=https://elixa.vercel.app`

---

## Project Structure

```
Elixa/
├── frontend/                           # ← Vercel Project 1 (Root: frontend/)
│   ├── app/
│   │   ├── globals.css                 # Design system
│   │   ├── layout.js                   # Root layout: fonts, navbar
│   │   ├── page.js                     # Landing page
│   │   ├── login/page.js
│   │   ├── register/page.js
│   │   ├── dashboard/page.js
│   │   ├── modules/
│   │   │   ├── page.js                 # All modules browser
│   │   │   └── [moduleId]/
│   │   │       ├── page.js             # Module detail
│   │   │       └── [lessonId]/page.js  # Lesson viewer
│   │   ├── quiz/[quizId]/page.js
│   │   ├── playground/page.js
│   │   ├── games/
│   │   │   ├── page.js
│   │   │   └── [gameId]/page.js
│   │   ├── simulations/
│   │   │   ├── page.js
│   │   │   ├── spam-detector/page.js
│   │   │   └── image-classifier/page.js
│   │   ├── leaderboard/page.js
│   │   └── profile/page.js
│   │
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── ModuleCard.jsx
│   │   ├── LessonRenderer.jsx
│   │   ├── ProgressRing.jsx
│   │   ├── QuizEngine.jsx
│   │   ├── CodeEditor.jsx
│   │   ├── LeaderboardTable.jsx
│   │   ├── AchievementBadge.jsx
│   │   ├── Toast.jsx
│   │   └── games/
│   │       ├── OverfittingGame.jsx
│   │       └── NeuralNetGame.jsx
│   │
│   ├── lib/
│   │   └── api.js                      # API client (fetch wrapper)
│   │
│   ├── public/images/
│   ├── next.config.js
│   ├── package.json
│   └── .env.local
│
├── backend/                            # ← Vercel Project 2 (Root: backend/)
│   ├── index.js                        # Express app entry point
│   ├── routes/
│   │   ├── auth.js                     # /api/auth/*
│   │   ├── modules.js                  # /api/modules/*
│   │   ├── lessons.js                  # /api/lessons/*
│   │   ├── quiz.js                     # /api/quiz/*
│   │   ├── progress.js                 # /api/progress
│   │   ├── leaderboard.js              # /api/leaderboard
│   │   ├── games.js                    # /api/games/*
│   │   ├── simulations.js              # /api/simulations/*
│   │   └── achievements.js             # /api/achievements
│   │
│   ├── middleware/
│   │   └── auth.js                     # JWT verification middleware
│   │
│   ├── lib/
│   │   ├── mongodb.js                  # Connection singleton
│   │   ├── seed.js                     # Auto-seed on first connect
│   │   └── xp.js                       # XP/level helpers
│   │
│   ├── data/
│   │   ├── modules.js                  # 15 module definitions
│   │   ├── lessons.js                  # All lesson content
│   │   ├── quizzes.js                  # Quiz question banks
│   │   └── achievements.js             # Badge definitions
│   │
│   ├── vercel.json                     # Vercel serverless config
│   ├── package.json
│   └── .env
│
├── docs/                               # Documentation (this folder)
│   ├── ARCHITECTURE.md
│   ├── DATABASE.md
│   ├── API.md
│   ├── DESIGN.md
│   ├── COMPONENTS.md
│   ├── PHASES.md
│   ├── INTERACTIVE.md
│   └── CURRICULUM.md
│
├── .gitignore
└── README.md
```

---

## Backend: Express.js on Vercel

### Entry Point (`backend/index.js`)

```javascript
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const moduleRoutes = require('./routes/modules');
const lessonRoutes = require('./routes/lessons');
const quizRoutes = require('./routes/quiz');
const progressRoutes = require('./routes/progress');
const leaderboardRoutes = require('./routes/leaderboard');
const gameRoutes = require('./routes/games');
const simulationRoutes = require('./routes/simulations');
const achievementRoutes = require('./routes/achievements');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true  // IMPORTANT: allows cookies cross-origin
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/simulations', simulationRoutes);
app.use('/api/achievements', achievementRoutes);

// Health check
app.get('/api', (req, res) => {
  res.json({ status: 'ok', name: 'Elixa API', version: '1.0.0' });
});

// Local dev
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`API running on port ${PORT}`));
}

module.exports = app;
```

### Vercel Config (`backend/vercel.json`)

```json
{
  "version": 2,
  "builds": [
    { "src": "index.js", "use": "@vercel/node" }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "index.js" }
  ]
}
```

### Backend Dependencies (`backend/package.json`)

```json
{
  "name": "elixa-api",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "dev": "node --watch index.js",
    "start": "node index.js"
  },
  "dependencies": {
    "express": "^4.18.0",
    "cors": "^2.8.5",
    "mongodb": "^6.0.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.0",
    "cookie-parser": "^1.4.6"
  }
}
```

---

## Frontend: API Client

Since backend is separate, all API calls go through a centralized client.

### `frontend/lib/api.js`

```javascript
const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function request(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  const config = {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',  // IMPORTANT: sends cookies cross-origin
    ...options,
  };

  const res = await fetch(url, config);
  const data = await res.json();
  
  if (!res.ok) {
    throw new Error(data.error || 'API request failed');
  }
  return data;
}

// Auth
export const api = {
  register: (body) => request('/api/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/api/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  logout: () => request('/api/auth/logout', { method: 'POST' }),
  getMe: () => request('/api/auth/me'),

  // Modules
  getModules: () => request('/api/modules'),
  getModule: (id) => request(`/api/modules/${id}`),

  // Lessons
  getLesson: (id) => request(`/api/lessons/${id}`),
  completeLesson: (id) => request(`/api/lessons/${id}/complete`, { method: 'POST' }),

  // Quiz
  getQuiz: (id) => request(`/api/quiz/${id}`),
  submitQuiz: (body) => request('/api/quiz/submit', { method: 'POST', body: JSON.stringify(body) }),

  // Games
  saveGameScore: (body) => request('/api/games/score', { method: 'POST', body: JSON.stringify(body) }),

  // Simulations
  completeSimulation: (body) => request('/api/simulations/complete', { method: 'POST', body: JSON.stringify(body) }),

  // Progress
  getProgress: () => request('/api/progress'),

  // Leaderboard
  getLeaderboard: () => request('/api/leaderboard'),

  // Achievements
  getAchievements: () => request('/api/achievements'),
};
```

### Frontend Dependencies (`frontend/package.json`)

```json
{
  "name": "elixa-frontend",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  }
}
```

---

## Vercel Deployment (Two Projects)

### Project 1: Frontend
1. Go to Vercel → New Project → Import `Elixa` repo
2. **Root Directory**: `frontend`
3. **Framework**: Next.js (auto-detected)
4. **Environment Variables**: `NEXT_PUBLIC_API_URL = https://elixa-api.vercel.app`
5. Deploy

### Project 2: Backend
1. Go to Vercel → New Project → Import SAME `Elixa` repo
2. **Root Directory**: `backend`
3. **Framework**: Other
4. **Environment Variables**: `MONGODB_URI`, `JWT_SECRET`, `FRONTEND_URL`
5. Deploy

Both auto-deploy on push to the same repo.

---

## Auth Flow (Cross-Origin)

Since frontend and backend are on different domains, cookie-based auth requires:

1. **Backend CORS**: `credentials: true` + explicit `origin` (not `*`)
2. **Frontend fetch**: `credentials: 'include'` on every request
3. **Cookie settings**: `sameSite: 'none'`, `secure: true` in production

**Alternative (simpler for cross-origin)**: Use Authorization header instead of cookies.

```javascript
// Backend: Return token in response body
res.json({ token: jwt, user: {...} });

// Frontend: Store in localStorage, send as header
headers: { 'Authorization': `Bearer ${token}` }
```

> **Recommendation for vibethon**: Use `Authorization: Bearer <token>` header approach instead of cookies. It's simpler for cross-origin and avoids SameSite cookie complexities.

### Auth with Bearer Token

**Backend middleware:**
```javascript
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userId, email, name }
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
```

**Frontend api.js (updated):**
```javascript
function getToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('elixa_token');
  }
  return null;
}

export function setToken(token) {
  localStorage.setItem('elixa_token', token);
}

export function clearToken() {
  localStorage.removeItem('elixa_token');
}

async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  
  const res = await fetch(`${API_URL}${endpoint}`, { headers, ...options });
  // ...
}
```

---

## Auto-Seed Strategy

On first API call, backend checks if MongoDB has data. If not, it seeds from `data/*.js` files.

```javascript
// lib/seed.js — called by routes before querying
let seeded = false;

async function ensureSeeded(db) {
  if (seeded) return;
  const count = await db.collection('modules').countDocuments();
  if (count === 0) {
    // Import and insert all seed data + create indexes
  }
  seeded = true;
}
```

See `docs/DATABASE.md` for full seed implementation.

---

## Local Development

### Terminal 1: Backend
```bash
cd backend
npm install
cp .env.example .env   # Add MONGODB_URI, JWT_SECRET
npm run dev             # Starts on http://localhost:5000
```

### Terminal 2: Frontend
```bash
cd frontend
npm install
cp .env.example .env.local   # Set NEXT_PUBLIC_API_URL=http://localhost:5000
npm run dev                   # Starts on http://localhost:3000
```
