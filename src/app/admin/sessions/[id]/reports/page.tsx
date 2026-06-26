'use client';

import { useEffect, useState, use } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function SessionReports({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const sessionId = resolvedParams.id;
  const [reports, setReports] = useState<any[]>([]);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [origin, setOrigin] = useState('');

  // Added preview state
  const [previewToken, setPreviewToken] = useState<string | null>(null);

  useEffect(() => {
    setOrigin(window.location.origin);
    fetchReports();
  }, [sessionId]);

  const fetchReports = async () => {
    const { data: sessionData } = await supabase.from('sessions').select('*').eq('id', sessionId).single();
    if (sessionData) setSession(sessionData);

    const { data: reportsData } = await supabase.from('reports').select('*').eq('session_id', sessionId);
    
    if (reportsData) {
      const enhancedReports = [];
      for (const r of reportsData) {
        const { data: pData } = await supabase.from('participants').select('*').eq('id', r.participant_id).single();
        const { data: sData } = await supabase.from('shooting_results').select('*').eq('id', r.result_id).single();
        enhancedReports.push({
          ...r,
          participants: pData || {},
          shooting_results: sData || {},
          url: `${origin}/report/${r.report_token}`
        });
      }
      setReports(enhancedReports);
      if (enhancedReports.length > 0) setPreviewToken(enhancedReports[0].report_token);
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

  if (loading) return <div style={{color: 'var(--admin-p)', textAlign: 'center', padding: '40px'}}>LOADING DATA...</div>;

  return (
    <section id="reports">
      <div className="section-title">
        <div>
          <Link href={`/admin/sessions/${sessionId}`} style={{color: 'var(--admin-muted)', fontSize: '13px', textDecoration: 'none', marginBottom: '8px', display: 'inline-block'}}>← 세션 상세 보기로</Link>
          <h2>리포트 / QR 관리</h2>
          <p>리포트 상태를 준비 중, 공개, 비공개, 만료로 관리합니다.</p>
        </div>
        <div className="actions">
          <button onClick={() => updateSessionStatus('ready')} className="btn cyan">전체 준비 중</button>
          <button onClick={() => updateSessionStatus('published')} className="btn primary">전체 공개</button>
          <button onClick={() => updateSessionStatus('private')} className="btn" style={{borderColor: 'rgba(255,255,255,0.2)'}}>전체 비공개</button>
        </div>
      </div>

      <div className="preview">
        {/* Table Column */}
        <div className="card">
          <div className="card-head">
            <div>
              <h3>리포트 목록</h3>
              <p>사용자에게 노출되는 리포트 접근 상태를 제어합니다.</p>
            </div>
            <div className="tabs">
              <span className="tab active">전체</span>
            </div>
          </div>
          <div className="card-body" style={{overflowX: 'auto'}}>
            <table>
              <thead>
                <tr>
                  <th>닉네임</th>
                  <th>팀</th>
                  <th>상태</th>
                  <th>QR 코드</th>
                  <th>URL 토큰</th>
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                {reports.map(r => (
                  <tr key={r.id}>
                    <td>{r.participants.nickname}</td>
                    <td>{r.participants.team_name || '-'}</td>
                    <td>
                      <span className={`status ${
                        r.report_status === 'published' ? 'public' :
                        r.report_status === 'ready' ? 'pending' :
                        r.report_status === 'expired' ? 'expired' : 'private'
                      }`}>
                        {r.report_status === 'published' ? '공개' : 
                         r.report_status === 'ready' ? '준비 중' : 
                         r.report_status === 'expired' ? '만료' : '비공개'}
                      </span>
                    </td>
                    <td>
                      {r.url ? (
                        <div style={{width: '60px', height: '60px', background: '#fff', padding: '4px', borderRadius: '4px'}}>
                          <img src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(r.url)}`} alt="QR" style={{width: '100%', height: '100%', objectFit: 'contain'}} />
                        </div>
                      ) : '-'}
                    </td>
                    <td><div style={{width: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{r.report_token}</div></td>
                    <td>
                      <div className="actions">
                        <button onClick={() => setPreviewToken(r.report_token)} className="btn">미리보기</button>
                        {r.report_status !== 'published' ? (
                          <button onClick={() => updateStatus(r.id, 'published')} className="btn primary">공개</button>
                        ) : (
                          <button onClick={() => updateStatus(r.id, 'ready')} className="btn">숨기기</button>
                        )}
                        <a href={r.url} target="_blank" rel="noreferrer" className="btn cyan">URL</a>
                      </div>
                    </td>
                  </tr>
                ))}
                {reports.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{textAlign: 'center', color: 'var(--admin-muted)'}}>발급된 리포트가 없습니다.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Preview Column */}
        <div>
          <div className="section-title" style={{marginTop: 0}}>
            <div>
              <h2 style={{fontSize: '20px'}}>사용자 리포트 미리보기</h2>
              <p>QR 스캔 후 사용자가 보게 될 모바일 리포트 화면입니다.</p>
            </div>
          </div>
          {previewToken ? (
            <div style={{borderRadius: '40px', overflow: 'hidden', outline: '10px solid #111118', boxShadow: '0 0 0 1px rgba(255,255,255,0.08), 0 24px 60px rgba(0,0,0,0.6)', width: '390px', height: '844px', margin: '0 auto', background: '#0a0818'}}>
              <iframe src={`/report/${previewToken}`} style={{width: '100%', height: '100%', border: 'none'}} title="Report Preview"></iframe>
            </div>
          ) : (
            <div style={{borderRadius: '40px', outline: '10px solid #111118', boxShadow: '0 0 0 1px rgba(255,255,255,0.08), 0 24px 60px rgba(0,0,0,0.6)', width: '390px', height: '844px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--admin-muted)', background: '#111118'}}>
              리스트에서 '미리보기'를<br/>선택해주세요.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
