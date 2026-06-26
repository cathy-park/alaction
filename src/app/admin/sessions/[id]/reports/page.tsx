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
      // Generate QR codes locally
      const reportsWithQr = await Promise.all(data.map(async (r) => {
        const url = `${origin}/report/${r.report_token}`;
        const qrDataUrl = await QRCode.toDataURL(url, {
          width: 300,
          margin: 2,
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
      // Optionally update all reports to match session status
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

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <div>
        <Link href={`/admin/sessions/${sessionId}`} className="text-[#20C6FF] text-sm hover:underline mb-2 inline-block">← 세션 상세 보기</Link>
        <h1 className="text-3xl font-bold font-['Orbitron'] mb-2">QR 리포트 관리</h1>
        <p className="text-[#BFBBCF]">[{session?.title}] 의 생성된 리포트와 QR 코드를 관리합니다.</p>
      </div>

      <div className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold font-['Orbitron']">일괄 상태 변경</h2>
          <div className="flex gap-2">
            <button onClick={() => updateSessionStatus('published')} className="bg-[#20C6FF] text-[#04040a] px-4 py-2 rounded-lg font-bold text-sm hover:bg-[#1bb3e6]">전체 공개 (Published)</button>
            <button onClick={() => updateSessionStatus('ready')} className="bg-[#B5FF2D] text-[#04040a] px-4 py-2 rounded-lg font-bold text-sm hover:bg-[#9de622]">전체 준비중 (Ready)</button>
            <button onClick={() => updateSessionStatus('private')} className="bg-[#60597A] text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-[#4d4763]">전체 비공개 (Private)</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map(r => (
            <div key={r.id} className="bg-[rgba(0,0,0,0.3)] border border-[rgba(255,255,255,0.1)] rounded-xl p-6 flex flex-col items-center text-center">
              <div className="mb-2">
                <span className="font-bold text-lg">{r.participants.nickname}</span>
                <span className="text-xs text-[#BFBBCF] ml-2">({r.participants.team_name || '팀 없음'})</span>
              </div>
              <div className="text-[#FF2A9D] text-sm font-bold mb-4">Rank: {r.shooting_results.rank} | Score: {r.shooting_results.score}</div>
              
              <div className="bg-white p-2 rounded-lg mb-4">
                <img src={r.qrDataUrl} alt="QR Code" className="w-32 h-32" />
              </div>

              <div className="flex flex-col gap-2 w-full">
                <button onClick={() => downloadQr(r.qrDataUrl, r.participants.nickname)} className="w-full bg-[#60597A] hover:bg-[#8C3FFF] text-white py-2 rounded-lg text-sm transition-colors">
                  QR 이미지 다운로드
                </button>
                <a href={r.url} target="_blank" rel="noreferrer" className="w-full border border-[#20C6FF] text-[#20C6FF] hover:bg-[#20C6FF]/10 py-2 rounded-lg text-sm transition-colors inline-block">
                  리포트 미리보기
                </a>
              </div>

              <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.1)] w-full">
                <select 
                  value={r.report_status} 
                  onChange={(e) => updateStatus(r.id, e.target.value)}
                  className="w-full bg-[#04040a] border border-[#60597A] rounded-lg px-2 py-1 text-white text-sm"
                >
                  <option value="ready">준비 중 (Ready)</option>
                  <option value="published">공개 (Published)</option>
                  <option value="private">비공개 (Private)</option>
                  <option value="expired">만료됨 (Expired)</option>
                </select>
              </div>
            </div>
          ))}
          {reports.length === 0 && (
            <div className="col-span-full py-12 text-[#60597A]">생성된 리포트가 없습니다. 세션 상세 페이지에서 리포트를 생성하세요.</div>
          )}
        </div>
      </div>
    </div>
  );
}
