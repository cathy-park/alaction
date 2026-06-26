'use client';

import { useEffect, useState, use } from 'react';
import { supabase } from '@/lib/supabase';
import Head from 'next/head';

export default function MobileReport({ params }: { params: Promise<{ token: string }> }) {
  const resolvedParams = use(params);
  const token = resolvedParams.token;
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, [token]);

  const fetchReport = async () => {
    // 1. Fetch report by token
    const { data: reportData } = await supabase.from('reports').select('*, sessions(*), participants(*), shooting_results(*)').eq('report_token', token).single();
    
    if (reportData) {
      setReport(reportData);
    }
    setLoading(false);
  };

  if (loading) return <div className="min-h-screen bg-[#04040a] flex items-center justify-center"><div className="text-[#FF2A9D] font-['Orbitron'] font-bold animate-pulse">LOADING DATA...</div></div>;

  if (!report) return (
    <div className="min-h-screen bg-[#04040a] flex items-center justify-center text-center p-6">
      <div>
        <h1 className="text-[#FF2A9D] font-['Orbitron'] text-4xl mb-4">404</h1>
        <p className="text-[#BFBBCF]">리포트를 찾을 수 없거나 유효하지 않은 링크입니다.</p>
      </div>
    </div>
  );

  if (report.report_status !== 'published') {
    return (
      <div className="min-h-screen bg-[#04040a] flex items-center justify-center text-center p-6">
        <div>
          <h1 className="text-[#20C6FF] font-['Orbitron'] text-2xl mb-4">READY</h1>
          <p className="text-[#BFBBCF]">아직 리포트가 공개되지 않았습니다.<br/>관리자의 승인을 기다려주세요.</p>
        </div>
      </div>
    );
  }

  const result = report.shooting_results;
  const session = report.sessions;
  const participant = report.participants;

  return (
    <div className="min-h-screen bg-[#04040a] text-[#F0ECFF] font-['Noto_Sans_KR'] pb-20">
      <div className="max-w-md mx-auto">
        
        <header className="py-6 px-6 border-b border-[rgba(255,255,255,0.1)] flex justify-between items-center">
          <div className="font-['Orbitron'] font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-[#FF2A9D] to-[#20C6FF]">
            ALACTION REPORT
          </div>
          <div className="text-xs text-[#60597A] font-['Rajdhani'] uppercase tracking-widest">{session.play_date}</div>
        </header>

        <main className="p-6">
          <div className="text-center mb-10">
            <div className="inline-block px-4 py-1 rounded-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#BFBBCF] text-xs font-bold mb-4">
              {participant.team_name || '솔로 플레이'}
            </div>
            <h1 className="text-3xl font-bold font-['Orbitron'] text-white mb-2">{participant.nickname}</h1>
            <p className="text-sm text-[#60597A]">{session.title} - {session.program_type}</p>
          </div>

          <div className="relative mb-10">
            <div className="absolute inset-0 bg-gradient-to-br from-[rgba(255,42,157,0.2)] to-[rgba(32,198,255,0.1)] rounded-[2rem] blur-xl opacity-50"></div>
            <div className="relative bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-[2rem] p-8 text-center backdrop-blur-md">
              <div className="text-[#FF2A9D] font-['Rajdhani'] text-sm font-bold tracking-widest uppercase mb-2">RANKING</div>
              <div className="text-7xl font-['Orbitron'] font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-[#BFBBCF]">
                {result.rank}
              </div>
              <div className="text-[#60597A] text-sm mt-2">Overall Position</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-2xl p-5 text-center">
              <div className="text-[#B5FF2D] font-['Rajdhani'] text-[10px] font-bold tracking-widest uppercase mb-1">SCORE</div>
              <div className="text-3xl font-['Rajdhani'] font-bold text-white">{result.score}</div>
            </div>
            <div className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-2xl p-5 text-center">
              <div className="text-[#20C6FF] font-['Rajdhani'] text-[10px] font-bold tracking-widest uppercase mb-1">ACCURACY</div>
              <div className="text-3xl font-['Rajdhani'] font-bold text-white">{result.accuracy}%</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-10">
            <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] rounded-xl p-3 text-center">
              <div className="text-[#60597A] font-['Rajdhani'] text-[9px] font-bold tracking-wider uppercase mb-1">SHOTS</div>
              <div className="text-xl font-['Rajdhani'] font-bold text-white">{result.shots_fired}</div>
            </div>
            <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] rounded-xl p-3 text-center">
              <div className="text-[#60597A] font-['Rajdhani'] text-[9px] font-bold tracking-wider uppercase mb-1">HITS</div>
              <div className="text-xl font-['Rajdhani'] font-bold text-white">{result.hits}</div>
            </div>
            <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] rounded-xl p-3 text-center">
              <div className="text-[#60597A] font-['Rajdhani'] text-[9px] font-bold tracking-wider uppercase mb-1">TIMES HIT</div>
              <div className="text-xl font-['Rajdhani'] font-bold text-white">{result.times_hit}</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-[rgba(255,42,157,0.1)] to-[rgba(140,63,255,0.1)] border border-[rgba(255,42,157,0.2)] rounded-2xl p-6 text-center">
            <h3 className="font-['Orbitron'] font-bold text-lg mb-2 text-[#FF2A9D]">NEXT BATTLE?</h3>
            <p className="text-sm text-[#BFBBCF] mb-4">자신의 최고 기록에 다시 한번 도전해보세요.</p>
            <a href="/" className="inline-block bg-[#FF2A9D] text-white px-6 py-3 rounded-full font-bold text-sm shadow-[0_0_20px_rgba(255,42,157,0.3)]">
              홈페이지로 이동
            </a>
          </div>

        </main>
      </div>
    </div>
  );
}
