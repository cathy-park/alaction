'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function SessionsList() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    const { data } = await supabase
      .from('sessions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setSessions(data);
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-['Orbitron'] tracking-wide">ALL SESSIONS</h1>
          <p className="text-[#9A91B4] text-sm mt-1">Manage all game sessions and participants.</p>
        </div>
        <Link href="/admin/sessions/new" className="group relative inline-flex items-center justify-center overflow-hidden rounded-full p-3 px-6 font-medium text-white transition-all duration-300 border border-[rgba(255,42,157,0.5)] bg-[rgba(255,42,157,0.1)] hover:bg-[rgba(255,42,157,0.3)] shadow-[0_0_15px_rgba(255,42,157,0.2)]">
          <span className="relative font-bold font-['Rajdhani'] uppercase tracking-widest text-sm">+ Create Session</span>
        </Link>
      </div>

      <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-[2rem] overflow-hidden backdrop-blur-md">
        {loading ? (
          <div className="p-16 text-center text-[#FF2A9D] font-['Orbitron'] font-bold text-lg animate-pulse">LOADING DATA...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[rgba(0,0,0,0.2)] text-[#9A91B4] text-xs font-['Rajdhani'] uppercase tracking-wider">
                  <th className="p-5 font-bold">Session Name</th>
                  <th className="p-5 font-bold">Play Date</th>
                  <th className="p-5 font-bold">Type</th>
                  <th className="p-5 font-bold">Status</th>
                  <th className="p-5 font-bold">Created At</th>
                  <th className="p-5 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map(session => (
                  <tr key={session.id} className="border-b border-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.04)] transition-colors group">
                    <td className="p-5">
                      <div className="font-bold text-white group-hover:text-[#20C6FF] transition-colors">{session.title}</div>
                    </td>
                    <td className="p-5 text-[#BFBBCF]">{session.play_date}</td>
                    <td className="p-5 text-[#BFBBCF]">{session.program_type}</td>
                    <td className="p-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold font-['Rajdhani'] tracking-widest uppercase border ${
                        session.status === 'published' ? 'bg-[#20C6FF]/10 text-[#20C6FF] border-[#20C6FF]/30 shadow-[0_0_10px_rgba(32,198,255,0.2)]' :
                        session.status === 'ready' ? 'bg-[#B5FF2D]/10 text-[#B5FF2D] border-[#B5FF2D]/30 shadow-[0_0_10px_rgba(181,255,45,0.2)]' :
                        'bg-gray-500/10 text-gray-400 border-gray-500/30'
                      }`}>
                        {session.status}
                      </span>
                    </td>
                    <td className="p-5 text-[#60597A] text-sm">
                      {new Date(session.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-5 text-right">
                      <Link href={`/admin/sessions/${session.id}`} className="inline-block px-4 py-1.5 rounded-lg border border-[rgba(255,255,255,0.1)] text-xs font-bold text-white hover:border-[#FF2A9D] hover:text-[#FF2A9D] transition-colors">
                        MANAGE
                      </Link>
                    </td>
                  </tr>
                ))}
                {sessions.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-16 text-center text-[#60597A] font-['Rajdhani'] uppercase tracking-widest">No sessions created yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
