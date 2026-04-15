'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Toast from '@/components/Toast';

/* ── SVG Ring ──────────────────────────────────────────── */
function Ring({ pct = 0, size = 120, stroke = 10, color = '#00d4aa', children }) {
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

/* ── Stat Card ─────────────────────────────────────────── */
function StatCard({ icon, label, value, color, sub }) {
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
      padding: '20px 22px', display: 'flex', alignItems: 'center', gap: 16,
      transition: 'all 0.2s', backdropFilter: 'blur(12px)',
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = color + '44'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = ''; }}
    >
      <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: color + '18', border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>
        {icon}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: '1.6rem', fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 3 }}>{label}</div>
        {sub && <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  );
}

/* ── Module Mini Card ──────────────────────────────────── */
function ModuleMini({ m }) {
  const pct = Math.round((m.progress || 0) * 100);
  return (
    <Link href={`/modules/${m.moduleId}`} style={{ textDecoration: 'none' }}>
      <div style={{
        padding: '12px 14px', borderRadius: 'var(--radius-md)',
        border: `1px solid ${m.status === 'completed' ? 'rgba(16,185,129,0.3)' : m.locked ? 'var(--border)' : 'var(--border)'}`,
        background: m.status === 'completed' ? 'rgba(16,185,129,0.06)' : 'var(--bg-card)',
        opacity: m.locked ? 0.45 : 1,
        transition: 'all 0.2s', cursor: 'pointer',
      }}
        onMouseEnter={e => { if (!m.locked) { e.currentTarget.style.borderColor = m.color || 'var(--accent)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}}
        onMouseLeave={e => { e.currentTarget.style.borderColor = m.status === 'completed' ? 'rgba(16,185,129,0.3)' : 'var(--border)'; e.currentTarget.style.transform = ''; }}
      >
        <div style={{ fontSize: '1.2rem', marginBottom: 6 }}>{m.icon}</div>
        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: m.status === 'completed' ? 'var(--green)' : 'var(--text-primary)', lineHeight: 1.3, marginBottom: 6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {m.status === 'completed' ? '✓ ' : m.locked ? '🔒 ' : ''}{m.title}
        </div>
        {!m.locked && m.status !== 'not-started' && (
          <div style={{ height: 3, background: 'var(--bg-tertiary)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: m.color || 'var(--accent)', borderRadius: 2 }} />
          </div>
        )}
      </div>
    </Link>
  );
}

/* ── Main Page ─────────────────────────────────────────── */
export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState(null);
  const [modules, setModules] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem('elixa_token')) { router.push('/login'); return; }
    Promise.all([api.getMe(), api.getProgress(), api.getModules()])
      .then(([me, prog, mods]) => {
        setUser(me.user);
        setProgress(prog);
        setCategories(mods.categories || []);
        setModules(mods.categories.flatMap(c => c.modules));
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
  const completedModules = Object.values(progress?.modules || {}).filter(m => m.status === 'completed').length;
  const inProgress = modules.filter(m => m.status === 'in-progress');
  const continueModule = inProgress[0] || modules.find(m => !m.locked && m.status !== 'completed');
  const achievements = progress?.achievements || [];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = user?.name?.split(' ')[0] || 'Learner';

  return (
    <>
      <Navbar />
      <Toast />
      <div className="page-wrapper">
        <div className="container" style={{ maxWidth: 1200 }}>

          {/* ── HERO ─────────────────────────────────────── */}
          <div className="animate-fade" style={{
            position: 'relative', borderRadius: 'var(--radius-xl)', overflow: 'hidden',
            background: 'linear-gradient(135deg, rgba(0,212,170,0.08) 0%, rgba(59,130,246,0.06) 50%, rgba(139,92,246,0.08) 100%)',
            border: '1px solid rgba(0,212,170,0.15)',
            padding: '36px 40px', marginBottom: 32,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32, flexWrap: 'wrap',
          }}>
            {/* Decorative blobs */}
            <div style={{ position: 'absolute', top: -60, right: -60, width: 240, height: 240, borderRadius: '50%', background: 'rgba(0,212,170,0.06)', filter: 'blur(60px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: -40, left: '30%', width: 180, height: 180, borderRadius: '50%', background: 'rgba(59,130,246,0.06)', filter: 'blur(50px)', pointerEvents: 'none' }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 6, letterSpacing: '0.03em' }}>
                {greeting}{streak > 1 ? ` · 🔥 ${streak}-day streak` : ''}
              </div>
              <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', marginBottom: 10, lineHeight: 1.2 }}>
                Welcome back, <span style={{ background: 'linear-gradient(135deg, var(--accent), #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{firstName}</span> 👋
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>
                {completedModules > 0
                  ? `${completedModules} module${completedModules > 1 ? 's' : ''} completed · ${modules.length - completedModules} to go`
                  : 'Start your AI & ML journey — pick a module below.'}
              </p>
              {continueModule && (
                <Link href={`/modules/${continueModule.moduleId}`} className="btn btn-primary" style={{ marginTop: 20, display: 'inline-flex' }}>
                  {continueModule.status === 'in-progress' ? '▶ Continue Learning' : '🚀 Start Learning'} →
                </Link>
              )}
            </div>

            {/* XP Ring */}
            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <Ring pct={xpInLevel / 100} size={120} stroke={10} color="var(--accent)">
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent)', lineHeight: 1 }}>L{level}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 2 }}>LEVEL</div>
              </Ring>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent)' }}>⚡ {xp} XP</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{xpInLevel}/100 to L{level + 1}</div>
              </div>
            </div>
          </div>

          {/* ── STATS ROW ────────────────────────────────── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }} className="stagger-children">
            <StatCard icon="⚡" label="Total XP" value={xp} color="var(--accent)" />
            <StatCard icon="📚" label="Lessons Done" value={progress?.stats?.totalLessonsCompleted || 0} color="var(--blue)" />
            <StatCard icon="🎯" label="Quizzes Passed" value={progress?.stats?.totalQuizzesPassed || 0} color="var(--purple)" sub={`Avg ${progress?.stats?.averageQuizScore || 0}%`} />
            <StatCard icon="🏆" label="Achievements" value={achievements.length} color="var(--orange)" sub={achievements.length > 0 ? `Latest: ${achievements[achievements.length - 1]}` : 'None yet'} />
          </div>

          {/* ── MAIN GRID ────────────────────────────────── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>

            {/* LEFT: Continue + Modules */}
            <div>

              {/* Continue Learning */}
              {inProgress.length > 0 && (
                <div style={{ marginBottom: 28 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <h2 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', margin: 0 }}>Continue Learning</h2>
                    <Link href="/modules" style={{ fontSize: '0.8rem', color: 'var(--accent)' }}>View all →</Link>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {inProgress.slice(0, 2).map(m => (
                      <Link key={m.moduleId} href={`/modules/${m.moduleId}`} style={{ textDecoration: 'none' }}>
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: 18, padding: '18px 22px',
                          background: 'var(--bg-card)', border: '1px solid var(--border)',
                          borderLeft: `3px solid ${m.color || 'var(--accent)'}`,
                          borderRadius: 'var(--radius-lg)', transition: 'all 0.2s', cursor: 'pointer',
                        }}
                          onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(4px)'; e.currentTarget.style.borderColor = m.color || 'var(--accent)'; e.currentTarget.style.borderLeftColor = m.color || 'var(--accent)'; }}
                          onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.borderLeftColor = m.color || 'var(--accent)'; }}
                        >
                          <div style={{ fontSize: '2.2rem', flexShrink: 0 }}>{m.icon}</div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 2 }}>{m.title}</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 8 }}>{m.estimatedMinutes}m · {m.totalLessons} lessons</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div style={{ flex: 1, height: 5, background: 'var(--bg-tertiary)', borderRadius: 3, overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${Math.round((m.progress || 0) * 100)}%`, background: m.color || 'var(--accent)', borderRadius: 3, transition: 'width 0.8s ease' }} />
                              </div>
                              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: m.color || 'var(--accent)', flexShrink: 0 }}>{Math.round((m.progress || 0) * 100)}%</span>
                            </div>
                          </div>
                          <span style={{ color: m.color || 'var(--accent)', fontSize: '1.3rem', flexShrink: 0 }}>→</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* All Modules by Category */}
              {categories.map(cat => (
                <div key={cat.id} style={{ marginBottom: 28 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 3, height: 16, borderRadius: 2, background: 'var(--accent)' }} />
                    <h2 style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', margin: 0 }}>
                      {cat.title}
                    </h2>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {cat.modules.filter(m => m.status === 'completed').length}/{cat.modules.length} done
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10 }}>
                    {cat.modules.map(m => <ModuleMini key={m.moduleId} m={m} />)}
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT PANEL */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 'calc(var(--nav-h) + 24px)' }}>

              {/* Streak card */}
              <div style={{
                background: streak > 1
                  ? 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(239,68,68,0.06))'
                  : 'var(--bg-card)',
                border: `1px solid ${streak > 1 ? 'rgba(245,158,11,0.3)' : 'var(--border)'}`,
                borderRadius: 'var(--radius-lg)', padding: '20px 22px', textAlign: 'center',
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 6 }}>🔥</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: streak > 1 ? '#f59e0b' : 'var(--text-muted)', lineHeight: 1 }}>{streak}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 4 }}>Day Streak</div>
                {streak === 0 && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 8 }}>Complete a lesson today to start your streak!</div>}
                {streak === 1 && <div style={{ fontSize: '0.75rem', color: '#f59e0b', marginTop: 8 }}>Keep going! Come back tomorrow.</div>}
                {streak > 1 && <div style={{ fontSize: '0.75rem', color: '#f59e0b', marginTop: 8 }}>Amazing! Don't break the chain. 🎯</div>}
              </div>

              {/* Quick nav */}
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '18px 20px' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', marginBottom: 12 }}>Quick Access</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {[
                    { href: '/modules', icon: '📚', label: 'All Modules', desc: `${completedModules}/${modules.length} done` },
                    { href: '/leaderboard', icon: '🏆', label: 'Leaderboard', desc: 'See top learners' },
                    { href: '/profile', icon: '👤', label: 'My Profile', desc: `${achievements.length} badges earned` },
                  ].map(q => (
                    <Link key={q.href} href={q.href} style={{ textDecoration: 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 'var(--radius-sm)', transition: 'all 0.15s', cursor: 'pointer' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-tertiary)'; e.currentTarget.style.transform = 'translateX(3px)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = ''; }}
                      >
                        <span style={{ fontSize: '1.1rem', width: 28, textAlign: 'center', flexShrink: 0 }}>{q.icon}</span>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{q.label}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{q.desc}</div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Achievement shelf */}
              {achievements.length > 0 && (
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '18px 20px' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', marginBottom: 12 }}>Recent Badges</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {achievements.slice(-8).map((a, i) => (
                      <div key={i} title={a} style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', cursor: 'default' }}>
                        {a.includes('first') || a.includes('beginner') ? '🌱' :
                         a.includes('streak') ? '🔥' :
                         a.includes('perfect') ? '💎' :
                         a.includes('speed') ? '⚡' :
                         a.includes('quiz') || a.includes('scholar') ? '🎓' :
                         a.includes('module') ? '📚' : '🏆'}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Module progress overview */}
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '18px 20px' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', marginBottom: 14 }}>Overall Progress</div>
                <Ring pct={completedModules / Math.max(modules.length, 1)} size={100} stroke={9} color="var(--accent)">
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent)', lineHeight: 1 }}>{completedModules}</div>
                  <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>/ {modules.length}</div>
                </Ring>
                <div style={{ textAlign: 'center', marginTop: 10 }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{completedModules} of {modules.length} modules</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>{Math.round(completedModules / Math.max(modules.length, 1) * 100)}% complete</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
