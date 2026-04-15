'use client';

import { useEffect, useRef, useState } from 'react';

let toastIdCounter = 0;
let globalAddToast = null;

export function showToast({ message, type = 'info', duration = 3500 }) {
  if (globalAddToast) {
    globalAddToast({ id: ++toastIdCounter, message, type, duration });
  }
}

const TYPE_ICONS = {
  success: '✅',
  error: '❌',
  info: '💡',
  achievement: '🏆',
};

export default function Toast() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    globalAddToast = (toast) => {
      setToasts(prev => [...prev, toast]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== toast.id));
      }, toast.duration);
    };
    return () => { globalAddToast = null; };
  }, []);

  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`}>
          <span>{TYPE_ICONS[t.type] || '💡'}</span>
          <span>{t.message}</span>
          <button
            onClick={() => setToasts(p => p.filter(x => x.id !== t.id))}
            style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1rem', cursor: 'pointer' }}
          >×</button>
        </div>
      ))}
    </div>
  );
}
