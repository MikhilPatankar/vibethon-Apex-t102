'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

// Dataset: small but clean linear relationship
const DEFAULT_POINTS = [
  [1, 2.1], [1.5, 3.2], [2, 3.8], [2.5, 5.1],
  [3, 5.9], [3.5, 7.2], [4, 7.8], [4.5, 9.1],
  [5, 10.0], [5.5, 10.9], [6, 12.1], [6.5, 13.0],
];

function computeLosses(points, w, b) {
  const n = points.length;
  let sumL1 = 0, sumL2 = 0;
  for (const [x, y] of points) {
    const pred = w * x + b;
    const err = pred - y;
    sumL1 += Math.abs(err);
    sumL2 += err * err;
  }
  const mse = sumL2 / n;
  const mae = sumL1 / n;
  return { mae: +mae.toFixed(3), mse: +mse.toFixed(3), rmse: +Math.sqrt(mse).toFixed(3) };
}

export default function LinearRegressionSlider({ dataPoints, initialW = 1.0, initialB = 0.0, wRange = [-2, 4], bRange = [-3, 8] }) {
  const points = dataPoints || DEFAULT_POINTS;
  const canvasRef = useRef(null);
  const [w, setW] = useState(initialW);
  const [b, setB] = useState(initialB);
  const losses = computeLosses(points, w, b);

  // Optimal by closed-form solution
  const n = points.length;
  const meanX = points.reduce((s, [x]) => s + x, 0) / n;
  const meanY = points.reduce((s, [, y]) => s + y, 0) / n;
  const optW = +(points.reduce((s, [x, y]) => s + (x - meanX) * (y - meanY), 0) /
    points.reduce((s, [x]) => s + (x - meanX) ** 2, 0)).toFixed(3);
  const optB = +(meanY - optW * meanX).toFixed(3);
  const optLosses = computeLosses(points, optW, optB);
  const isNearOptimal = losses.mse <= optLosses.mse * 1.15;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const PAD = { l: 48, r: 20, t: 20, b: 36 };
    const plotW = W - PAD.l - PAD.r;
    const plotH = H - PAD.t - PAD.b;

    // Data extent
    const xs = points.map(([x]) => x);
    const ys = points.map(([, y]) => y);
    const xMin = Math.min(...xs) - 0.5, xMax = Math.max(...xs) + 0.5;
    const yMin = Math.min(...ys, w * xMin + b, w * xMax + b) - 1;
    const yMax = Math.max(...ys, w * xMin + b, w * xMax + b) + 1;

    const toX = (x) => PAD.l + ((x - xMin) / (xMax - xMin)) * plotW;
    const toY = (y) => PAD.t + (1 - (y - yMin) / (yMax - yMin)) * plotH;

    // Background
    ctx.fillStyle = '#0d1117';
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const x = PAD.l + (i / 5) * plotW;
      ctx.beginPath(); ctx.moveTo(x, PAD.t); ctx.lineTo(x, PAD.t + plotH); ctx.stroke();
      const y = PAD.t + (i / 5) * plotH;
      ctx.beginPath(); ctx.moveTo(PAD.l, y); ctx.lineTo(PAD.l + plotW, y); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(PAD.l, PAD.t); ctx.lineTo(PAD.l, PAD.t + plotH); ctx.lineTo(PAD.l + plotW, PAD.t + plotH); ctx.stroke();

    // Axis labels
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('x (input)', PAD.l + plotW / 2, H - 4);
    ctx.save(); ctx.translate(12, PAD.t + plotH / 2); ctx.rotate(-Math.PI / 2);
    ctx.fillText('y (output)', 0, 0); ctx.restore();

    // Residual lines
    for (const [x, y] of points) {
      const pred = w * x + b;
      ctx.strokeStyle = 'rgba(245,158,11,0.45)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(toX(x), toY(y));
      ctx.lineTo(toX(x), toY(pred));
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Regression line
    ctx.strokeStyle = '#00d4aa';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(toX(xMin), toY(w * xMin + b));
    ctx.lineTo(toX(xMax), toY(w * xMax + b));
    ctx.stroke();

    // Optimal line (faint reference)
    ctx.strokeStyle = 'rgba(99,102,241,0.35)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.moveTo(toX(xMin), toY(optW * xMin + optB));
    ctx.lineTo(toX(xMax), toY(optW * xMax + optB));
    ctx.stroke();
    ctx.setLineDash([]);

    // Data points
    for (const [x, y] of points) {
      ctx.beginPath();
      ctx.arc(toX(x), toY(y), 5, 0, Math.PI * 2);
      ctx.fillStyle = '#3b82f6';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.5)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }, [w, b, points, optW, optB]);

  useEffect(() => { draw(); }, [draw]);

  const pct = (val, min, max) => ((val - min) / (max - min)) * 100;

  return (
    <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>📈 Linear Regression Explorer</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>
            Adjust <strong style={{ color: 'var(--accent)' }}>w</strong> and <strong style={{ color: 'var(--accent)' }}>b</strong> to fit y = wx + b
          </div>
        </div>
        {isNearOptimal && (
          <div style={{ padding: '6px 12px', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 'var(--radius-full)', fontSize: '0.78rem', color: 'var(--green)', fontWeight: 600 }}>
            🎯 Near optimal!
          </div>
        )}
      </div>

      {/* Sliders */}
      <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, borderBottom: '1px solid var(--border)' }}>
        {[
          { label: 'Weight (w)', val: w, min: wRange[0], max: wRange[1], set: setW, color: '#00d4aa' },
          { label: 'Bias (b)', val: b, min: bRange[0], max: bRange[1], set: setB, color: '#3b82f6' },
        ].map(({ label, val, min, max, set, color }) => (
          <div key={label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 8 }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{label}</span>
              <span style={{ fontWeight: 700, color, minWidth: 40, textAlign: 'right' }}>{val.toFixed(2)}</span>
            </div>
            <div style={{ position: 'relative', height: 6, margin: '4px 0' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'var(--bg-tertiary)', borderRadius: 3 }} />
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${pct(val, min, max)}%`, background: color, borderRadius: 3 }} />
              {/* Thumb dot */}
              <div style={{
                position: 'absolute', top: '50%', left: `${pct(val, min, max)}%`,
                transform: 'translate(-50%, -50%)',
                width: 16, height: 16, borderRadius: '50%',
                background: color,
                border: '2px solid rgba(255,255,255,0.9)',
                boxShadow: `0 0 8px ${color}88`,
                pointerEvents: 'none',
                transition: 'box-shadow 0.15s',
              }} />
              <input type="range" min={min} max={max} step={0.05} value={val}
                onChange={e => set(parseFloat(e.target.value))}
                style={{ position: 'absolute', inset: '-8px 0', width: '100%', opacity: 0, cursor: 'pointer', height: 22 }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 4 }}>
              <span>{min}</span><span>{max}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Canvas */}
      <canvas ref={canvasRef} width={560} height={280}
        style={{ display: 'block', width: '100%', height: 'auto', cursor: 'crosshair' }}
      />

      {/* Legend */}
      <div style={{ padding: '8px 20px 12px', display: 'flex', gap: 16, fontSize: '0.72rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
        <span><span style={{ color: '#00d4aa' }}>━</span> Your line (y = {w.toFixed(2)}x + {b.toFixed(2)})</span>
        <span><span style={{ color: 'rgba(99,102,241,0.6)' }}>╌</span> Optimal (y = {optW}x + {optB})</span>
        <span style={{ color: '#f59e0b' }}>┊</span><span>Residual errors</span>
      </div>

      {/* Loss metrics */}
      <div style={{ padding: '12px 20px 16px', borderTop: '1px solid var(--border)', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {[
          { label: 'MSE', val: losses.mse, opt: optLosses.mse },
          { label: 'MAE', val: losses.mae, opt: optLosses.mae },
          { label: 'RMSE', val: losses.rmse, opt: optLosses.rmse },
        ].map(({ label, val, opt }) => {
          const ratio = val / opt;
          const color = ratio < 1.1 ? 'var(--green)' : ratio < 2 ? 'var(--orange)' : '#ef4444';
          return (
            <div key={label} style={{ textAlign: 'center', padding: '10px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', border: `1px solid ${ratio < 1.1 ? 'rgba(16,185,129,0.3)' : 'var(--border)'}` }}>
              <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color, fontFamily: 'JetBrains Mono, monospace' }}>{val}</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 2 }}>opt: {opt}</div>
            </div>
          );
        })}
      </div>

      {/* Reset */}
      <div style={{ padding: '0 20px 16px', display: 'flex', gap: 8 }}>
        <button onClick={() => { setW(initialW); setB(initialB); }}
          style={{ padding: '6px 14px', fontSize: '0.8rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)', cursor: 'pointer' }}>
          ↩ Reset
        </button>
        <button onClick={() => { setW(optW); setB(optB); }}
          style={{ padding: '6px 14px', fontSize: '0.8rem', background: 'var(--accent-soft)', border: '1px solid var(--border-accent)', borderRadius: 'var(--radius-sm)', color: 'var(--accent)', cursor: 'pointer' }}>
          ✓ Show optimal
        </button>
      </div>
    </div>
  );
}
