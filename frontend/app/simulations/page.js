'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Toast, { showToast } from '@/components/Toast';
import { api } from '@/lib/api';

// ── Spam Detector ─────────────────────────────────────────────
const DATASET = [
  { text: "Congratulations! You've won a $1000 gift card! Click here!", label: 1 },
  { text: "Hey, are we still meeting for lunch tomorrow?", label: 0 },
  { text: "URGENT: Your account will be suspended. Verify now!", label: 1 },
  { text: "Can you review the pull request I sent yesterday?", label: 0 },
  { text: "FREE iPhone! Limited time offer. Act NOW!", label: 1 },
  { text: "The project deadline has been moved to next Friday.", label: 0 },
  { text: "You've been selected as a winner! Send your details.", label: 1 },
  { text: "Don't forget to buy groceries on your way home.", label: 0 },
  { text: "Make $5000 per week working from home! Click link!", label: 1 },
  { text: "Team standup is rescheduled to 10:30 AM.", label: 0 },
  { text: "WINNING NOTIFICATION: Claim your prize money today!", label: 1 },
  { text: "Happy birthday! Hope you have a great day! 🎂", label: 0 },
  { text: "Lose weight fast! Buy our miracle supplement!", label: 1 },
  { text: "The quarterly report is ready for your review.", label: 0 },
  { text: "Get rich quick! Invest in crypto NOW for 500% returns!", label: 1 },
];

function naiveBayesPredict(text) {
  // Simple keyword-based naive Bayes simulation
  const spamWords = ['congratulations', 'won', 'free', 'urgent', 'click', 'winner', 'prize', 'claim', 'rich', 'crypto', 'miracle', 'limited', 'offer', 'suspended', 'verify', '$', '!'];
  const words = text.toLowerCase().split(/\s+/);
  const spamScore = words.filter(w => spamWords.some(sw => w.includes(sw))).length;
  const total = Math.max(words.length, 1);
  const spamProb = Math.min(0.98, 0.15 + (spamScore / total) * 1.5);
  return {
    prediction: spamProb > 0.5 ? 1 : 0,
    spamProb: Math.round(spamProb * 100),
    hamProb: Math.round((1 - spamProb) * 100),
    triggerWords: words.filter(w => spamWords.some(sw => w.includes(sw))).slice(0, 5),
  };
}

function SpamDetector() {
  const [trained, setTrained] = useState(false);
  const [accuracy, setAccuracy] = useState(0);
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [training, setTraining] = useState(false);

  const train = () => {
    setTraining(true);
    setTimeout(() => {
      let correct = 0;
      DATASET.forEach(d => { const r = naiveBayesPredict(d.text); if (r.prediction === d.label) correct++; });
      setAccuracy(Math.round((correct / DATASET.length) * 100));
      setTrained(true);
      setTraining(false);
    }, 800);
  };

  const classify = () => {
    if (!input.trim()) return;
    setResult(naiveBayesPredict(input));
  };

  return (
    <div>
      {/* Dataset preview */}
      <div style={{ overflowX: 'auto', marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          <span>Training Dataset ({DATASET.length} examples)</span>
          <span>Spam: {DATASET.filter(d => d.label === 1).length} | Ham: {DATASET.filter(d => d.label === 0).length}</span>
        </div>
        <table className="lesson-table" style={{ fontSize: '0.82rem' }}>
          <thead><tr><th>Email Text</th><th>Label</th></tr></thead>
          <tbody>
            {DATASET.slice(0, 8).map((d, i) => (
              <tr key={i}>
                <td>{d.text}</td>
                <td><span style={{ color: d.label === 1 ? 'var(--red)' : 'var(--green)', fontWeight: 600 }}>{d.label === 1 ? '🚨 SPAM' : '✅ HAM'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 6 }}>...and {DATASET.length - 8} more examples</div>
      </div>

      {/* Train button */}
      {!trained ? (
        <button className="btn btn-primary" onClick={train} disabled={training} style={{ marginBottom: 24 }}>
          {training ? <><span className="spinner" style={{ width: 14, height: 14 }} /> Training Naive Bayes...</> : '🤖 Train Model'}
        </button>
      ) : (
        <div style={{ padding: '12px 16px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 'var(--radius-sm)', marginBottom: 20, display: 'flex', gap: 16, alignItems: 'center' }}>
          <span style={{ color: 'var(--green)', fontWeight: 700 }}>✅ Model trained!</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Accuracy: {accuracy}%</span>
        </div>
      )}

      {/* Classify */}
      {trained && (
        <div>
          <div className="form-group" style={{ marginBottom: 12 }}>
            <label className="form-label">Test an email</label>
            <textarea className="form-input" value={input} onChange={e => setInput(e.target.value)}
              placeholder="Type an email here to classify it as spam or not spam..."
              rows={3} style={{ resize: 'vertical' }} />
          </div>
          <button className="btn btn-primary" onClick={classify} disabled={!input.trim()}>🔍 Classify</button>

          {result && (
            <div style={{ marginTop: 20, padding: '20px', background: result.prediction === 1 ? 'rgba(239,68,68,0.08)' : 'rgba(16,185,129,0.08)', border: `1px solid ${result.prediction === 1 ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.3)'}`, borderRadius: 'var(--radius-lg)' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: result.prediction === 1 ? 'var(--red)' : 'var(--green)', marginBottom: 12 }}>
                {result.prediction === 1 ? '🚨 SPAM' : '✅ NOT SPAM'}
              </div>
              <div style={{ display: 'flex', gap: 20, fontSize: '0.88rem', marginBottom: 12 }}>
                <span>Spam: <strong style={{ color: 'var(--red)' }}>{result.spamProb}%</strong></span>
                <span>Ham: <strong style={{ color: 'var(--green)' }}>{result.hamProb}%</strong></span>
              </div>
              {result.triggerWords.length > 0 && (
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Trigger words: {result.triggerWords.map(w => <span key={w} style={{ background: 'rgba(239,68,68,0.15)', color: 'var(--red)', padding: '2px 6px', borderRadius: 4, marginRight: 4 }}>{w}</span>)}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Image Classifier ──────────────────────────────────────────
const SAMPLE_IMAGES = [
  { id: 1, emoji: '🐱', label: 'Cat', predictions: [{ label: 'Cat', conf: 89 }, { label: 'Dog', conf: 7 }, { label: 'Rabbit', conf: 3 }, { label: 'Bird', conf: 1 }] },
  { id: 2, emoji: '🐶', label: 'Dog', predictions: [{ label: 'Dog', conf: 82 }, { label: 'Cat', conf: 12 }, { label: 'Fox', conf: 4 }, { label: 'Wolf', conf: 2 }] },
  { id: 3, emoji: '🌸', label: 'Flower', predictions: [{ label: 'Flower', conf: 91 }, { label: 'Plant', conf: 6 }, { label: 'Leaf', conf: 2 }, { label: 'Tree', conf: 1 }] },
  { id: 4, emoji: '🚗', label: 'Car', predictions: [{ label: 'Car', conf: 94 }, { label: 'Truck', conf: 4 }, { label: 'Bus', conf: 2 }, { label: 'Bike', conf: 0 }] },
  { id: 5, emoji: '🏡', label: 'House', predictions: [{ label: 'House', conf: 88 }, { label: 'Building', conf: 8 }, { label: 'Cabin', conf: 3 }, { label: 'Barn', conf: 1 }] },
  { id: 6, emoji: '🍕', label: 'Pizza', predictions: [{ label: 'Pizza', conf: 96 }, { label: 'Pie', conf: 3 }, { label: 'Flatbread', conf: 1 }, { label: 'Sandwich', conf: 0 }] },
];

function ImageClassifier() {
  const [selected, setSelected] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  const handleSelect = (img) => {
    setAnalyzing(true);
    setSelected(null);
    setTimeout(() => { setSelected(img); setAnalyzing(false); }, 600);
  };

  return (
    <div>
      <p style={{ color: 'var(--text-muted)', marginBottom: 20, fontSize: '0.9rem' }}>Click any image to classify it using our pre-computed CNN model predictions.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {SAMPLE_IMAGES.map(img => (
          <div key={img.id} onClick={() => handleSelect(img)}
            style={{ aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-lg)', cursor: 'pointer', border: `2px solid ${selected?.id === img.id ? 'var(--accent)' : 'var(--border)'}`, transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.currentTarget.style.transform = ''}>
            {img.emoji}
          </div>
        ))}
      </div>

      {analyzing && <div style={{ textAlign: 'center', padding: 20 }}><span className="spinner" style={{ width: 32, height: 32, margin: '0 auto', display: 'block' }} /><p style={{ marginTop: 8, color: 'var(--accent)' }}>Analyzing...</p></div>}

      {selected && !analyzing && (
        <div className="card animate-fade">
          <h3 style={{ marginBottom: 16 }}>Classification: <span style={{ color: 'var(--accent)' }}>{selected.label}</span></h3>
          {selected.predictions.map((p, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: 4 }}>
                <span style={{ fontWeight: i === 0 ? 600 : 400, color: i === 0 ? 'var(--text-primary)' : 'var(--text-muted)' }}>{p.label}</span>
                <span style={{ color: i === 0 ? 'var(--accent)' : 'var(--text-muted)', fontWeight: 600 }}>{p.conf}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-bar-fill" style={{ width: `${p.conf}%`, background: i === 0 ? 'var(--accent)' : 'var(--blue)', transition: 'width 0.8s ease' }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────
const SIMS = [
  { id: 'spam-detector', title: '🔬 Spam Detector', desc: 'Train a Naive Bayes model on real email data and classify custom text.', icon: '📧', color: 'var(--red)' },
  { id: 'image-classifier', title: '🖼️ Image Classifier', desc: 'Classify images using pre-computed CNN model predictions.', icon: '🤖', color: 'var(--blue)' },
];

export default function SimulationsPage() {
  const router = useRouter();
  const [active, setActive] = useState('spam-detector');
  const [completedSims, setCompletedSims] = useState([]);

  useEffect(() => { if (!localStorage.getItem('elixa_token')) router.push('/login'); }, [router]);

  const handleComplete = async (simId) => {
    if (completedSims.includes(simId)) return;
    try {
      const res = await api.completeSimulation({ simulationId: simId });
      setCompletedSims(prev => [...prev, simId]);
      showToast({ message: `+${res.xpEarned} XP — Simulation completed! 🔬`, type: 'success' });
      if (res.newAchievements?.length > 0) showToast({ message: '🏆 Sim Runner badge unlocked!', type: 'achievement', duration: 5000 });
    } catch (e) {}
  };

  return (
    <>
      <Navbar />
      <Toast />
      <div className="page-wrapper">
        <div className="container">
          <div className="animate-fade" style={{ marginBottom: 32 }}>
            <h1 style={{ marginBottom: 6 }}>🔬 Real-World Simulations</h1>
            <p style={{ color: 'var(--text-muted)' }}>Work with real ML models. Train them, test them, understand how they work.</p>
          </div>

          <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
            {SIMS.map(s => (
              <button key={s.id} onClick={() => setActive(s.id)}
                className={`btn ${active === s.id ? 'btn-primary' : 'btn-ghost'}`}>
                {s.icon} {s.title}
              </button>
            ))}
          </div>

          <div className="card animate-fade" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div>
                <h2 style={{ fontSize: '1.3rem', marginBottom: 4 }}>{SIMS.find(s => s.id === active)?.title}</h2>
                <p style={{ margin: 0, fontSize: '0.88rem' }}>{SIMS.find(s => s.id === active)?.desc}</p>
              </div>
              {!completedSims.includes(active) && (
                <button className="btn btn-secondary btn-sm" onClick={() => handleComplete(active)}>
                  ✅ Mark Complete (+40 XP)
                </button>
              )}
              {completedSims.includes(active) && <span style={{ color: 'var(--green)', fontWeight: 600, fontSize: '0.88rem' }}>✅ Completed</span>}
            </div>
            {active === 'spam-detector' && <SpamDetector />}
            {active === 'image-classifier' && <ImageClassifier />}
          </div>
        </div>
      </div>
    </>
  );
}
