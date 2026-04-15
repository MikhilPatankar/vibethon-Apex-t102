'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Toast from '@/components/Toast';
import { api } from '@/lib/api';

function Ring({ pct = 0, size = 100, stroke = 8, color = '#00d4aa', children }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const off = circ * (1 - Math.min(pct, 1));
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', position: 'absolute', inset: 0 }}>
        <circle cx={size/2} cy={size/2} r={r} strokeWidth={stroke} fill="none" stroke="rgba(255,255,255,0.06)" />
        <circle cx={size/2} cy={size/2} r={r} strokeWidth={stroke} fill="none" stroke={color}
          strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  );
}

const BADGE_ICONS = {
  first_lesson: '🌱', perfect_quiz: '💎', speed_learner: '⚡',
  streak_3: '🔥', streak_7: '🔥', quiz_master: '🎓', module_complete: '📚',
  xp_100: '⭐', xp_500: '🌟', code_lab: '💻',
};

function getBadgeIcon(id, title = '') {
  if (BADGE_ICONS[id]) return BADGE_ICONS[id];
  if (title.toLowerCase().includes('streak')) return '🔥';
  if (title.toLowerCase().includes('quiz')) return '🎯';
  if (title.toLowerCase().includes('code')) return '💻';
  if (title.toLowerCase().includes('xp') || title.toLowerCase().includes('point')) return '⚡';
  if (title.toLowerCase().includes('speed')) return '⚡';
  if (title.toLowerCase().includes('module')) return '📚';
  return '🏆';
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem('elixa_token')) { router.push('/login'); return; }
    Promise.all([api.getMe(), api.getProgress(), api.getAchievements(), api.getModules()])
      .then(([me, prog, ach, mods]) => {
        setUser(me.user);
        setProgress(prog);
        setAchievements(ach.achievements || []);
        setModules(mods.categories?.flatMap(c => c.modules) || []);
      })
      .catch(() => router.push('/login'))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner" style={{ width: 44, height: 44 }} />
      </div>
    </>
  );

  const xp = progress?.xp || 0;
  const level = progress?.level || 1;
  const xpInLevel = xp % 100;
  const streak = progress?.streak || 0;
  const completedModules = modules.filter(m => m.status === 'completed').length;
  const unlockedAch = achievements.filter(a => a.unlocked);
  const quizResults = progress?.quizResults || [];
  const avgScore = quizResults.length
    ? Math.round(quizResults.reduce((s, r) => s + r.percentage, 0) / quizResults.length)
    : 0;

  return (
    <>
      <Navbar />
      <Toast />
      <div className="page-wrapper">
        <div className="container" style={{ maxWidth: 900 }}>

          {/* ── HERO CARD ─────────────────────────────── */}
          <div className="animate-fade profile-hero-flex" style={{
            position: 'relative', borderRadius: 'var(--radius-xl)', overflow: 'hidden',
            background: 'linear-gradient(135deg, rgba(0,212,170,0.07) 0%, rgba(59,130,246,0.05) 50%, rgba(139,92,246,0.07) 100%)',
            border: '1px solid rgba(0,212,170,0.15)', padding: '36px 40px',
            display: 'flex', alignItems: 'center', gap: 36, flexWrap: 'wrap',
            marginBottom: 32,
          }}>
            <div style={{ position: 'absolute', top: -60, right: -40, width: 220, height: 220, borderRadius: '50%', background: 'rgba(0,212,170,0.05)', filter: 'blur(60px)', pointerEvents: 'none' }} />

            {/* Avatar */}
            <div style={{ position: 'relative', zIndex: 1 }}>
              <Ring pct={xpInLevel / 100} size={100} stroke={8} color="var(--accent)">
                <div style={{ width: 76, height: 76, borderRadius: '50%', background: 'var(--bg-secondary)', border: '2px solid rgba(0,212,170,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.4rem' }}>
                  {user?.avatar || '🧠'}
                </div>
              </Ring>
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0, position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 4 }}>
                Level {level} Learner
              </div>
              <h1 style={{ fontSize: 'clamp(1.4rem, 3vw, 1.9rem)', marginBottom: 6, lineHeight: 1.2 }}>
                {user?.name}
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '0 0 14px' }}>
                {user?.email}
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <span style={{ padding: '5px 12px', background: 'var(--accent-soft)', border: '1px solid var(--border-accent)', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent)' }}>
                  ⚡ {xp} XP
                </span>
                {streak > 0 && (
                  <span style={{ padding: '5px 12px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700, color: '#f59e0b' }}>
                    🔥 {streak}-day streak
                  </span>
                )}
                {unlockedAch.length > 0 && (
                  <span style={{ padding: '5px 12px', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700, color: '#8b5cf6' }}>
                    🏆 {unlockedAch.length} badge{unlockedAch.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>

            {/* XP progress */}
            <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', minWidth: 130 }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>XP to Level {level + 1}</div>
              <div style={{ height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${xpInLevel}%`, background: 'var(--accent)', borderRadius: 4, transition: 'width 1s ease' }} />
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--accent)', fontWeight: 700, marginTop: 6 }}>{xpInLevel} / 100 XP</div>
            </div>
          </div>

          {/* ── STATS ROW ─────────────────────────────── */}
          <div className="stats-grid-4 stagger-children" style={{ marginBottom: 32 }}>
            {[
              { icon: '📚', label: 'Modules Done', value: completedModules, color: 'var(--accent)' },
              { icon: '✅', label: 'Lessons Done', value: progress?.stats?.totalLessonsCompleted || 0, color: 'var(--blue)' },
              { icon: '🎯', label: 'Quizzes Passed', value: progress?.stats?.totalQuizzesPassed || 0, color: 'var(--purple)' },
              { icon: '📊', label: 'Avg Quiz Score', value: `${avgScore}%`, color: 'var(--orange)' },
            ].map(s => (
              <div key={s.label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.6rem', marginBottom: 6 }}>{s.icon}</div>
                <div style={{ fontSize: '1.7rem', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div className="profile-bottom">
            {/* LEFT: Achievements */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', margin: 0 }}>
                  Achievements · {unlockedAch.length}/{achievements.length}
                </h2>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {achievements.length - unlockedAch.length} locked
                </div>
              </div>

              {achievements.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>🏆</div>
                  <p>Complete lessons and quizzes to unlock achievements!</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))', gap: 12 }}>
                  {achievements.map(a => (
                    <div key={a.id} style={{
                      padding: '18px 14px', borderRadius: 'var(--radius-lg)', textAlign: 'center',
                      border: `1px solid ${a.unlocked ? 'rgba(0,212,170,0.3)' : 'var(--border)'}`,
                      background: a.unlocked ? 'rgba(0,212,170,0.04)' : 'var(--bg-card)',
                      opacity: a.unlocked ? 1 : 0.45,
                      transition: 'all 0.2s',
                      ...(a.unlocked ? { boxShadow: '0 2px 12px rgba(0,212,170,0.08)' } : {}),
                    }}>
                      <div style={{ fontSize: '2rem', marginBottom: 8, filter: a.unlocked ? 'none' : 'grayscale(1)' }}>
                        {a.icon || getBadgeIcon(a.id, a.title)}
                      </div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: 4, color: a.unlocked ? 'var(--text-primary)' : 'var(--text-muted)', lineHeight: 1.3 }}>
                        {a.title}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                        {a.description}
                      </div>
                      {a.unlocked && (
                        <div style={{ display: 'inline-block', marginTop: 8, padding: '2px 8px', background: 'rgba(0,212,170,0.12)', border: '1px solid rgba(0,212,170,0.25)', borderRadius: 'var(--radius-full)', fontSize: '0.6rem', fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.05em' }}>
                          UNLOCKED
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT: Quiz results + module progress */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Module progress */}
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '18px 20px' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', marginBottom: 14 }}>Module Progress</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {modules.filter(m => m.status !== 'not-started' && !m.locked).slice(0, 6).map(m => (
                    <div key={m.moduleId}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: '0.78rem' }}>
                        <span style={{ color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '75%' }}>{m.icon} {m.title}</span>
                        <span style={{ color: m.status === 'completed' ? 'var(--green)' : 'var(--accent)', fontWeight: 700, flexShrink: 0 }}>
                          {m.status === 'completed' ? '✓' : `${Math.round((m.progress || 0) * 100)}%`}
                        </span>
                      </div>
                      <div style={{ height: 4, background: 'var(--bg-tertiary)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${Math.round((m.progress || 0) * 100)}%`, background: m.status === 'completed' ? 'var(--green)' : m.color || 'var(--accent)', borderRadius: 2 }} />
                      </div>
                    </div>
                  ))}
                  {modules.filter(m => m.status !== 'not-started' && !m.locked).length === 0 && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '12px 0' }}>
                      Start a module to track progress!
                    </div>
                  )}
                </div>
                <Link href="/modules" style={{ display: 'block', marginTop: 14, textAlign: 'center', fontSize: '0.78rem', color: 'var(--accent)' }}>
                  Browse all modules →
                </Link>
              </div>

              {/* Recent quiz results */}
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '18px 20px' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', marginBottom: 14 }}>Recent Quizzes</div>
                {quizResults.length === 0 ? (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '12px 0' }}>No quizzes taken yet.</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[...quizResults].reverse().slice(0, 5).map((r, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                        <span style={{ fontSize: '1rem', flexShrink: 0 }}>{r.passed ? '✅' : '❌'}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '0.8rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {r.quizId.replace('quiz-', '').replace(/-/g, ' ')}
                          </div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{r.score}/{r.total} correct</div>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: r.passed ? 'var(--green)' : '#ef4444' }}>{r.percentage}%</div>
                          <div style={{ fontSize: '0.65rem', color: 'var(--orange)' }}>+{r.xpEarned} XP</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
