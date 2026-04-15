'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Toast from '@/components/Toast';

const TIER_LABELS = { interactive: '✨ Interactive', reading: '📖 Reading', structure: '📋 Structure' };

function ModuleCard({ module }) {
  const { moduleId, title, description, icon, color, difficulty, tier, estimatedMinutes, totalLessons, progress, status, locked, prerequisites } = module;
  const hasPrereqs = prerequisites && prerequisites.length > 0;

  return (
    <Link href={`/modules/${moduleId}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
      <div
        style={{
          position: 'relative',
          background: locked ? 'rgba(10,13,20,0.7)' : 'var(--bg-card)',
          border: `1px solid ${status === 'completed' ? 'rgba(16,185,129,0.3)' : locked ? 'rgba(245,158,11,0.2)' : 'var(--border)'}`,
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          transition: 'all 0.2s',
          cursor: 'pointer',
          overflow: 'hidden',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-3px)';
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.4)';
          e.currentTarget.style.borderColor = locked ? 'rgba(245,158,11,0.5)' : status === 'completed' ? 'rgba(16,185,129,0.5)' : 'rgba(255,255,255,0.15)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = '';
          e.currentTarget.style.boxShadow = '';
          e.currentTarget.style.borderColor = status === 'completed' ? 'rgba(16,185,129,0.3)' : locked ? 'rgba(245,158,11,0.2)' : 'var(--border)';
        }}
      >
        {/* Top color bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: locked ? 'linear-gradient(90deg, rgba(245,158,11,0.6), transparent)' : `linear-gradient(90deg, ${color}, transparent)`, borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0' }} />

        {/* Header row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <span style={{ fontSize: '2rem', opacity: locked ? 0.55 : 1 }}>{icon}</span>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <span className={`badge badge-${difficulty}`}>{difficulty}</span>
            {tier !== 'structure' && <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 8px', borderRadius: 'var(--radius-full)', fontSize: '0.72rem', fontWeight: 600, background: tier === 'interactive' ? 'var(--accent-soft)' : 'var(--blue-soft)', color: tier === 'interactive' ? 'var(--accent)' : 'var(--blue)' }}>{TIER_LABELS[tier]}</span>}
          </div>
        </div>

        <h3 style={{ fontSize: '0.95rem', marginBottom: 6, lineHeight: 1.3, opacity: locked ? 0.65 : 1 }}>{title}</h3>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.55, margin: '0 0 12px 0', flex: 1 }}>{description}</p>

        {/* Prerequisites list */}
        {hasPrereqs && (
          <div style={{ marginBottom: 10, padding: '8px 10px', background: locked ? 'rgba(245,158,11,0.06)' : 'rgba(16,185,129,0.05)', borderRadius: 'var(--radius-sm)', border: `1px solid ${locked ? 'rgba(245,158,11,0.15)' : 'rgba(16,185,129,0.15)'}` }}>
            <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: locked ? '#f59e0b' : 'var(--text-muted)', fontWeight: 700, marginBottom: 5 }}>
              {locked ? '⚠ Requires:' : '✓ Prerequisites:'}
            </div>
            {prerequisites.map(p => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.75rem', marginBottom: 2 }}>
                <span style={{ fontWeight: 700, color: p.completed ? 'var(--green)' : '#ef4444', flexShrink: 0 }}>{p.completed ? '✓' : '✗'}</span>
                <span style={{ color: p.completed ? 'var(--text-secondary)' : 'var(--text-muted)' }}>{p.icon} {p.title}</span>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: locked ? 8 : 10 }}>
          <span>🕐 {estimatedMinutes}m</span>
          <span>📚 {totalLessons} lessons</span>
        </div>

        {!locked && (status === 'completed' || status === 'in-progress') && (
          <div>
            <div className="progress-bar">
              <div className="progress-bar-fill" style={{ width: `${(progress || 0) * 100}%`, background: color }} />
            </div>
            {status === 'completed' && <div style={{ fontSize: '0.78rem', color: 'var(--green)', marginTop: 6, fontWeight: 600 }}>✅ Completed</div>}
            {status === 'in-progress' && <div style={{ fontSize: '0.78rem', color: color, marginTop: 6 }}>{Math.round((progress || 0) * 100)}% complete</div>}
          </div>
        )}

        {locked && (
          <div style={{ padding: '5px 10px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 'var(--radius-sm)', fontSize: '0.73rem', color: '#f59e0b', textAlign: 'center', fontWeight: 600 }}>
            🔒 Locked
          </div>
        )}
      </div>
    </Link>
  );
}

export default function ModulesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem('elixa_token')) { router.push('/login'); return; }
    api.getModules()
      .then(data => setCategories(data.categories))
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

  const totalModules = categories.reduce((s, c) => s + c.modules.length, 0);
  const completedModules = categories.flatMap(c => c.modules).filter(m => m.status === 'completed').length;

  return (
    <>
      <Navbar />
      <Toast />
      <div className="page-wrapper">
        <div className="container">
          <div className="animate-fade" style={{ marginBottom: 40 }}>
            <h1 style={{ marginBottom: 8 }}>Learning Modules</h1>
            <p style={{ color: 'var(--text-muted)' }}>
              {completedModules} of {totalModules} modules completed — structured from ML fundamentals to production-ready systems.
            </p>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 32, padding: '10px 16px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <span>🟢 Available</span>
            <span>🔵 In Progress</span>
            <span>✅ Completed</span>
            <span>🔒 Locked (preview only)</span>
          </div>

          {categories.map((cat, ci) => (
            <div key={cat.id} className="animate-fade" style={{ marginBottom: 48, animationDelay: `${ci * 0.08}s` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <h2 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{cat.label}</h2>
                <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {cat.modules.filter(m => m.status === 'completed').length}/{cat.modules.length} done
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                {cat.modules.map(m => <ModuleCard key={m.moduleId} module={m} />)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
