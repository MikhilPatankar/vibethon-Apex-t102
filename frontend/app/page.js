'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Toast from '@/components/Toast';

const FEATURES = [
  { icon: '🤖', title: '15 Learning Modules', desc: '70+ lessons across 5 categories — from ML basics to LLMs and AI ethics.' },
  { icon: '💻', title: 'Real Python Playground', desc: 'Write and run actual Python with NumPy, Pandas, and scikit-learn in your browser.' },
  { icon: '🎮', title: 'Mini-Games', desc: 'Overfitting Challenge and Neural Network Trainer — learn by playing.' },
  { icon: '🔬', title: 'Live Simulations', desc: 'Train a real spam detector and classify images with genuine ML models.' },
  { icon: '🏆', title: 'XP & Achievements', desc: 'Earn XP, level up, unlock badges, and compete on the global leaderboard.' },
  { icon: '📊', title: 'Quizzes & Progress', desc: 'Per-module quizzes with instant feedback and detailed progress tracking.' },
];

const STATS = [
  { label: 'Modules', value: '15' },
  { label: 'Lessons', value: '70+' },
  { label: 'Interactive Features', value: '8' },
  { label: 'Achievements', value: '10' },
];

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  return (
    <>
      <Navbar />
      <Toast />
      <main>
        {/* ── Hero ─────────────────────────────────────────── */}
        <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', paddingTop: 'var(--nav-h)' }}>
          {/* Background gradient orbs */}
          <div style={{ position: 'absolute', top: '20%', left: '10%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(0,212,170,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: '50%', right: '5%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

          <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <div className={mounted ? 'animate-fade' : ''} style={{ animationDelay: '0s' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', background: 'var(--accent-soft)', border: '1px solid var(--border-accent)', borderRadius: 'var(--radius-full)', fontSize: '0.82rem', fontWeight: 600, color: 'var(--accent)', marginBottom: 24 }}>
                🚀 Free • Interactive • No signup spam
              </div>
            </div>

            <h1 className={mounted ? 'animate-fade' : ''} style={{ animationDelay: '0.1s', marginBottom: 20, lineHeight: 1.15 }}>
              Learn{' '}
              <span className="gradient-text">AI & Machine Learning</span>
              <br />the interactive way
            </h1>

            <p className={mounted ? 'animate-fade' : ''} style={{ fontSize: '1.2rem', maxWidth: 600, margin: '0 auto 40px', color: 'var(--text-secondary)', animationDelay: '0.2s' }}>
              Structured modules, real Python in the browser, mini-games, and simulations.
              From linear regression to transformers — all in one place.
            </p>

            <div className={`${mounted ? 'animate-fade' : ''}`} style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', animationDelay: '0.3s' }}>
              <Link href="/register" className="btn btn-primary btn-lg">
                Start Learning Free →
              </Link>
              <Link href="/modules" className="btn btn-secondary btn-lg">
                Browse Modules
              </Link>
            </div>

            {/* Stats */}
            <div className={mounted ? 'animate-fade' : ''} style={{ display: 'flex', gap: 40, justifyContent: 'center', marginTop: 64, flexWrap: 'wrap', animationDelay: '0.4s' }}>
              {STATS.map(s => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent)' }}>{s.value}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features ─────────────────────────────────────── */}
        <section className="section" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <h2>Everything you need to master ML</h2>
              <p style={{ marginTop: 12, maxWidth: 500, margin: '12px auto 0' }}>
                Designed for learners who want to actually understand and do — not just watch videos.
              </p>
            </div>
            <div className="grid-3 stagger-children">
              {FEATURES.map(f => (
                <div key={f.title} className="card">
                  <div style={{ fontSize: '2rem', marginBottom: 16 }}>{f.icon}</div>
                  <h3 style={{ marginBottom: 8 }}>{f.title}</h3>
                  <p style={{ fontSize: '0.9rem', margin: 0 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────── */}
        <section className="section">
          <div className="container" style={{ textAlign: 'center' }}>
            <div className="card card-glow" style={{ maxWidth: 640, margin: '0 auto', padding: '48px', animationFillMode: 'both' }}>
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>🧠</div>
              <h2 style={{ marginBottom: 12 }}>Ready to start?</h2>
              <p style={{ marginBottom: 32 }}>Join and start your ML journey in 60 seconds. No credit card required.</p>
              <Link href="/register" className="btn btn-primary btn-lg" style={{ display: 'inline-flex' }}>
                Create Free Account →
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
