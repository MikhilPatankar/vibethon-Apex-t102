'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

// Network architecture
const LAYERS = [2, 4, 3, 1]; // inputs, hidden1, hidden2, outputs
const LAYER_LABELS = ['Input', 'Hidden 1', 'Hidden 2', 'Output'];

function randomWeights() {
  const w = [];
  for (let l = 0; l < LAYERS.length - 1; l++) {
    w.push(Array.from({ length: LAYERS[l] }, () =>
      Array.from({ length: LAYERS[l + 1] }, () => (Math.random() - 0.5) * 2)
    ));
  }
  return w;
}

function sigmoid(x) { return 1 / (1 + Math.exp(-x)); }

function forwardPass(inputs, weights) {
  let a = inputs;
  const activations = [a];
  for (const W of weights) {
    const next = W[0].map((_, j) => sigmoid(a.reduce((s, ai, i) => s + ai * W[i][j], 0)));
    activations.push(next);
    a = next;
  }
  return activations;
}

function computeLoss(activations, target) {
  const out = activations[activations.length - 1][0];
  return +(-(target * Math.log(out + 1e-7) + (1 - target) * Math.log(1 - out + 1e-7))).toFixed(4);
}

const SAMPLE_INPUT = [0.7, 0.3];
const SAMPLE_TARGET = 1;

export default function NeuralNetworkViz() {
  const canvasRef = useRef(null);
  const [weights, setWeights] = useState(randomWeights);
  const [lossHistory, setLossHistory] = useState([]);
  const [training, setTraining] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const trainRef = useRef(false);
  const lossRef = useRef([]);

  const activations = forwardPass(SAMPLE_INPUT, weights);
  const currentLoss = computeLoss(activations, SAMPLE_TARGET);
  const output = activations[activations.length - 1][0];

  const draw = useCallback(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const CW = canvas.width, CH = canvas.height;
    ctx.fillStyle = '#0d1117'; ctx.fillRect(0, 0, CW, CH);

    const layerX = LAYERS.map((_, i) => 60 + (i / (LAYERS.length - 1)) * (CW - 120));
    const nodePos = LAYERS.map((n, l) => {
      const spacing = Math.min(56, (CH - 60) / Math.max(n - 1, 1));
      const totalH = (n - 1) * spacing;
      return Array.from({ length: n }, (_, i) => ({ x: layerX[l], y: CH / 2 - totalH / 2 + i * spacing }));
    });

    // Draw edges
    for (let l = 0; l < LAYERS.length - 1; l++) {
      for (let i = 0; i < LAYERS[l]; i++) {
        for (let j = 0; j < LAYERS[l + 1]; j++) {
          const w = weights[l][i][j];
          const strength = Math.abs(w) / 2;
          ctx.strokeStyle = w > 0 ? `rgba(0,212,170,${0.1 + strength * 0.4})` : `rgba(239,68,68,${0.1 + strength * 0.4})`;
          ctx.lineWidth = 0.5 + strength * 2;
          ctx.beginPath();
          ctx.moveTo(nodePos[l][i].x, nodePos[l][i].y);
          ctx.lineTo(nodePos[l + 1][j].x, nodePos[l + 1][j].y);
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    for (let l = 0; l < LAYERS.length; l++) {
      for (let i = 0; i < LAYERS[l]; i++) {
        const { x, y } = nodePos[l][i];
        const act = activations[l]?.[i] ?? 0;
        const col = l === 0 ? '#3b82f6' : l === LAYERS.length - 1 ? (output > 0.5 ? '#00d4aa' : '#ef4444') : '#8b5cf6';

        // Glow
        ctx.shadowBlur = 12; ctx.shadowColor = col + '88';
        ctx.beginPath(); ctx.arc(x, y, 16, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${l === 0 ? '59,130,246' : l === LAYERS.length - 1 ? (output > 0.5 ? '0,212,170' : '239,68,68') : '139,92,246'},${0.15 + act * 0.35})`;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.stroke();

        // Activation value
        ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.font = 'bold 9px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(act.toFixed(2), x, y);
      }

      // Layer label
      ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.font = '10px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
      ctx.fillText(LAYER_LABELS[l], layerX[l], 14);
    }
    ctx.textBaseline = 'alphabetic';
  }, [weights, activations, output]);

  useEffect(() => { draw(); }, [draw]);

  // Simulated training: perturb weights toward lower loss
  const trainStep = (w) => {
    const newW = w.map(layer => layer.map(row => row.map(wij => wij + (Math.random() - 0.5) * 0.15)));
    const oldAct = forwardPass(SAMPLE_INPUT, w);
    const newAct = forwardPass(SAMPLE_INPUT, newW);
    return computeLoss(newAct, SAMPLE_TARGET) < computeLoss(oldAct, SAMPLE_TARGET) ? newW : w.map(layer => layer.map(row => row.map(wij => wij + (Math.random() - 0.5) * 0.08)));
  };

  const handleTrain = async () => {
    if (training) { trainRef.current = false; setTraining(false); return; }
    setTraining(true); trainRef.current = true;
    lossRef.current = [currentLoss];
    for (let i = 0; i < 80; i++) {
      if (!trainRef.current) break;
      setWeights(prev => {
        const nw = trainStep(prev);
        const acts = forwardPass(SAMPLE_INPUT, nw);
        const l = computeLoss(acts, SAMPLE_TARGET);
        lossRef.current = [...lossRef.current.slice(-50), l];
        setLossHistory([...lossRef.current]);
        return nw;
      });
      setEpoch(i + 1);
      await new Promise(r => setTimeout(r, 60));
    }
    trainRef.current = false; setTraining(false);
  };

  const handleReset = () => { trainRef.current = false; setTraining(false); setWeights(randomWeights()); setLossHistory([]); setEpoch(0); lossRef.current = []; };

  // Draw mini loss curve
  const lossCanvas = useRef(null);
  useEffect(() => {
    const c = lossCanvas.current; if (!c || lossHistory.length < 2) return;
    const ctx = c.getContext('2d');
    const W = c.width, H = c.height;
    ctx.fillStyle = '#0d1117'; ctx.fillRect(0, 0, W, H);
    const lMin = Math.min(...lossHistory), lMax = Math.max(...lossHistory);
    const range = lMax - lMin || 1;
    ctx.strokeStyle = '#00d4aa'; ctx.lineWidth = 2; ctx.beginPath();
    lossHistory.forEach((l, i) => {
      const x = (i / (lossHistory.length - 1)) * W;
      const y = H - ((l - lMin) / range) * H;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();
  }, [lossHistory]);

  return (
    <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>🧠 Neural Network Visualizer</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>Watch signals flow through layers — brighter nodes = stronger activation</div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Output:</div>
          <div style={{ padding: '4px 12px', background: output > 0.5 ? 'rgba(0,212,170,0.12)' : 'rgba(239,68,68,0.1)', border: `1px solid ${output > 0.5 ? 'rgba(0,212,170,0.3)' : 'rgba(239,68,68,0.3)'}`, borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700, color: output > 0.5 ? '#00d4aa' : '#ef4444' }}>
            {output.toFixed(3)} → Class {output > 0.5 ? 1 : 0}
          </div>
        </div>
      </div>

      {/* Network diagram */}
      <canvas ref={canvasRef} width={560} height={220} style={{ display: 'block', width: '100%', height: 'auto' }} />

      {/* Legend */}
      <div style={{ padding: '8px 20px', display: 'flex', gap: 20, fontSize: '0.72rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border)', flexWrap: 'wrap' }}>
        <span><span style={{ color: '#3b82f6' }}>●</span> Input layer</span>
        <span><span style={{ color: '#8b5cf6' }}>●</span> Hidden layers</span>
        <span><span style={{ color: '#00d4aa' }}>●</span> Output</span>
        <span><span style={{ color: '#00d4aa' }}>━</span> +ve weight</span>
        <span><span style={{ color: '#ef4444' }}>━</span> –ve weight</span>
      </div>

      {/* Loss curve + controls */}
      <div style={{ padding: '14px 20px 16px', borderTop: '1px solid var(--border)', display: 'grid', gridTemplateColumns: '1fr 180px', gap: 20, alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Loss curve {epoch > 0 ? `(epoch ${epoch})` : ''}</div>
          <canvas ref={lossCanvas} width={300} height={60} style={{ display: 'block', width: '100%', height: 60, borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }} />
          {lossHistory.length === 0 && <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: 4 }}>Press Train to see loss decrease</div>}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ textAlign: 'center', padding: '10px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Current Loss</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, color: currentLoss < 0.3 ? 'var(--green)' : currentLoss < 0.7 ? '#f59e0b' : '#ef4444', fontFamily: 'monospace' }}>{currentLoss}</div>
          </div>
          <button onClick={handleTrain} style={{ padding: '9px', fontSize: '0.82rem', background: training ? 'rgba(239,68,68,0.12)' : 'var(--accent-soft)', border: `1px solid ${training ? 'rgba(239,68,68,0.3)' : 'var(--border-accent)'}`, borderRadius: 'var(--radius-sm)', color: training ? '#ef4444' : 'var(--accent)', cursor: 'pointer', fontWeight: 600 }}>
            {training ? '⏹ Stop' : '▶ Train'}
          </button>
          <button onClick={handleReset} style={{ padding: '9px', fontSize: '0.82rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            ↩ Reset
          </button>
        </div>
      </div>
    </div>
  );
}
