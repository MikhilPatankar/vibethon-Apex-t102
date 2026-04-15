# Component Specifications

All React components live in `frontend/components/`. Each is a client component (`'use client'`).
Every component uses CSS Modules: `ComponentName.module.css` alongside the `.jsx` file.

---

## Navbar.jsx

Top navigation bar. Always visible. Auth-aware.

**Props:** None (reads auth state internally via `api.getMe()` or localStorage token check)

**States:**
- **Logged out**: Shows logo + `Login` + `Register` buttons
- **Logged in**: Shows logo + nav links + XP badge + avatar + `Logout`

**Nav links (logged in):** Dashboard | Modules | Playground | Games | Simulations | Leaderboard

**Mobile:** Hamburger menu icon → toggles slide-down nav

**Structure:**
```jsx
<nav className={styles.navbar}>
  <Link href="/" className={styles.logo}>🧠 Elixa</Link>
  
  <div className={styles.navLinks}>
    {isLoggedIn ? (
      <>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/modules">Modules</Link>
        <Link href="/playground">Playground</Link>
        <Link href="/games">Games</Link>
        <Link href="/simulations">Simulations</Link>
        <Link href="/leaderboard">Leaderboard</Link>
      </>
    ) : null}
  </div>
  
  <div className={styles.navRight}>
    {isLoggedIn ? (
      <>
        <span className={styles.xpBadge}>⚡ {xp} XP</span>
        <Link href="/profile" className={styles.avatar}>{avatar}</Link>
        <button onClick={handleLogout}>Logout</button>
      </>
    ) : (
      <>
        <Link href="/login" className="btn btn-ghost">Login</Link>
        <Link href="/register" className="btn btn-primary">Register</Link>
      </>
    )}
  </div>
</nav>
```

---

## ModuleCard.jsx

Displays a single learning module in the grid.

**Props:**
```typescript
{
  moduleId: string,
  title: string,
  description: string,
  icon: string,        // emoji
  color: string,       // hex color
  difficulty: string,  // "beginner" | "intermediate" | "advanced"
  tier: string,        // "interactive" | "reading" | "structure"
  estimatedMinutes: number,
  totalLessons: number,
  progress: number,    // 0.0-1.0
  status: string,      // "locked" | "available" | "in-progress" | "completed"
  locked: boolean
}
```

**Rendering logic:**
- `locked === true` → greyed out card, lock icon overlay, no click
- `status === "completed"` → green checkmark overlay
- `status === "in-progress"` → show progress bar filled to `progress`
- `tier === "interactive"` → small "✨ Interactive" badge
- `tier === "structure"` → small "📝 Coming Soon" badge

**Structure:**
```jsx
<Link href={locked ? '#' : `/modules/${moduleId}`} className={styles.card}>
  <div className={styles.accent} style={{ background: color }} />
  <div className={styles.header}>
    <span className={styles.icon}>{icon}</span>
    <span className={`${styles.difficulty} ${styles[difficulty]}`}>{difficulty}</span>
  </div>
  <h3 className={styles.title}>{title}</h3>
  <p className={styles.desc}>{description}</p>
  <div className={styles.meta}>
    <span>🕐 {estimatedMinutes} min</span>
    <span>📚 {totalLessons} lessons</span>
  </div>
  {status === 'in-progress' && <ProgressBar value={progress} color={color} />}
  {locked && <div className={styles.lockOverlay}>🔒</div>}
  {status === 'completed' && <div className={styles.completeBadge}>✅</div>}
</Link>
```

---

## LessonRenderer.jsx

Renders lesson content by iterating through `content.sections[]` and switching on `type`.

**Props:**
```typescript
{
  sections: Array<Section>,      // Lesson content sections
  onCheckAnswer: (questionId, answerIndex) => void  // For inline quizzes
}
```

**Section type rendering map:**

| Section Type | Component/Render |
|-------------|-----------------|
| `text` | `<p>` or `<div>` with markdown-like formatting |
| `heading` | `<h2>`, `<h3>`, etc. based on `level` |
| `code` | `<pre><code>` with syntax class and optional caption |
| `callout` | Styled box with icon: 💡 tip, ⚠️ warning, 📝 note, ❗ important |
| `data-table` | `<table>` with headers and rows, optional caption |
| `image` | `<figure><img><figcaption>` |
| `check-understanding` | Interactive question card (see below) |
| `key-takeaways` | Bulleted list in styled box with 🎯 header |
| `list` | `<ol>` or `<ul>` based on `style` |
| `interactive` | Maps `component` value to a React component |

**Check Understanding rendering (stateful):**
```jsx
function CheckUnderstanding({ question, options, correctIndex, explanation }) {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  
  const handleSelect = (index) => {
    if (revealed) return;
    setSelected(index);
    setRevealed(true);
  };
  
  return (
    <div className={styles.checkBox}>
      <h4>✅ Check Your Understanding</h4>
      <p>{question}</p>
      {options.map((opt, i) => (
        <div
          key={i}
          className={`${styles.option} ${
            revealed && i === correctIndex ? styles.correct : ''
          } ${revealed && i === selected && i !== correctIndex ? styles.wrong : ''}`}
          onClick={() => handleSelect(i)}
        >
          <span className={styles.radio}>{selected === i ? '●' : '○'}</span>
          {opt}
        </div>
      ))}
      {revealed && <p className={styles.explanation}>💡 {explanation}</p>}
    </div>
  );
}
```

---

## ProgressRing.jsx

Circular SVG progress indicator.

**Props:**
```typescript
{
  progress: number,  // 0.0-1.0
  size: number,      // diameter in px (default: 80)
  strokeWidth: number, // (default: 6)
  color: string,     // stroke color
  label: string      // center text (e.g., "65%")
}
```

**SVG implementation:**
```jsx
function ProgressRing({ progress, size = 80, strokeWidth = 6, color = '#00d4aa', label }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);
  
  return (
    <svg width={size} height={size} className={styles.ring}>
      <circle cx={size/2} cy={size/2} r={radius} className={styles.bg}
        strokeWidth={strokeWidth} fill="none" stroke="var(--bg-tertiary)" />
      <circle cx={size/2} cy={size/2} r={radius} className={styles.fill}
        strokeWidth={strokeWidth} fill="none" stroke={color}
        strokeDasharray={circumference} strokeDashoffset={offset}
        strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`}
        style={{ transition: 'stroke-dashoffset 1s ease' }} />
      {label && <text x="50%" y="50%" textAnchor="middle" dy="0.35em"
        className={styles.label}>{label}</text>}
    </svg>
  );
}
```

---

## QuizEngine.jsx

Full quiz experience — questions, timer, submit, results.

**Props:**
```typescript
{
  quiz: { quizId, title, timeLimit, questions: [] },
  previousBest: { score, total } | null,
  onComplete: (results) => void
}
```

**States:** `currentQuestion`, `answers`, `timeRemaining`, `submitted`, `results`

**Flow:**
1. Show quiz title + "Start Quiz" button
2. On start: begin countdown timer, show question 1
3. Each question: show question text + options, user selects one, "Next" button
4. Last question: "Submit" button
5. Submit → call `api.submitQuiz()` → show results screen
6. Results: score/total, percentage, pass/fail, XP earned, per-question breakdown with explanations

**Question types:**
- `multiple-choice`: 4 radio options
- `true-false`: 2 radio options (True / False)

**Timer:** Count down from `timeLimit` seconds. Display as `MM:SS`. Auto-submit when timer hits 0.

---

## CodeEditor.jsx

Pyodide-powered Python editor.

**Props:**
```typescript
{
  initialCode: string,     // Pre-filled starter code
  readOnly: boolean,       // For code display in lessons
  onRun: (output) => void  // Callback with execution output
}
```

**Implementation notes:**
- Load Pyodide via CDN script in `layout.js`:
  `<Script src="https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js" strategy="beforeInteractive" />`
- On first "Run", initialize Pyodide + load packages (numpy, sklearn, pandas, matplotlib)
- Show loading spinner: "Loading Python environment... (first run only)"
- Textarea for code input with monospace font (JetBrains Mono)
- Output panel below: shows stdout or error in red
- "Run" button with ▶ icon
- "Reset" button to restore initial code
- "Copy" button to copy code

**Layout:** 
- Desktop: side-by-side (code left, output right)
- Mobile: stacked (code top, output bottom)

---

## LeaderboardTable.jsx

Top users ranked by XP.

**Props:**
```typescript
{
  leaders: [{ rank, name, avatar, xp, level, lessonsCompleted }],
  currentUserRank: number
}
```

**Rendering:**
- Top 3: podium-style cards (1st gold background, 2nd silver, 3rd bronze)
- Rows 4-20: table rows
- Current user row: highlighted with accent border
- Each row: rank number, avatar emoji, name, XP, level badge, lessons completed count

---

## AchievementBadge.jsx

Single achievement badge.

**Props:**
```typescript
{
  icon: string,          // emoji
  title: string,
  description: string,
  unlocked: boolean,
  unlockedAt: string | null
}
```

**Rendering:**
- `unlocked`: full color, icon visible, subtle glow
- `locked`: greyed out, icon dimmed, lock overlay
- Hover: show tooltip with description + unlock date

---

## Toast.jsx

Notification toast system.

**Usage:** Import and call `showToast({ message, type, duration })`
- `type`: "success" | "error" | "info" | "achievement"
- "achievement" type: special larger toast with badge animation
- Auto-dismiss after `duration` ms (default: 3000)
- Slide in from top-right
- Multiple toasts stack vertically
