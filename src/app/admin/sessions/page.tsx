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
        <h1 className="text-3xl font-bold font-['Orbitron']">SESSIONS</h1>
        <Link href="/admin/sessions/new" className="bg-[#FF2A9D] hover:bg-[#ff4db1] text-white px-6 py-2 rounded-full font-bold transition-colors">
          새 경기 세션 만들기
        </Link>
      </div>

      <div className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[#BFBBCF]">불러오는 중...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.1)] text-[#BFBBCF] text-sm">
                <th className="p-4 font-normal">세션명</th>
                <th className="p-4 font-normal">경기 일자</th>
                <th className="p-4 font-normal">유형</th>
                <th className="p-4 font-normal">상태</th>
                <th className="p-4 font-normal">등록일</th>
                <th className="p-4 font-normal"></th>
              </tr>
            </thead>
            <tbody>
              {sessions.map(session => (
                <tr key={session.id} className="border-b border-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                  <td className="p-4 font-bold">{session.title}</td>
                  <td className="p-4 text-[#BFBBCF]">{session.play_date}</td>
                  <td className="p-4 text-[#BFBBCF]">{session.program_type}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      session.status === 'published' ? 'bg-[#20C6FF]/20 text-[#20C6FF]' :
                      session.status === 'ready' ? 'bg-[#B5FF2D]/20 text-[#B5FF2D]' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {session.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 text-[#60597A] text-sm">
                    {new Date(session.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right">
                    <Link href={`/admin/sessions/${session.id}`} className="text-sm text-[#FF2A9D] hover:underline">
                      관리
                    </Link>
                  </td>
                </tr>
              ))}
              {sessions.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#60597A]">생성된 세션이 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
