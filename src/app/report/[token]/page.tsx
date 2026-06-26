'use client';

import { useEffect, useState, use, useRef } from 'react';
import { supabase } from '@/lib/supabase';

export default function MobileReport({ params }: { params: Promise<{ token: string }> }) {
  const resolvedParams = use(params);
  const token = resolvedParams.token;
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const reportRef = useRef<HTMLDivElement>(null);

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
      <div style={{minHeight: '100vh', background: '#050508', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px', fontFamily: '-apple-system, BlinkMacSystemFont, "Pretendard", sans-serif', overflow: 'hidden', position: 'relative'}}>
        <style>{`
          @keyframes spinSlow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes spinReverse {
            from { transform: rotate(360deg); }
            to { transform: rotate(0deg); }
          }
          @keyframes pulseGlow {
            0%, 100% { opacity: 0.7; filter: blur(12px); }
            50% { opacity: 1; filter: blur(16px); }
          }
          @keyframes blinkDot {
            0%, 100% { opacity: 0.2; transform: scale(0.8); }
            50% { opacity: 1; transform: scale(1.2); }
          }
          .connecting-line {
            position: absolute;
            top: 24px; bottom: 24px; left: 11px;
            width: 2px;
            background: linear-gradient(to bottom, #ff35cd 0%, #20c7ff 50%, rgba(255,255,255,0.1) 80%);
            z-index: 0;
          }
        `}</style>
        
        {/* Background ambient glow */}
        <div style={{position: 'absolute', top: '-10%', right: '-10%', width: '300px', height: '300px', background: 'rgba(32,199,255,0.15)', filter: 'blur(100px)', borderRadius: '50%', zIndex: 0}}></div>
        <div style={{position: 'absolute', bottom: '-10%', left: '-10%', width: '300px', height: '300px', background: 'rgba(255,53,205,0.1)', filter: 'blur(100px)', borderRadius: '50%', zIndex: 0}}></div>

        <div style={{position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '340px'}}>
          {/* Circular progress */}
          <div style={{position: 'relative', width: '220px', height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '40px'}}>
            
            {/* Corner crosshairs */}
            <div style={{position: 'absolute', top: '14px', left: '14px', width: '6px', height: '6px', borderTop: '1px solid rgba(255,255,255,0.2)', borderLeft: '1px solid rgba(255,255,255,0.2)'}}></div>
            <div style={{position: 'absolute', top: '14px', right: '14px', width: '6px', height: '6px', borderTop: '1px solid rgba(255,255,255,0.2)', borderRight: '1px solid rgba(255,255,255,0.2)'}}></div>
            <div style={{position: 'absolute', bottom: '14px', left: '14px', width: '6px', height: '6px', borderBottom: '1px solid rgba(255,255,255,0.2)', borderLeft: '1px solid rgba(255,255,255,0.2)'}}></div>
            <div style={{position: 'absolute', bottom: '14px', right: '14px', width: '6px', height: '6px', borderBottom: '1px solid rgba(255,255,255,0.2)', borderRight: '1px solid rgba(255,255,255,0.2)'}}></div>

            {/* Glowing rings */}
            <svg width="220" height="220" viewBox="0 0 220 220" style={{position: 'absolute', inset: 0, overflow: 'visible', animation: 'spinSlow 12s linear infinite'}}>
              <defs>
                <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ff35cd" />
                  <stop offset="100%" stopColor="#20c7ff" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="8" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              <circle cx="110" cy="110" r="88" fill="none" stroke="url(#ringGrad)" strokeWidth="6" filter="url(#glow)" opacity="0.7" style={{animation: 'pulseGlow 2s ease-in-out infinite alternate'}}/>
              <circle cx="110" cy="110" r="88" fill="none" stroke="url(#ringGrad)" strokeWidth="3" />
            </svg>

            {/* Inner dashed ring */}
            <svg width="220" height="220" viewBox="0 0 220 220" style={{position: 'absolute', inset: 0, animation: 'spinReverse 20s linear infinite'}}>
              <circle cx="110" cy="110" r="70" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="2 6" />
              <circle cx="110" cy="110" r="70" fill="none" stroke="#20c7ff" strokeWidth="2" strokeDasharray="2 6" strokeDashoffset="100" opacity="0.8" style={{strokeDasharray: '40 200'}}/>
            </svg>

            {/* Cross lines (faint) */}
            <div style={{position: 'absolute', inset: '0', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <div style={{width: '200px', height: '1px', background: 'rgba(255,255,255,0.05)'}}></div>
            </div>
            <div style={{position: 'absolute', inset: '0', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <div style={{width: '1px', height: '200px', background: 'rgba(255,255,255,0.05)'}}></div>
            </div>

            <div style={{textAlign: 'center', zIndex: 1, transform: 'translateY(2px)'}}>
              <div style={{fontSize: '38px', fontWeight: '800', margin: '0', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '2px', fontFamily: '"Rajdhani", sans-serif'}}>
                68<span style={{fontSize: '18px', marginBottom: '8px', color: '#fff'}} >%</span>
              </div>
              <div style={{color: '#20c7ff', fontSize: '13px', fontWeight: '600', letterSpacing: '0.05em'}}>분석 중</div>
            </div>
          </div>

          {/* Title block */}
          <div style={{textAlign: 'center', marginBottom: '36px', width: '100%'}}>
            <h1 style={{fontSize: '28px', fontWeight: '800', margin: '0 0 16px', background: 'linear-gradient(90deg, #ff35cd, #20c7ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.02em'}}>리포트 준비 중</h1>
            <p style={{color: '#e2dbea', fontSize: '15px', margin: '0 0 8px', fontWeight: '500', wordBreak: 'keep-all'}}>게임 데이터를 분석하고 있어요</p>
            <p style={{color: '#7f788f', fontSize: '13px', margin: '0', wordBreak: 'keep-all'}}>리포트가 완성되면 QR로 바로 확인할 수 있습니다.</p>
          </div>

          {/* Steps block */}
          <div style={{width: '100%', position: 'relative', paddingLeft: '4px'}}>
            <div className="connecting-line"></div>
            
            {/* Step 1 */}
            <div style={{display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px', position: 'relative', zIndex: 1}}>
              <div style={{width: '24px', height: '24px', borderRadius: '50%', background: '#ff35cd', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 12px rgba(255,53,205,0.6)', flexShrink: 0}}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <div style={{flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,53,205,0.25)', borderRadius: '12px'}}>
                <span style={{color: '#fff', fontSize: '14px', fontWeight: '500'}}>1. 데이터 수집</span>
                <span style={{color: '#ff35cd', fontSize: '13px', fontWeight: '600'}}>완료</span>
              </div>
            </div>
            
            {/* Step 2 */}
            <div style={{display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px', position: 'relative', zIndex: 1}}>
              <div style={{width: '24px', height: '24px', borderRadius: '50%', background: '#20c7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 12px rgba(32,199,255,0.6)', flexShrink: 0}}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <div style={{flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', background: 'rgba(32,199,255,0.03)', border: '1px solid rgba(32,199,255,0.25)', borderRadius: '12px'}}>
                <span style={{color: '#fff', fontSize: '14px', fontWeight: '500'}}>2. 결과 분석</span>
                <span style={{color: '#20c7ff', fontSize: '13px', fontWeight: '600'}}>진행 중</span>
              </div>
            </div>
            
            {/* Step 3 */}
            <div style={{display: 'flex', alignItems: 'center', gap: '16px', position: 'relative', zIndex: 1}}>
              <div style={{width: '24px', height: '24px', borderRadius: '50%', background: '#0a0a0f', border: '2px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
              </div>
              <div style={{flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px'}}>
                <span style={{color: '#7f788f', fontSize: '14px', fontWeight: '500'}}>3. 리포트 생성</span>
                <span style={{color: '#5b546e', fontSize: '13px', fontWeight: '600'}}>대기 중</span>
              </div>
            </div>
          </div>

          <div style={{marginTop: '40px', display: 'flex', gap: '8px'}}>
            <div style={{width: '4px', height: '4px', borderRadius: '50%', background: '#ff35cd', animation: 'blinkDot 1.5s infinite 0s'}}></div>
            <div style={{width: '4px', height: '4px', borderRadius: '50%', background: '#fff', animation: 'blinkDot 1.5s infinite 0.3s'}}></div>
            <div style={{width: '4px', height: '4px', borderRadius: '50%', background: '#20c7ff', animation: 'blinkDot 1.5s infinite 0.6s'}}></div>
          </div>
          <div style={{marginTop: '16px', color: '#5b546e', fontSize: '13px'}}>잠시 후 다시 확인해주세요</div>
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

  return (
    <div style={{minHeight: '100vh', background: '#050508', padding: '14px', fontFamily: '-apple-system, BlinkMacSystemFont, "Pretendard", sans-serif'}}>
      <div className="screen" ref={reportRef} style={{maxWidth: '480px', margin: '0 auto'}}>
        <div className="report-logo">
          <span className="brand" style={{fontSize: '15px', gap: '7px'}}>
            <img src="/logo.png" alt="" style={{ width: '22px', height: '22px', objectFit: 'contain' }} />
            <span>R.ACTION</span>
          </span>
          <span>QR</span>
        </div>
        
        <div className="rank">
          {/* Glowing rings */}
          <svg width="150" height="150" viewBox="0 0 150 150" style={{position: 'absolute', inset: 0, overflow: 'visible', animation: 'spinSlow 12s linear infinite'}}>
            <defs>
              <linearGradient id="rankRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff35cd" />
                <stop offset="100%" stopColor="#20c7ff" />
              </linearGradient>
              <filter id="rankGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <circle cx="75" cy="75" r="66" fill="none" stroke="url(#rankRingGrad)" strokeWidth="4" filter="url(#rankGlow)" opacity="0.6" style={{animation: 'pulseGlow 2s ease-in-out infinite alternate'}}/>
            <circle cx="75" cy="75" r="66" fill="none" stroke="url(#rankRingGrad)" strokeWidth="2" />
          </svg>

          {/* Inner dashed ring */}
          <svg width="150" height="150" viewBox="0 0 150 150" style={{position: 'absolute', inset: 0, animation: 'spinReverse 20s linear infinite'}}>
            <circle cx="75" cy="75" r="54" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="2 4" />
          </svg>
          
          <div style={{position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <small>RANK</small>
            <b>{result.rank}</b>
          </div>
        </div>
        
        <div className="report-title">
          <h3>{participant.nickname}</h3>
          <p>{participant.team_name || 'NO TEAM'}</p>
        </div>

        {styleBadge && (
          <div style={{textAlign: 'center', marginTop: '12px'}}>
            <span style={{display: 'inline-block', padding: '6px 14px', background: 'rgba(255,53,205,0.15)', border: '1px solid rgba(255,53,205,0.4)', borderRadius: '99px', color: '#ff35cd', fontSize: '13px', fontWeight: 800, letterSpacing: '-0.02em'}}>
              🎯 {styleBadge}
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
            <b>{result.score}</b>
          </div>
          <div className="report-metric">
            <span>정확도</span>
            <b style={{color: '#baff2d'}}>{result.accuracy}%</b>
          </div>
          <div className="report-metric">
            <span>발사 수</span>
            <b>{result.shots_fired}</b>
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
            <b style={{color: '#ffe66b', fontSize: '24px', display: 'block', lineHeight: 1.2}}>
              {report.play_style || (result.accuracy > 70 ? '🎯 정밀형 플레이' : '🔥 돌격형 플레이')}
            </b>
          </div>
        </div>

        {strengthCard && (
          <div style={{marginTop: '20px', padding: '18px', borderRadius: '20px', background: 'linear-gradient(135deg, rgba(32,199,255,0.1), rgba(32,199,255,0.02))', border: '1px solid rgba(32,199,255,0.2)'}}>
            <div className="card-label" style={{color: '#20c7ff', marginBottom: '8px', fontSize: '13px', fontWeight: 900}}>
              <span className="card-emoji" style={{marginRight: '6px'}}>⚡️</span>
              <span>강점</span>
            </div>
            <div style={{color: '#dffdf9', fontSize: '13px', lineHeight: 1.6, wordBreak: 'keep-all'}}>
              {strengthCard}
            </div>
          </div>
        )}

        {nextPlayCard && (
          <div style={{marginTop: '12px', padding: '18px', borderRadius: '20px', background: 'linear-gradient(135deg, rgba(255,53,205,0.1), rgba(255,53,205,0.02))', border: '1px solid rgba(255,53,205,0.2)'}}>
            <div className="card-label" style={{color: '#ff35cd', marginBottom: '8px', fontSize: '13px', fontWeight: 900}}>
              <span className="card-emoji" style={{marginRight: '6px'}}>🎯</span>
              <span>다음 플레이 포인트</span>
            </div>
            <div style={{color: '#f8f5ff', fontSize: '13px', lineHeight: 1.6, wordBreak: 'keep-all'}}>
              {nextPlayCard}
            </div>
          </div>
        )}
        
        <div className="comment" style={{marginTop: '20px'}}>
          {bottomComment || report.public_comment || `알액션에서 훌륭한 플레이를 보여주셨습니다! 정확도 ${result.accuracy}%를 기록하며 뛰어난 사격 솜씨를 증명했습니다.`}
        </div>
        
        <a 
          href="https://m.booking.naver.com/booking/12/bizes/766721/items/4624099?area=pll&lang=ko&service-target=map-pc&startDateTime=2026-06-26T00%3A00%3A00%2B09%3A00&theme=place" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="btn primary" 
          style={{width: '100%', marginTop: '24px', display: 'flex', height: '46px', justifyContent: 'center'}}
        >
          다시 예약하기
        </a>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .screen {
          min-height: 590px;
          border-radius: 32px;
          padding: 22px;
          background: linear-gradient(180deg, #0a0818, #17102a);
          border: 1px solid rgba(255,255,255,.08);
        }
        .report-logo {
          display: flex;
          justify-content: space-between;
          color: #fff;
          font-weight: 1000;
          font-size: 13px;
          letter-spacing: .1em;
        }
        .rank {
          width: 150px; height: 150px;
          margin: 34px auto 20px;
          display: flex; align-items: center; justify-content: center; flex-direction: column;
          border-radius: 50%;
          position: relative;
        }
        .rank small { color: #a49cb7; font-size: 12px; font-weight: 1000; letter-spacing: 0.1em; }
        .rank b { font-size: 58px; color: #fff; margin-top: -4px; text-shadow: 0 0 20px rgba(255,255,255,0.3); }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spinReverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.5; filter: blur(6px); }
          50% { opacity: 0.8; filter: blur(10px); }
        }
        .report-title { text-align: center; color: #fff; }
        .report-title h3 { margin: 0; font-size: 24px; letter-spacing: -.055em; }
        .report-title p { margin: 8px 0 0; color: #a49cb7; line-height: 1.5; font-size: 13px; }
        .report-metrics {
          display: grid;
          grid-template-columns: repeat(2,1fr);
          gap: 10px;
          margin-top: 24px;
        }
        .report-metric {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          padding: 20px;
        }
        .report-metric > span { display: block; color: #a49cb7; font-size: 11px; font-weight: 900; }
        .report-metric > b { display: block; margin-top: 12px; font-size: 24px; letter-spacing: -.05em; color: #fff; }
        .comment {
          padding: 16px;
          border-radius: 20px;
          background: rgba(56,255,228,.07);
          border: 1px solid rgba(56,255,228,.16);
          color: #dffdf9;
          font-size: 13px;
          line-height: 1.55;
          word-break: keep-all;
        }
        .btn {
          height: 42px;
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          padding: 0 16px;
          border: 1px solid rgba(255,255,255,.12);
          border-radius: 999px;
          background: rgba(255,255,255,.055);
          color: #f8f5ff;
          font-weight: 1000;
          font-size: 13px;
          cursor: pointer;
          text-decoration: none;
        }
        .btn.primary {
          border: 0;
          background: linear-gradient(100deg, #ff35cd, #8b44ff 58%, #20c7ff);
          box-shadow: 0 0 30px rgba(255,53,205,.25);
        }
        .btn.cyan {
          border-color: rgba(32,199,255,.3);
          color: #20c7ff;
        }

        /* ─── 카드 라벨 (이모지 + 텍스트 정렬) ─── */
        .card-label {
          display: block;
          font-size: 12px;
          font-weight: 900;
          margin-bottom: 6px;
          line-height: 1;
        }
        .card-emoji {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          line-height: 1;
          /* 이모지 전용 font-family로 시스템 이모지 강제 적용 */
          font-family: "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif;
          /* 상하 baseline 보정 */
          position: relative;
          top: 0;
          vertical-align: middle;
        }


      `}} />
    </div>
  );
}
