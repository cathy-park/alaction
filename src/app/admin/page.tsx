'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    ready: 0,
    expired: 0,
  });
  const [recentSessions, setRecentSessions] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const { count: totalSessions } = await supabase.from('sessions').select('*', { count: 'exact', head: true });
    const { count: published } = await supabase.from('reports').select('*', { count: 'exact', head: true }).eq('report_status', 'published');
    const { count: ready } = await supabase.from('reports').select('*', { count: 'exact', head: true }).eq('report_status', 'ready');
    const { count: expired } = await supabase.from('reports').select('*', { count: 'exact', head: true }).eq('report_status', 'expired');

    setStats({
      total: totalSessions || 0,
      published: published || 0,
      ready: ready || 0,
      expired: expired || 0,
    });

    const { data: sessions } = await supabase
      .from('sessions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (sessions) setRecentSessions(sessions);
  };

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-['Orbitron'] tracking-wide">SYSTEM OVERVIEW</h1>
          <p className="text-[#9A91B4] text-sm mt-1">Real-time status of sessions and reports.</p>
        </div>
        <Link href="/admin/sessions/new" className="group relative inline-flex items-center justify-center overflow-hidden rounded-full p-4 px-8 font-medium text-white transition-all duration-300">
          <span className="absolute inset-0 bg-gradient-to-r from-[#FF2A9D] to-[#8C3FFF] opacity-90 group-hover:opacity-100"></span>
          <span className="absolute bottom-0 left-0 h-1/3 w-full bg-gradient-to-t from-white/20 to-transparent"></span>
          <span className="relative font-bold shadow-black drop-shadow-md">새 경기 세션 생성 ⚡</span>
        </Link>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-[1.5rem] p-6 relative overflow-hidden group hover:border-[#FF2A9D]/30 transition-colors">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FF2A9D] to-transparent opacity-50" />
          <h3 className="text-[#9A91B4] font-['Rajdhani'] uppercase tracking-widest text-xs font-bold mb-2">Total Sessions</h3>
          <div className="font-['Rajdhani'] font-bold text-5xl text-transparent bg-clip-text bg-gradient-to-br from-white to-[#BFBBCF]">
            {stats.total}
          </div>
        </div>
        <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-[1.5rem] p-6 relative overflow-hidden group hover:border-[#20C6FF]/30 transition-colors">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#20C6FF] to-transparent opacity-50" />
          <h3 className="text-[#9A91B4] font-['Rajdhani'] uppercase tracking-widest text-xs font-bold mb-2">Published Reports</h3>
          <div className="font-['Rajdhani'] font-bold text-5xl text-transparent bg-clip-text bg-gradient-to-br from-[#20C6FF] to-[#0070FF]">
            {stats.published}
          </div>
        </div>
        <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-[1.5rem] p-6 relative overflow-hidden group hover:border-[#B5FF2D]/30 transition-colors">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#B5FF2D] to-transparent opacity-50" />
          <h3 className="text-[#9A91B4] font-['Rajdhani'] uppercase tracking-widest text-xs font-bold mb-2">Ready Reports</h3>
          <div className="font-['Rajdhani'] font-bold text-5xl text-transparent bg-clip-text bg-gradient-to-br from-[#B5FF2D] to-[#20C6FF]">
            {stats.ready}
          </div>
        </div>
        <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-[1.5rem] p-6 relative overflow-hidden group hover:border-[#60597A]/50 transition-colors">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#60597A] to-transparent opacity-50" />
          <h3 className="text-[#9A91B4] font-['Rajdhani'] uppercase tracking-widest text-xs font-bold mb-2">Expired</h3>
          <div className="font-['Rajdhani'] font-bold text-5xl text-[#60597A]">
            {stats.expired}
          </div>
        </div>
      </div>

      {/* Recent Sessions Table */}
      <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-[2rem] overflow-hidden backdrop-blur-md">
        <div className="p-6 border-b border-[rgba(255,255,255,0.05)] flex justify-between items-center">
          <h2 className="text-xl font-bold font-['Orbitron']">RECENT SESSIONS</h2>
          <Link href="/admin/sessions" className="text-sm font-['Rajdhani'] uppercase tracking-widest text-[#20C6FF] hover:text-white transition-colors">View All →</Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[rgba(0,0,0,0.2)] text-[#9A91B4] text-xs font-['Rajdhani'] uppercase tracking-wider">
                <th className="p-4 font-bold">Session Name</th>
                <th className="p-4 font-bold">Play Date</th>
                <th className="p-4 font-bold">Type</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {recentSessions.map(session => (
                <tr key={session.id} className="border-b border-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                  <td className="p-4 font-bold text-white">{session.title}</td>
                  <td className="p-4 text-[#BFBBCF]">{session.play_date}</td>
                  <td className="p-4 text-[#BFBBCF]">{session.program_type}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold font-['Rajdhani'] tracking-widest uppercase border ${
                      session.status === 'published' ? 'bg-[#20C6FF]/10 text-[#20C6FF] border-[#20C6FF]/30' :
                      session.status === 'ready' ? 'bg-[#B5FF2D]/10 text-[#B5FF2D] border-[#B5FF2D]/30' :
                      'bg-gray-500/10 text-gray-400 border-gray-500/30'
                    }`}>
                      {session.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Link href={`/admin/sessions/${session.id}`} className="text-sm font-bold text-[#FF2A9D] hover:text-white transition-colors">
                      관리하기
                    </Link>
                  </td>
                </tr>
              ))}
              {recentSessions.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[#60597A] font-['Rajdhani'] uppercase tracking-widest">No sessions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
