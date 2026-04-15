'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { api, clearToken } from '@/lib/api';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('elixa_token');
    if (token) {
      api.getMe()
        .then(data => { setUser(data.user); setProgress(data.progress); })
        .catch(() => { clearToken(); setUser(null); });
    }
  }, [pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    clearToken();
    setUser(null);
    setDropdownOpen(false);
    router.push('/');
  };

  const navLinks = [
    { href: '/dashboard', label: '🏠 Dashboard' },
    { href: '/modules', label: '📚 Modules' },
    { href: '/playground', label: '💻 Playground' },
    { href: '/games', label: '🎮 Games' },
    { href: '/simulations', label: '🔬 Simulations' },
    { href: '/leaderboard', label: '🏆 Leaderboard' },
  ];

  const isActive = (href) => pathname === href || pathname.startsWith(href + '/');

  const xp = progress?.xp || 0;
  const level = progress?.level || 1;
  const xpProgress = xp % 100;

  return (
    <>
      <nav className="navbar">
        <Link href="/" className="navbar-logo">🧠 Elixa</Link>

        {user && (
          <div className="navbar-links">
            {navLinks.map(l => (
              <Link key={l.href} href={l.href} className={`nav-link ${isActive(l.href) ? 'active' : ''}`}>
                {l.label.split(' ')[1]}
              </Link>
            ))}
          </div>
        )}

        <div className="navbar-right">
          {user ? (
            <div ref={dropdownRef} style={{ position: 'relative' }}>
              {/* Avatar circle button */}
              <button
                id="user-menu-btn"
                onClick={() => setDropdownOpen(o => !o)}
                style={{
                  width: 38, height: 38,
                  borderRadius: '50%',
                  background: dropdownOpen
                    ? 'linear-gradient(135deg, var(--accent), #009980)'
                    : 'var(--bg-tertiary)',
                  border: `2px solid ${dropdownOpen ? 'var(--accent)' : 'var(--border)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.1rem', cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: dropdownOpen ? '0 0 12px var(--accent-glow)' : 'none',
                }}
                onMouseEnter={e => { if (!dropdownOpen) { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = 'var(--bg-card-hover)'; }}}
                onMouseLeave={e => { if (!dropdownOpen) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-tertiary)'; }}}
              >
                {user.avatar}
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                  width: 240,
                  background: 'rgba(13, 17, 23, 0.97)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
                  backdropFilter: 'blur(20px)',
                  overflow: 'hidden',
                  zIndex: 200,
                  animation: 'fadeIn 0.15s ease',
                }}>
                  {/* User info */}
                  <div style={{ padding: '16px', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--accent-soft)', border: '1px solid var(--border-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>
                        {user.avatar}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{user.name}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{user.email}</div>
                      </div>
                    </div>

                    {/* XP + level */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 5 }}>
                      <span style={{ color: 'var(--accent)', fontWeight: 700 }}>⚡ {xp} XP</span>
                      <span>Level {level}</span>
                    </div>
                    <div style={{ width: '100%', height: 4, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${xpProgress}%`, background: 'var(--accent)', borderRadius: 'var(--radius-full)', transition: 'width 0.6s ease' }} />
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 3, textAlign: 'right' }}>{xpProgress}/100 to next level</div>
                  </div>

                  {/* Nav links */}
                  <div style={{ padding: '8px 0' }}>
                    {navLinks.map(l => (
                      <Link key={l.href} href={l.href}
                        onClick={() => setDropdownOpen(false)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10,
                          padding: '9px 16px',
                          fontSize: '0.88rem',
                          color: isActive(l.href) ? 'var(--accent)' : 'var(--text-secondary)',
                          background: isActive(l.href) ? 'var(--accent-soft)' : 'transparent',
                          transition: 'all 0.15s',
                          textDecoration: 'none',
                        }}
                        onMouseEnter={e => { if (!isActive(l.href)) { e.currentTarget.style.background = 'var(--bg-tertiary)'; e.currentTarget.style.color = 'var(--text-primary)'; }}}
                        onMouseLeave={e => { if (!isActive(l.href)) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}}
                      >
                        <span>{l.label.split(' ')[0]}</span>
                        <span>{l.label.split(' ').slice(1).join(' ')}</span>
                      </Link>
                    ))}
                    <Link href="/profile"
                      onClick={() => setDropdownOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 16px', fontSize: '0.88rem', color: isActive('/profile') ? 'var(--accent)' : 'var(--text-secondary)', background: isActive('/profile') ? 'var(--accent-soft)' : 'transparent', transition: 'all 0.15s', textDecoration: 'none' }}
                      onMouseEnter={e => { if (!isActive('/profile')) { e.currentTarget.style.background = 'var(--bg-tertiary)'; e.currentTarget.style.color = 'var(--text-primary)'; }}}
                      onMouseLeave={e => { if (!isActive('/profile')) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}}
                    >
                      <span>👤</span><span>Profile</span>
                    </Link>
                  </div>

                  {/* Logout */}
                  <div style={{ borderTop: '1px solid var(--border)', padding: '8px' }}>
                    <button onClick={handleLogout} style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                      padding: '9px 10px', fontSize: '0.88rem',
                      color: '#ef4444', background: 'transparent',
                      border: 'none', borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left',
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <span>↩</span> Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link href="/register" className="btn btn-primary btn-sm">Get Started</Link>
            </>
          )}
        </div>
      </nav>
    </>
  );
}
