'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 380, background: '#0d1117', color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem', gap: 10 }}>
      <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.2)', borderTopColor: 'var(--accent)', animation: 'spin 0.7s linear infinite' }} />
      Loading editor...
    </div>
  ),
});

const PYODIDE_URL = 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js';
let _pyodide = null, _loading = false, _cbs = [];

async function getPyodide() {
  if (_pyodide) return _pyodide;
  if (_loading) return new Promise(r => _cbs.push(r));
  _loading = true;
  await new Promise((res, rej) => {
    if (document.querySelector(`script[src="${PYODIDE_URL}"]`)) { res(); return; }
    const s = document.createElement('script');
    s.src = PYODIDE_URL; s.onload = res; s.onerror = rej;
    document.head.appendChild(s);
  });
  while (!window.loadPyodide) await new Promise(r => setTimeout(r, 80));
  _pyodide = await window.loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/' });
  try { await _pyodide.loadPackagesFromImports('import numpy'); } catch {}
  _loading = false; _cbs.forEach(cb => cb(_pyodide)); _cbs = [];
  return _pyodide;
}

const DEFAULT_CODE = `import numpy as np

# Study hours vs exam score dataset
x = np.array([1, 2, 3, 4, 5, 6, 7, 8], dtype=float)
y = np.array([45, 50, 55, 62, 70, 75, 82, 88], dtype=float)

# Linear regression: find w and b
w = np.sum((x - x.mean()) * (y - y.mean())) / np.sum((x - x.mean())**2)
b = y.mean() - w * x.mean()

print(f"Slope  (w): {w:.2f}")
print(f"Intercept (b): {b:.2f}")
print(f"Equation: score = {w:.2f} × hours + {b:.2f}")
print()

for h in [3, 6, 10]:
    print(f"  {h} hours → predicted score: {w*h+b:.1f}")

y_hat = w * x + b
r2 = 1 - np.sum((y - y_hat)**2) / np.sum((y - y.mean())**2)
print(f"\\nR² Score: {r2:.4f}")
`;

export default function CodePlayground({ starterCode, title }) {
  const [code, setCode] = useState(starterCode || DEFAULT_CODE);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [running, setRunning] = useState(false);
  const [pyStatus, setPyStatus] = useState('loading');
  const [runCount, setRunCount] = useState(0);
  const [outputLines, setOutputLines] = useState([]);
  const editorRef = useRef(null);
  const runCodeRef = useRef(null);
  const outputRef = useRef(null);

  useEffect(() => {
    setPyStatus('loading');
    getPyodide().then(() => setPyStatus('ready')).catch(() => setPyStatus('error'));
  }, []);

  const runCode = useCallback(async () => {
    if (running || pyStatus !== 'ready') return;
    setRunning(true);
    setOutput(''); setError(''); setOutputLines([]);

    try {
      const py = await getPyodide();
      const lines = [];
      const errLines = [];

      py.setStdout({ batched: s => { lines.push(s); setOutputLines([...lines]); } });
      py.setStderr({ batched: s => errLines.push(s) });

      const t0 = performance.now();
      await py.runPythonAsync(code);
      const elapsed = ((performance.now() - t0) / 1000).toFixed(2);

      setOutputLines(prev => [...prev, `\n⏱ Finished in ${elapsed}s`]);
      if (errLines.length) setError(errLines.join(''));
      setRunCount(c => c + 1);
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setRunning(false);
      setTimeout(() => outputRef.current?.scrollTo({ top: 99999, behavior: 'smooth' }), 50);
    }
  }, [code, running, pyStatus]);

  useEffect(() => { runCodeRef.current = runCode; }, [runCode]);

  const reset = () => { setCode(starterCode || DEFAULT_CODE); setOutputLines([]); setError(''); };

  const copy = () => navigator.clipboard?.writeText(code);

  const handleMount = (editor, monaco) => {
    editorRef.current = editor;
    editor.addCommand(monaco.KeyMod.Shift | monaco.KeyCode.Enter, () => runCodeRef.current?.());
  };

  const statusColor = { loading: '#f59e0b', ready: '#10b981', error: '#ef4444' }[pyStatus] || '#6b7280';
  const allOutput = outputLines.join('');

  return (
    <div style={{
      background: '#0d1117',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      fontFamily: 'inherit',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    }}>

      {/* ── TOP BAR ─────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '8px 14px',
        background: '#161b22',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        {/* Dots */}
        <div style={{ display: 'flex', gap: 6, marginRight: 6 }}>
          {['#ef4444','#f59e0b','#10b981'].map(c => (
            <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.7 }} />
          ))}
        </div>

        {/* Language tag */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '3px 10px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 600, color: '#f59e0b' }}>
          🐍 Python 3
        </div>

        {/* Title */}
        {title && (
          <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)', marginLeft: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>
            {title.replace(/^[\p{Emoji}\s]+/u, '').trim()}
          </span>
        )}

        <div style={{ flex: 1 }} />

        {/* Status pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: statusColor, boxShadow: pyStatus === 'loading' ? `0 0 6px ${statusColor}` : 'none' }} />
          {{ loading: 'Loading Python…', ready: 'Python ready', error: 'Python error' }[pyStatus]}
        </div>

        {/* Copy */}
        <button onClick={copy} title="Copy code" style={{ padding: '4px 10px', fontSize: '0.72rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-sm)', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', transition: 'all 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.color = '#fff'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}>
          Copy
        </button>

        {/* Reset */}
        <button onClick={reset} title="Reset to starter code" style={{ padding: '4px 10px', fontSize: '0.72rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-sm)', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', transition: 'all 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.color = '#fff'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}>
          ↩ Reset
        </button>

        {/* Run */}
        <button onClick={runCode} disabled={running || pyStatus !== 'ready'}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 16px', fontSize: '0.82rem', fontWeight: 700, background: pyStatus !== 'ready' ? 'rgba(0,212,170,0.1)' : running ? 'rgba(0,212,170,0.15)' : '#00d4aa', border: `1px solid ${pyStatus !== 'ready' || running ? 'rgba(0,212,170,0.3)' : 'transparent'}`, borderRadius: 'var(--radius-sm)', color: pyStatus !== 'ready' || running ? '#00d4aa' : '#000', cursor: pyStatus === 'ready' && !running ? 'pointer' : 'default', transition: 'all 0.15s', opacity: pyStatus !== 'ready' ? 0.6 : 1 }}>
          {running
            ? <><div style={{ width: 10, height: 10, borderRadius: '50%', border: '2px solid #00d4aa', borderTopColor: 'transparent', animation: 'spin 0.7s linear infinite' }} /> Running</>
            : <>▶ Run</>}
        </button>
      </div>

      {/* ── EDITOR ──────────────────────────────────── */}
      <MonacoEditor
        height="400px"
        language="python"
        theme="vs-dark"
        value={code}
        onChange={v => setCode(v || '')}
        onMount={handleMount}
        options={{
          fontSize: 13.5,
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Menlo, monospace",
          fontLigatures: true,
          minimap: { enabled: false },
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          wordWrap: 'off',
          tabSize: 4,
          automaticLayout: true,
          padding: { top: 14, bottom: 14 },
          scrollbar: { verticalScrollbarSize: 5, horizontalScrollbarSize: 5 },
          renderLineHighlight: 'line',
          cursorBlinking: 'smooth',
          smoothScrolling: true,
          bracketPairColorization: { enabled: true },
        }}
      />

      {/* ── OUTPUT PANEL ─────────────────────────────── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        {/* Output header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 14px', background: '#161b22' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.72rem' }}>
            <span style={{ color: '#10b981', fontWeight: 700, fontSize: '0.7rem' }}>OUTPUT</span>
            {runCount > 0 && <span style={{ color: 'rgba(255,255,255,0.25)' }}>— run #{runCount}</span>}
          </div>
          {(allOutput || error) && (
            <button onClick={() => { setOutputLines([]); setError(''); }} style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.25)', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px' }}>
              Clear
            </button>
          )}
        </div>

        {/* Console area */}
        <div ref={outputRef} style={{
          minHeight: 120, maxHeight: 240, overflowY: 'auto',
          padding: '12px 16px',
          fontFamily: "'JetBrains Mono', 'Fira Code', Menlo, monospace",
          fontSize: '12.5px', lineHeight: 1.75,
          whiteSpace: 'pre-wrap', wordBreak: 'break-word',
          background: '#0d1117',
        }}>
          {/* Idle placeholder */}
          {!running && !allOutput && !error && (
            <span style={{ color: 'rgba(255,255,255,0.18)', fontStyle: 'italic' }}>
              {pyStatus === 'loading' ? '⏳  Loading Python runtime (WebAssembly)…' : 'Press ▶ Run or Shift+Enter to execute'}
            </span>
          )}

          {/* Running indicator */}
          {running && !allOutput && (
            <span style={{ color: '#f59e0b' }}>⏳  Executing…</span>
          )}

          {/* Stdout — stream line by line */}
          {allOutput && (
            <span style={{ color: '#e2e8f0' }}>{allOutput}</span>
          )}

          {/* Stderr */}
          {error && (
            <>
              {allOutput && <br />}
              <span style={{ color: '#f87171', display: 'block', marginTop: allOutput ? 8 : 0 }}>
                <span style={{ color: '#ef4444', fontWeight: 700, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Error</span>{'\n'}{error}
              </span>
            </>
          )}
        </div>

        {/* Shortcut hint */}
        <div style={{ padding: '5px 14px', background: '#161b22', borderTop: '1px solid rgba(255,255,255,0.04)', display: 'flex', gap: 20, fontSize: '0.65rem', color: 'rgba(255,255,255,0.18)' }}>
          <span><kbd style={{ padding: '1px 5px', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 3, background: 'rgba(255,255,255,0.05)' }}>Shift</kbd> + <kbd style={{ padding: '1px 5px', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 3, background: 'rgba(255,255,255,0.05)' }}>Enter</kbd> to run</span>
          <span>numpy is pre-loaded</span>
          <span>Runs entirely in your browser</span>
        </div>
      </div>

      {pyStatus === 'loading' && (
        <div style={{ padding: '7px 14px', background: 'rgba(245,158,11,0.05)', borderTop: '1px solid rgba(245,158,11,0.12)', fontSize: '0.72rem', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', border: '2px solid #f59e0b', borderTopColor: 'transparent', animation: 'spin 0.7s linear infinite', flexShrink: 0 }} />
          Loading Python 3 runtime (WebAssembly) — first visit only, then cached in your browser.
        </div>
      )}
    </div>
  );
}
