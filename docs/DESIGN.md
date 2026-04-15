# Design System

## Color Palette

```css
:root {
  /* Base */
  --bg-primary: #0a0e1a;
  --bg-secondary: #111827;
  --bg-tertiary: #1f2937;
  --bg-card: rgba(17, 24, 39, 0.8);
  --bg-card-hover: rgba(31, 41, 55, 0.9);
  
  /* Text */
  --text-primary: #f9fafb;
  --text-secondary: #9ca3af;
  --text-tertiary: #6b7280;
  --text-muted: #4b5563;
  
  /* Borders */
  --border-default: rgba(75, 85, 99, 0.3);
  --border-hover: rgba(75, 85, 99, 0.5);
  
  /* Module Colors (each module gets its own accent) */
  --color-intro: #00d4aa;       /* Module 1: Intro to AI */
  --color-linreg: #3b82f6;      /* Module 2: Linear Regression */
  --color-logreg: #6366f1;      /* Module 3: Logistic Regression */
  --color-classification: #8b5cf6; /* Module 4: Classification */
  --color-numerical: #f59e0b;   /* Module 5: Numerical Data */
  --color-categorical: #f97316; /* Module 6: Categorical Data */
  --color-overfitting: #ef4444; /* Module 7: Overfitting */
  --color-neural: #ec4899;      /* Module 8: Neural Networks */
  --color-deep: #d946ef;        /* Module 9: Deep Learning */
  --color-embeddings: #a855f7;  /* Module 10: Embeddings */
  --color-llm: #7c3aed;         /* Module 11: LLMs */
  --color-rl: #6d28d9;          /* Module 12: Reinforcement Learning */
  --color-production: #06b6d4;  /* Module 13: Production ML */
  --color-automl: #14b8a6;      /* Module 14: AutoML */
  --color-ethics: #10b981;      /* Module 15: AI Ethics */
  
  /* Status Colors */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;
  
  /* Gradients */
  --gradient-primary: linear-gradient(135deg, #00d4aa, #3b82f6);
  --gradient-purple: linear-gradient(135deg, #8b5cf6, #ec4899);
  --gradient-warm: linear-gradient(135deg, #f59e0b, #ef4444);
  
  /* Glassmorphism */
  --glass-bg: rgba(17, 24, 39, 0.6);
  --glass-border: rgba(255, 255, 255, 0.08);
  --glass-blur: blur(12px);
  
  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-3xl: 64px;
  
  /* Border Radius */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 8px 30px rgba(0, 0, 0, 0.5);
  --shadow-glow: 0 0 20px rgba(0, 212, 170, 0.15);
  
  /* Typography */
  --font-sans: 'Inter', -apple-system, system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
  
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  --text-4xl: 2.25rem;   /* 36px */
  --text-5xl: 3rem;      /* 48px */
  
  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-base: 250ms ease;
  --transition-slow: 400ms ease;
  
  /* Z-index */
  --z-dropdown: 100;
  --z-modal: 200;
  --z-toast: 300;
  --z-navbar: 50;
  
  /* Layout */
  --navbar-height: 64px;
  --sidebar-width: 280px;
  --content-max-width: 800px;
  --page-max-width: 1280px;
}
```

## Typography

Load in `layout.js`:
```javascript
import { Inter, JetBrains_Mono } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains' });
```

Apply to `<body>`: `className={`${inter.variable} ${jetbrains.variable}`}`

## Base Styles

```css
* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: var(--font-sans);
  background: var(--bg-primary);
  color: var(--text-primary);
  line-height: 1.6;
  min-height: 100vh;
}

/* Scrollbar */
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: var(--bg-secondary); }
::-webkit-scrollbar-thumb { background: var(--bg-tertiary); border-radius: 4px; }
```

## Component Styles

### Card (Glassmorphic)
```css
.card {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  transition: transform var(--transition-base), box-shadow var(--transition-base);
}
.card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}
```

### Module Card
```css
.moduleCard {
  /* extends .card */
  position: relative;
  overflow: hidden;
}
.moduleCard::before {
  /* Colored accent bar at top */
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 4px;
  background: var(--module-color); /* set via inline style */
}
.moduleCard .icon { font-size: 2rem; }
.moduleCard .title { font-size: var(--text-lg); font-weight: 600; }
.moduleCard .difficulty {
  display: inline-block;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  text-transform: uppercase;
  font-weight: 600;
}
.moduleCard .difficulty.beginner { background: rgba(16, 185, 129, 0.15); color: #10b981; }
.moduleCard .difficulty.intermediate { background: rgba(245, 158, 11, 0.15); color: #f59e0b; }
.moduleCard .difficulty.advanced { background: rgba(239, 68, 68, 0.15); color: #ef4444; }
```

### Button
```css
.btn {
  display: inline-flex; align-items: center; gap: var(--space-sm);
  padding: 10px 20px;
  border: none; border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: var(--text-sm); font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
}
.btn-primary {
  background: var(--gradient-primary);
  color: white;
}
.btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
.btn-secondary {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border-default);
}
.btn-ghost { background: transparent; color: var(--text-secondary); }
.btn-ghost:hover { color: var(--text-primary); background: var(--bg-tertiary); }
```

### Progress Ring (SVG-based)
```css
.progressRing { transform: rotate(-90deg); }
.progressRing circle {
  fill: none;
  stroke-width: 6;
  stroke-linecap: round;
}
.progressRing .bg { stroke: var(--bg-tertiary); }
.progressRing .fill {
  stroke: var(--color-success);
  transition: stroke-dashoffset 1s ease;
}
```

### Form Input
```css
.input {
  width: 100%;
  padding: 12px 16px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-family: var(--font-sans);
  font-size: var(--text-base);
  transition: border-color var(--transition-fast);
}
.input:focus {
  outline: none;
  border-color: var(--color-intro);
  box-shadow: 0 0 0 3px rgba(0, 212, 170, 0.1);
}
```

### Callout (Lesson Content)
```css
.callout {
  padding: var(--space-md) var(--space-lg);
  border-radius: var(--radius-md);
  border-left: 4px solid;
  margin: var(--space-lg) 0;
}
.callout.tip    { border-color: #10b981; background: rgba(16, 185, 129, 0.08); }
.callout.warning { border-color: #f59e0b; background: rgba(245, 158, 11, 0.08); }
.callout.note   { border-color: #3b82f6; background: rgba(59, 130, 246, 0.08); }
.callout.important { border-color: #8b5cf6; background: rgba(139, 92, 246, 0.08); }
```

### Check Understanding (Google MLCC style)
```css
.checkUnderstanding {
  border: 1px solid var(--border-default);
  border-left: 4px solid #3b82f6;
  border-radius: var(--radius-md);
  padding: var(--space-lg);
  margin: var(--space-xl) 0;
  background: rgba(59, 130, 246, 0.05);
}
.checkUnderstanding h4 { color: #3b82f6; margin-bottom: var(--space-md); }
.checkUnderstanding .option {
  display: flex; align-items: center; gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background var(--transition-fast);
}
.checkUnderstanding .option:hover { background: rgba(255,255,255,0.05); }
.checkUnderstanding .option.correct { background: rgba(16, 185, 129, 0.1); border: 1px solid #10b981; }
.checkUnderstanding .option.wrong { background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; }
```

## Responsive Breakpoints

```css
/* Mobile first, scale up */
@media (min-width: 480px)  { /* sm */ }
@media (min-width: 768px)  { /* md: tablet */ }
@media (min-width: 1024px) { /* lg: desktop */ }
@media (min-width: 1280px) { /* xl: wide */ }

/* Module grid */
.moduleGrid {
  display: grid;
  gap: var(--space-lg);
  grid-template-columns: 1fr;           /* mobile: 1 col */
}
@media (min-width: 768px) {
  .moduleGrid { grid-template-columns: repeat(2, 1fr); }  /* tablet: 2 cols */
}
@media (min-width: 1024px) {
  .moduleGrid { grid-template-columns: repeat(3, 1fr); }  /* desktop: 3 cols */
}

/* Navbar mobile: hamburger menu */
@media (max-width: 768px) {
  .navLinks { display: none; }
  .hamburger { display: block; }
  .navLinks.open { display: flex; flex-direction: column; position: absolute; ... }
}
```

## Animation Keyframes

```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes slideInRight {
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes pulse { 
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}
@keyframes countUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes badgeUnlock {
  0% { transform: scale(0) rotate(-180deg); opacity: 0; }
  60% { transform: scale(1.2) rotate(10deg); opacity: 1; }
  100% { transform: scale(1) rotate(0); opacity: 1; }
}

/* Page transition */
.pageEnter { animation: fadeIn 0.3s ease; }

/* Staggered card entrance */
.moduleCard:nth-child(1) { animation-delay: 0ms; }
.moduleCard:nth-child(2) { animation-delay: 50ms; }
.moduleCard:nth-child(3) { animation-delay: 100ms; }
/* etc. */
```
