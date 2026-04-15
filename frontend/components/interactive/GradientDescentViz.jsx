'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

// Loss function: L(w) = (w - 2.5)^2  → minimum at w=2.5
const loss = (w) => (w - 2.5) ** 2;
const gradient = (w) => 2 * (w - 2.5);

export default function GradientDescentViz() {
  const canvasRef = useRef(null);
  const [w, setW] = useState(-2.0);
  const [lr, setLr] = useState(0.2);
  const [history, setHistory] = useState([{ w: -2.0, L: loss(-2.0) }]);
  const [running, setRunning] = useState(false);
  const runRef = useRef(false);

  const step = useCallback((currentW) => {
    const g = gradient(currentW);
    const newW = currentW - lr * g;
    return Math.max(-4, Math.min(6, newW));
  }, [lr]);

  const handleStep = () => {
    setW(prev => {
      const nw = step(prev);
      setHistory(h => [...h.slice(-40), { w: nw, L: loss(nw) }]);
      return nw;
    });
  };

  const handleRun = async () => {
    if (running) { runRef.current = false; setRunning(false); return; }
    setRunning(true); runRef.current = true;
    let curr = w;
    for (let i = 0; i < 60; i++) {
      if (!runRef.current) break;
      const nw = step(curr);
      curr = nw;
      setW(nw);
      setHistory(h => [...h.slice(-40), { w: nw, L: loss(nw) }]);
      await new Promise(r => setTimeout(r, 80));
    }
    runRef.current = false; setRunning(false);
  };

  const handleReset = () => { runRef.current = false; setRunning(false); const start = -2.0; setW(start); setHistory([{ w: start, L: loss(start) }]); };

  // Draw loss curve + ball
  const draw = useCallback(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const CW = canvas.width, CH = canvas.height;
    const PAD = { l: 48, r: 20, t: 20, b: 36 };
    const pw = CW - PAD.l - PAD.r, ph = CH - PAD.t - PAD.b;
    const wMin = -4, wMax = 6, lMin = 0, lMax = 45;
    const tx = (x) => PAD.l + ((x - wMin) / (wMax - wMin)) * pw;
    const ty = (y) => PAD.t + (1 - (y - lMin) / (lMax - lMin)) * ph;

    ctx.fillStyle = '#0d1117'; ctx.fillRect(0, 0, CW, CH);
    ctx.strokeStyle = 'rgba(255,255,255,0.04)'; ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const x = PAD.l + (i / 5) * pw; ctx.beginPath(); ctx.moveTo(x, PAD.t); ctx.lineTo(x, PAD.t + ph); ctx.stroke();
      const y = PAD.t + (i / 5) * ph; ctx.beginPath(); ctx.moveTo(PAD.l, y); ctx.lineTo(PAD.l + pw, y); ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(PAD.l, PAD.t); ctx.lineTo(PAD.l, PAD.t + ph); ctx.lineTo(PAD.l + pw, PAD.t + ph); ctx.stroke();

    // Axis labels
    ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.font = '11px Inter';
    ctx.textAlign = 'center'; ctx.fillText('w (parameter)', PAD.l + pw / 2, CW - 4);
    ctx.save(); ctx.translate(12, PAD.t + ph / 2); ctx.rotate(-Math.PI / 2); ctx.fillText('L(w)', 0, 0); ctx.restore();

    // Optimal marker
    ctx.strokeStyle = 'rgba(16,185,129,0.3)'; ctx.lineWidth = 1.5; ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(tx(2.5), PAD.t); ctx.lineTo(tx(2.5), PAD.t + ph); ctx.stroke();
    ctx.setLineDash([]); ctx.fillStyle = 'rgba(16,185,129,0.5)'; ctx.font = '10px Inter'; ctx.textAlign = 'left';
    ctx.fillText('minimum', tx(2.5) + 4, PAD.t + 14);

    // Loss curve
    const grad = ctx.createLinearGradient(PAD.l, 0, PAD.l + pw, 0);
    grad.addColorStop(0, '#3b82f6'); grad.addColorStop(0.5, '#00d4aa'); grad.addColorStop(1, '#3b82f6');
    ctx.strokeStyle = grad; ctx.lineWidth = 2.5; ctx.beginPath();
    let first = true;
    for (let wi = wMin; wi <= wMax; wi += 0.05) {
      const li = loss(wi);
      if (li > lMax) { first = true; continue; }
      if (first) { ctx.moveTo(tx(wi), ty(li)); first = false; } else ctx.lineTo(tx(wi), ty(li));
    }
    ctx.stroke();

    // Path history
    if (history.length > 1) {
      ctx.strokeStyle = 'rgba(245,158,11,0.5)'; ctx.lineWidth = 1.5; ctx.setLineDash([3, 3]);
      ctx.beginPath(); ctx.moveTo(tx(history[0].w), ty(history[0].L));
      for (const h of history.slice(1)) ctx.lineTo(tx(h.w), ty(h.L));
      ctx.stroke(); ctx.setLineDash([]);
    }

    // Ball
    const bx = tx(w), by = ty(loss(w));
    ctx.beginPath(); ctx.arc(bx, by, 10, 0, Math.PI * 2);
    ctx.fillStyle = '#f59e0b'; ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = 2; ctx.stroke();
    // Gradient arrow
    const g = gradient(w); const arrowLen = Math.min(Math.abs(g) * 8, 60);
    const dir = g > 0 ? -1 : 1;
    ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2.5; ctx.beginPath();
    ctx.moveTo(bx, by); ctx.lineTo(bx + dir * arrowLen, by); ctx.stroke();
    ctx.fillStyle = '#ef4444';
    ctx.beginPath(); ctx.moveTo(bx + dir * arrowLen, by - 5); ctx.lineTo(bx + dir * arrowLen + dir * 8, by); ctx.lineTo(bx + dir * arrowLen, by + 5); ctx.fill();
  }, [w, history]);

  useEffect(() => { draw(); }, [draw]);

  const pct = (val, mn, mx) => ((val - mn) / (mx - mn)) * 100;
  const atMin = Math.abs(w - 2.5) < 0.05;
  const currentLoss = loss(w);

  return (
    <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>⛷️ Gradient Descent Visualizer</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>Watch the ball roll downhill to the minimum — adjust the learning rate to control speed</div>
        </div>
        {atMin && <div style={{ padding: '6px 12px', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 'var(--radius-full)', fontSize: '0.78rem', color: 'var(--green)', fontWeight: 600 }}>✓ Converged!</div>}
      </div>

      {/* LR Slider */}
      <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 8 }}>
          <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Learning Rate (α)</span>
          <span style={{ fontWeight: 700, color: lr > 0.6 ? '#ef4444' : lr > 0.3 ? '#f59e0b' : 'var(--green)', fontFamily: 'monospace' }}>{lr.toFixed(2)}{lr > 0.6 ? ' ⚠️ too high!' : lr < 0.05 ? ' 🐢 very slow' : ' ✓ good'}</span>
        </div>
        <div style={{ position: 'relative', height: 6, margin: '4px 0' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'var(--bg-tertiary)', borderRadius: 3 }} />
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${pct(lr, 0.01, 1.0)}%`, background: lr > 0.6 ? '#ef4444' : lr > 0.3 ? '#f59e0b' : 'var(--green)', borderRadius: 3 }} />
          <div style={{ position: 'absolute', top: '50%', left: `${pct(lr, 0.01, 1.0)}%`, transform: 'translate(-50%, -50%)', width: 16, height: 16, borderRadius: '50%', background: lr > 0.6 ? '#ef4444' : lr > 0.3 ? '#f59e0b' : 'var(--green)', border: '2px solid rgba(255,255,255,0.9)', pointerEvents: 'none' }} />
          <input type="range" min={0.01} max={1.0} step={0.01} value={lr} onChange={e => setLr(parseFloat(e.target.value))} style={{ position: 'absolute', inset: '-8px 0', width: '100%', opacity: 0, cursor: 'pointer', height: 22 }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 4 }}><span>0.01 (slow)</span><span>1.0 (fast/risky)</span></div>
      </div>

      <canvas ref={canvasRef} width={560} height={260} style={{ display: 'block', width: '100%', height: 'auto' }} />

      {/* Controls + stats */}
      <div style={{ padding: '12px 20px 16px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <button onClick={handleStep} disabled={running || atMin} style={{ padding: '8px 16px', fontSize: '0.82rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)', cursor: 'pointer' }}>
          ① Step
        </button>
        <button onClick={handleRun} style={{ padding: '8px 18px', fontSize: '0.82rem', background: running ? 'rgba(239,68,68,0.12)' : 'var(--accent-soft)', border: `1px solid ${running ? 'rgba(239,68,68,0.3)' : 'var(--border-accent)'}`, borderRadius: 'var(--radius-sm)', color: running ? '#ef4444' : 'var(--accent)', cursor: 'pointer', fontWeight: 600 }}>
          {running ? '⏹ Stop' : '▶ Run'}
        </button>
        <button onClick={handleReset} style={{ padding: '8px 16px', fontSize: '0.82rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)', cursor: 'pointer' }}>
          ↩ Reset
        </button>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 20, fontSize: '0.8rem' }}>
          {[{ label: 'w', val: w.toFixed(3) }, { label: 'L(w)', val: currentLoss.toFixed(3) }, { label: '∇L', val: gradient(w).toFixed(3) }, { label: 'Steps', val: history.length - 1 }].map(({ label, val }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{label}</div>
              <div style={{ fontWeight: 700, fontFamily: 'monospace', color: 'var(--accent)' }}>{val}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
