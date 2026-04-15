'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

// Generate noisy data from a sine + linear trend
function makeDataset(seed = 42) {
  const rng = (s) => { let x = Math.sin(s) * 43758.5453; return x - Math.floor(x); };
  const points = [];
  for (let i = 0; i < 20; i++) {
    const x = (i / 19) * 4 * Math.PI;
    const noise = (rng(seed + i) - 0.5) * 2.5;
    points.push({ x, y: Math.sin(x) + noise });
  }
  return points;
}

// Fit polynomial of given degree using least-squares
function fitPoly(points, degree) {
  const n = points.length;
  const d = degree + 1;
  // Build Vandermonde matrix X and y vector
  const Xm = points.map(p => Array.from({ length: d }, (_, i) => Math.pow(p.x, i)));
  const yv = points.map(p => p.y);
  // Normal equations: (X^T X)^-1 X^T y  — using simple Gaussian elimination
  const XtX = Array.from({ length: d }, (_, i) => Array.from({ length: d }, (_, j) => Xm.reduce((s, row) => s + row[i] * row[j], 0)));
  const Xty = Array.from({ length: d }, (_, i) => Xm.reduce((s, row, k) => s + row[i] * yv[k], 0));
  // Gaussian elimination with pivot
  const aug = XtX.map((row, i) => [...row, Xty[i]]);
  for (let col = 0; col < d; col++) {
    let maxRow = col;
    for (let row = col + 1; row < d; row++) if (Math.abs(aug[row][col]) > Math.abs(aug[maxRow][col])) maxRow = row;
    [aug[col], aug[maxRow]] = [aug[maxRow], aug[col]];
    if (Math.abs(aug[col][col]) < 1e-12) continue;
    for (let row = 0; row < d; row++) {
      if (row === col) continue;
      const f = aug[row][col] / aug[col][col];
      for (let k = col; k <= d; k++) aug[row][k] -= f * aug[col][k];
    }
  }
  return Array.from({ length: d }, (_, i) => aug[i][d] / aug[i][i]);
}

function evalPoly(coeffs, x) {
  return coeffs.reduce((s, c, i) => s + c * Math.pow(x, i), 0);
}

function splitTrainTest(points) {
  // Interleave: odd indices = test, even = train
  return {
    train: points.filter((_, i) => i % 3 !== 1),
    test: points.filter((_, i) => i % 3 === 1),
  };
}

function mse(points, coeffs) {
  if (!coeffs || coeffs.some(isNaN)) return 999;
  return points.reduce((s, p) => s + (evalPoly(coeffs, p.x) - p.y) ** 2, 0) / points.length;
}

export default function OverfittingExplorer() {
  const canvasRef = useRef(null);
  const [degree, setDegree] = useState(1);
  const [dataset] = useState(() => makeDataset(77));
  const { train, test } = splitTrainTest(dataset);

  let coeffs;
  try { coeffs = fitPoly(train, degree); } catch { coeffs = null; }

  const trainMSE = coeffs ? +mse(train, coeffs).toFixed(3) : null;
  const testMSE = coeffs ? +mse(test, coeffs).toFixed(3) : null;

  const diagnosis = (() => {
    if (degree <= 1) return { label: 'Underfitting', color: '#ef4444', tip: 'The line is too simple to capture the pattern in the data.' };
    if (degree <= 3) return { label: '✓ Good Fit', color: 'var(--green)', tip: 'Low training error and reasonable test error.' };
    if (degree <= 6) return { label: 'Starting to Overfit', color: 'var(--orange)', tip: 'The curve starts chasing noise. Gap between train and test MSE is growing.' };
    return { label: 'Overfitting', color: '#ef4444', tip: 'The model memorizes every training point but fails on test data.' };
  })();

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !coeffs) return;
    const ctx = canvas.getContext('2d');
    const CW = canvas.width, CH = canvas.height;
    const PAD = { l: 48, r: 20, t: 18, b: 36 };
    const plotW = CW - PAD.l - PAD.r;
    const plotH = CH - PAD.t - PAD.b;

    const allY = dataset.map(p => p.y);
    const xMin = 0, xMax = 4 * Math.PI;
    const yMin = Math.min(...allY) - 1.5, yMax = Math.max(...allY) + 1.5;

    const toX = x => PAD.l + ((x - xMin) / (xMax - xMin)) * plotW;
    const toY = y => PAD.t + (1 - (y - yMin) / (yMax - yMin)) * plotH;

    ctx.fillStyle = '#0d1117';
    ctx.fillRect(0, 0, CW, CH);

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.04)'; ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const x = PAD.l + (i / 5) * plotW;
      ctx.beginPath(); ctx.moveTo(x, PAD.t); ctx.lineTo(x, PAD.t + plotH); ctx.stroke();
      const y = PAD.t + (i / 5) * plotH;
      ctx.beginPath(); ctx.moveTo(PAD.l, y); ctx.lineTo(PAD.l + plotW, y); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(PAD.l, PAD.t); ctx.lineTo(PAD.l, PAD.t + plotH); ctx.lineTo(PAD.l + plotW, PAD.t + plotH); ctx.stroke();

    // Fitted curve
    const curveColor = degree <= 3 ? '#00d4aa' : degree <= 6 ? '#f59e0b' : '#ef4444';
    ctx.strokeStyle = curveColor; ctx.lineWidth = 2.5; ctx.beginPath();
    let first = true;
    for (let i = 0; i <= 200; i++) {
      const x = xMin + (i / 200) * (xMax - xMin);
      const y = evalPoly(coeffs, x);
      if (y < yMin - 5 || y > yMax + 5) { first = true; continue; }
      if (first) { ctx.moveTo(toX(x), toY(y)); first = false; }
      else ctx.lineTo(toX(x), toY(y));
    }
    ctx.stroke();

    // True underlying curve (sin)
    ctx.strokeStyle = 'rgba(139,92,246,0.4)'; ctx.lineWidth = 1.5; ctx.setLineDash([5, 4]);
    ctx.beginPath(); first = true;
    for (let i = 0; i <= 200; i++) {
      const x = xMin + (i / 200) * (xMax - xMin);
      const y = Math.sin(x);
      if (first) { ctx.moveTo(toX(x), toY(y)); first = false; }
      else ctx.lineTo(toX(x), toY(y));
    }
    ctx.stroke(); ctx.setLineDash([]);

    // Training points (blue)
    for (const p of train) {
      ctx.beginPath(); ctx.arc(toX(p.x), toY(p.y), 5, 0, Math.PI * 2);
      ctx.fillStyle = '#3b82f6'; ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 1.5; ctx.stroke();
    }
    // Test points (orange)
    for (const p of test) {
      ctx.beginPath(); ctx.arc(toX(p.x), toY(p.y), 5, 0, Math.PI * 2);
      ctx.fillStyle = '#f59e0b'; ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 1.5; ctx.stroke();
    }
  }, [degree, coeffs, dataset, train, test]);

  useEffect(() => { draw(); }, [draw]);

  return (
    <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>📉 Overfitting Explorer</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>Adjust polynomial degree — find the sweet spot between underfitting and overfitting</div>
        </div>
        <div style={{ padding: '6px 14px', background: `${diagnosis.color}18`, border: `1px solid ${diagnosis.color}44`, borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700, color: diagnosis.color }}>
          {diagnosis.label}
        </div>
      </div>

      {/* Degree slider */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 8 }}>
          <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Polynomial Degree</span>
          <span style={{ fontWeight: 700, color: 'var(--accent)', fontFamily: 'JetBrains Mono, monospace' }}>degree = {degree}</span>
        </div>
        <div style={{ position: 'relative', height: 6, margin: '8px 0 4px' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'var(--bg-tertiary)', borderRadius: 3 }} />
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${((degree - 1) / 9) * 100}%`, background: degree <= 3 ? '#00d4aa' : degree <= 6 ? '#f59e0b' : '#ef4444', borderRadius: 3, transition: 'width 0.15s, background 0.3s' }} />
          {/* Thumb */}
          <div style={{
            position: 'absolute', top: '50%', left: `${((degree - 1) / 9) * 100}%`,
            transform: 'translate(-50%, -50%)',
            width: 18, height: 18, borderRadius: '50%',
            background: degree <= 3 ? '#00d4aa' : degree <= 6 ? '#f59e0b' : '#ef4444',
            border: '2.5px solid rgba(255,255,255,0.9)',
            boxShadow: `0 0 10px ${degree <= 3 ? '#00d4aa' : degree <= 6 ? '#f59e0b' : '#ef4444'}88`,
            pointerEvents: 'none', transition: 'left 0.05s, background 0.3s, box-shadow 0.3s',
          }} />
          <input type="range" min={1} max={10} step={1} value={degree}
            onChange={e => setDegree(parseInt(e.target.value))}
            style={{ position: 'absolute', inset: '-8px 0', width: '100%', opacity: 0, cursor: 'pointer', height: 22 }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>
          <span>1 (line)</span><span>5 (medium)</span><span>10 (very complex)</span>
        </div>
        <div style={{ marginTop: 10, fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>{diagnosis.tip}</div>
      </div>

      <canvas ref={canvasRef} width={560} height={280} style={{ display: 'block', width: '100%', height: 'auto' }} />

      {/* Legend */}
      <div style={{ padding: '8px 20px', display: 'flex', gap: 16, fontSize: '0.72rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
        <span><span style={{ color: '#3b82f6' }}>●</span> Train</span>
        <span><span style={{ color: '#f59e0b' }}>●</span> Test</span>
        <span><span style={{ color: degree <= 3 ? '#00d4aa' : degree <= 6 ? '#f59e0b' : '#ef4444' }}>━</span> Fitted curve</span>
        <span><span style={{ color: 'rgba(139,92,246,0.6)' }}>╌</span> True signal (sin)</span>
      </div>

      {/* MSE comparison */}
      <div style={{ padding: '12px 20px 16px', borderTop: '1px solid var(--border)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {[
          { label: 'Train MSE', val: trainMSE, note: '(should be low)', good: trainMSE !== null && trainMSE < 1 },
          { label: 'Test MSE', val: testMSE, note: '(matters most!)', good: testMSE !== null && testMSE < 1.5 },
        ].map(({ label, val, note, good }) => (
          <div key={label} style={{ textAlign: 'center', padding: '10px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', border: `1px solid ${good ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.2)'}` }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, color: good ? 'var(--green)' : '#ef4444', fontFamily: 'JetBrains Mono, monospace' }}>{val ?? '—'}</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 2 }}>{note}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
