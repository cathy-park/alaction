'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/admin');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="card-head" style={{ flexDirection: 'column', alignItems: 'center', gap: '8px', justifyContent: 'center', borderBottom: '0', paddingTop: '32px' }}>
          <img src="/logo_dark.png" alt="R-ACTION" style={{ height: '26px', width: 'auto', objectFit: 'contain' }} />
          <span style={{ color: 'var(--admin-muted)', fontSize: '12px', fontWeight: 700 }}>Admin Authentication</span>
        </div>

        <div className="card-body">
          <form onSubmit={handleLogin} className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
            <div className="field">
              <label>Admin Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@alaction.com" />
            </div>
            <div className="field">
              <label>Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            {error && (
              <div className="note" style={{ marginTop: 0 }}>{error}</div>
            )}
            <button type="submit" className="btn primary" disabled={loading} style={{ width: '100%', marginTop: '14px', height: '46px' }}>
              {loading ? 'Authenticating...' : 'Enter System'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
