'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Toast from '@/components/Toast';

function ProgressRing({ progress = 0, size = 80, strokeWidth = 6, color = '#00d4aa', label }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(progress, 1));
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth} fill="none" stroke="var(--bg-tertiary)" />
      <circle cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth} fill="none" stroke={color}
        strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1s ease' }} />
      {label && (
        <text x="50%" y="50%" textAnchor="middle" dy={size * 0.1}
          style={{ transform: 'rotate(90deg)', transformOrigin: 'center', fill: 'var(--text-primary)', fontSize: size * 0.2, fontWeight: 700, fontFamily: 'Inter, sans-serif' }}>
          {label}
        </text>
      )}
    </svg>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('elixa_token');
    if (!token) { router.push('/login'); return; }

    Promise.all([api.getMe(), api.getProgress(), api.getModules()])
      .then(([meData, progData, modData]) => {
        setUser(meData.user);
        setProgress(progData);
        const allMods = modData.categories.flatMap(c => c.modules);
        setModules(allMods);
      })
      .catch(() => router.push('/login'))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner" style={{ width: 40, height: 40 }} />
      </div>
    </>
  );

  const completedModules = Object.values(progress?.modules || {}).filter(m => m.status === 'completed').length;
  const inProgressModules = modules.filter(m => m.status === 'in-progress');
  const xpProgress = progress ? (progress.xp % 100) : 0;
  const level = progress?.level || 1;

  return (
    <>
      <Navbar />
      <Toast />
      <div className="page-wrapper">
        <div className="container">
          {/* ── Header ── */}
          <div className="animate-fade" style={{ marginBottom: 40 }}>
            <h1 style={{ marginBottom: 4 }}>Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
            <p style={{ color: 'var(--text-muted)' }}>
              {progress?.streak > 1 ? `🔥 ${progress.streak}-day streak! Keep it up.` : "Let's continue learning today."}
            </p>
          </div>

          {/* ── Stats Row ── */}
          <div className="grid-4 stagger-children" style={{ marginBottom: 40 }}>
            {[
              { icon: '⚡', label: 'Total XP', value: progress?.xp || 0, color: 'var(--accent)' },
              { icon: '🎯', label: 'Level', value: level, color: 'var(--blue)' },
              { icon: '📚', label: 'Lessons Done', value: progress?.stats?.totalLessonsCompleted || 0, color: 'var(--purple)' },
              { icon: '🏆', label: 'Badges', value: (progress?.achievements || []).length, color: 'var(--orange)' },
            ].map(s => (
              <div key={s.label} className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.75rem', marginBottom: 8 }}>{s.icon}</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
            {/* ── Continue Learning ── */}
            <div>
              <h2 style={{ fontSize: '1.1rem', marginBottom: 16, color: 'var(--text-secondary)', fontWeight: 600 }}>CONTINUE LEARNING</h2>
              {inProgressModules.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {inProgressModules.slice(0, 3).map(m => (
                    <Link key={m.moduleId} href={`/modules/${m.moduleId}`} style={{ textDecoration: 'none' }}>
                      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer' }}>
                        <div style={{ fontSize: '2rem', width: 48, textAlign: 'center', flexShrink: 0 }}>{m.icon}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: 4 }}>{m.title}</div>
                          <div className="progress-bar" style={{ marginBottom: 6 }}>
                            <div className="progress-bar-fill" style={{ width: `${(m.progress || 0) * 100}%`, background: m.color || 'var(--accent)' }} />
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{Math.round((m.progress || 0) * 100)}% complete</div>
                        </div>
                        <span style={{ color: 'var(--accent)', fontSize: '1.2rem', flexShrink: 0 }}>→</span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="card" style={{ textAlign: 'center', padding: 40 }}>
                  <div style={{ fontSize: '3rem', marginBottom: 12 }}>🚀</div>
                  <p style={{ marginBottom: 20 }}>No modules started yet. Begin your ML journey!</p>
                  <Link href="/modules" className="btn btn-primary">Browse Modules →</Link>
                </div>
              )}

              {/* ── All Modules Overview ── */}
              <h2 style={{ fontSize: '1.1rem', margin: '32px 0 16px', color: 'var(--text-secondary)', fontWeight: 600 }}>ALL MODULES</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {modules.map(m => (
                  <Link key={m.moduleId} href={m.locked ? '#' : `/modules/${m.moduleId}`} style={{ textDecoration: 'none' }}>
                    <div style={{
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: `1px solid ${m.status === 'completed' ? 'rgba(16,185,129,0.3)' : 'var(--border)'}`,
                      background: m.status === 'completed' ? 'rgba(16,185,129,0.06)' : m.locked ? 'rgba(255,255,255,0.01)' : 'var(--bg-card)',
                      opacity: m.locked ? 0.4 : 1,
                      transition: 'all 0.2s',
                    }}>
                      <span style={{ fontSize: '1.1rem' }}>{m.icon}</span>
                      <div style={{ fontSize: '0.78rem', fontWeight: 600, marginTop: 4, color: m.status === 'completed' ? 'var(--green)' : 'var(--text-primary)', lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {m.status === 'completed' ? '✓ ' : m.locked ? '🔒 ' : ''}{m.title}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* ── Right Panel ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Level progress */}
              <div className="card" style={{ textAlign: 'center' }}>
                <ProgressRing progress={xpProgress / 100} size={100} color="var(--accent)" label={`L${level}`} />
                <div style={{ marginTop: 12, fontWeight: 700, fontSize: '1.1rem' }}>Level {level}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 4 }}>{xpProgress}/100 XP to next level</div>
                <div className="progress-bar" style={{ marginTop: 12 }}>
                  <div className="progress-bar-fill" style={{ width: `${xpProgress}%`, background: 'var(--accent)' }} />
                </div>
              </div>

              {/* Quick links */}
              <div className="card" style={{ padding: '20px' }}>
                <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 16 }}>Quick Access</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { href: '/playground', icon: '💻', label: 'Python Playground' },
                    { href: '/games', icon: '🎮', label: 'Mini-Games' },
                    { href: '/simulations', icon: '🔬', label: 'Simulations' },
                    { href: '/leaderboard', icon: '🏆', label: 'Leaderboard' },
                  ].map(q => (
                    <Link key={q.href} href={q.href} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-secondary)', border: '1px solid var(--border)', fontSize: '0.88rem', color: 'var(--text-secondary)', transition: 'all 0.2s' }}>
                      <span>{q.icon}</span> {q.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Stats mini */}
              <div className="card">
                <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 16 }}>Your Stats</h3>
                {[
                  { label: 'Quizzes Passed', value: progress?.stats?.totalQuizzesPassed || 0 },
                  { label: 'Avg Quiz Score', value: `${progress?.stats?.averageQuizScore || 0}%` },
                  { label: 'Games Played', value: progress?.stats?.totalGamesPlayed || 0 },
                  { label: 'Simulations', value: progress?.stats?.totalSimulations || 0 },
                ].map(s => (
                  <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: '0.88rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{s.label}</span>
                    <span style={{ fontWeight: 600 }}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
