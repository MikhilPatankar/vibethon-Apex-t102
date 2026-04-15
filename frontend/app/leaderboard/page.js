'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Toast from '@/components/Toast';
import { api } from '@/lib/api';

export default function LeaderboardPage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [myId, setMyId] = useState(null);

  useEffect(() => {
    if (!localStorage.getItem('elixa_token')) { router.push('/login'); return; }
    Promise.all([api.getLeaderboard(), api.getMe()])
      .then(([lb, me]) => { setData(lb); setMyId(me.user.id); })
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

  const { leaders, currentUser } = data || {};
  const top3 = leaders?.slice(0, 3) || [];
  const rest = leaders?.slice(3) || [];
  const podiumColors = ['#f59e0b', '#94a3b8', '#cd7c2f'];
  const podiumBg = ['rgba(245,158,11,0.1)', 'rgba(148,163,184,0.08)', 'rgba(205,124,47,0.08)'];

  return (
    <>
      <Navbar />
      <Toast />
      <div className="page-wrapper">
        <div className="container" style={{ maxWidth: 720 }}>
          <div className="animate-fade" style={{ marginBottom: 40 }}>
            <h1 style={{ marginBottom: 6 }}>🏆 Leaderboard</h1>
            <p style={{ color: 'var(--text-muted)' }}>Top learners ranked by XP. You are rank #{currentUser?.rank || '—'}.</p>
          </div>

          {/* Podium */}
          {top3.length === 3 && (
            <div className="animate-fade" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 32 }}>
              {[top3[1], top3[0], top3[2]].map((leader, i) => {
                const actualRank = i === 0 ? 2 : i === 1 ? 1 : 3;
                return (
                  <div key={leader.rank} className="card" style={{ textAlign: 'center', padding: '24px 16px', borderColor: podiumColors[actualRank - 1], background: podiumBg[actualRank - 1], marginTop: actualRank === 1 ? 0 : 20 }}>
                    <div style={{ fontSize: '2rem', marginBottom: 6 }}>{actualRank === 1 ? '🥇' : actualRank === 2 ? '🥈' : '🥉'}</div>
                    <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>{leader.avatar}</div>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: 2 }}>{leader.name}</div>
                    <div style={{ fontWeight: 800, fontSize: '1.3rem', color: podiumColors[actualRank - 1] }}>{leader.xp} XP</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>Level {leader.level} · {leader.lessonsCompleted} lessons</div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Rest of table */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }} className="stagger-children">
            {rest.map((leader, i) => (
              <div key={leader.rank} style={{
                display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px',
                background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
              }}>
                <span style={{ width: 28, textAlign: 'center', fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.88rem' }}>{leader.rank}</span>
                <span style={{ fontSize: '1.2rem' }}>{leader.avatar}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{leader.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Level {leader.level} · {leader.lessonsCompleted} lessons · {leader.achievementCount} badges</div>
                </div>
                <div style={{ fontWeight: 800, color: 'var(--accent)', fontSize: '1rem' }}>{leader.xp} XP</div>
              </div>
            ))}
            {leaders?.length === 0 && (
              <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                No learners yet — be the first! 🚀
              </div>
            )}
          </div>

          {currentUser && (
            <div style={{ marginTop: 20, padding: '14px 20px', background: 'var(--accent-soft)', border: '1px solid var(--border-accent)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Your Position</span>
              <span style={{ fontWeight: 800 }}>Rank #{currentUser.rank} · {currentUser.xp} XP</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
