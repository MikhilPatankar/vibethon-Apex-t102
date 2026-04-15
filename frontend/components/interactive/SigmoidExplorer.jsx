'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

const sigmoid = (z) => 1 / (1 + Math.exp(-z));

export default function SigmoidExplorer() {
  const canvasRef = useRef(null);
  const [z, setZ] = useState(0);
  const [threshold, setThreshold] = useState(0.5);
  const prob = sigmoid(z);
  const predictedClass = prob >= threshold ? 1 : 0;

  const draw = useCallback(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const CW = canvas.width, CH = canvas.height;
    const PAD = { l: 48, r: 20, t: 20, b: 36 };
    const pw = CW - PAD.l - PAD.r, ph = CH - PAD.t - PAD.b;
    const zMin = -6, zMax = 6, sigMin = 0, sigMax = 1;
    const tx = (x) => PAD.l + ((x - zMin) / (zMax - zMin)) * pw;
    const ty = (y) => PAD.t + (1 - (y - sigMin) / (sigMax - sigMin)) * ph;

    ctx.fillStyle = '#0d1117'; ctx.fillRect(0, 0, CW, CH);
    ctx.strokeStyle = 'rgba(255,255,255,0.04)'; ctx.lineWidth = 1;
    for (let i = 0; i <= 6; i++) {
      const x = PAD.l + (i / 6) * pw; ctx.beginPath(); ctx.moveTo(x, PAD.t); ctx.lineTo(x, PAD.t + ph); ctx.stroke();
    }
    for (let i = 0; i <= 4; i++) {
      const y = PAD.t + (i / 4) * ph; ctx.beginPath(); ctx.moveTo(PAD.l, y); ctx.lineTo(PAD.l + pw, y); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(PAD.l, PAD.t); ctx.lineTo(PAD.l, PAD.t + ph); ctx.lineTo(PAD.l + pw, PAD.t + ph); ctx.stroke();
    // Y axis labels
    ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.font = '10px Inter'; ctx.textAlign = 'right';
    [0, 0.25, 0.5, 0.75, 1].forEach(v => ctx.fillText(v.toFixed(2), PAD.l - 4, ty(v) + 4));
    ctx.textAlign = 'center';
    [-6, -3, 0, 3, 6].forEach(v => ctx.fillText(v, tx(v), PAD.t + ph + 16));
    ctx.fillText('z', PAD.l + pw / 2, CH - 2);
    ctx.save(); ctx.translate(12, PAD.t + ph / 2); ctx.rotate(-Math.PI / 2); ctx.fillText('σ(z)', 0, 0); ctx.restore();

    // Threshold fill areas
    const threshY = ty(threshold);
    ctx.fillStyle = 'rgba(59,130,246,0.06)';
    ctx.fillRect(PAD.l, threshY, pw, PAD.t + ph - threshY);
    ctx.fillStyle = 'rgba(239,68,68,0.06)';
    ctx.fillRect(PAD.l, PAD.t, pw, threshY - PAD.t);

    // Threshold line
    ctx.strokeStyle = 'rgba(245,158,11,0.6)'; ctx.lineWidth = 1.5; ctx.setLineDash([5, 4]);
    ctx.beginPath(); ctx.moveTo(PAD.l, threshY); ctx.lineTo(PAD.l + pw, threshY); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#f59e0b'; ctx.font = 'bold 10px Inter'; ctx.textAlign = 'left';
    ctx.fillText(`threshold = ${threshold.toFixed(2)}`, PAD.l + 6, threshY - 5);

    // Sigmoid curve
    const grad = ctx.createLinearGradient(PAD.l, 0, PAD.l + pw, 0);
    grad.addColorStop(0, '#ef4444'); grad.addColorStop(0.5, '#f59e0b'); grad.addColorStop(1, '#3b82f6');
    ctx.strokeStyle = grad; ctx.lineWidth = 3; ctx.beginPath();
    let first = true;
    for (let zi = zMin; zi <= zMax; zi += 0.05) {
      const si = sigmoid(zi);
      if (first) { ctx.moveTo(tx(zi), ty(si)); first = false; } else ctx.lineTo(tx(zi), ty(si));
    }
    ctx.stroke();

    // Drop lines for current z
    const cx = tx(z), cy = ty(prob);
    ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(cx, PAD.t + ph); ctx.lineTo(cx, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(PAD.l, cy); ctx.lineTo(cx, cy); ctx.stroke();
    ctx.setLineDash([]);

    // Point on curve
    ctx.beginPath(); ctx.arc(cx, cy, 9, 0, Math.PI * 2);
    ctx.fillStyle = predictedClass === 1 ? '#3b82f6' : '#ef4444'; ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.lineWidth = 2; ctx.stroke();
  }, [z, threshold, prob, predictedClass]);

  useEffect(() => { draw(); }, [draw]);

  const pct = (val, mn, mx) => ((val - mn) / (mx - mn)) * 100;

  return (
    <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>〰️ Sigmoid Function Explorer</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>Adjust z to see how σ(z) maps any number to a probability between 0 and 1</div>
        </div>
        <div style={{ padding: '6px 14px', background: predictedClass === 1 ? 'rgba(59,130,246,0.12)' : 'rgba(239,68,68,0.1)', border: `1px solid ${predictedClass === 1 ? 'rgba(59,130,246,0.3)' : 'rgba(239,68,68,0.3)'}`, borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700, color: predictedClass === 1 ? '#3b82f6' : '#ef4444' }}>
          Predicted: Class {predictedClass}
        </div>
      </div>

      {/* Sliders */}
      <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {[
          { label: 'Input z (linear score)', val: z, mn: -6, mx: 6, step: 0.1, set: setZ, color: '#00d4aa', fmt: (v) => v.toFixed(1) },
          { label: 'Decision Threshold', val: threshold, mn: 0.1, mx: 0.9, step: 0.05, set: setThreshold, color: '#f59e0b', fmt: (v) => v.toFixed(2) },
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
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 4 }}><span>{mn}</span><span>{mx}</span></div>
          </div>
        ))}
      </div>

      <canvas ref={canvasRef} width={560} height={260} style={{ display: 'block', width: '100%', height: 'auto' }} />

      {/* Stats bar */}
      <div style={{ padding: '12px 20px 16px', borderTop: '1px solid var(--border)', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { label: 'z (input)', val: z.toFixed(2), color: '#00d4aa' },
          { label: 'σ(z) = prob', val: prob.toFixed(4), color: predictedClass === 1 ? '#3b82f6' : '#ef4444' },
          { label: 'Threshold', val: threshold.toFixed(2), color: '#f59e0b' },
          { label: 'Prediction', val: `Class ${predictedClass}`, color: predictedClass === 1 ? '#3b82f6' : '#ef4444' },
        ].map(({ label, val, color }) => (
          <div key={label} style={{ textAlign: 'center', padding: '10px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color, fontFamily: 'monospace' }}>{val}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
