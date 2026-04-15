'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Toast, { showToast } from '@/components/Toast';
import { api } from '@/lib/api';

const EXAMPLES = [
  {
    id: 'hello',
    title: '👋 Hello Python',
    code: `print("Hello from Elixa! 🧠")
print("Python is running in your browser via WebAssembly!")

for i in range(1, 6):
    print(f"  Step {i}: Learning ML is {'amazing' if i > 2 else 'fun'}!")`,
  },
  {
    id: 'numpy',
    title: '🔢 NumPy Basics',
    code: `import numpy as np

data = np.array([14, 23, 18, 25, 30, 19, 22, 27, 31, 16])
print(f"Data:    {data}")
print(f"Mean:    {np.mean(data):.2f}")
print(f"Std Dev: {np.std(data):.2f}")
print(f"Min/Max: {np.min(data)} / {np.max(data)}")
print(f"Sorted:  {np.sort(data)}")

# Matrix multiplication
A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])
print(f"\\nA @ B =\\n{A @ B}")`,
  },
  {
    id: 'linear-regression',
    title: '📈 Linear Regression',
    code: `import numpy as np
from sklearn.linear_model import LinearRegression

# Study hours vs exam score
hours = np.array([1, 2, 3, 4, 5, 6, 7, 8]).reshape(-1, 1)
scores = np.array([45, 50, 55, 62, 70, 75, 82, 88])

model = LinearRegression()
model.fit(hours, scores)

print(f"Slope (w):     {model.coef_[0]:.2f}")
print(f"Intercept (b): {model.intercept_:.2f}")
print(f"Equation:      score = {model.coef_[0]:.2f} × hours + {model.intercept_:.2f}")
print(f"R² Score:      {model.score(hours, scores):.4f}")
print()

for h in [3, 6, 9, 12]:
    pred = model.predict([[h]])[0]
    print(f"  {h} hours → predicted score: {pred:.1f}")`,
  },
  {
    id: 'classification',
    title: '🎯 Decision Tree',
    code: `import numpy as np
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split

# Height (cm), Weight (kg) → sport
X = np.array([
    [180, 80], [175, 75], [190, 90], [185, 85],
    [165, 60], [170, 55], [160, 58], [168, 62],
    [175, 100],[180, 110],[185, 105],[178, 95]
])
y = np.array([0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2])
labels = ['Basketball', 'Gymnastics', 'Wrestling']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42)
clf = DecisionTreeClassifier(random_state=42)
clf.fit(X_train, y_train)

print(f"Accuracy: {clf.score(X_test, y_test)*100:.0f}%")
print()
for athlete in [[182, 82], [162, 55], [180, 105]]:
    pred = clf.predict([athlete])[0]
    print(f"  H={athlete[0]}cm, W={athlete[1]}kg → {labels[pred]}")`,
  },
  {
    id: 'pandas',
    title: '🐼 Pandas Analysis',
    code: `import pandas as pd
import numpy as np

data = {
    'Student': ['Alice','Bob','Charlie','Diana','Eve','Frank'],
    'Math': [92, 78, 85, 96, 88, 73],
    'Science': [88, 82, 79, 94, 91, 68],
    'English': [95, 71, 88, 90, 85, 77]
}

df = pd.DataFrame(data)
df['Average'] = df[['Math','Science','English']].mean(axis=1).round(1)
df['Grade'] = df['Average'].apply(
    lambda x: 'A' if x >= 90 else 'B' if x >= 80 else 'C'
)

print("📊 Student Report Card")
print("=" * 55)
print(df.to_string(index=False))
print()
print(f"Class Average:  {df['Average'].mean():.1f}")
print(f"Top Student:    {df.loc[df['Average'].idxmax(),'Student']}")
print(f"Grade Distribution:\\n{df['Grade'].value_counts().to_string()}")`,
  },
];

export default function PlaygroundPage() {
  const router = useRouter();
  const [code, setCode] = useState(EXAMPLES[0].code);
  const [output, setOutput] = useState('');
  const [running, setRunning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pyReady, setPyReady] = useState(false);
  const [selectedExample, setSelectedExample] = useState('hello');
  const [hasRun, setHasRun] = useState(false);
  const pyodideRef = useRef(null);

  useEffect(() => {
    if (!localStorage.getItem('elixa_token')) { router.push('/login'); return; }
  }, [router]);

  const initPyodide = async () => {
    if (pyodideRef.current) return;
    setLoading(true);
    setOutput('⏳ Loading Python environment (first run only)...\n');
    try {
      const py = await window.loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/' });
      await py.loadPackage(['numpy', 'micropip']);
      const micropip = py.pyimport('micropip');
      await micropip.install('scikit-learn');
      await micropip.install('pandas');
      pyodideRef.current = py;
      setPyReady(true);
      setOutput('✅ Python 3.11 ready! (numpy, pandas, scikit-learn loaded)\n\nRun your code below ↓\n');
    } catch (err) {
      setOutput('❌ Failed to load Python: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const runCode = async () => {
    if (running) return;
    if (!pyodideRef.current) {
      await initPyodide();
      if (!pyodideRef.current) return;
    }
    setRunning(true);
    setOutput('Running...\n');
    const py = pyodideRef.current;
    try {
      py.runPython(`import sys, io; sys.stdout = io.StringIO(); sys.stderr = io.StringIO()`);
      await py.runPythonAsync(code);
      const stdout = py.runPython('sys.stdout.getvalue()');
      const stderr = py.runPython('sys.stderr.getvalue()');
      setOutput(stdout || '(no output)');
      if (stderr) setOutput(prev => prev + '\n⚠️ Stderr:\n' + stderr);

      // Award XP for first run
      if (!hasRun) {
        setHasRun(true);
        api.completeSimulation({ simulationId: 'playground-run' }).catch(() => {});
        showToast({ message: '+40 XP — Lab Rat badge unlocked! 🧪', type: 'achievement', duration: 4000 });
      }
    } catch (err) {
      setOutput('❌ Error:\n' + err.message);
    } finally {
      setRunning(false);
    }
  };

  const handleExampleSelect = (id) => {
    const ex = EXAMPLES.find(e => e.id === id);
    if (ex) { setCode(ex.code); setSelectedExample(id); }
  };

  return (
    <>
      {/* Load Pyodide */}
      <script src="https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js" async />
      <Navbar />
      <Toast />
      <div className="page-wrapper">
        <div className="container">
          <div className="animate-fade" style={{ marginBottom: 24 }}>
            <h1 style={{ marginBottom: 6 }}>💻 Python Playground</h1>
            <p style={{ color: 'var(--text-muted)' }}>Write and run real Python in your browser — powered by Pyodide (WebAssembly)</p>
          </div>

          {/* Examples selector */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            {EXAMPLES.map(ex => (
              <button key={ex.id} onClick={() => handleExampleSelect(ex.id)}
                className={`btn btn-sm ${selectedExample === ex.id ? 'btn-primary' : 'btn-ghost'}`}>
                {ex.title}
              </button>
            ))}
          </div>

          {/* Editor + Output */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, minHeight: 500 }}>
            {/* Code editor */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0, border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>✏️ editor.py</span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-sm btn-ghost" onClick={() => { const ex = EXAMPLES.find(e => e.id === selectedExample); if (ex) setCode(ex.code); }}>Reset</button>
                  <button className="btn btn-sm btn-primary" onClick={runCode} disabled={running || loading}>
                    {running || loading ? <span className="spinner" style={{ width: 14, height: 14 }} /> : '▶ Run'}
                  </button>
                </div>
              </div>
              <textarea
                value={code}
                onChange={e => setCode(e.target.value)}
                spellCheck={false}
                style={{
                  flex: 1, padding: '20px', background: '#0d1117', color: '#e2e8f0',
                  fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem', lineHeight: 1.7,
                  border: 'none', resize: 'none', outline: 'none', minHeight: 440, tabSize: 4,
                }}
                onKeyDown={e => {
                  if (e.key === 'Tab') { e.preventDefault(); const s = e.target.selectionStart; const val = e.target.value; setCode(val.substring(0, s) + '    ' + val.substring(s)); }
                  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) runCode();
                }}
                placeholder="Write Python code here..."
              />
            </div>

            {/* Output */}
            <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>📤 output</span>
                <button className="btn btn-sm btn-ghost" onClick={() => setOutput('')}>Clear</button>
              </div>
              <pre style={{ flex: 1, padding: '20px', background: '#080c14', color: output.startsWith('❌') ? '#fca5a5' : '#e2e8f0', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem', lineHeight: 1.7, overflow: 'auto', whiteSpace: 'pre-wrap', margin: 0, minHeight: 440 }}>
                {output || '▷ Click "Run" to execute your code\n\nTip: Press Ctrl+Enter to run'}
              </pre>
            </div>
          </div>

          {/* Init button if not loaded */}
          {!pyReady && !loading && (
            <div style={{ marginTop: 16, textAlign: 'center' }}>
              <button className="btn btn-secondary" onClick={initPyodide}>
                ⚡ Pre-load Python Environment
              </button>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 6 }}>Or just click Run — Python loads on first use</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
