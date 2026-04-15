'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Toast from '@/components/Toast';
import { api } from '@/lib/api';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem('elixa_token')) { router.push('/login'); return; }
    Promise.all([api.getMe(), api.getProgress(), api.getAchievements()])
      .then(([me, prog, ach]) => { setUser(me.user); setProgress(prog); setAchievements(ach.achievements || []); })
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

  const xpProgress = (progress?.xp || 0) % 100;

  return (
    <>
      <Navbar />
      <Toast />
      <div className="page-wrapper">
        <div className="container" style={{ maxWidth: 800 }}>
          {/* Profile header */}
          <div className="card animate-fade" style={{ padding: '32px', marginBottom: 24, display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--accent-soft)', border: '2px solid var(--border-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', flexShrink: 0 }}>
              {user?.avatar}
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: '1.75rem', marginBottom: 4 }}>{user?.name}</h1>
              <p style={{ color: 'var(--text-muted)', margin: '0 0 12px', fontSize: '0.9rem' }}>{user?.email}</p>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <span className="xp-badge">⚡ {progress?.xp || 0} XP</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', color: 'var(--text-muted)' }}>🎯 Level {progress?.level || 1}</span>
                {progress?.streak > 0 && <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', color: 'var(--orange)', fontWeight: 600 }}>🔥 {progress.streak}-day streak</span>}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent)', marginBottom: 4 }}>{progress?.level || 1}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Level</div>
              <div className="progress-bar" style={{ marginTop: 6, width: 80 }}>
                <div className="progress-bar-fill" style={{ width: `${xpProgress}%`, background: 'var(--accent)' }} />
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 3 }}>{xpProgress}/100 XP</div>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid-4 stagger-children" style={{ marginBottom: 24 }}>
            {[
              { icon: '📚', label: 'Lessons Done', value: progress?.stats?.totalLessonsCompleted || 0 },
              { icon: '🎯', label: 'Quizzes Passed', value: progress?.stats?.totalQuizzesPassed || 0 },
              { icon: '🎮', label: 'Games Played', value: progress?.stats?.totalGamesPlayed || 0 },
              { icon: '🔬', label: 'Simulations', value: progress?.stats?.totalSimulations || 0 },
            ].map(s => (
              <div key={s.label} className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>{s.icon}</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>{s.value}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Achievements */}
          <div className="card animate-fade" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 20 }}>
              Achievements ({achievements.filter(a => a.unlocked).length}/{achievements.length})
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
              {achievements.map(a => (
                <div key={a.id} style={{
                  padding: '16px', borderRadius: 'var(--radius-md)',
                  border: `1px solid ${a.unlocked ? 'var(--border-accent)' : 'var(--border)'}`,
                  background: a.unlocked ? 'var(--accent-soft)' : 'var(--bg-secondary)',
                  opacity: a.unlocked ? 1 : 0.4,
                  textAlign: 'center',
                  transition: 'all 0.2s',
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: 6, filter: a.unlocked ? 'none' : 'grayscale(1)' }}>{a.icon}</div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, marginBottom: 4, color: a.unlocked ? 'var(--text-primary)' : 'var(--text-muted)' }}>{a.title}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{a.description}</div>
                  {a.unlocked && <div style={{ fontSize: '0.65rem', color: 'var(--accent)', marginTop: 6, fontWeight: 600 }}>UNLOCKED</div>}
                </div>
              ))}
            </div>
          </div>

          {/* Recent quiz results */}
          {progress?.quizResults?.length > 0 && (
            <div className="card animate-fade" style={{ padding: '24px', marginTop: 24 }}>
              <h2 style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 20 }}>Recent Quiz Results</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[...progress.quizResults].reverse().slice(0, 5).map((r, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ fontSize: '1.1rem' }}>{r.passed ? '✅' : '❌'}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{r.quizId.replace('quiz-', '').replace(/-/g, ' ')}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.score}/{r.total} correct</div>
                    </div>
                    <span style={{ fontWeight: 800, color: r.passed ? 'var(--green)' : 'var(--red)' }}>{r.percentage}%</span>
                    <span style={{ color: 'var(--orange)', fontSize: '0.82rem', fontWeight: 600 }}>+{r.xpEarned} XP</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
