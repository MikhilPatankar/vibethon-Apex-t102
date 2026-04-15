'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Toast, { showToast } from '@/components/Toast';
import dynamic from 'next/dynamic';

const LinearRegressionSlider = dynamic(() => import('@/components/interactive/LinearRegressionSlider'), { ssr: false, loading: () => <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Loading interactive...</div> });
const OverfittingExplorer = dynamic(() => import('@/components/interactive/OverfittingExplorer'), { ssr: false, loading: () => <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Loading explorer...</div> });
const GradientDescentViz = dynamic(() => import('@/components/interactive/GradientDescentViz'), { ssr: false, loading: () => <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Loading visualizer...</div> });
const SigmoidExplorer = dynamic(() => import('@/components/interactive/SigmoidExplorer'), { ssr: false, loading: () => <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Loading explorer...</div> });
const NeuralNetworkViz = dynamic(() => import('@/components/interactive/NeuralNetworkViz'), { ssr: false, loading: () => <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Loading network...</div> });
const DecisionBoundaryExplorer = dynamic(() => import('@/components/interactive/DecisionBoundaryExplorer'), { ssr: false, loading: () => <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Loading explorer...</div> });

// lessonId → extra embedded interactive
const LESSON_EXTRAS = {
  'linreg-gradient-descent': GradientDescentViz,
  'logreg-sigmoid': SigmoidExplorer,
  'nn-intro': NeuralNetworkViz,
  'class-confusion-matrix': DecisionBoundaryExplorer,
  'class-metrics': DecisionBoundaryExplorer,
};

const TYPE_ICONS = { reading: '📖', quiz: '🎯', 'code-lab': '💻', interactive: '✨', game: '🎮' };
const stripEmoji = (s = '') => s.replace(/^[\p{Emoji}\s]+/u, '').trim();

// ── Check Understanding ───────────────────────────────────
function CheckUnderstanding({ question, options, correctIndex, explanation }) {
  const [selected, setSelected] = useState(null);
  const revealed = selected !== null;

  return (
    <div className="check-understanding">
      <h4>✅ Check Your Understanding</h4>
      <p className="question">{question}</p>
      {options.map((opt, i) => (
        <div key={i}
          className={`cu-option ${revealed && i === correctIndex ? 'correct' : ''} ${revealed && i === selected && i !== correctIndex ? 'wrong' : ''}`}
          onClick={() => { if (!revealed) setSelected(i); }}
        >
          <span style={{ fontSize: '0.9rem', flexShrink: 0 }}>
            {revealed ? (i === correctIndex ? '✓' : i === selected ? '✗' : '○') : '○'}
          </span>
          {opt}
        </div>
      ))}
      {revealed && <div className="cu-explanation">💡 {explanation}</div>}
    </div>
  );
}

// ── Paragraph renderer ────────────────────────────────────
function renderSection(section, index) {
  switch (section.type) {
    case 'heading':
      const Tag = `h${section.level}`;
      return <Tag key={index} style={{ marginTop: section.level <= 2 ? 40 : 28, marginBottom: 12 }}>{section.text}</Tag>;

    case 'text':
      return <p key={index} style={{ marginBottom: 16, fontSize: '1rem', lineHeight: 1.8, color: 'var(--text-secondary)' }}>{section.body}</p>;

    case 'callout':
      return (
        <div key={index} className={`lesson-callout ${section.style}`}>
          <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>
            {section.style === 'tip' ? '💡' : section.style === 'warning' ? '⚠️' : section.style === 'important' ? '❗' : '📝'}
          </span>
          <span>{section.body}</span>
        </div>
      );

    case 'code':
      return (
        <div key={index} style={{ margin: '20px 0' }}>
          {section.caption && <div className="lesson-code-caption">{section.caption}</div>}
          <pre className="lesson-code">{section.code}</pre>
        </div>
      );

    case 'data-table':
      return (
        <div key={index} style={{ margin: '20px 0', overflowX: 'auto' }}>
          <table className="lesson-table">
            <thead>
              <tr>{section.headers.map((h, i) => <th key={i}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {section.rows.map((row, ri) => (
                <tr key={ri}>{row.map((cell, ci) => <td key={ci}>{cell}</td>)}</tr>
              ))}
            </tbody>
          </table>
          {section.caption && <div className="lesson-table-caption">{section.caption}</div>}
        </div>
      );

    case 'list':
      return (
        <ul key={index} className={`lesson-list ${section.style}`}>
          {section.items.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      );

    case 'key-takeaways':
      return (
        <div key={index} className="key-takeaways">
          <h4>🎯 Key Takeaways</h4>
          <ul>
            {section.points.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        </div>
      );

    case 'check-understanding':
      return <CheckUnderstanding key={index} {...section} />;

    case 'interactive':
      if (section.component === 'linear-regression-slider') {
        return (
          <div key={index} style={{ margin: '24px 0' }}>
            <LinearRegressionSlider {...(section.props || {})} />
          </div>
        );
      }
      return (
        <div key={index} style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-accent)', borderRadius: 'var(--radius-lg)', padding: '24px', margin: '24px 0', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: 8 }}>✨</div>
          <p style={{ color: 'var(--accent)', fontWeight: 600 }}>Interactive: {section.component}</p>
        </div>
      );

    case 'game':
      return (
        <div key={index} style={{ margin: '24px 0' }}>
          <OverfittingExplorer />
        </div>
      );

    default:
      return null;
  }
}

export default function LessonPage() {
  const router = useRouter();
  const params = useParams();
  const { moduleId, lessonId } = params;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('elixa_token')) { router.push('/login'); return; }
    api.getLesson(lessonId)
      .then(d => { setData(d); setCompleted(d.completed); })
      .catch(() => router.push(`/modules/${moduleId}`))
      .finally(() => setLoading(false));
  }, [lessonId, moduleId, router]);

  const handleComplete = async () => {
    if (completing || completed) return;
    setCompleting(true);
    try {
      const result = await api.completeLesson(lessonId);
      setCompleted(true);
      if (result.xpEarned > 0) {
        showToast({ message: `+${result.xpEarned} XP earned! ${result.moduleCompleted ? '🎉 Module completed!' : ''}`, type: 'success' });
      }
      if (result.newAchievements?.length > 0) {
        result.newAchievements.forEach(a => {
          setTimeout(() => showToast({ message: `🏆 Achievement unlocked: ${a}!`, type: 'achievement', duration: 5000 }), 600);
        });
      }
    } catch (err) {
      showToast({ message: err.message, type: 'error' });
    } finally {
      setCompleting(false);
    }
  };

  if (loading) return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner" style={{ width: 40, height: 40 }} />
      </div>
    </>
  );

  const { lesson, prevLesson, nextLesson, quizId } = data || {};

  return (
    <>
      <Navbar />
      <Toast />
      <div className="page-wrapper">
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 40, alignItems: 'start' }}>
          {/* ── Main content ── */}
          <div className="animate-fade">
            {/* Breadcrumb */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 24, flexWrap: 'wrap' }}>
              <Link href="/modules" style={{ color: 'var(--accent)' }}>Modules</Link>
              <span>›</span>
              <Link href={`/modules/${moduleId}`} style={{ color: 'var(--accent)' }}>{lesson?.moduleTitle}</Link>
              <span>›</span>
              <span>{stripEmoji(lesson?.title)}</span>
            </div>

            {/* Lesson header */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8, flexWrap: 'wrap' }}>
                <span style={{ padding: '4px 10px', borderRadius: 'var(--radius-full)', background: 'var(--accent-soft)', border: '1px solid var(--border-accent)', fontSize: '0.78rem', fontWeight: 600, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  {TYPE_ICONS[lesson?.type] || '📖'} {lesson?.type}
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>🕐 {lesson?.estimatedMinutes} min</span>
                {lesson?.xpReward > 0 && <span style={{ fontSize: '0.78rem', color: 'var(--orange)', fontWeight: 600 }}>⚡ +{lesson?.xpReward} XP</span>}
              </div>
              <h1 style={{ fontSize: '2rem', lineHeight: 1.2 }}>{stripEmoji(lesson?.title)}</h1>
              <div style={{ height: 3, width: 48, background: lesson?.moduleColor || 'var(--accent)', borderRadius: 2, marginTop: 12 }} />
            </div>

            {/* Content */}
            <div className="lesson-content">
              {lesson?.content?.sections?.map((section, i) => renderSection(section, i))}
            </div>

            {/* Embedded interactive for game-type lessons */}
            {lesson?.type === 'game' && (
              <div style={{ marginTop: 24 }}>
                <OverfittingExplorer />
              </div>
            )}

            {/* lessonId-specific embedded interactive */}
            {LESSON_EXTRAS[lessonId] && lesson?.type !== 'game' && (() => {
              const ExtraComponent = LESSON_EXTRAS[lessonId];
              return (
                <div style={{ marginTop: 28 }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--accent)', marginBottom: 12 }}>✨ Interactive Exercise</div>
                  <ExtraComponent />
                </div>
              );
            })()}

            {/* Complete button */}
            {lesson?.type !== 'quiz' && (
              <div style={{ marginTop: 40, padding: '24px', background: completed ? 'rgba(16,185,129,0.05)' : 'var(--bg-card)', border: `1px solid ${completed ? 'rgba(16,185,129,0.3)' : 'var(--border)'}`, borderRadius: 'var(--radius-lg)' }}>
                {completed ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--green)' }}>
                    <span style={{ fontSize: '1.5rem' }}>✅</span>
                    <div>
                      <div style={{ fontWeight: 600 }}>Lesson completed!</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 2 }}>You earned XP for this lesson</div>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: 2 }}>Ready to move on?</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Mark this lesson complete to earn {lesson?.xpReward} XP</div>
                    </div>
                    <button className="btn btn-primary" onClick={handleComplete} disabled={completing}>
                      {completing ? <span className="spinner" /> : `Mark Complete ⚡`}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Quiz redirect */}
            {lesson?.type === 'quiz' && quizId && (
              <div style={{ marginTop: 32, textAlign: 'center' }}>
                <Link href={`/quiz/${quizId}`} className="btn btn-primary btn-lg" style={{ display: 'inline-flex' }}>
                  Start Quiz 🎯
                </Link>
              </div>
            )}

            {/* Next/Prev navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32, gap: 16 }}>
              {prevLesson ? (
                <Link href={`/modules/${moduleId}/${prevLesson.lessonId}`} className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center', maxWidth: 'calc(50% - 8px)' }}>
                  ← {prevLesson.title}
                </Link>
              ) : <div />}
              {nextLesson && (
                <Link href={`/modules/${moduleId}/${nextLesson.lessonId}`} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', maxWidth: 'calc(50% - 8px)' }}>
                  {nextLesson.title} →
                </Link>
              )}
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div style={{ position: 'sticky', top: 'calc(var(--nav-h) + 24px)' }}>
            <div className="card" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 16 }}>In this Lesson</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {lesson?.content?.sections?.filter(s => s.type === 'heading').map((s, i) => (
                  <div key={i} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', paddingLeft: s.level > 2 ? 12 : 0, borderLeft: s.level <= 2 ? '2px solid var(--accent)' : 'none', paddingLeft: s.level <= 2 ? 8 : 16 }}>
                    {s.text}
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                <Link href={`/modules/${moduleId}`} style={{ fontSize: '0.85rem', color: 'var(--accent)' }}>
                  ← Back to {lesson?.moduleTitle}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
