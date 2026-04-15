'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Toast, { showToast } from '@/components/Toast';

export default function QuizPage() {
  const router = useRouter();
  const params = useParams();
  const quizId = params.quizId;

  const [quiz, setQuiz] = useState(null);
  const [previousBest, setPreviousBest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const startTimeRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!localStorage.getItem('elixa_token')) { router.push('/login'); return; }
    api.getQuiz(quizId)
      .then(data => { setQuiz(data.quiz); setPreviousBest(data.previousBest); setTimeLeft(data.quiz.timeLimit); })
      .catch(() => router.push('/modules'))
      .finally(() => setLoading(false));
  }, [quizId, router]);

  // Timer
  useEffect(() => {
    if (!started || submitted) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); handleSubmit(true); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [started, submitted]);

  const handleStart = () => {
    setStarted(true);
    startTimeRef.current = Date.now();
  };

  const handleSelect = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async (autoSubmit = false) => {
    if (submitting) return;
    clearInterval(timerRef.current);
    setSubmitting(true);
    const timeTaken = startTimeRef.current ? Math.round((Date.now() - startTimeRef.current) / 1000) : null;
    try {
      const result = await api.submitQuiz({ quizId, answers, timeTaken });
      setResults(result);
      setSubmitted(true);
      if (result.passed) showToast({ message: `🎉 Passed! ${result.score}/${result.total} — +${result.xpEarned} XP`, type: 'success' });
      else showToast({ message: `Score: ${result.score}/${result.total}. Need ${quiz.passingScore}% to pass. Try again!`, type: 'error' });
      result.newAchievements?.forEach(a => {
        setTimeout(() => showToast({ message: `🏆 Achievement: ${a}`, type: 'achievement', duration: 5000 }), 800);
      });
    } catch (err) {
      showToast({ message: err.message, type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const timerColor = timeLeft < 30 ? 'var(--red)' : timeLeft < 60 ? 'var(--orange)' : 'var(--accent)';

  if (loading) return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner" style={{ width: 40, height: 40 }} />
      </div>
    </>
  );

  // ── Results Screen ────────────────────────────────────
  if (submitted && results) {
    return (
      <>
        <Navbar />
        <Toast />
        <div className="page-wrapper">
          <div className="container" style={{ maxWidth: 680 }}>
            <div className="animate-fade card" style={{ padding: '40px', textAlign: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: '4rem', marginBottom: 16 }}>{results.passed ? '🎉' : '😅'}</div>
              <h1 style={{ fontSize: '2rem', marginBottom: 8 }}>{results.passed ? 'Quiz Passed!' : 'Not Quite There'}</h1>
              <div style={{ fontSize: '3rem', fontWeight: 800, color: results.passed ? 'var(--green)' : 'var(--orange)', marginBottom: 8 }}>{results.percentage}%</div>
              <p style={{ marginBottom: 20 }}>{results.score}/{results.total} correct {results.xpEarned > 0 && `• +${results.xpEarned} XP earned`}</p>

              {/* Score bar */}
              <div className="progress-bar" style={{ height: 8, marginBottom: 24 }}>
                <div className="progress-bar-fill" style={{ width: `${results.percentage}%`, background: results.passed ? 'var(--green)' : 'var(--orange)' }} />
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                {!results.passed && <button className="btn btn-primary" onClick={() => { setStarted(false); setSubmitted(false); setAnswers({}); setResults(null); setCurrent(0); setTimeLeft(quiz.timeLimit); }}>Try Again</button>}
                <Link href={`/modules`} className="btn btn-secondary">Back to Modules</Link>
              </div>
            </div>

            {/* Per-question results */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {results.results.map((r, i) => {
                const q = quiz.questions[i];
                return (
                  <div key={r.id} className="card" style={{ borderColor: r.correct ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)', padding: '16px 20px' }}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 8 }}>
                      <span style={{ flexShrink: 0 }}>{r.correct ? '✅' : '❌'}</span>
                      <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Q{i + 1}: {q?.question}</span>
                    </div>
                    {!r.correct && r.correctAnswer !== undefined && (
                      <div style={{ fontSize: '0.82rem', color: 'var(--green)', marginBottom: 6, paddingLeft: 26 }}>
                        Correct: {q?.type === 'true-false' ? String(r.correctAnswer) : q?.options?.[r.correctAnswer]}
                      </div>
                    )}
                    {r.explanation && <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', paddingLeft: 26 }}>💡 {r.explanation}</div>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── Intro Screen ──────────────────────────────────────
  if (!started) {
    return (
      <>
        <Navbar />
        <Toast />
        <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="animate-fade card" style={{ maxWidth: 520, width: '100%', padding: '40px', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>🎯</div>
            <h1 style={{ fontSize: '1.5rem', marginBottom: 8 }}>{quiz?.title}</h1>
            <div style={{ display: 'flex', gap: 20, justifyContent: 'center', margin: '20px 0', flexWrap: 'wrap' }}>
              <div style={{ textAlign: 'center' }}><div style={{ font: '700 1.5rem Inter', color: 'var(--accent)' }}>{quiz?.questions?.length}</div><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Questions</div></div>
              <div style={{ textAlign: 'center' }}><div style={{ font: '700 1.5rem Inter', color: 'var(--blue)' }}>{formatTime(quiz?.timeLimit || 300)}</div><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Time Limit</div></div>
              <div style={{ textAlign: 'center' }}><div style={{ font: '700 1.5rem Inter', color: 'var(--orange)' }}>{quiz?.passingScore}%</div><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>To Pass</div></div>
            </div>
            {previousBest && <div style={{ padding: '10px 16px', background: previousBest.passed ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', border: `1px solid ${previousBest.passed ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`, borderRadius: 'var(--radius-sm)', marginBottom: 20, fontSize: '0.88rem', fontWeight: 600, color: previousBest.passed ? 'var(--green)' : 'var(--orange)', display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
              {previousBest.passed ? '✅' : '⚠️'} Best: {previousBest.score}/{previousBest.total} ({previousBest.percentage}%) - {previousBest.passed ? 'PASSED' : `Need ${quiz?.passingScore}% to pass`}
            </div>}
            <button className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }} onClick={handleStart}>Start Quiz →</button>
          </div>
        </div>
      </>
    );
  }

  // ── Active Quiz ───────────────────────────────────────
  const question = quiz?.questions?.[current];
  const answered = answers[question?.id] !== undefined;

  return (
    <>
      <Navbar />
      <Toast />
      <div className="page-wrapper">
        <div className="container" style={{ maxWidth: 680 }}>
          {/* Progress + Timer */}
          <div className="animate-fade" style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 24 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 6 }}>
                <span>Question {current + 1} of {quiz?.questions?.length}</span>
                <span>{Object.keys(answers).length} answered</span>
              </div>
              <div className="progress-bar">
                <div className="progress-bar-fill" style={{ width: `${((current + 1) / quiz?.questions?.length) * 100}%`, background: 'var(--accent)' }} />
              </div>
            </div>
            <div style={{ font: `700 1.2rem JetBrains Mono, monospace`, color: timerColor, minWidth: 60, textAlign: 'right' }}>{formatTime(timeLeft)}</div>
          </div>

          {/* Question card */}
          <div className="card animate-fade" style={{ padding: '32px', marginBottom: 24 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 24 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--accent-soft)', border: '1px solid var(--border-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent)', flexShrink: 0, marginTop: 2 }}>
                {current + 1}
              </div>
              <h2 style={{ fontSize: '1.05rem', lineHeight: 1.5, color: 'var(--text-primary)', fontWeight: 600, margin: 0 }}>{question?.question}</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {question?.type === 'multiple-choice' && question?.options?.map((opt, i) => (
                <button key={i}
                  onClick={() => handleSelect(question.id, i)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
                    borderRadius: 'var(--radius-md)', border: `2px solid ${answers[question.id] === i ? 'var(--accent)' : 'var(--border)'}`,
                    background: answers[question.id] === i ? 'var(--accent-soft)' : 'var(--bg-secondary)',
                    color: answers[question.id] === i ? 'var(--accent)' : 'var(--text-secondary)',
                    fontWeight: answers[question.id] === i ? 600 : 400, fontSize: '0.92rem',
                    textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s', width: '100%',
                  }}>
                  <span style={{ width: 22, height: 22, borderRadius: '50%', border: `2px solid ${answers[question.id] === i ? 'var(--accent)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.7rem', background: answers[question.id] === i ? 'var(--accent)' : 'transparent', color: answers[question.id] === i ? '#000' : 'inherit' }}>
                    {answers[question.id] === i ? '●' : ''}
                  </span>
                  {opt}
                </button>
              ))}

              {question?.type === 'true-false' && [true, false].map((val) => (
                <button key={String(val)}
                  onClick={() => handleSelect(question.id, val)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
                    borderRadius: 'var(--radius-md)', border: `2px solid ${answers[question.id] === val ? 'var(--accent)' : 'var(--border)'}`,
                    background: answers[question.id] === val ? 'var(--accent-soft)' : 'var(--bg-secondary)',
                    color: answers[question.id] === val ? 'var(--accent)' : 'var(--text-secondary)',
                    fontWeight: answers[question.id] === val ? 600 : 400, fontSize: '0.92rem',
                    cursor: 'pointer', transition: 'all 0.2s', width: '100%',
                  }}>
                  {val ? '✓ True' : '✗ False'}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'space-between' }}>
            <button className="btn btn-ghost" onClick={() => setCurrent(c => Math.max(0, c - 1))} disabled={current === 0}>← Prev</button>
            <div style={{ display: 'flex', gap: 8 }}>
              {quiz?.questions?.map((_, i) => (
                <button key={i} onClick={() => setCurrent(i)}
                  style={{ width: 8, height: 8, borderRadius: '50%', border: 'none', background: i === current ? 'var(--accent)' : answers[quiz.questions[i]?.id] !== undefined ? 'var(--green)' : 'var(--bg-tertiary)', cursor: 'pointer', transition: 'all 0.2s' }} />
              ))}
            </div>
            {current < quiz?.questions?.length - 1 ? (
              <button className="btn btn-primary" onClick={() => setCurrent(c => c + 1)}>Next →</button>
            ) : (
              <button className="btn btn-primary" onClick={() => handleSubmit(false)} disabled={submitting}>
                {submitting ? <span className="spinner" /> : '🎯 Submit Quiz'}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
