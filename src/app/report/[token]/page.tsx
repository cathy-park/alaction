'use client';

import { useEffect, useState, use } from 'react';
import { supabase } from '@/lib/supabase';

export default function MobileReport({ params }: { params: Promise<{ token: string }> }) {
  const resolvedParams = use(params);
  const token = resolvedParams.token;
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, [token]);

  const fetchReport = async () => {
    const { data: reportData } = await supabase.from('reports').select('*').eq('report_token', token).single();
    if (reportData) {
      const { data: sData } = await supabase.from('sessions').select('*').eq('id', reportData.session_id).single();
      const { data: pData } = await supabase.from('participants').select('*').eq('id', reportData.participant_id).single();
      const { data: rData } = await supabase.from('shooting_results').select('*').eq('id', reportData.result_id).single();

      setReport({
        ...reportData,
        sessions: sData || {},
        participants: pData || {},
        shooting_results: rData || {}
      });
    }
    setLoading(false);
  };

  if (loading) return <div style={{minHeight: '100vh', background: '#050508', color: '#ff35cd', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>LOADING...</div>;

  if (!report) return (
    <div style={{minHeight: '100vh', background: '#050508', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{textAlign: 'center', padding: '40px'}}>
        <h1 style={{color: '#ff35cd', fontSize: '40px', margin: '0 0 10px'}}>404</h1>
        <p style={{color: '#a49cb7'}}>리포트를 찾을 수 없습니다.</p>
      </div>
    </div>
  );

  if (report.report_status !== 'published') {
    return (
      <div style={{minHeight: '100vh', background: '#050508', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{textAlign: 'center', padding: '40px'}}>
          <h1 style={{color: '#20c7ff', fontSize: '30px', margin: '0 0 10px'}}>STAND BY</h1>
          <p style={{color: '#a49cb7'}}>아직 리포트가 공개되지 않았습니다.</p>
        </div>
      </div>
    );
  }

  const result = report.shooting_results;
  const participant = report.participants;

  const styleBadge = report.style_badge;
  const displayTitle = report.display_title;
  const displaySummary = report.display_summary;
  const strengthCard = report.strength_card;
  const nextPlayCard = report.next_play_card;
  const bottomComment = report.bottom_comment;

  if (report.report_status !== 'published') {
    return (
      <div style={{minHeight: '100vh', background: '#050508', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Pretendard", sans-serif'}}>
        <div style={{textAlign: 'center'}}>
          <div style={{width: '64px', height: '64px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px'}}>
            <span style={{fontSize: '24px'}}>⏳</span>
          </div>
          <h2 style={{color: '#fff', fontSize: '20px', marginBottom: '8px'}}>리포트 준비 중입니다</h2>
          <p style={{color: 'var(--admin-muted)', fontSize: '14px', lineHeight: 1.5}}>
            관리자가 경기 결과를 분석하고 있습니다.<br/>잠시 후 다시 접속해 주세요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{minHeight: '100vh', background: '#050508', padding: '14px', fontFamily: '-apple-system, BlinkMacSystemFont, "Pretendard", sans-serif'}}>
      <div className="screen" style={{maxWidth: '480px', margin: '0 auto'}}>
        <div className="report-logo">
          <span>ALACTION</span>
          <span>QR</span>
        </div>
        
        <div className="rank">
          <small>RANK</small>
          <b>{result.rank}</b>
        </div>
        
        <div className="report-title">
          <h3>{participant.nickname}</h3>
          <p>{participant.team_name || 'NO TEAM'}</p>
        </div>

        {styleBadge && (
          <div style={{textAlign: 'center', marginTop: '12px'}}>
            <span style={{display: 'inline-block', padding: '6px 14px', background: 'rgba(255,53,205,0.15)', border: '1px solid rgba(255,53,205,0.4)', borderRadius: '99px', color: '#ff35cd', fontSize: '13px', fontWeight: 800, letterSpacing: '-0.02em'}}>
              {styleBadge}
            </span>
          </div>
        )}

        {displayTitle && (
          <div style={{textAlign: 'center', marginTop: '24px', padding: '0 10px'}}>
            <h4 style={{color: '#fff', fontSize: '20px', margin: '0 0 8px', wordBreak: 'keep-all'}}>{displayTitle}</h4>
            <p style={{color: '#a49cb7', fontSize: '13px', lineHeight: 1.5, margin: 0, wordBreak: 'keep-all'}}>{displaySummary}</p>
          </div>
        )}
        
        <div className="report-metrics">
          <div className="report-metric">
            <span>점수</span>
            <b style={{color: '#fff'}}>{result.score}</b>
          </div>
          <div className="report-metric">
            <span>정확도</span>
            <b style={{color: '#baff2d'}}>{result.accuracy}%</b>
          </div>
          <div className="report-metric">
            <span>발사 수</span>
            <b style={{color: '#fff'}}>{result.shots_fired}</b>
          </div>
          <div className="report-metric">
            <span>맞힌 수</span>
            <b style={{color: '#20c7ff'}}>{result.hits}</b>
          </div>
          <div className="report-metric">
            <span>맞은 수</span>
            <b style={{color: '#ff35cd'}}>{result.times_hit}</b>
          </div>
          <div className="report-metric">
            <span>성향</span>
            <b style={{color: '#ffe66b'}}>{report.play_style || (result.accuracy > 70 ? '정밀형' : '돌격형')}</b>
          </div>
        </div>

        {strengthCard && (
          <div style={{marginTop: '20px', padding: '18px', borderRadius: '20px', background: 'linear-gradient(135deg, rgba(32,199,255,0.1), rgba(32,199,255,0.02))', border: '1px solid rgba(32,199,255,0.2)'}}>
            <div style={{color: '#20c7ff', fontSize: '12px', fontWeight: 900, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px'}}>
              <span style={{fontSize: '16px'}}>⚡️</span> 강점
            </div>
            <div style={{color: '#dffdf9', fontSize: '13px', lineHeight: 1.6, wordBreak: 'keep-all'}}>
              {strengthCard}
            </div>
          </div>
        )}

        {nextPlayCard && (
          <div style={{marginTop: '12px', padding: '18px', borderRadius: '20px', background: 'linear-gradient(135deg, rgba(255,53,205,0.1), rgba(255,53,205,0.02))', border: '1px solid rgba(255,53,205,0.2)'}}>
            <div style={{color: '#ff35cd', fontSize: '12px', fontWeight: 900, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px'}}>
              <span style={{fontSize: '16px'}}>🎯</span> 다음 플레이 포인트
            </div>
            <div style={{color: '#f8f5ff', fontSize: '13px', lineHeight: 1.6, wordBreak: 'keep-all'}}>
              {nextPlayCard}
            </div>
          </div>
        )}
        
        <div className="comment" style={{marginTop: '20px'}}>
          {bottomComment || report.public_comment || `알액션에서 훌륭한 플레이를 보여주셨습니다! 정확도 ${result.accuracy}%를 기록하며 뛰어난 사격 솜씨를 증명했습니다.`}
        </div>
        
        <a href="/" className="btn primary" style={{width: '100%', marginTop: '24px', display: 'flex', height: '46px', justifyContent: 'center'}}>다시 예약하기</a>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .screen { min-height: 590px; border-radius: 32px; padding: 22px; background: linear-gradient(180deg,#0a0818,#17102a); border: 1px solid rgba(255,255,255,.08); }
        .report-logo { display: flex; justify-content: space-between; color: #fff; font-weight: 1000; font-size: 13px; letter-spacing: .1em; }
        .rank { width: 150px; height: 150px; margin: 34px auto 20px; display: flex; align-items: center; justify-content: center; flex-direction: column; border-radius: 50%; border: 1px solid rgba(255,53,205,.55); background: radial-gradient(circle,rgba(255,53,205,.18),rgba(255,255,255,.03)); box-shadow: 0 0 50px rgba(255,53,205,.25); }
        .rank small { color: #a49cb7; font-size: 12px; font-weight: 1000; }
        .rank b { font-size: 58px; color: #fff; }
        .report-title { text-align: center; color: #fff; }
        .report-title h3 { margin: 0; font-size: 24px; letter-spacing: -.055em; }
        .report-title p { margin: 8px 0 0; color: #a49cb7; line-height: 1.5; font-size: 13px; }
        .report-metrics { display: grid; grid-template-columns: repeat(2,1fr); gap: 10px; margin-top: 24px; }
        .report-metric { min-height: 86px; padding: 14px; border-radius: 20px; background: rgba(255,255,255,.055); border: 1px solid rgba(255,255,255,.08); }
        .report-metric span { display: block; color: #a49cb7; font-size: 11px; font-weight: 900; }
        .report-metric b { display: block; margin-top: 12px; font-size: 24px; letter-spacing: -.05em; }
        .comment { padding: 16px; border-radius: 20px; background: rgba(56,255,228,.07); border: 1px solid rgba(56,255,228,.16); color: #dffdf9; font-size: 13px; line-height: 1.55; word-break: keep-all; }
        .btn { height: 42px; display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 0 16px; border: 1px solid rgba(255,255,255,.12); border-radius: 999px; background: rgba(255,255,255,.055); color: #f8f5ff; font-weight: 1000; font-size: 13px; cursor: pointer; text-decoration: none; }
        .btn.primary { border: 0; background: linear-gradient(100deg,#ff35cd,#8b44ff 58%,#20c7ff); box-shadow: 0 0 30px rgba(255,53,205,.25); }
      `}} />
    </div>
  );
}
