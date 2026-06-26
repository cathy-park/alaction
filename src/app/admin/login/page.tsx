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

    const { data, error } = await supabase.auth.signInWithPassword({
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
    <div className="min-h-screen flex items-center justify-center bg-[#04040a] p-4">
      <div className="w-full max-w-md p-8 rounded-[20px] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] backdrop-blur-[14px]">
        <h1 className="text-2xl font-bold text-center text-[#FF2A9D] font-['Orbitron'] mb-6">ADMIN LOGIN</h1>
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#BFBBCF] mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#04040a] border border-[#60597A] rounded-lg px-4 py-2 text-[#F0ECFF] focus:outline-none focus:border-[#FF2A9D] transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#BFBBCF] mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#04040a] border border-[#60597A] rounded-lg px-4 py-2 text-[#F0ECFF] focus:outline-none focus:border-[#FF2A9D] transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 mt-6 rounded-full bg-gradient-to-r from-[#FF2A9D] via-[#8C3FFF] to-[#20C6FF] text-white font-bold font-['Rajdhani'] tracking-widest hover:shadow-[0_0_36px_rgba(255,42,157,0.3)] transition-shadow disabled:opacity-50"
          >
            {loading ? 'LOGGING IN...' : 'LOGIN'}
          </button>
        </form>
      </div>
    </div>
  );
}
