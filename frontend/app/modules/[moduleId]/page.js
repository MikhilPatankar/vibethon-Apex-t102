'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Toast from '@/components/Toast';

const TYPE_ICONS = { reading: '📖', quiz: '🎯', 'code-lab': '💻', interactive: '✨', game: '🎮' };
// Strip any leading emoji from title so it doesn't double-up with the TYPE_ICONS prefix
const stripLeadingEmoji = (str = '') => str.replace(/^[\p{Emoji}\s]+/u, '').trim();


export default function ModuleDetailPage() {
  const router = useRouter();
  const params = useParams();
  const moduleId = params.moduleId;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem('elixa_token')) { router.push('/login'); return; }
    api.getModule(moduleId)
      .then(setData)
      .catch(() => router.push('/modules'))
      .finally(() => setLoading(false));
  }, [moduleId, router]);

  if (loading) return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner" style={{ width: 40, height: 40 }} />
      </div>
    </>
  );

  const { module, lessons } = data || {};
  const locked = module?.locked;
  const prereqs = module?.prerequisites || [];
  const completed = lessons?.filter(l => l.completed).length || 0;
  const progress = lessons?.length ? completed / lessons.length : 0;

  return (
    <>
      <Navbar />
      <Toast />
      <div className="page-wrapper">
        <div className="container" style={{ maxWidth: 800 }}>
          {/* Breadcrumb */}
          <div className="animate-fade" style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 24 }}>
            <Link href="/modules" style={{ color: 'var(--accent)' }}>Modules</Link>
            <span>›</span>
            <span>{module?.title}</span>
            {locked && <span style={{ marginLeft: 6, padding: '2px 8px', background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 'var(--radius-full)', fontSize: '0.72rem', fontWeight: 600, color: '#f59e0b' }}>🔒 Locked</span>}
          </div>

          {/* Module header */}
          <div className="animate-fade" style={{
            background: locked ? 'rgba(10,13,20,0.8)' : 'var(--bg-card)',
            border: `1px solid ${locked ? 'rgba(245,158,11,0.25)' : 'var(--border)'}`,
            borderRadius: 'var(--radius-xl)',
            padding: '32px',
            marginBottom: 24,
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: locked ? 'linear-gradient(90deg, rgba(245,158,11,0.7), transparent)' : `linear-gradient(90deg, ${module?.color}, transparent)` }} />
            <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div style={{ fontSize: '3rem', opacity: locked ? 0.6 : 1 }}>{module?.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                  <span className={`badge badge-${module?.difficulty}`}>{module?.difficulty}</span>
                  {locked && <span style={{ padding: '4px 10px', borderRadius: 'var(--radius-full)', background: 'rgba(245,158,11,0.12)', fontSize: '0.78rem', fontWeight: 600, color: '#f59e0b' }}>🔒 Locked</span>}
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>🕐 {module?.estimatedMinutes} min</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>📚 {module?.totalLessons} lessons</span>
                </div>
                <h1 style={{ fontSize: '1.6rem', marginBottom: 8, opacity: locked ? 0.8 : 1 }}>{module?.title}</h1>
                <p style={{ fontSize: '0.92rem', margin: 0 }}>{module?.description}</p>
              </div>
            </div>

            {!locked && (
              <div style={{ marginTop: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 6 }}>
                  <span>Progress</span>
                  <span>{completed}/{lessons?.length} lessons completed</span>
                </div>
                <div className="progress-bar" style={{ height: 6 }}>
                  <div className="progress-bar-fill" style={{ width: `${progress * 100}%`, background: module?.color || 'var(--accent)' }} />
                </div>
              </div>
            )}
          </div>

          {/* ── Prerequisites block — always shown if module has any ── */}
          {prereqs.length > 0 && (
            <div className="animate-fade" style={{
              marginBottom: 24,
              padding: '20px 24px',
              background: locked ? 'rgba(245,158,11,0.05)' : 'rgba(16,185,129,0.05)',
              border: `1px solid ${locked ? 'rgba(245,158,11,0.25)' : 'rgba(16,185,129,0.2)'}`,
              borderRadius: 'var(--radius-lg)',
            }}>
              <h3 style={{ fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: locked ? '#f59e0b' : 'var(--green)', marginBottom: 14 }}>
                {locked ? '⚠ Complete these first to unlock lessons:' : '✅ Prerequisites — all done!'}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {prereqs.map(p => (
                  <Link key={p.id} href={`/modules/${p.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
                      background: p.completed ? 'rgba(16,185,129,0.08)' : 'var(--bg-secondary)',
                      border: `1px solid ${p.completed ? 'rgba(16,185,129,0.25)' : 'var(--border)'}`,
                      borderRadius: 'var(--radius-sm)',
                      transition: 'all 0.2s',
                    }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = p.completed ? 'rgba(16,185,129,0.25)' : 'var(--border)'}
                    >
                      <span style={{ fontSize: '1.3rem' }}>{p.icon}</span>
                      <span style={{ flex: 1, fontWeight: 600, fontSize: '0.9rem', color: p.completed ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{p.title}</span>
                      <span style={{ fontWeight: 700, fontSize: '0.85rem', color: p.completed ? 'var(--green)' : '#ef4444', flexShrink: 0 }}>
                        {p.completed ? '✓ Completed' : '✗ Incomplete'}
                      </span>
                      <span style={{ color: 'var(--accent)', fontSize: '0.9rem' }}>→</span>
                    </div>
                  </Link>
                ))}
              </div>
              {locked && (
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '12px 0 0', lineHeight: 1.6 }}>
                  💡 You can read the lesson names and quiz topics below, but cannot start lessons until all prerequisites are completed.
                </p>
              )}
            </div>
          )}

          {/* Lessons list */}
          <h2 style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 16 }}>
            Lessons
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }} className="stagger-children">
            {lessons?.map((lesson, i) => {
              const isAccessible = !locked;
              const Wrapper = isAccessible ? Link : 'div';
              const wrapperProps = isAccessible
                ? { href: `/modules/${moduleId}/${lesson.lessonId}`, style: { textDecoration: 'none' } }
                : {};

              return (
                <Wrapper key={lesson.lessonId} {...wrapperProps}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px',
                    background: locked ? 'rgba(10,12,18,0.5)' : lesson.completed ? 'rgba(16,185,129,0.05)' : 'var(--bg-card)',
                    border: `1px solid ${locked ? 'rgba(255,255,255,0.04)' : lesson.completed ? 'rgba(16,185,129,0.2)' : 'var(--border)'}`,
                    borderRadius: 'var(--radius-md)',
                    transition: 'all 0.2s',
                    cursor: isAccessible ? 'pointer' : 'default',
                    opacity: locked ? 0.55 : 1,
                    userSelect: locked ? 'none' : 'auto',
                  }}
                    onMouseEnter={e => { if (isAccessible) { e.currentTarget.style.transform = 'translateX(4px)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}}
                    onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.borderColor = locked ? 'rgba(255,255,255,0.04)' : lesson.completed ? 'rgba(16,185,129,0.2)' : 'var(--border)'; }}
                  >
                    {/* Step number / check / lock */}
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      background: locked ? 'var(--bg-tertiary)' : lesson.completed ? 'rgba(16,185,129,0.15)' : 'var(--bg-tertiary)',
                      border: `1px solid ${locked ? 'rgba(255,255,255,0.06)' : lesson.completed ? 'rgba(16,185,129,0.4)' : 'var(--border)'}`,
                      fontSize: locked ? '0.7rem' : '0.82rem', fontWeight: 700,
                      color: locked ? 'var(--text-muted)' : lesson.completed ? 'var(--green)' : 'var(--text-muted)',
                    }}>
                      {locked ? '🔒' : lesson.completed ? '✓' : i + 1}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: '1rem' }}>{TYPE_ICONS[lesson.type] || '📖'}</span>
                        <span style={{ fontWeight: 600, fontSize: '0.92rem', color: locked ? 'var(--text-muted)' : lesson.completed ? 'var(--green)' : 'var(--text-primary)' }}>{stripLeadingEmoji(lesson.title)}</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{lesson.type} · {lesson.estimatedMinutes} min</div>
                    </div>

                    {locked
                      ? null
                      : <span style={{ color: lesson.completed ? 'var(--green)' : 'var(--text-muted)', fontSize: '1.1rem', flexShrink: 0 }}>
                          {lesson.completed ? '✅' : '→'}
                        </span>
                    }
                  </div>
                </Wrapper>
              );
            })}
          </div>

          {/* Quiz CTA — only if unlocked */}
          {module?.quizId && !locked && (
            <div style={{ marginTop: 24 }}>
              <Link href={`/quiz/${module.quizId}`} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
                🎯 Take Module Quiz
              </Link>
            </div>
          )}
          {module?.quizId && locked && (
            <div style={{ marginTop: 24, padding: '14px', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 'var(--radius-md)', textAlign: 'center', color: '#f59e0b', fontSize: '0.88rem' }}>
              🔒 Quiz available after completing prerequisites and all lessons
            </div>
          )}

          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <Link href="/modules" style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>← Back to all modules</Link>
          </div>
        </div>
      </div>
    </>
  );
}
