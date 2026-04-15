'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Toast from '@/components/Toast';

const DIFFICULTY_COLORS = { beginner: 'var(--green)', intermediate: 'var(--orange)', advanced: 'var(--red)' };
const TIER_LABELS = { interactive: '✨ Interactive', reading: '📖 Reading', structure: '📋 Structure' };

function ModuleCard({ module }) {
  const { moduleId, title, description, icon, color, difficulty, tier, estimatedMinutes, totalLessons, progress, status, locked } = module;

  return (
    <Link href={locked ? '#' : `/modules/${moduleId}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div style={{
        position: 'relative',
        background: 'var(--bg-card)',
        border: `1px solid ${status === 'completed' ? 'rgba(16,185,129,0.3)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
        transition: 'all 0.2s',
        cursor: locked ? 'not-allowed' : 'pointer',
        opacity: locked ? 0.5 : 1,
        overflow: 'hidden',
        height: '100%',
      }}
        onMouseEnter={e => { if (!locked) { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.boxShadow = `0 8px 32px rgba(0,0,0,0.4)`; } }}
        onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.borderColor = status === 'completed' ? 'rgba(16,185,129,0.3)' : 'var(--border)'; e.currentTarget.style.boxShadow = ''; }}
      >
        {/* Color accent top */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${color}, transparent)`, borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <span style={{ fontSize: '2rem' }}>{icon}</span>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <span className={`badge badge-${difficulty}`}>{difficulty}</span>
            {tier !== 'structure' && <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 8px', borderRadius: 'var(--radius-full)', fontSize: '0.72rem', fontWeight: 600, background: tier === 'interactive' ? 'var(--accent-soft)' : 'var(--blue-soft)', color: tier === 'interactive' ? 'var(--accent)' : 'var(--blue)' }}>
              {TIER_LABELS[tier]}
            </span>}
          </div>
        </div>

        <h3 style={{ fontSize: '0.95rem', marginBottom: 6, lineHeight: 1.3 }}>{title}</h3>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 16, lineHeight: 1.55, margin: '0 0 16px 0' }}>{description}</p>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 10 }}>
          <span>🕐 {estimatedMinutes}m</span>
          <span>📚 {totalLessons} lessons</span>
        </div>

        {status !== 'locked' && (
          <div>
            <div className="progress-bar">
              <div className="progress-bar-fill" style={{ width: `${(progress || 0) * 100}%`, background: color }} />
            </div>
            {status === 'completed' && <div style={{ fontSize: '0.78rem', color: 'var(--green)', marginTop: 6, fontWeight: 600 }}>✅ Completed</div>}
            {status === 'in-progress' && <div style={{ fontSize: '0.78rem', color: color, marginTop: 6 }}>{Math.round((progress || 0) * 100)}% complete</div>}
          </div>
        )}

        {locked && <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>🔒 Complete prerequisites first</div>}
      </div>
    </Link>
  );
}

export default function ModulesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('elixa_token');
    if (!token) { router.push('/login'); return; }
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
              {completedModules}/{totalModules} modules completed — inspired by Google Machine Learning Crash Course
            </p>
          </div>

          {categories.map((cat, ci) => (
            <div key={cat.id} className="animate-fade" style={{ marginBottom: 48, animationDelay: `${ci * 0.1}s` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <h2 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{cat.label}</h2>
                <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{cat.modules.filter(m => m.status === 'completed').length}/{cat.modules.length}</span>
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
