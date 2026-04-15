'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Toast from '@/components/Toast';

const GAMES = [
  {
    id: 'overfitting-challenge',
    title: '📉 Overfitting Challenge',
    description: 'Adjust the polynomial degree and find the sweet spot between underfitting and overfitting. Maximize test accuracy!',
    difficulty: 'intermediate',
    xp: 30,
    icon: '📉',
    color: '#ef4444',
  },
  {
    id: 'neural-network-trainer',
    title: '🧠 Neural Network Trainer',
    description: 'Configure hidden neurons and learning rate, then watch your network train in real-time with animated loss curves.',
    difficulty: 'intermediate',
    xp: 30,
    icon: '🧠',
    color: '#8b5cf6',
  },
];

export default function GamesPage() {
  const router = useRouter();
  useEffect(() => { if (!localStorage.getItem('elixa_token')) router.push('/login'); }, [router]);

  return (
    <>
      <Navbar />
      <Toast />
      <div className="page-wrapper">
        <div className="container">
          <div className="animate-fade" style={{ marginBottom: 40 }}>
            <h1 style={{ marginBottom: 8 }}>🎮 Mini-Games</h1>
            <p style={{ color: 'var(--text-muted)' }}>Learn ML concepts by playing. Earn XP for high scores!</p>
          </div>
          <div className="grid-2 stagger-children">
            {GAMES.map(g => (
              <Link key={g.id} href={`/games/${g.id}`} style={{ textDecoration: 'none' }}>
                <div className="card" style={{ borderLeft: `3px solid ${g.color}`, padding: '28px', cursor: 'pointer', height: '100%' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
                  <div style={{ fontSize: '3rem', marginBottom: 16 }}>{g.icon}</div>
                  <h2 style={{ fontSize: '1.2rem', marginBottom: 8 }}>{g.title}</h2>
                  <p style={{ fontSize: '0.9rem', marginBottom: 20, margin: '0 0 20px' }}>{g.description}</p>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <span className={`badge badge-${g.difficulty}`}>{g.difficulty}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.78rem', color: 'var(--orange)', fontWeight: 600 }}>⚡ +{g.xp} XP</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
