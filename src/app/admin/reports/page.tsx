'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

import { QRCodeCanvas } from 'qrcode.react';

export default function AllReports() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [origin, setOrigin] = useState('');
  const [previewToken, setPreviewToken] = useState<string | null>(null);
  
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterStatus, setFilterStatus] = useState('전체');

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
      enhancedReports.reverse();
      setReports(enhancedReports);
      if (enhancedReports.length > 0) setPreviewToken(enhancedReports[0].report_token);
    }
    setLoading(false);
  };

  const updateStatus = async (reportId: string, newStatus: string) => {
    const { error } = await supabase.from('reports').update({ report_status: newStatus }).eq('id', reportId);
    if (!error) fetchReports();
  };

  const handleDownloadQR = (id: string, nickname: string) => {
    const canvas = document.getElementById(`qr-${id}`) as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `ALACTION_QR_${nickname}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  const handlePrintQR = (id: string, nickname: string) => {
    const canvas = document.getElementById(`qr-${id}`) as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas.toDataURL("image/png");
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>ALACTION QR 인쇄 - ${nickname}</title>
              <style>
                @page { margin: 0; size: auto; }
                body {
                  margin: 0; padding: 0;
                  background-color: #050508;
                  color: #f8f5ff;
                  font-family: -apple-system, BlinkMacSystemFont, "Pretendard", sans-serif;
                  display: flex; flex-direction: column; justify-content: center; align-items: center;
                  height: 100vh;
                  -webkit-print-color-adjust: exact;
                  print-color-adjust: exact;
                }
                .bg {
                  position: absolute; top: 0; left: 0; right: 0; bottom: 0; z-index: -1;
                  background-image: 
                    radial-gradient(circle at 15% 25%, rgba(255, 53, 205, 0.15) 0%, transparent 50%),
                    radial-gradient(circle at 85% 75%, rgba(32, 199, 255, 0.15) 0%, transparent 50%);
                }
                .card {
                  background: rgba(255, 255, 255, 0.03);
                  border: 1px solid rgba(255, 255, 255, 0.1);
                  border-radius: 40px;
                  padding: 60px 50px;
                  text-align: center;
                  box-shadow: 0 30px 80px rgba(0,0,0,0.6);
                  position: relative;
                }
                .logo {
                  font-size: 28px; font-weight: 900; letter-spacing: -0.05em;
                  background: linear-gradient(90deg, #fff, #ff35cd, #20c7ff);
                  -webkit-background-clip: text;
                  color: transparent;
                  margin-bottom: 40px;
                }
                h2 { margin: 0 0 12px 0; font-size: 32px; font-weight: 800; letter-spacing: -0.03em; }
                p { color: #a49cb7; margin: 0 0 40px 0; font-size: 16px; }
                .qr-container {
                  background: #fff;
                  padding: 24px;
                  border-radius: 28px;
                  display: inline-block;
                  box-shadow: 0 0 60px rgba(32, 199, 255, 0.25);
                  margin-bottom: 30px;
                }
                img { width: 280px; height: 280px; display: block; }
                .footer { color: #666; font-size: 14px; font-weight: bold; letter-spacing: 0.1em; }
              </style>
            </head>
            <body>
              <div class="bg"></div>
              <div class="card">
                <div class="logo">ALACTION</div>
                <h2>${nickname}</h2>
                <p>QR 코드를 스캔하여 개인 슈팅 리포트를 확인하세요</p>
                <div class="qr-container">
                  <img src="${pngUrl}" onload="setTimeout(() => { window.print(); window.close(); }, 500);" />
                </div>
                <div class="footer">SHOOTING REPORT</div>
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }
  };

  const filteredReports = reports.filter(r => {
    if (filterStatus !== '전체' && r.report_status !== filterStatus) return false;
    if (searchKeyword && !r.participants?.nickname?.toLowerCase().includes(searchKeyword.toLowerCase()) && !r.session_title?.toLowerCase().includes(searchKeyword.toLowerCase())) return false;
    return true;
  });

  if (loading) return <div style={{color: 'var(--admin-p)', textAlign: 'center', padding: '40px'}}>LOADING DATA...</div>;

  return (
    <div id="reports" className="admin-page-content">
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
            <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{height: '38px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '0 10px'}}>
                <option value="전체">모든 상태</option>
                <option value="ready">준비 중</option>
                <option value="published">공개</option>
              </select>
              <input type="text" placeholder="세션명/닉네임 검색" value={searchKeyword} onChange={e => setSearchKeyword(e.target.value)} style={{height: '38px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '0 12px', width: '180px'}} />
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
                        <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
                          <div style={{width: '60px', height: '60px', background: '#fff', padding: '4px', borderRadius: '4px'}}>
                            <QRCodeCanvas value={r.url} size={52} id={`qr-${r.id}`} style={{width: '100%', height: '100%'}} />
                          </div>
                          <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
                            <button onClick={() => handleDownloadQR(r.id, r.participants?.nickname || '사용자')} className="btn" style={{height: '24px', fontSize: '11px', padding: '0 8px'}}>저장</button>
                            <button onClick={() => handlePrintQR(r.id, r.participants?.nickname || '사용자')} className="btn" style={{height: '24px', fontSize: '11px', padding: '0 8px'}}>인쇄</button>
                          </div>
                        </div>
                      ) : '-'}
                    </td>
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
            <div style={{borderRadius: '40px', overflow: 'hidden', outline: '10px solid #111118', boxShadow: '0 0 0 1px rgba(255,255,255,0.08), 0 24px 60px rgba(0,0,0,0.6)', width: '360px', height: '680px', margin: '0 auto', background: '#0a0818'}}>
              <iframe src={`/report/${previewToken}`} style={{width: '100%', height: '100%', border: 'none'}} title="Report Preview"></iframe>
            </div>
          ) : (
            <div style={{borderRadius: '40px', outline: '10px solid #111118', boxShadow: '0 0 0 1px rgba(255,255,255,0.08), 0 24px 60px rgba(0,0,0,0.6)', width: '360px', height: '680px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--admin-muted)', background: '#111118'}}>
              리포트를 선택해주세요.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
