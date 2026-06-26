'use client';

import { useEffect, useState, use } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ParticipantReportEdit({ params }: { params: Promise<{ id: string, participantId: string }> }) {
  const resolvedParams = use(params);
  const sessionId = resolvedParams.id;
  const participantId = resolvedParams.participantId;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [participant, setParticipant] = useState<any>(null);
  const [result, setResult] = useState<any>({});
  const [report, setReport] = useState<any>(null);

  // GPT Raw Output
  const [gptRaw, setGptRaw] = useState('');

  // Separated Fields
  const [reportTitle, setReportTitle] = useState('');
  const [oneLineSummary, setOneLineSummary] = useState('');
  const [playStyle, setPlayStyle] = useState('');
  const [strengths, setStrengths] = useState('');
  const [improvementPoint, setImprovementPoint] = useState('');
  const [nextTip, setNextTip] = useState('');
  const [publicComment, setPublicComment] = useState('');

  const [displayTitle, setDisplayTitle] = useState('');
  const [displaySummary, setDisplaySummary] = useState('');
  const [styleBadge, setStyleBadge] = useState('');
  const [strengthCard, setStrengthCard] = useState('');
  const [nextPlayCard, setNextPlayCard] = useState('');
  const [bottomComment, setBottomComment] = useState('');

  useEffect(() => {
    fetchData();
  }, [sessionId, participantId]);

  const fetchData = async () => {
    const { data: sessionData } = await supabase.from('sessions').select('*').eq('id', sessionId).single();
    if (sessionData) setSession(sessionData);

    const { data: participantData } = await supabase.from('participants').select('*').eq('id', participantId).single();
    if (participantData) setParticipant(participantData);

    const { data: resultData } = await supabase.from('shooting_results').select('*').eq('participant_id', participantId).single();
    if (resultData) setResult(resultData);

    const { data: reportData } = await supabase.from('reports').select('*').eq('participant_id', participantId).single();
    if (reportData) {
      setReport(reportData);
      setGptRaw(reportData.gpt_raw_output || '');
      setReportTitle(reportData.report_title || '');
      setOneLineSummary(reportData.one_line_summary || '');
      setPlayStyle(reportData.play_style || '');
      setStrengths(reportData.strengths || '');
      setImprovementPoint(reportData.improvement_point || '');
      setNextTip(reportData.next_tip || '');
      setPublicComment(reportData.public_comment || '');

      setDisplayTitle(reportData.display_title || '');
      setDisplaySummary(reportData.display_summary || '');
      setStyleBadge(reportData.style_badge || '');
      setStrengthCard(reportData.strength_card || '');
      setNextPlayCard(reportData.next_play_card || '');
      setBottomComment(reportData.bottom_comment || '');
    }

    setLoading(false);
  };

  const handleGPTParse = () => {
    if (!gptRaw) return;

    const extract = (key: string) => {
      const regex = new RegExp(`${key}:\\s*([^\\n]+(?:\\n(?!.*:).*)*)`);
      const match = gptRaw.match(regex);
      return match ? match[1].trim() : '';
    };

    // Parse Data Check
    const shots = extract('발사 수')?.replace(/[^0-9]/g, '');
    const hits = extract('맞힌 수')?.replace(/[^0-9]/g, '');
    const consoleAcc = extract('콘솔 정확도')?.replace(/[^0-9.]/g, '');
    
    let newResult = { ...result };
    if (shots) newResult.shots_fired = parseInt(shots, 10);
    if (hits) newResult.hits = parseInt(hits, 10);
    if (newResult.shots_fired > 0) {
      newResult.accuracy = ((newResult.hits / newResult.shots_fired) * 100).toFixed(2);
    }
    setResult(newResult);

    // Parse Admin Fields
    setReportTitle(extract('리포트 제목') || extract('**리포트 제목**') || '');
    setOneLineSummary(extract('한 줄 요약') || extract('**한 줄 요약**') || '');
    setPlayStyle(extract('플레이 성향') || extract('**플레이 성향**') || '');
    setStrengths(extract('강점') || extract('**강점**') || '');
    setImprovementPoint(extract('다음 플레이 포인트') || extract('**다음 플레이 포인트**') || '');
    setNextTip(extract('다음 플레이 팁') || extract('**다음 플레이 팁**') || '');
    setPublicComment(extract('관리자페이지 붙여넣기용 공개 문구') || extract('**관리자페이지 붙여넣기용 공개 문구**') || '');

    // Parse Display Fields
    setDisplayTitle(extract('제목') || extract('**제목**') || '');
    setDisplaySummary(extract('요약') || extract('**요약**') || '');
    setStyleBadge(extract('성향 배지') || extract('**성향 배지**') || '');
    setStrengthCard(extract('강점 카드') || extract('**강점 카드**') || '');
    setNextPlayCard(extract('다음 플레이 카드') || extract('**다음 플레이 카드**') || '');
    setBottomComment(extract('하단 공개 문구') || extract('**하단 공개 문구**') || '');

    alert('자동 파싱이 완료되었습니다!');
  };

  const handleSave = async (status: string) => {
    // 1. Save participant
    if (participant?.id) {
      await supabase.from('participants').update({
        nickname: participant.nickname,
        team_name: participant.team_name,
      }).eq('id', participant.id);
    }

    // 2. Save result
    const resultData = {
      session_id: sessionId,
      participant_id: participantId,
      rank: parseInt(result.rank) || 1,
      score: parseInt(result.score) || 0,
      shots_fired: parseInt(result.shots_fired) || 0,
      hits: parseInt(result.hits) || 0,
      times_hit: parseInt(result.times_hit) || 0,
      accuracy: parseFloat(result.accuracy) || 0,
    };

    let savedResultId = result.id;
    if (result.id) {
      await supabase.from('shooting_results').update(resultData).eq('id', result.id);
    } else {
      const { data } = await supabase.from('shooting_results').insert([resultData]).select().single();
      if (data) savedResultId = data.id;
    }

    // 3. Save report
    const reportData = {
      session_id: sessionId,
      participant_id: participantId,
      result_id: savedResultId,
      report_token: report?.report_token || Math.random().toString(36).substring(2, 10),
      report_status: status,
      gpt_raw_output: gptRaw,
      report_title: reportTitle,
      one_line_summary: oneLineSummary,
      play_style: playStyle,
      strengths: strengths,
      improvement_point: improvementPoint,
      next_tip: nextTip,
      public_comment: publicComment,
      display_title: displayTitle,
      display_summary: displaySummary,
      style_badge: styleBadge,
      strength_card: strengthCard,
      next_play_card: nextPlayCard,
      bottom_comment: bottomComment,
    };

    if (report?.id) {
      await supabase.from('reports').update(reportData).eq('id', report.id);
    } else {
      await supabase.from('reports').insert([reportData]);
    }

    alert('리포트가 저장되었습니다.');
    fetchData(); // reload
  };

  if (loading) return <div style={{color: '#fff', textAlign: 'center', padding: '40px'}}>LOADING...</div>;

  return (
    <section id="report-detail" style={{paddingBottom: '100px'}}>
      <div className="section-title">
        <div>
          <Link href={`/admin/sessions/${sessionId}`} style={{color: 'var(--admin-muted)', fontSize: '13px', textDecoration: 'none', marginBottom: '8px', display: 'inline-block'}}>← 참가자 목록으로</Link>
          <h2>리포트 생성 / 수정 상세</h2>
          <p>GPT 분석문을 붙여넣고 세부 내용을 검수합니다.</p>
        </div>
      </div>

      <div style={{display: 'flex', gap: '24px', alignItems: 'flex-start'}}>
        {/* Left Column - Input Forms */}
        <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: '20px'}}>
          
          <div className="card">
            <div className="card-head">
              <h3>기본 정보 및 경기 데이터</h3>
            </div>
            <div className="card-body">
              <div className="form-grid" style={{gridTemplateColumns: '1fr 1fr 1fr'}}>
                <div className="field">
                  <label>닉네임</label>
                  <input type="text" value={participant?.nickname || ''} onChange={e => setParticipant({...participant, nickname: e.target.value})} />
                </div>
                <div className="field">
                  <label>팀명</label>
                  <input type="text" value={participant?.team_name || ''} onChange={e => setParticipant({...participant, team_name: e.target.value})} />
                </div>
                <div className="field">
                  <label>랭킹</label>
                  <input type="number" value={result?.rank || ''} onChange={e => setResult({...result, rank: e.target.value})} />
                </div>
                <div className="field">
                  <label>점수</label>
                  <input type="number" value={result?.score || ''} onChange={e => setResult({...result, score: e.target.value})} />
                </div>
                <div className="field">
                  <label>발사 수</label>
                  <input type="number" value={result?.shots_fired || ''} onChange={e => {
                    const shots = parseInt(e.target.value) || 0;
                    const hits = result.hits || 0;
                    setResult({...result, shots_fired: shots, accuracy: shots > 0 ? ((hits/shots)*100).toFixed(2) : 0});
                  }} />
                </div>
                <div className="field">
                  <label>맞힌 수</label>
                  <input type="number" value={result?.hits || ''} onChange={e => {
                    const hits = parseInt(e.target.value) || 0;
                    const shots = result.shots_fired || 0;
                    setResult({...result, hits: hits, accuracy: shots > 0 ? ((hits/shots)*100).toFixed(2) : 0});
                  }} />
                </div>
                <div className="field">
                  <label>맞은 수</label>
                  <input type="number" value={result?.times_hit || ''} onChange={e => setResult({...result, times_hit: e.target.value})} />
                </div>
                <div className="field">
                  <label>정확도 (%)</label>
                  <input type="number" step="0.1" value={result?.accuracy || ''} onChange={e => setResult({...result, accuracy: e.target.value})} />
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-head">
              <h3>GPT 분석문 붙여넣기</h3>
              <a href="https://chatgpt.com/g/g-6a3e1bce607c8191b135e06eafc9cff9-alaegsyeon-syuting-ripoteu-bunseog-doumi" target="_blank" rel="noreferrer" className="btn cyan" style={{textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 800}}>
                <span>🤖 분석 도우미 열기</span>
              </a>
            </div>
            <div className="card-body">
              <textarea 
                placeholder="GPTs에서 생성된 전체 분석 결과를 여기에 붙여넣으세요." 
                value={gptRaw} 
                onChange={e => setGptRaw(e.target.value)}
                style={{width: '100%', height: '180px', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--admin-line)', borderRadius: '8px', color: '#fff', resize: 'vertical', fontFamily: 'monospace', fontSize: '12px'}}
              />
              <button onClick={handleGPTParse} className="btn primary" style={{marginTop: '12px', width: '100%'}}>자동 분리</button>
            </div>
          </div>

          <div className="card">
            <div className="card-head">
              <h3>사용자 리포트 표시용 필드</h3>
            </div>
            <div className="card-body">
              <div className="form-grid" style={{gridTemplateColumns: '1fr'}}>
                <div className="field"><label>표시 제목</label><input type="text" value={displayTitle} onChange={e => setDisplayTitle(e.target.value)} /></div>
                <div className="field"><label>표시 요약</label><input type="text" value={displaySummary} onChange={e => setDisplaySummary(e.target.value)} /></div>
                <div className="field"><label>성향 배지</label><input type="text" value={styleBadge} onChange={e => setStyleBadge(e.target.value)} /></div>
                <div className="field"><label>강점 카드</label><textarea rows={3} value={strengthCard} onChange={e => setStrengthCard(e.target.value)} style={{width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--admin-line)', borderRadius: '8px', color: '#fff'}} /></div>
                <div className="field"><label>다음 플레이 카드</label><textarea rows={3} value={nextPlayCard} onChange={e => setNextPlayCard(e.target.value)} style={{width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--admin-line)', borderRadius: '8px', color: '#fff'}} /></div>
                <div className="field"><label>하단 공개 문구</label><textarea rows={4} value={bottomComment} onChange={e => setBottomComment(e.target.value)} style={{width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--admin-line)', borderRadius: '8px', color: '#fff'}} /></div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-head">
              <h3>관리자 내부 기록용 필드</h3>
            </div>
            <div className="card-body">
              <div className="form-grid" style={{gridTemplateColumns: '1fr'}}>
                <div className="field"><label>리포트 제목</label><input type="text" value={reportTitle} onChange={e => setReportTitle(e.target.value)} /></div>
                <div className="field"><label>한 줄 요약</label><input type="text" value={oneLineSummary} onChange={e => setOneLineSummary(e.target.value)} /></div>
                <div className="field"><label>플레이 성향</label><input type="text" value={playStyle} onChange={e => setPlayStyle(e.target.value)} /></div>
                <div className="field"><label>강점</label><textarea rows={3} value={strengths} onChange={e => setStrengths(e.target.value)} style={{width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--admin-line)', borderRadius: '8px', color: '#fff'}} /></div>
                <div className="field"><label>다음 플레이 포인트</label><textarea rows={3} value={improvementPoint} onChange={e => setImprovementPoint(e.target.value)} style={{width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--admin-line)', borderRadius: '8px', color: '#fff'}} /></div>
                <div className="field"><label>다음 플레이 팁</label><textarea rows={3} value={nextTip} onChange={e => setNextTip(e.target.value)} style={{width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--admin-line)', borderRadius: '8px', color: '#fff'}} /></div>
                <div className="field"><label>공개 문구 (복사용)</label><textarea rows={4} value={publicComment} onChange={e => setPublicComment(e.target.value)} style={{width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--admin-line)', borderRadius: '8px', color: '#fff'}} /></div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column - Live Preview */}
        <div style={{width: '420px', flexShrink: 0, position: 'sticky', top: '40px'}}>
          <div className="section-title" style={{marginTop: 0}}>
            <h2 style={{fontSize: '18px'}}>실시간 리포트 미리보기</h2>
          </div>
          
          <div className="phone" style={{borderRadius: '32px', overflow: 'hidden', border: '1px solid rgba(255,255,255,.08)', height: '700px', overflowY: 'auto', background: '#050508'}}>
            <div style={{minHeight: '100%', padding: '14px', fontFamily: '-apple-system, BlinkMacSystemFont, "Pretendard", sans-serif'}}>
              <div className="screen" style={{minHeight: '590px', borderRadius: '32px', padding: '22px', background: 'linear-gradient(180deg,#0a0818,#17102a)', border: '1px solid rgba(255,255,255,.08)'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', color: '#fff', fontWeight: 1000, fontSize: '13px', letterSpacing: '.1em'}}>
                  <span>ALACTION</span><span>QR</span>
                </div>
                
                <div style={{width: '120px', height: '120px', margin: '30px auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', borderRadius: '50%', border: '1px solid rgba(255,53,205,.55)', background: 'radial-gradient(circle,rgba(255,53,205,.18),rgba(255,255,255,.03))', boxShadow: '0 0 50px rgba(255,53,205,.25)'}}>
                  <small style={{color: '#a49cb7', fontSize: '11px', fontWeight: 1000}}>RANK</small>
                  <b style={{fontSize: '48px', color: '#fff'}}>{result?.rank || '-'}</b>
                </div>
                
                <div style={{textAlign: 'center', color: '#fff'}}>
                  <h3 style={{margin: 0, fontSize: '22px', letterSpacing: '-.055em'}}>{participant?.nickname || '닉네임'}</h3>
                  <p style={{margin: '6px 0 0', color: '#a49cb7', fontSize: '13px'}}>{participant?.team_name || 'NO TEAM'}</p>
                </div>

                {styleBadge && (
                  <div style={{textAlign: 'center', marginTop: '12px'}}>
                    <span style={{display: 'inline-block', padding: '6px 14px', background: 'rgba(255,53,205,0.15)', border: '1px solid rgba(255,53,205,0.4)', borderRadius: '99px', color: '#ff35cd', fontSize: '13px', fontWeight: 800, letterSpacing: '-0.02em'}}>{styleBadge}</span>
                  </div>
                )}

                {displayTitle && (
                  <div style={{textAlign: 'center', marginTop: '24px', padding: '0 10px'}}>
                    <h4 style={{color: '#fff', fontSize: '20px', margin: '0 0 8px', wordBreak: 'keep-all'}}>{displayTitle}</h4>
                    <p style={{color: '#a49cb7', fontSize: '13px', lineHeight: 1.5, margin: 0, wordBreak: 'keep-all'}}>{displaySummary}</p>
                  </div>
                )}
                
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '10px', marginTop: '24px'}}>
                  <div style={{padding: '12px', borderRadius: '16px', background: 'rgba(255,255,255,.055)', border: '1px solid rgba(255,255,255,.08)'}}>
                    <span style={{display: 'block', color: '#a49cb7', fontSize: '11px', fontWeight: 900}}>점수</span>
                    <b style={{display: 'block', marginTop: '8px', fontSize: '20px', color: '#fff'}}>{result?.score || 0}</b>
                  </div>
                  <div style={{padding: '12px', borderRadius: '16px', background: 'rgba(255,255,255,.055)', border: '1px solid rgba(255,255,255,.08)'}}>
                    <span style={{display: 'block', color: '#a49cb7', fontSize: '11px', fontWeight: 900}}>정확도</span>
                    <b style={{display: 'block', marginTop: '8px', fontSize: '20px', color: '#baff2d'}}>{result?.accuracy || 0}%</b>
                  </div>
                  <div style={{padding: '12px', borderRadius: '16px', background: 'rgba(255,255,255,.055)', border: '1px solid rgba(255,255,255,.08)'}}>
                    <span style={{display: 'block', color: '#a49cb7', fontSize: '11px', fontWeight: 900}}>발사 수</span>
                    <b style={{display: 'block', marginTop: '8px', fontSize: '20px', color: '#fff'}}>{result?.shots_fired || 0}</b>
                  </div>
                  <div style={{padding: '12px', borderRadius: '16px', background: 'rgba(255,255,255,.055)', border: '1px solid rgba(255,255,255,.08)'}}>
                    <span style={{display: 'block', color: '#a49cb7', fontSize: '11px', fontWeight: 900}}>맞힌 수</span>
                    <b style={{display: 'block', marginTop: '8px', fontSize: '20px', color: '#20c7ff'}}>{result?.hits || 0}</b>
                  </div>
                  <div style={{padding: '12px', borderRadius: '16px', background: 'rgba(255,255,255,.055)', border: '1px solid rgba(255,255,255,.08)'}}>
                    <span style={{display: 'block', color: '#a49cb7', fontSize: '11px', fontWeight: 900}}>맞은 수</span>
                    <b style={{display: 'block', marginTop: '8px', fontSize: '20px', color: '#ff35cd'}}>{result?.times_hit || 0}</b>
                  </div>
                  <div style={{padding: '12px', borderRadius: '16px', background: 'rgba(255,255,255,.055)', border: '1px solid rgba(255,255,255,.08)'}}>
                    <span style={{display: 'block', color: '#a49cb7', fontSize: '11px', fontWeight: 900}}>성향</span>
                    <b style={{display: 'block', marginTop: '8px', fontSize: '18px', color: '#ffe66b'}}>{playStyle || (result?.accuracy > 70 ? '정밀형' : '돌격형')}</b>
                  </div>
                </div>

                {strengthCard && (
                  <div style={{marginTop: '20px', padding: '16px', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(32,199,255,0.1), rgba(32,199,255,0.02))', border: '1px solid rgba(32,199,255,0.2)'}}>
                    <div style={{color: '#20c7ff', fontSize: '12px', fontWeight: 900, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px'}}>
                      <span style={{fontSize: '16px'}}>⚡️</span> 강점
                    </div>
                    <div style={{color: '#dffdf9', fontSize: '13px', lineHeight: 1.6, wordBreak: 'keep-all'}}>{strengthCard}</div>
                  </div>
                )}

                {nextPlayCard && (
                  <div style={{marginTop: '12px', padding: '16px', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(255,53,205,0.1), rgba(255,53,205,0.02))', border: '1px solid rgba(255,53,205,0.2)'}}>
                    <div style={{color: '#ff35cd', fontSize: '12px', fontWeight: 900, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px'}}>
                      <span style={{fontSize: '16px'}}>🎯</span> 다음 플레이 포인트
                    </div>
                    <div style={{color: '#f8f5ff', fontSize: '13px', lineHeight: 1.6, wordBreak: 'keep-all'}}>{nextPlayCard}</div>
                  </div>
                )}
                
                <div style={{marginTop: '20px', padding: '16px', borderRadius: '16px', background: 'rgba(56,255,228,.07)', border: '1px solid rgba(56,255,228,.16)', color: '#dffdf9', fontSize: '13px', lineHeight: 1.55, wordBreak: 'keep-all'}}>
                  {bottomComment || '하단 공개 문구가 이곳에 표시됩니다.'}
                </div>
                
                <div style={{width: '100%', marginTop: '24px', display: 'flex', height: '46px', alignItems: 'center', justifyContent: 'center', borderRadius: '999px', background: 'linear-gradient(100deg,#ff35cd,#8b44ff 58%,#20c7ff)', color: '#fff', fontWeight: 1000, fontSize: '13px', boxShadow: '0 0 30px rgba(255,53,205,.25)'}}>다시 예약하기</div>
              </div>
            </div>
          </div>
          
          <div style={{marginTop: '20px', padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid var(--admin-line)'}}>
            <h4 style={{margin: '0 0 16px', fontSize: '15px'}}>리포트 발행 설정</h4>
            
            <div style={{display: 'flex', gap: '10px', marginBottom: '16px'}}>
              <button onClick={() => handleSave('ready')} className="btn" style={{flex: 1, background: report?.report_status === 'ready' ? 'rgba(255,255,255,0.1)' : ''}}>임시 저장</button>
              <button onClick={() => handleSave('published')} className="btn primary" style={{flex: 1}}>리포트 저장 및 공개</button>
            </div>

            {report?.report_token && (
              <div style={{display: 'flex', gap: '10px'}}>
                <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/report/${report.report_token}`); alert('복사되었습니다.'); }} className="btn cyan" style={{flex: 1}}>URL 복사</button>
                <a href={`/report/${report.report_token}`} target="_blank" rel="noreferrer" className="btn" style={{flex: 1, justifyContent: 'center'}}>새 창 미리보기</a>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
