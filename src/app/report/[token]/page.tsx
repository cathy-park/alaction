'use client';

import { useEffect, useState, use } from 'react';
import { supabase } from '@/lib/supabase';

// Icons
const IconTarget = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;
const IconSwords = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M14.5 14.5L20 9m0 0V4h-5m5 5l-5.5 5.5M9.5 9.5L4 15m0 0v5h5m-5-5l5.5-5.5M9.5 14.5l5 5"/></svg>;
const IconShield = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>;

export default function MobileReport({ params }: { params: Promise<{ token: string }> }) {
  const resolvedParams = use(params);
  const token = resolvedParams.token;
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, [token]);

  const fetchReport = async () => {
    const { data: reportData } = await supabase.from('reports').select('*, sessions(*), participants(*), shooting_results(*)').eq('report_token', token).single();
    if (reportData) {
      setReport(reportData);
    }
    setLoading(false);
  };

  if (loading) return <div className="min-h-screen bg-[#04040a] flex items-center justify-center"><div className="text-[#FF2A9D] font-['Orbitron'] font-bold text-xl animate-pulse tracking-widest">LOADING DATA...</div></div>;

  if (!report) return (
    <div className="min-h-screen bg-[#04040a] flex items-center justify-center text-center p-6">
      <div className="bg-[rgba(255,255,255,0.02)] backdrop-blur-xl border border-[rgba(255,255,255,0.05)] rounded-[2rem] p-10">
        <h1 className="text-[#FF2A9D] font-['Orbitron'] text-5xl font-black mb-4 tracking-widest">404</h1>
        <p className="text-[#BFBBCF] text-sm font-['Noto_Sans_KR']">리포트를 찾을 수 없거나 유효하지 않은 링크입니다.</p>
      </div>
    </div>
  );

  if (report.report_status !== 'published') {
    return (
      <div className="min-h-screen bg-[#04040a] flex items-center justify-center text-center p-6">
        <div className="bg-[rgba(255,255,255,0.02)] backdrop-blur-xl border border-[rgba(255,255,255,0.05)] rounded-[2rem] p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#20C6FF] to-transparent opacity-50" />
          <h1 className="text-[#20C6FF] font-['Orbitron'] text-3xl font-black mb-4 tracking-widest">STAND BY</h1>
          <p className="text-[#BFBBCF] text-sm font-['Noto_Sans_KR'] leading-relaxed">아직 리포트가 공개되지 않았습니다.<br/>관리자의 승인을 기다려주세요.</p>
        </div>
      </div>
    );
  }

  const result = report.shooting_results;
  const session = report.sessions;
  const participant = report.participants;

  return (
    <div className="min-h-screen bg-[#04040a] text-[#F0ECFF] font-['Noto_Sans_KR'] pb-20 relative overflow-x-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-[rgba(255,42,157,0.15)] to-transparent pointer-events-none" />
      <div className="absolute top-[20%] right-[-20%] w-[300px] h-[300px] bg-[#8C3FFF] rounded-full blur-[120px] opacity-20 pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-20%] w-[300px] h-[300px] bg-[#20C6FF] rounded-full blur-[120px] opacity-20 pointer-events-none" />

      <div className="max-w-md mx-auto relative z-10">
        
        {/* Header */}
        <header className="py-6 px-6 flex justify-between items-center backdrop-blur-md sticky top-0 z-20 border-b border-[rgba(255,255,255,0.05)] bg-[rgba(4,4,10,0.8)]">
          <div className="font-['Orbitron'] font-black text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#FF2A9D] to-[#20C6FF]">
            ALACTION
          </div>
          <div className="text-[10px] text-[#60597A] font-['Rajdhani'] uppercase tracking-widest font-bold border border-[#60597A]/30 px-2 py-1 rounded">
            {session.play_date}
          </div>
        </header>

        <main className="p-6">
          {/* Player Info */}
          <div className="text-center mb-10 mt-4 animate-[fadeIn_0.5s_ease-out]">
            <div className="inline-block px-4 py-1.5 rounded-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#20C6FF] text-[10px] font-['Rajdhani'] font-bold uppercase tracking-widest mb-4 shadow-[0_0_15px_rgba(32,198,255,0.1)]">
              {participant.team_name || 'SOLO PLAYER'}
            </div>
            <h1 className="text-4xl font-black font-['Orbitron'] text-white mb-2 tracking-wide drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{participant.nickname}</h1>
            <p className="text-xs text-[#9A91B4] font-['Rajdhani'] tracking-widest uppercase">{session.title}</p>
          </div>

          {/* Main Rank Card */}
          <div className="relative mb-6 animate-[scaleIn_0.6s_ease-out]">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF2A9D] to-[#8C3FFF] rounded-[2rem] blur-xl opacity-30" />
            <div className="relative bg-[rgba(255,255,255,0.02)] border border-[rgba(255,42,157,0.3)] rounded-[2rem] p-10 text-center backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
              <div className="text-[#FF2A9D] font-['Rajdhani'] text-xs font-bold tracking-[0.3em] uppercase mb-2">OVERALL RANKING</div>
              <div className="text-[100px] leading-none font-['Orbitron'] font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-[#BFBBCF] drop-shadow-[0_10px_20px_rgba(255,42,157,0.3)]">
                {result.rank}
              </div>
              <div className="text-[#9A91B4] text-[10px] font-['Rajdhani'] uppercase tracking-widest mt-4">Out of all participants</div>
            </div>
          </div>

          {/* Core Stats Bento */}
          <div className="grid grid-cols-2 gap-4 mb-4 animate-[fadeIn_0.7s_ease-out]">
            <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-3xl p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#B5FF2D] to-transparent opacity-50" />
              <div className="text-[#B5FF2D] font-['Rajdhani'] text-[10px] font-bold tracking-[0.2em] uppercase mb-2 flex items-center gap-2">
                <IconSwords /> TOTAL SCORE
              </div>
              <div className="text-4xl font-['Rajdhani'] font-bold text-white drop-shadow-[0_0_10px_rgba(181,255,45,0.3)]">{result.score}</div>
            </div>
            <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-3xl p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#20C6FF] to-transparent opacity-50" />
              <div className="text-[#20C6FF] font-['Rajdhani'] text-[10px] font-bold tracking-[0.2em] uppercase mb-2 flex items-center gap-2">
                <IconTarget /> ACCURACY
              </div>
              <div className="text-4xl font-['Rajdhani'] font-bold text-white drop-shadow-[0_0_10px_rgba(32,198,255,0.3)]">{result.accuracy}%</div>
            </div>
          </div>

          {/* Sub Stats Row */}
          <div className="grid grid-cols-3 gap-3 mb-10 animate-[fadeIn_0.8s_ease-out]">
            <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-2xl p-4 text-center">
              <div className="text-[#9A91B4] font-['Rajdhani'] text-[9px] font-bold tracking-wider uppercase mb-1">SHOTS FIRED</div>
              <div className="text-2xl font-['Rajdhani'] font-bold text-white">{result.shots_fired}</div>
            </div>
            <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-2xl p-4 text-center">
              <div className="text-[#9A91B4] font-['Rajdhani'] text-[9px] font-bold tracking-wider uppercase mb-1">TARGET HITS</div>
              <div className="text-2xl font-['Rajdhani'] font-bold text-[#20C6FF]">{result.hits}</div>
            </div>
            <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-2xl p-4 text-center">
              <div className="text-[#9A91B4] font-['Rajdhani'] text-[9px] font-bold tracking-wider uppercase mb-1 flex justify-center items-center gap-1"><IconShield /> DAMAGED</div>
              <div className="text-2xl font-['Rajdhani'] font-bold text-[#FF2A9D]">{result.times_hit}</div>
            </div>
          </div>

          {/* CTA Box */}
          <div className="bg-[rgba(255,42,157,0.05)] border border-[rgba(255,42,157,0.2)] rounded-3xl p-8 text-center relative overflow-hidden group animate-[fadeIn_0.9s_ease-out]">
            <div className="absolute inset-0 bg-gradient-to-r from-[#FF2A9D] to-[#8C3FFF] opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
            <h3 className="font-['Orbitron'] font-bold text-xl mb-2 text-white tracking-widest">NEXT BATTLE?</h3>
            <p className="text-xs text-[#BFBBCF] mb-6">최고 기록을 경신하기 위해 다시 한 번 도전하세요.</p>
            <a href="/" className="inline-block relative w-full overflow-hidden bg-[rgba(255,255,255,0.1)] border border-[rgba(255,42,157,0.5)] text-white py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(255,42,157,0.2)] hover:shadow-[0_0_30px_rgba(255,42,157,0.5)]">
              <div className="absolute inset-0 bg-gradient-to-r from-[#FF2A9D] to-[#8C3FFF] opacity-80" />
              <span className="relative font-bold font-['Rajdhani'] text-sm tracking-[0.2em] uppercase">홈페이지로 이동</span>
            </a>
          </div>

        </main>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      `}} />
    </div>
  );
}
