'use client';

import { useEffect, useState, use } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import QRCode from 'qrcode';

export default function SessionReports({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const sessionId = resolvedParams.id;
  const [reports, setReports] = useState<any[]>([]);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    setOrigin(window.location.origin);
    fetchReports();
  }, [sessionId]);

  const fetchReports = async () => {
    const { data: sessionData } = await supabase.from('sessions').select('*').eq('id', sessionId).single();
    if (sessionData) setSession(sessionData);

    const { data } = await supabase
      .from('reports')
      .select('*, participants(*), shooting_results(*)')
      .eq('session_id', sessionId);
    
    if (data) {
      const reportsWithQr = await Promise.all(data.map(async (r) => {
        const url = `${origin}/report/${r.report_token}`;
        const qrDataUrl = await QRCode.toDataURL(url, {
          width: 300,
          margin: 1,
          color: {
            dark: '#04040a',
            light: '#ffffff'
          }
        });
        return { ...r, url, qrDataUrl };
      }));
      setReports(reportsWithQr);
    }
    setLoading(false);
  };

  const updateStatus = async (reportId: string, newStatus: string) => {
    const { error } = await supabase.from('reports').update({ report_status: newStatus }).eq('id', reportId);
    if (!error) {
      fetchReports();
    }
  };

  const updateSessionStatus = async (newStatus: string) => {
    const { error } = await supabase.from('sessions').update({ status: newStatus }).eq('id', sessionId);
    if (!error) {
      setSession({...session, status: newStatus});
      await supabase.from('reports').update({ report_status: newStatus }).eq('session_id', sessionId);
      fetchReports();
    }
  };

  const downloadQr = (qrDataUrl: string, nickname: string) => {
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `QR_${nickname}_${session.title}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="p-16 text-center text-[#FF2A9D] font-['Orbitron'] font-bold text-lg animate-pulse">LOADING DATA...</div>;

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[rgba(255,255,255,0.05)] pb-6">
        <div>
          <Link href={`/admin/sessions/${sessionId}`} className="text-[#20C6FF] text-xs font-bold uppercase tracking-widest hover:text-white transition-colors mb-3 inline-block">← Back to Details</Link>
          <h1 className="text-3xl font-bold font-['Orbitron'] tracking-wide">QR REPORTS</h1>
          <p className="text-[#9A91B4] text-sm mt-2">[{session?.title}] 의 QR 코드를 발급하고 배포 상태를 관리합니다.</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button onClick={() => updateSessionStatus('published')} className="bg-[rgba(32,198,255,0.1)] border border-[rgba(32,198,255,0.3)] text-[#20C6FF] hover:bg-[rgba(32,198,255,0.2)] px-4 py-2 rounded-lg font-bold font-['Rajdhani'] uppercase tracking-widest text-xs transition-colors shadow-[0_0_10px_rgba(32,198,255,0.1)]">
            PUBLISH ALL
          </button>
          <button onClick={() => updateSessionStatus('ready')} className="bg-[rgba(181,255,45,0.1)] border border-[rgba(181,255,45,0.3)] text-[#B5FF2D] hover:bg-[rgba(181,255,45,0.2)] px-4 py-2 rounded-lg font-bold font-['Rajdhani'] uppercase tracking-widest text-xs transition-colors shadow-[0_0_10px_rgba(181,255,45,0.1)]">
            READY ALL
          </button>
          <button onClick={() => updateSessionStatus('private')} className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#BFBBCF] hover:bg-[rgba(255,255,255,0.1)] hover:text-white px-4 py-2 rounded-lg font-bold font-['Rajdhani'] uppercase tracking-widest text-xs transition-colors">
            PRIVATE ALL
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {reports.map(r => (
          <div key={r.id} className="relative group">
            {/* Ambient Ticket Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#FF2A9D] to-[#20C6FF] opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 rounded-3xl" />
            
            {/* Ticket Card */}
            <div className="bg-[rgba(255,255,255,0.02)] backdrop-blur-md border border-[rgba(255,255,255,0.05)] rounded-[2rem] p-6 relative overflow-hidden flex flex-col items-center text-center">
              {/* Status Badge */}
              <div className="absolute top-4 left-4">
                <span className={`px-2 py-1 rounded text-[9px] font-bold font-['Rajdhani'] tracking-widest uppercase border ${
                  r.report_status === 'published' ? 'bg-[#20C6FF]/10 text-[#20C6FF] border-[#20C6FF]/30 shadow-[0_0_8px_rgba(32,198,255,0.3)]' :
                  r.report_status === 'ready' ? 'bg-[#B5FF2D]/10 text-[#B5FF2D] border-[#B5FF2D]/30 shadow-[0_0_8px_rgba(181,255,45,0.3)]' :
                  'bg-gray-500/10 text-gray-400 border-gray-500/30'
                }`}>
                  {r.report_status}
                </span>
              </div>

              <div className="mt-4 mb-2">
                <div className="font-['Orbitron'] font-bold text-xl text-white">{r.participants.nickname}</div>
                <div className="text-[10px] text-[#60597A] uppercase tracking-widest font-bold mt-1">{r.participants.team_name || 'NO TEAM'}</div>
              </div>
              
              <div className="flex items-center gap-4 my-4">
                <div className="text-center">
                  <div className="text-[#FF2A9D] font-['Rajdhani'] text-[10px] font-bold tracking-widest uppercase">RANK</div>
                  <div className="text-2xl font-['Orbitron'] font-bold text-white">{r.shooting_results.rank}</div>
                </div>
                <div className="w-[1px] h-8 bg-[rgba(255,255,255,0.1)]"></div>
                <div className="text-center">
                  <div className="text-[#20C6FF] font-['Rajdhani'] text-[10px] font-bold tracking-widest uppercase">SCORE</div>
                  <div className="text-2xl font-['Orbitron'] font-bold text-white">{r.shooting_results.score}</div>
                </div>
              </div>
              
              <div className="bg-white p-2 rounded-2xl mb-6 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                <img src={r.qrDataUrl} alt="QR Code" className="w-32 h-32 rounded-xl" />
              </div>

              <div className="flex flex-col gap-3 w-full">
                <button onClick={() => downloadQr(r.qrDataUrl, r.participants.nickname)} className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] hover:bg-[#8C3FFF] hover:border-[#8C3FFF] text-white py-3 rounded-xl text-xs font-bold font-['Rajdhani'] tracking-widest uppercase transition-all shadow-[0_0_15px_rgba(140,63,255,0)] hover:shadow-[0_0_15px_rgba(140,63,255,0.4)]">
                  DOWNLOAD QR
                </button>
                <a href={r.url} target="_blank" rel="noreferrer" className="w-full border border-[#20C6FF]/50 text-[#20C6FF] hover:bg-[#20C6FF]/10 py-3 rounded-xl text-xs font-bold font-['Rajdhani'] tracking-widest uppercase transition-all text-center">
                  PREVIEW REPORT
                </a>
              </div>

              <div className="mt-6 pt-4 border-t border-[rgba(255,255,255,0.05)] w-full text-left">
                <label className="block text-[10px] font-bold font-['Rajdhani'] uppercase tracking-widest text-[#60597A] mb-2">Change Status</label>
                <select 
                  value={r.report_status} 
                  onChange={(e) => updateStatus(r.id, e.target.value)}
                  className="w-full bg-[#070710] border border-[rgba(255,255,255,0.1)] rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#FF2A9D] transition-colors appearance-none"
                >
                  <option value="ready">Ready (준비 중)</option>
                  <option value="published">Published (공개)</option>
                  <option value="private">Private (비공개)</option>
                  <option value="expired">Expired (만료됨)</option>
                </select>
              </div>
            </div>
          </div>
        ))}
        {reports.length === 0 && (
          <div className="col-span-full py-20 text-center border border-dashed border-[rgba(255,255,255,0.1)] rounded-[2rem]">
            <div className="text-[#60597A] font-['Rajdhani'] uppercase tracking-widest">No reports generated.</div>
            <div className="text-sm text-[#9A91B4] mt-2">세션 상세 페이지에서 플레이어의 리포트를 발행해주세요.</div>
          </div>
        )}
      </div>
    </div>
  );
}
