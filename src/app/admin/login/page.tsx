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
    <div className="min-h-screen bg-[#04040a] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-[rgba(255,42,157,0.15)] to-[rgba(32,198,255,0.15)] blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <div className="font-['Orbitron'] font-black text-4xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#FF2A9D] to-[#20C6FF] mb-2">
            ALACTION
          </div>
          <div className="text-[#60597A] font-['Rajdhani'] uppercase tracking-widest text-sm font-bold">System Authentication</div>
        </div>

        <div className="bg-[rgba(255,255,255,0.03)] backdrop-blur-2xl border border-[rgba(255,255,255,0.05)] rounded-[2rem] p-10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative">
          {/* Subtle top border glow */}
          <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-[#FF2A9D] to-transparent opacity-50" />

          <h2 className="text-2xl font-bold font-['Orbitron'] text-white mb-8 text-center">ACCESS GRANTED</h2>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold font-['Rajdhani'] uppercase tracking-wider text-[#9A91B4] mb-2">Admin Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#070710] border border-[rgba(255,255,255,0.1)] rounded-xl px-4 py-3 text-white placeholder-[#60597A] focus:outline-none focus:border-[#FF2A9D] focus:shadow-[0_0_15px_rgba(255,42,157,0.2)] transition-all"
                placeholder="admin@alaction.com"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold font-['Rajdhani'] uppercase tracking-wider text-[#9A91B4] mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#070710] border border-[rgba(255,255,255,0.1)] rounded-xl px-4 py-3 text-white placeholder-[#60597A] focus:outline-none focus:border-[#20C6FF] focus:shadow-[0_0_15px_rgba(32,198,255,0.2)] transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-[rgba(255,42,157,0.1)] border border-[rgba(255,42,157,0.2)] rounded-lg text-[#FF2A9D] text-sm text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full relative group overflow-hidden bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl py-3 mt-4 transition-all"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#FF2A9D] to-[#8C3FFF] opacity-80 group-hover:opacity-100 transition-opacity" />
              <span className="relative text-white font-bold font-['Rajdhani'] uppercase tracking-widest text-lg">
                {loading ? 'Authenticating...' : 'Enter System'}
              </span>
            </button>
          </form>
        </div>
        <p className="text-center text-[#60597A] text-xs mt-8">© 2025 ALACTION. Authorized Personnel Only.</p>
      </div>
    </div>
  );
}
