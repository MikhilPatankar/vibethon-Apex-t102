# Phased Build Plan

> **Rule**: At the end of EVERY phase, the app is complete, working, and demo-ready.

---

## Phase 1: MVP (0:00 → 1:15) — Minimum Passing Submission

### What works after Phase 1
Auth (register/login) → 1 module (5 lessons) → Quiz with scoring → XP tracking → Deployed on Vercel

### Checklist

```
[ ] 1.  Backend: npm init, install express cors mongodb bcryptjs jsonwebtoken cookie-parser
[ ] 2.  Backend: lib/mongodb.js — connection singleton
[ ] 3.  Backend: lib/seed.js — auto-seed logic (check if empty → populate)
[ ] 4.  Backend: lib/auth.js — JWT middleware (Bearer token)
[ ] 5.  Backend: data/modules.js — at minimum, Module 1 "Intro to AI & ML"
[ ] 6.  Backend: data/lessons.js — 5 lessons for Module 1 (real content)
[ ] 7.  Backend: data/quizzes.js — 1 quiz (10 questions) for Module 1
[ ] 8.  Backend: routes/auth.js — POST /register, POST /login, POST /logout, GET /me
[ ] 9.  Backend: routes/modules.js — GET / (all modules), GET /:moduleId
[ ] 10. Backend: routes/lessons.js — GET /:lessonId, POST /:lessonId/complete
[ ] 11. Backend: routes/quiz.js — GET /:quizId, POST /submit
[ ] 12. Backend: routes/progress.js — GET / (user progress)
[ ] 13. Backend: index.js — wire all routes, CORS, health check
[ ] 14. Backend: vercel.json — serverless config
[ ] 15. Backend: Deploy to Vercel, verify /api returns health check
[ ] 16. Frontend: npx create-next-app, set NEXT_PUBLIC_API_URL
[ ] 17. Frontend: globals.css — full design system (see docs/DESIGN.md)
[ ] 18. Frontend: lib/api.js — fetch wrapper with Bearer token
[ ] 19. Frontend: app/layout.js — root layout, fonts, metadata
[ ] 20. Frontend: components/Navbar.jsx — auth-aware navbar
[ ] 21. Frontend: app/page.js — landing page (hero + CTA)
[ ] 22. Frontend: app/register/page.js — registration form
[ ] 23. Frontend: app/login/page.js — login form
[ ] 24. Frontend: app/modules/page.js — show Module 1 card
[ ] 25. Frontend: app/modules/[moduleId]/page.js — lesson list
[ ] 26. Frontend: app/modules/[moduleId]/[lessonId]/page.js — lesson viewer
[ ] 27. Frontend: components/LessonRenderer.jsx — render sections (text, code, callout, check-understanding, key-takeaways)
[ ] 28. Frontend: app/quiz/[quizId]/page.js — quiz engine (questions, timer, submit, results)
[ ] 29. Frontend: Deploy to Vercel, verify full flow works
[ ] 30. Git: commit, push
```

### Build Order (minute by minute)

**Backend first** (0:00 → 0:40):
1. Create `backend/` folder, npm init, install deps
2. Write `lib/mongodb.js`, `lib/auth.js`
3. Write `data/modules.js` with Module 1 definition
4. Write `data/lessons.js` with 5 lessons (see CURRICULUM.md for content)
5. Write `data/quizzes.js` with 1 quiz (10 questions)
6. Write `lib/seed.js` (auto-populate)
7. Write all route files: auth, modules, lessons, quiz, progress
8. Write `index.js` entry point
9. Write `vercel.json`
10. Test locally: `npm run dev`, test with curl/Postman
11. Deploy backend to Vercel

**Frontend** (0:40 → 1:10):
1. Create `frontend/` folder, `npx create-next-app ./`
2. Write `globals.css` design system
3. Write `lib/api.js` fetch wrapper
4. Write layout.js + Navbar
5. Write landing page
6. Write register + login pages
7. Write modules page + module detail page
8. Write lesson viewer + LessonRenderer
9. Write quiz engine page
10. Test locally against backend

**Deploy** (1:10 → 1:15):
1. Deploy frontend to Vercel (set NEXT_PUBLIC_API_URL env var)
2. Verify full flow: register → login → modules → lesson → quiz
3. Git commit + push

---

## Phase 2: Full Content Platform (1:15 → 2:15)

### What's added
All 15 modules seeded → Dashboard with progress → Module progress tracking → Interactive Linear Regression lessons

### Checklist

```
[ ] 1.  Backend: data/modules.js — expand to all 15 modules
[ ] 2.  Backend: data/lessons.js — add Tier 🟢 Module 2 (Linear Regression: 7 lessons)
[ ] 3.  Backend: data/lessons.js — add Tier 🟢 Module 7 (Overfitting: 6 lessons)
[ ] 4.  Backend: data/lessons.js — add Tier 🟡 content for modules 3,4,5,8,11,15
[ ] 5.  Backend: data/lessons.js — add Tier 🔴 structural content for modules 6,9,10,12,13,14
[ ] 6.  Backend: data/quizzes.js — add quizzes for all Tier 🟢 and 🟡 modules
[ ] 7.  Backend: Re-deploy to Vercel
[ ] 8.  Frontend: app/modules/page.js — 5 category groups with headers
[ ] 9.  Frontend: components/ModuleCard.jsx — full card with progress, difficulty, lock state
[ ] 10. Frontend: app/dashboard/page.js — hero, XP, level, streak, progress rings, continue card
[ ] 11. Frontend: components/ProgressRing.jsx — SVG circular progress
[ ] 12. Frontend: LessonRenderer — add data-table, chart, interactive section types
[ ] 13. Frontend: Re-deploy to Vercel
[ ] 14. Git: commit, push
```

---

## Phase 3: Interactive Features (2:15 → 3:15)

### What's added
Code playground (Pyodide) → Spam detector (real ML) → Overfitting game (real math) → Image classifier

### Checklist

```
[ ] 1.  Frontend: app/layout.js — add Pyodide CDN script tag
[ ] 2.  Frontend: components/CodeEditor.jsx — Pyodide init, code textarea, run button, output panel
[ ] 3.  Frontend: app/playground/page.js — playground with examples dropdown
[ ] 4.  Frontend: app/simulations/page.js — simulations hub
[ ] 5.  Frontend: app/simulations/spam-detector/page.js — dataset table, train button, predict UI
[ ] 6.  Frontend: app/simulations/image-classifier/page.js — image grid, click to classify
[ ] 7.  Frontend: components/games/OverfittingGame.jsx — canvas, slider, real poly fit
[ ] 8.  Frontend: app/games/page.js — games hub
[ ] 9.  Frontend: app/games/[gameId]/page.js — game renderer
[ ] 10. Backend: routes/games.js — POST /score
[ ] 11. Backend: routes/simulations.js — POST /complete
[ ] 12. Backend: Re-deploy
[ ] 13. Frontend: Re-deploy
[ ] 14. Git: commit, push
```

---

## Phase 4: Polish + Gamification + Ship (3:15 → 4:00)

### What's added
Leaderboard → Achievements → Profile → Responsive → README

### Checklist

```
[ ] 1.  Backend: routes/leaderboard.js — GET / (aggregate top 20)
[ ] 2.  Backend: routes/achievements.js — GET / (user badges)
[ ] 3.  Backend: data/achievements.js — 10 badge definitions
[ ] 4.  Backend: Achievement unlock detection in lesson/quiz/game completion routes
[ ] 5.  Backend: Re-deploy
[ ] 6.  Frontend: app/leaderboard/page.js — podium + table
[ ] 7.  Frontend: app/profile/page.js — stats grid + badges + streak
[ ] 8.  Frontend: components/AchievementBadge.jsx
[ ] 9.  Frontend: components/Toast.jsx — achievement unlock notification
[ ] 10. Frontend: Responsive pass — mobile nav, grid reflow, playground stacking
[ ] 11. Frontend: Animations — page fade-in, progress ring, card hover, XP counter
[ ] 12. Frontend: Re-deploy
[ ] 13. Root: README.md — description, features, tech, setup, screenshots placeholder
[ ] 14. Root: .gitignore (node_modules, .env.local, .env, .next)
[ ] 15. Git: final commit + push
```

---

## What Judges See At Each Phase

| Phase | Demo Pitch | Rubric Coverage |
|-------|-----------|-----------------|
| **1** | "Auth + 1 module + quiz + deployed" | ✅ All mandatory minimums |
| **2** | "15 modules, dashboard, progress tracking" | + 3.2, 3.7 |
| **3** | "Real Python, real ML, simulations, games" | + 3.3, 3.4, 3.6 |
| **4** | "Leaderboard, badges, responsive, README" | + 3.8, 3.9, 3.10 = ALL 10 |
