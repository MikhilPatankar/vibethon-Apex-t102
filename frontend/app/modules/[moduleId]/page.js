'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Toast from '@/components/Toast';

const TYPE_ICONS = { reading: '📖', quiz: '🎯', 'code-lab': '💻', interactive: '✨', game: '🎮' };

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
          </div>

          {/* Module header */}
          <div className="animate-fade" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '32px', marginBottom: 32, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${module?.color}, transparent)` }} />
            <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div style={{ fontSize: '3rem' }}>{module?.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                  <span className={`badge badge-${module?.difficulty}`}>{module?.difficulty}</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>🕐 {module?.estimatedMinutes} min</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>📚 {module?.totalLessons} lessons</span>
                </div>
                <h1 style={{ fontSize: '1.6rem', marginBottom: 8 }}>{module?.title}</h1>
                <p style={{ fontSize: '0.92rem', margin: 0 }}>{module?.description}</p>
              </div>
            </div>

            <div style={{ marginTop: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 6 }}>
                <span>Progress</span>
                <span>{completed}/{lessons?.length} lessons completed</span>
              </div>
              <div className="progress-bar" style={{ height: 6 }}>
                <div className="progress-bar-fill" style={{ width: `${progress * 100}%`, background: module?.color || 'var(--accent)' }} />
              </div>
            </div>
          </div>

          {/* Lessons list */}
          <h2 style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 16 }}>Lessons</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }} className="stagger-children">
            {lessons?.map((lesson, i) => (
              <Link key={lesson.lessonId} href={`/modules/${moduleId}/${lesson.lessonId}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px',
                  background: lesson.completed ? 'rgba(16,185,129,0.05)' : 'var(--bg-card)',
                  border: `1px solid ${lesson.completed ? 'rgba(16,185,129,0.2)' : 'var(--border)'}`,
                  borderRadius: 'var(--radius-md)',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(4px)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.borderColor = lesson.completed ? 'rgba(16,185,129,0.2)' : 'var(--border)'; }}
                >
                  {/* Step number or check */}
                  <div style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: lesson.completed ? 'rgba(16,185,129,0.15)' : 'var(--bg-tertiary)', border: `1px solid ${lesson.completed ? 'rgba(16,185,129,0.4)' : 'var(--border)'}`, fontSize: '0.82rem', fontWeight: 700, color: lesson.completed ? 'var(--green)' : 'var(--text-muted)' }}>
                    {lesson.completed ? '✓' : i + 1}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: '1rem' }}>{TYPE_ICONS[lesson.type] || '📖'}</span>
                      <span style={{ fontWeight: 600, fontSize: '0.95rem', color: lesson.completed ? 'var(--green)' : 'var(--text-primary)' }}>{lesson.title}</span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>
                      {lesson.type} · {lesson.estimatedMinutes} min
                    </div>
                  </div>

                  <span style={{ color: lesson.completed ? 'var(--green)' : 'var(--text-muted)', fontSize: '1.1rem' }}>
                    {lesson.completed ? '✅' : '→'}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Quiz button */}
          {module?.quizId && (
            <div style={{ marginTop: 24 }}>
              <Link href={`/quiz/${module.quizId}`} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
                🎯 Take Module Quiz
              </Link>
            </div>
          )}

          {/* Back */}
          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <Link href="/modules" style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>← Back to all modules</Link>
          </div>
        </div>
      </div>
    </>
  );
}
