'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Toast from '@/components/Toast';
import { api } from '@/lib/api';

const RANK_META = {
  1: { medal: '🥇', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.35)', label: '1st' },
  2: { medal: '🥈', color: '#94a3b8', bg: 'rgba(148,163,184,0.08)', border: 'rgba(148,163,184,0.3)', label: '2nd' },
  3: { medal: '🥉', color: '#cd7c2f', bg: 'rgba(205,124,47,0.08)', border: 'rgba(205,124,47,0.3)', label: '3rd' },
};

function PodiumCard({ leader, isYou }) {
  const meta = RANK_META[leader.rank] || { medal: `#${leader.rank}`, color: 'var(--accent)', bg: 'var(--bg-card)', border: 'var(--border)', label: `#${leader.rank}` };
  const isFirst = leader.rank === 1;
  return (
    <div style={{
      background: meta.bg,
      border: `1px solid ${meta.border}`,
      borderRadius: 'var(--radius-xl)',
      padding: '28px 20px 24px',
      textAlign: 'center',
      marginTop: isFirst ? 0 : 28,
      position: 'relative',
      transition: 'all 0.2s',
      ...(isYou ? { boxShadow: `0 0 0 2px var(--accent)` } : {}),
    }}>
      {isYou && (
        <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', padding: '2px 10px', background: 'var(--accent)', borderRadius: 'var(--radius-full)', fontSize: '0.65rem', fontWeight: 700, color: '#000', whiteSpace: 'nowrap' }}>
          YOU
        </div>
      )}
      <div style={{ fontSize: '2.4rem', marginBottom: 6 }}>{meta.medal}</div>
      <div style={{ width: 52, height: 52, borderRadius: '50%', background: meta.bg, border: `2px solid ${meta.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', margin: '0 auto 10px' }}>
        {leader.avatar}
      </div>
      <div style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: 2, color: 'var(--text-primary)' }}>{leader.name}</div>
      <div style={{ fontWeight: 800, fontSize: '1.5rem', color: meta.color, lineHeight: 1 }}>{leader.xp}</div>
      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 2 }}>XP</div>
      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 6 }}>
        Lv.{leader.level} · {leader.lessonsCompleted} lessons · {leader.achievementCount} 🏆
      </div>
    </div>
  );
}

function TableRow({ leader, isYou }) {
  const meta = RANK_META[leader.rank];
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px',
      background: isYou ? 'rgba(0,212,170,0.04)' : 'var(--bg-card)',
      border: `1px solid ${isYou ? 'rgba(0,212,170,0.3)' : 'var(--border)'}`,
      borderRadius: 'var(--radius-md)',
      transition: 'all 0.2s',
    }}>
      <div style={{ width: 36, textAlign: 'center', fontWeight: 700, fontSize: '1rem', color: meta ? meta.color : 'var(--text-muted)', flexShrink: 0 }}>
        {meta ? meta.medal : `#${leader.rank}`}
      </div>
      <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
        {leader.avatar}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 600, fontSize: '0.92rem' }}>{leader.name}</span>
          {isYou && <span style={{ padding: '1px 7px', background: 'var(--accent-soft)', border: '1px solid var(--border-accent)', borderRadius: 'var(--radius-full)', fontSize: '0.65rem', fontWeight: 700, color: 'var(--accent)' }}>YOU</span>}
        </div>
        <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', marginTop: 2 }}>
          Level {leader.level} · {leader.lessonsCompleted} lessons · {leader.achievementCount} badges
        </div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontWeight: 800, color: meta ? meta.color : 'var(--accent)', fontSize: '1rem' }}>{leader.xp} XP</div>
        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Lv.{leader.level}</div>
      </div>
    </div>
  );
}

export default function LeaderboardPage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [myId, setMyId] = useState(null);
  const [myName, setMyName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem('elixa_token')) { router.push('/login'); return; }
    Promise.all([api.getLeaderboard(), api.getMe()])
      .then(([lb, me]) => { setData(lb); setMyId(me.user.id); setMyName(me.user.name); })
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

  const { leaders = [], currentUser } = data || {};
  // Identify current user by name (API doesn't return id in leaders)
  const isYou = (l) => l.name === myName;

  // Split: top 3 for podium, rest for table
  // But if < 3 users, show all in table (no podium)
  const showPodium = leaders.length >= 2;
  const podiumLeaders = leaders.slice(0, Math.min(3, leaders.length));
  const tableLeaders = leaders.length >= 3 ? leaders.slice(3) : leaders;

  // Podium order: 2nd, 1st, 3rd (classic podium layout)
  const podiumOrder = podiumLeaders.length === 1
    ? [podiumLeaders[0]]
    : podiumLeaders.length === 2
      ? [podiumLeaders[1], podiumLeaders[0]]
      : [podiumLeaders[1], podiumLeaders[0], podiumLeaders[2]];

  return (
    <>
      <Navbar />
      <Toast />
      <div className="page-wrapper">
        <div className="container" style={{ maxWidth: 680 }}>

          {/* Header */}
          <div className="animate-fade" style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ fontSize: '3rem', marginBottom: 8 }}>🏆</div>
            <h1 style={{ marginBottom: 8 }}>Leaderboard</h1>
            <p style={{ color: 'var(--text-muted)' }}>
              {leaders.length} learner{leaders.length !== 1 ? 's' : ''} competing · ranked by XP
            </p>
            {currentUser && (
              <div style={{ display: 'inline-flex', gap: 20, marginTop: 16, padding: '10px 24px', background: 'var(--accent-soft)', border: '1px solid var(--border-accent)', borderRadius: 'var(--radius-full)', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Your rank</span>
                <span style={{ fontWeight: 800, color: 'var(--accent)' }}>#{currentUser.rank}</span>
                <span style={{ color: 'var(--text-muted)' }}>·</span>
                <span style={{ fontWeight: 700 }}>⚡ {currentUser.xp} XP</span>
              </div>
            )}
          </div>

          {leaders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '3rem', marginBottom: 12 }}>🚀</div>
              <p>No learners yet — be the first to earn XP!</p>
            </div>
          ) : (
            <>
              {/* Podium — shown when 2+ players */}
              {showPodium && (
                <div className="animate-fade podium-grid" style={{
                  display: 'grid',
                  gridTemplateColumns: podiumOrder.length === 1 ? '1fr' : podiumOrder.length === 2 ? '1fr 1fr' : '1fr 1.15fr 1fr',
                  gap: 16, marginBottom: 32
                }}>
                  {podiumOrder.map(leader => (
                    <PodiumCard key={leader.rank} leader={leader} isYou={isYou(leader)} />
                  ))}
                </div>
              )}

              {/* Table — all rows when < 3 total, or rows 4+ when podium shown */}
              {tableLeaders.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }} className="stagger-children">
                  {tableLeaders.map(leader => (
                    <TableRow key={leader.rank} leader={leader} isYou={isYou(leader)} />
                  ))}
                </div>
              )}

              {/* If only 1 user total — just show as table row */}
              {!showPodium && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {leaders.map(leader => (
                    <TableRow key={leader.rank} leader={leader} isYou={isYou(leader)} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
