'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api, setToken } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Toast, { showToast } from '@/components/Toast';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.login(form);
      setToken(data.token);
      showToast({ message: `Welcome back, ${data.user.name}! 👋`, type: 'success' });
      router.push('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <Toast />
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 16px' }}>
        <div style={{ position: 'fixed', top: '20%', right: '20%', width: 350, height: 350, background: 'radial-gradient(circle, rgba(0,212,170,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div className="animate-fade" style={{ width: '100%', maxWidth: 420 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>👋</div>
            <h1 style={{ fontSize: '1.75rem', marginBottom: 8 }}>Welcome back</h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Sign in to continue your learning journey</p>
          </div>

          <div className="card" style={{ padding: '32px' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" type="email" placeholder="alice@example.com" required
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input className="form-input" type="password" placeholder="Your password" required
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
              </div>
              {error && <div className="form-error">⚠ {error}</div>}
              <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
                {loading ? <span className="spinner" /> : 'Sign In →'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: 20, fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Don&apos;t have an account?{' '}
              <Link href="/register" style={{ color: 'var(--accent)', fontWeight: 600 }}>Create one free</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
