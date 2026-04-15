'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

// Fixed 2-class dataset
const POINTS = [
  { x: 1.5, y: 4.0, c: 1 }, { x: 2.0, y: 3.5, c: 1 }, { x: 1.8, y: 5.2, c: 1 },
  { x: 2.5, y: 4.8, c: 1 }, { x: 1.2, y: 3.0, c: 1 }, { x: 3.0, y: 5.5, c: 1 },
  { x: 2.2, y: 2.8, c: 1 }, { x: 1.0, y: 4.5, c: 1 }, { x: 2.8, y: 3.8, c: 1 },
  { x: 3.5, y: 4.2, c: 1 }, { x: 3.2, y: 6.0, c: 1 }, { x: 0.8, y: 3.8, c: 1 },
  { x: 5.5, y: 1.5, c: 0 }, { x: 6.0, y: 2.0, c: 0 }, { x: 5.2, y: 0.8, c: 0 },
  { x: 6.5, y: 1.2, c: 0 }, { x: 4.8, y: 1.8, c: 0 }, { x: 7.0, y: 2.5, c: 0 },
  { x: 5.8, y: 0.5, c: 0 }, { x: 6.2, y: 3.0, c: 0 }, { x: 4.5, y: 0.8, c: 0 },
  { x: 7.2, y: 1.8, c: 0 }, { x: 5.0, y: 2.5, c: 0 }, { x: 6.8, y: 0.8, c: 0 },
];

// Linear decision boundary: w0*x + w1*y + b = 0
// Parameterized by angle θ and offset d
function classify(pt, theta, d) {
  const w0 = Math.cos(theta), w1 = Math.sin(theta);
  return (w0 * pt.x + w1 * pt.y + d) >= 0 ? 1 : 0;
}

function getMetrics(theta, d) {
  let tp = 0, fp = 0, fn = 0, tn = 0;
  for (const p of POINTS) {
    const pred = classify(p, theta, d);
    if (p.c === 1 && pred === 1) tp++;
    else if (p.c === 0 && pred === 1) fp++;
    else if (p.c === 1 && pred === 0) fn++;
    else tn++;
  }
  const acc = Math.round(((tp + tn) / POINTS.length) * 100);
  const prec = tp + fp > 0 ? Math.round((tp / (tp + fp)) * 100) : 0;
  const rec = tp + fn > 0 ? Math.round((tp / (tp + fn)) * 100) : 0;
  const f1 = prec + rec > 0 ? Math.round((2 * prec * rec) / (prec + rec)) : 0;
  return { tp, fp, fn, tn, acc, prec, rec, f1 };
}

export default function DecisionBoundaryExplorer() {
  const canvasRef = useRef(null);
  const [theta, setTheta] = useState(-1.1); // boundary angle
  const [d, setD] = useState(-14);           // boundary offset

  const metrics = getMetrics(theta, d);

  const draw = useCallback(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const CW = canvas.width, CH = canvas.height;
    const PAD = { l: 36, r: 20, t: 20, b: 36 };
    const pw = CW - PAD.l - PAD.r, ph = CH - PAD.t - PAD.b;
    const xMin = 0, xMax = 8, yMin = 0, yMax = 7;
    const tx = (x) => PAD.l + ((x - xMin) / (xMax - xMin)) * pw;
    const ty = (y) => PAD.t + (1 - (y - yMin) / (yMax - yMin)) * ph;

    ctx.fillStyle = '#0d1117'; ctx.fillRect(0, 0, CW, CH);

    // Background color fill by class
    const img = ctx.createImageData(CW, CH);
    for (let px = 0; px < CW; px++) {
      for (let py = 0; py < CH; py++) {
        const dataX = xMin + ((px - PAD.l) / pw) * (xMax - xMin);
        const dataY = yMin + (1 - (py - PAD.t) / ph) * (yMax - yMin);
        if (dataX < xMin || dataX > xMax || dataY < yMin || dataY > yMax) continue;
        const pred = classify({ x: dataX, y: dataY }, theta, d);
        const idx = (py * CW + px) * 4;
        if (pred === 1) { img.data[idx] = 59; img.data[idx+1] = 130; img.data[idx+2] = 246; img.data[idx+3] = 28; }
        else { img.data[idx] = 239; img.data[idx+1] = 68; img.data[idx+2] = 68; img.data[idx+3] = 28; }
      }
    }
    ctx.putImageData(img, 0, 0);

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.04)'; ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      ctx.beginPath(); ctx.moveTo(PAD.l + (i/4)*pw, PAD.t); ctx.lineTo(PAD.l + (i/4)*pw, PAD.t+ph); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(PAD.l, PAD.t + (i/4)*ph); ctx.lineTo(PAD.l+pw, PAD.t + (i/4)*ph); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(PAD.l, PAD.t); ctx.lineTo(PAD.l, PAD.t+ph); ctx.lineTo(PAD.l+pw, PAD.t+ph); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.font = '10px Inter';
    ctx.textAlign = 'center'; ctx.fillText('Feature 1', PAD.l + pw/2, CH - 4);
    ctx.save(); ctx.translate(10, PAD.t + ph/2); ctx.rotate(-Math.PI/2); ctx.fillText('Feature 2', 0, 0); ctx.restore();

    // Decision boundary line
    const w0 = Math.cos(theta), w1 = Math.sin(theta);
    // w0*x + w1*y + d = 0 → y = -(w0*x + d)/w1
    ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2.5; ctx.setLineDash([]);
    ctx.beginPath();
    let lineStart = false;
    for (let xi = xMin; xi <= xMax; xi += 0.05) {
      const yi = -(w0 * xi + d) / w1;
      if (yi < yMin || yi > yMax) { lineStart = false; continue; }
      if (!lineStart) { ctx.moveTo(tx(xi), ty(yi)); lineStart = true; } else ctx.lineTo(tx(xi), ty(yi));
    }
    ctx.stroke();

    // Points
    for (const p of POINTS) {
      const pred = classify(p, theta, d);
      const correct = pred === p.c;
      ctx.beginPath(); ctx.arc(tx(p.x), ty(p.y), 7, 0, Math.PI * 2);
      ctx.fillStyle = p.c === 1 ? '#3b82f6' : '#ef4444'; ctx.fill();
      if (!correct) {
        ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2.5; ctx.stroke();
        // X mark for incorrect
        const cx = tx(p.x), cy = ty(p.y), s = 4;
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(cx-s, cy-s); ctx.lineTo(cx+s, cy+s); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx+s, cy-s); ctx.lineTo(cx-s, cy+s); ctx.stroke();
      } else {
        ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 1.5; ctx.stroke();
      }
    }
  }, [theta, d]);

  useEffect(() => { draw(); }, [draw]);

  const pct = (val, mn, mx) => ((val - mn) / (mx - mn)) * 100;

  return (
    <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>🎯 Decision Boundary Explorer</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>Rotate and shift the decision boundary — maximize accuracy on both classes</div>
        </div>
        <div style={{ padding: '6px 14px', background: metrics.acc >= 90 ? 'rgba(16,185,129,0.12)' : metrics.acc >= 75 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${metrics.acc >= 90 ? 'rgba(16,185,129,0.3)' : metrics.acc >= 75 ? 'rgba(245,158,11,0.3)' : 'rgba(239,68,68,0.3)'}`, borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700, color: metrics.acc >= 90 ? 'var(--green)' : metrics.acc >= 75 ? '#f59e0b' : '#ef4444' }}>
          {metrics.acc}% Accuracy {metrics.acc >= 90 ? '🎯' : metrics.acc >= 75 ? '👍' : '❌'}
        </div>
      </div>

      {/* Sliders */}
      <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {[
          { label: 'Boundary Angle (θ)', val: theta, mn: -2.5, mx: 0, step: 0.05, set: setTheta, color: '#ffffff', fmt: v => `${(v * 180 / Math.PI).toFixed(0)}°` },
          { label: 'Boundary Offset', val: d, mn: -25, mx: -5, step: 0.5, set: setD, color: '#00d4aa', fmt: v => v.toFixed(1) },
        ].map(({ label, val, mn, mx, step, set, color, fmt }) => (
          <div key={label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 8 }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{label}</span>
              <span style={{ fontWeight: 700, color, fontFamily: 'monospace' }}>{fmt(val)}</span>
            </div>
            <div style={{ position: 'relative', height: 6, margin: '4px 0' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'var(--bg-tertiary)', borderRadius: 3 }} />
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${pct(val, mn, mx)}%`, background: color, borderRadius: 3 }} />
              <div style={{ position: 'absolute', top: '50%', left: `${pct(val, mn, mx)}%`, transform: 'translate(-50%, -50%)', width: 16, height: 16, borderRadius: '50%', background: color, border: '2px solid rgba(255,255,255,0.9)', boxShadow: `0 0 8px ${color}88`, pointerEvents: 'none' }} />
              <input type="range" min={mn} max={mx} step={step} value={val} onChange={e => set(parseFloat(e.target.value))} style={{ position: 'absolute', inset: '-8px 0', width: '100%', opacity: 0, cursor: 'pointer', height: 22 }} />
            </div>
          </div>
        ))}
      </div>

      <canvas ref={canvasRef} width={560} height={280} style={{ display: 'block', width: '100%', height: 'auto' }} />

      {/* Legend */}
      <div style={{ padding: '8px 20px', display: 'flex', gap: 16, fontSize: '0.72rem', color: 'var(--text-muted)' }}>
        <span><span style={{ color: '#3b82f6' }}>●</span> Class 1 (positive)</span>
        <span><span style={{ color: '#ef4444' }}>●</span> Class 0 (negative)</span>
        <span>⊗ Misclassified</span>
        <span>── Decision boundary</span>
      </div>

      {/* Metrics */}
      <div style={{ padding: '12px 20px 16px', borderTop: '1px solid var(--border)', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { label: 'Accuracy', val: `${metrics.acc}%`, color: metrics.acc >= 90 ? 'var(--green)' : metrics.acc >= 75 ? '#f59e0b' : '#ef4444' },
          { label: 'Precision', val: `${metrics.prec}%`, color: 'var(--blue)' },
          { label: 'Recall', val: `${metrics.rec}%`, color: '#8b5cf6' },
          { label: 'F1 Score', val: `${metrics.f1}%`, color: 'var(--orange)' },
        ].map(({ label, val, color }) => (
          <div key={label} style={{ textAlign: 'center', padding: '10px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color, fontFamily: 'monospace' }}>{val}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
