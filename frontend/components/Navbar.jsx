'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api, clearToken } from '@/lib/api';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('elixa_token');
    if (token) {
      api.getMe()
        .then(data => {
          setUser(data.user);
          setXp(data.progress?.xp || 0);
          setLevel(data.progress?.level || 1);
        })
        .catch(() => { clearToken(); setUser(null); });
    }
  }, [pathname]);

  const handleLogout = () => {
    clearToken();
    setUser(null);
    router.push('/');
  };

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/modules', label: 'Modules' },
    { href: '/playground', label: 'Playground' },
    { href: '/games', label: 'Games' },
    { href: '/simulations', label: 'Simulations' },
    { href: '/leaderboard', label: 'Leaderboard' },
  ];

  const isActive = (href) => pathname === href || pathname.startsWith(href + '/');

  return (
    <nav className="navbar">
      <Link href="/" className="navbar-logo">🧠 Elixa</Link>

      {user && (
        <div className="navbar-links">
          {navLinks.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className={`nav-link ${isActive(l.href) ? 'active' : ''}`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}

      <div className="navbar-right">
        {user ? (
          <>
            <span className="xp-badge">⚡ {xp} XP</span>
            <Link href="/profile" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, background: 'var(--bg-tertiary)', border: '1px solid var(--border)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', transition: 'all 0.2s' }}>
              {user.avatar} {user.name}
            </Link>
            <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link href="/login" className="btn btn-ghost btn-sm">Login</Link>
            <Link href="/register" className="btn btn-primary btn-sm">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
