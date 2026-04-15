'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Toast, { showToast } from '@/components/Toast';
import { api } from '@/lib/api';

// ══════════════════════════════════════════════════════════════
// OVERFITTING CHALLENGE GAME
// ══════════════════════════════════════════════════════════════
function OverfittingGame() {
  const canvasRef = useRef(null);
  const [degree, setDegree] = useState(1);
  const [trainAcc, setTrainAcc] = useState(0);
  const [testAcc, setTestAcc] = useState(0);
  const [bestTestAcc, setBestTestAcc] = useState(0);
  const [score, setScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const dataRef = useRef(null);

  // Generate dataset once
  useEffect(() => {
    const n = 30;
    const pts = Array.from({ length: n }, (_, i) => {
      const x = (i / (n - 1)) * 4 - 2;
      const y = Math.sin(x * Math.PI) + (Math.random() - 0.5) * 0.6;
      return { x, y };
    });
    const shuffled = [...pts].sort(() => Math.random() - 0.5);
    dataRef.current = { train: shuffled.slice(0, 21), test: shuffled.slice(21) };
  }, []);

  useEffect(() => {
    if (!dataRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const { train, test } = dataRef.current;

    const toX = x => ((x + 2.5) / 5) * W;
    const toY = y => H / 2 - (y / 2) * (H * 0.4);

    // Fit polynomial to training data (Vandermonde least squares)
    function polyFit(pts, deg) {
      const n = pts.length, m = deg + 1;
      const X = pts.map(p => Array.from({ length: m }, (_, j) => Math.pow(p.x, j)));
      // Normal equations: (X^T X)^-1 X^T y
      const XtX = Array.from({ length: m }, (_, i) => Array.from({ length: m }, (_, j) => X.reduce((s, row) => s + row[i] * row[j], 0)));
      const Xty = Array.from({ length: m }, (_, i) => X.reduce((s, row, k) => s + row[i] * pts[k].y, 0));
      // Gaussian elimination
      const aug = XtX.map((row, i) => [...row, Xty[i]]);
      for (let col = 0; col < m; col++) {
        let pivot = col; for (let r = col + 1; r < m; r++) if (Math.abs(aug[r][col]) > Math.abs(aug[pivot][col])) pivot = r;
        [aug[col], aug[pivot]] = [aug[pivot], aug[col]];
        if (Math.abs(aug[col][col]) < 1e-12) continue;
        for (let r = 0; r < m; r++) {
          if (r === col) continue;
          const f = aug[r][col] / aug[col][col];
          for (let c = col; c <= m; c++) aug[r][c] -= f * aug[col][c];
        }
      }
      return aug.map((row, i) => row[m] / row[i]);
    }

    function polyEval(coeffs, x) { return coeffs.reduce((s, c, i) => s + c * Math.pow(x, i), 0); }
    function mse(pts, coeffs) { return pts.reduce((s, p) => s + Math.pow(polyEval(coeffs, p.x) - p.y, 2), 0) / pts.length; }
    function mseToAcc(m) { return Math.max(0, Math.min(100, Math.round(100 - m * 25))); }

    const coeffs = polyFit(train, Math.min(degree, train.length - 1));
    const tAcc = mseToAcc(mse(train, coeffs));
    const teAcc = mseToAcc(mse(test, coeffs));
    setTrainAcc(tAcc);
    setTestAcc(teAcc);
    setBestTestAcc(prev => Math.max(prev, teAcc));

    // Draw
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0d1117';
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      ctx.beginPath(); ctx.moveTo(i * W / 5, 0); ctx.lineTo(i * W / 5, H); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i * H / 5); ctx.lineTo(W, i * H / 5); ctx.stroke();
    }

    // Fitted curve
    const grad = ctx.createLinearGradient(0, 0, W, 0);
    const overfit = degree > 5;
    grad.addColorStop(0, overfit ? '#ef4444' : '#00d4aa');
    grad.addColorStop(1, overfit ? '#f97316' : '#3b82f6');
    ctx.beginPath(); ctx.strokeStyle = grad; ctx.lineWidth = 2.5;
    for (let px = 0; px < W; px++) {
      const x = (px / W) * 5 - 2.5;
      const y = polyEval(coeffs, x);
      px === 0 ? ctx.moveTo(px, toY(y)) : ctx.lineTo(px, toY(y));
    }
    ctx.stroke();

    // Data points
    train.forEach(p => {
      ctx.beginPath(); ctx.arc(toX(p.x), toY(p.y), 4, 0, Math.PI * 2);
      ctx.fillStyle = '#00d4aa'; ctx.fill();
    });
    test.forEach(p => {
      ctx.beginPath(); ctx.arc(toX(p.x), toY(p.y), 4, 0, Math.PI * 2);
      ctx.fillStyle = '#f472b6'; ctx.fill();
    });
  }, [degree]);

  const handleSubmit = async () => {
    const finalScore = bestTestAcc * 20;
    setScore(finalScore);
    setSubmitted(true);
    try {
      await api.saveGameScore({ gameId: 'overfitting-challenge', score: finalScore });
      showToast({ message: `Game over! Score: ${finalScore} — ${finalScore > 1500 ? '🔥 Amazing!' : 'Good job!'}`, type: 'success' });
    } catch (e) {}
  };

  return (
    <div className="animate-fade">
      <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
        {[
          { label: 'Train Accuracy', value: `${trainAcc}%`, color: 'var(--accent)' },
          { label: 'Test Accuracy', value: `${testAcc}%`, color: '#f472b6' },
          { label: 'Best Test', value: `${bestTestAcc}%`, color: 'var(--orange)' },
        ].map(s => (
          <div key={s.label} className="card" style={{ flex: 1, minWidth: 120, textAlign: 'center', padding: '16px' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <canvas ref={canvasRef} width={700} height={360} style={{ width: '100%', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', display: 'block' }} />

      <div style={{ marginTop: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.88rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Polynomial Degree</span>
          <span style={{ fontWeight: 700, color: degree > 6 ? 'var(--red)' : degree > 3 ? 'var(--orange)' : 'var(--green)' }}>
            {degree} {degree === 1 ? '(linear)' : degree > 8 ? '⚠️ OVERFIT' : degree > 4 ? '(complex)' : '(good)'}
          </span>
        </div>
        <input type="range" min={1} max={12} value={degree} onChange={e => setDegree(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--accent)' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>
          <span>Underfit (deg 1)</span><span>Sweet Spot (deg 2-4)</span><span>Overfit (deg 12)</span>
        </div>
      </div>

      <div style={{ marginTop: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 16, flex: 1, fontSize: '0.82rem', color: 'var(--text-muted)', alignItems: 'center' }}>
          <span>🟢 Train data</span><span>🩷 Test data</span>
        </div>
        {!submitted ? (
          <button className="btn btn-primary" onClick={handleSubmit}>Submit Score 🎯</button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--green)', fontWeight: 600 }}>
            ✅ Score submitted: {score} pts
          </div>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// NEURAL NETWORK TRAINER GAME
// ══════════════════════════════════════════════════════════════
function NeuralNetGame() {
  const lossCanvasRef = useRef(null);
  const [neurons, setNeurons] = useState(4);
  const [lr, setLr] = useState(0.1);
  const [training, setTraining] = useState(false);
  const [accuracy, setAccuracy] = useState(50);
  const [lossHistory, setLossHistory] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = lossCanvasRef.current;
    if (!canvas || lossHistory.length === 0) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0d1117'; ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      ctx.beginPath(); ctx.moveTo(0, (i / 4) * H); ctx.lineTo(W, (i / 4) * H); ctx.stroke();
    }

    // Loss curve
    if (lossHistory.length > 1) {
      const maxLoss = 2.5;
      ctx.beginPath(); ctx.strokeStyle = 'var(--accent)'; ctx.lineWidth = 2;
      lossHistory.forEach((l, i) => {
        const x = (i / (100 - 1)) * W;
        const y = H - (Math.min(l, maxLoss) / maxLoss) * H;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.stroke();
    }
  }, [lossHistory]);

  const train = () => {
    setTraining(true);
    setLossHistory([]);
    setAccuracy(50);
    let step = 0;
    let loss = 2.5;
    const target = 0.05 + (0.4 / neurons);
    const history = [];

    const tick = () => {
      if (step >= 100) {
        setTraining(false);
        return;
      }
      const noise = (Math.random() - 0.5) * lr * 0.4;
      const decay = Math.exp(-step * lr * 0.06);
      loss = target + (loss - target) * (1 - lr * 0.12) + noise * decay;
      if (lr > 0.5 && Math.random() < 0.08) loss += lr * 0.25;
      loss = Math.max(target * 0.7, loss);
      history.push(loss);
      setLossHistory([...history]);
      const acc = Math.round(50 + (2.5 - loss) / 2.5 * 45);
      setAccuracy(Math.min(98, Math.max(50, acc)));
      step++;
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => () => cancelAnimationFrame(animRef.current), []);

  const handleSubmit = async () => {
    const finalScore = Math.round(accuracy * 10);
    setSubmitted(true);
    try {
      await api.saveGameScore({ gameId: 'neural-network-trainer', score: finalScore });
      showToast({ message: `Neural Net Trainer: ${accuracy}% accuracy! +30 XP`, type: 'success' });
    } catch (e) {}
  };

  return (
    <div className="animate-fade">
      <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
        <div className="card" style={{ flex: 1, textAlign: 'center', padding: 16 }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent)' }}>{accuracy}%</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: 2 }}>Accuracy</div>
        </div>
        <div className="card" style={{ flex: 1, textAlign: 'center', padding: 16 }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--blue)' }}>{lossHistory.length > 0 ? lossHistory[lossHistory.length - 1].toFixed(3) : '—'}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: 2 }}>Current Loss</div>
        </div>
        <div className="card" style={{ flex: 1, textAlign: 'center', padding: 16 }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--purple)' }}>{neurons}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: 2 }}>Neurons</div>
        </div>
      </div>

      <canvas ref={lossCanvasRef} width={700} height={280} style={{ width: '100%', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', display: 'block', marginBottom: 20 }} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: 8 }}>
            <span style={{ color: 'var(--text-muted)' }}>Hidden Neurons</span>
            <span style={{ fontWeight: 700, color: 'var(--purple)' }}>{neurons}</span>
          </div>
          <input type="range" min={2} max={8} value={neurons} onChange={e => setNeurons(Number(e.target.value))} disabled={training} style={{ width: '100%', accentColor: 'var(--purple)' }} />
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: 8 }}>
            <span style={{ color: 'var(--text-muted)' }}>Learning Rate</span>
            <span style={{ fontWeight: 700, color: lr > 0.5 ? 'var(--red)' : lr < 0.05 ? 'var(--orange)' : 'var(--green)' }}>{lr}</span>
          </div>
          <input type="range" min={0.01} max={1.0} step={0.01} value={lr} onChange={e => setLr(Number(e.target.value))} disabled={training} style={{ width: '100%', accentColor: 'var(--blue)' }} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button className="btn btn-primary" onClick={train} disabled={training}>
          {training ? <><span className="spinner" style={{ width: 14, height: 14 }} /> Training...</> : '▶ Train Network'}
        </button>
        {!training && lossHistory.length > 0 && !submitted && (
          <button className="btn btn-secondary" onClick={handleSubmit}>Submit Score 🎯</button>
        )}
        {submitted && <span style={{ color: 'var(--green)', fontWeight: 600, display: 'flex', alignItems: 'center' }}>✅ Score submitted!</span>}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// MAIN PAGE
// ══════════════════════════════════════════════════════════════
const GAME_COMPONENTS = {
  'overfitting-challenge': OverfittingGame,
  'neural-network-trainer': NeuralNetGame,
};
const GAME_META = {
  'overfitting-challenge': { title: '📉 Overfitting Challenge', desc: 'Find the sweet spot between underfitting and overfitting. Adjust polynomial degree, watch train vs test accuracy.' },
  'neural-network-trainer': { title: '🧠 Neural Network Trainer', desc: 'Configure your network and watch it learn. Tune neurons and learning rate to maximize accuracy.' },
};

export default function GamePage() {
  const router = useRouter();
  const params = useParams();
  const gameId = params.gameId;

  useEffect(() => { if (!localStorage.getItem('elixa_token')) router.push('/login'); }, [router]);

  const GameComponent = GAME_COMPONENTS[gameId];
  const meta = GAME_META[gameId];

  if (!GameComponent) return (
    <>
      <Navbar />
      <div className="page-wrapper" style={{ textAlign: 'center' }}>
        <h1>Game not found</h1>
        <Link href="/games" className="btn btn-primary" style={{ marginTop: 20, display: 'inline-flex' }}>← All Games</Link>
      </div>
    </>
  );

  return (
    <>
      <Navbar />
      <Toast />
      <div className="page-wrapper">
        <div className="container" style={{ maxWidth: 840 }}>
          <div style={{ marginBottom: 24 }}>
            <Link href="/games" style={{ color: 'var(--accent)', fontSize: '0.88rem' }}>← All Games</Link>
          </div>
          <div className="animate-fade" style={{ marginBottom: 28 }}>
            <h1 style={{ marginBottom: 6 }}>{meta?.title}</h1>
            <p style={{ color: 'var(--text-muted)' }}>{meta?.desc}</p>
          </div>
          <GameComponent />
        </div>
      </div>
    </>
  );
}
