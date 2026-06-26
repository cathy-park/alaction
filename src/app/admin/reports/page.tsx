'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function AllReports() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [origin, setOrigin] = useState('');
  const [previewToken, setPreviewToken] = useState<string | null>(null);

  useEffect(() => {
    setOrigin(window.location.origin);
    fetchReports();
  }, []);

  const fetchReports = async () => {
    const { data: reportsData } = await supabase.from('reports').select('*');
    
    if (reportsData) {
      const enhancedReports = [];
      for (const r of reportsData) {
        const { data: pData } = await supabase.from('participants').select('*').eq('id', r.participant_id).single();
        const { data: sData } = await supabase.from('shooting_results').select('*').eq('id', r.result_id).single();
        const { data: sessionData } = await supabase.from('sessions').select('*').eq('id', r.session_id).single();
        
        enhancedReports.push({
          ...r,
          participants: pData || {},
          shooting_results: sData || {},
          session_title: sessionData?.title || 'Unknown Session',
          url: `${origin}/report/${r.report_token}`
        });
      }
      // Sort by latest created_at ideally, but Mock DB might not support it easily, so just reverse it
      enhancedReports.reverse();
      
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

  if (loading) return <div style={{color: 'var(--admin-p)', textAlign: 'center', padding: '40px'}}>LOADING DATA...</div>;

  return (
    <section id="reports">
      <div className="section-title">
        <div>
          <h2>전체 리포트 / QR 관리</h2>
          <p>발급된 모든 리포트 목록을 확인하고 관리합니다.</p>
        </div>
      </div>

      <div className="preview">
        {/* Table Column */}
        <div className="card">
          <div className="card-head">
            <div>
              <h3>리포트 통합 목록</h3>
            </div>
          </div>
          <div className="card-body" style={{overflowX: 'auto'}}>
            <table>
              <thead>
                <tr>
                  <th>세션명</th>
                  <th>닉네임</th>
                  <th>상태</th>
                  <th>QR 코드</th>
                  <th>URL 토큰</th>
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                {reports.map(r => (
                  <tr key={r.id}>
                    <td>{r.session_title}</td>
                    <td>{r.participants?.nickname || '-'}</td>
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
                        <Link href={`/admin/sessions/${r.session_id}/participant/${r.participant_id}`} className="btn">관리/수정</Link>
                        <button onClick={() => setPreviewToken(r.report_token)} className="btn">미리보기</button>
                        {r.report_status !== 'published' ? (
                          <button onClick={() => updateStatus(r.id, 'published')} className="btn primary">공개</button>
                        ) : (
                          <button onClick={() => updateStatus(r.id, 'ready')} className="btn">숨기기</button>
                        )}
                        <button onClick={() => { navigator.clipboard.writeText(r.url); alert('복사되었습니다.'); }} className="btn cyan">URL 복사</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {reports.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{textAlign: 'center', color: 'var(--admin-muted)'}}>발급된 리포트가 없습니다.</td>
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
            <div className="phone">
              <div style={{height: '600px', borderRadius: '32px', overflow: 'hidden', border: '1px solid rgba(255,255,255,.08)'}}>
                <iframe src={`/report/${previewToken}`} style={{width: '100%', height: '100%', border: 'none'}} title="Report Preview"></iframe>
              </div>
            </div>
          ) : (
            <div className="phone">
              <div style={{height: '600px', borderRadius: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--admin-muted)', border: '1px solid rgba(255,255,255,.08)'}}>
                리포트를 선택해주세요.
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
