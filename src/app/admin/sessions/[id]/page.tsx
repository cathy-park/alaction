'use client';

import { useEffect, useState, use } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SessionDetails({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const sessionId = resolvedParams.id;
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Participant Form
  const [newParticipant, setNewParticipant] = useState({
    nickname: '',
    team_name: '',
    age_group: '',
    gender: '',
  });

  // Result Forms
  const [results, setResults] = useState<Record<string, any>>({});

  useEffect(() => {
    fetchSessionData();
  }, [sessionId]);

  const fetchSessionData = async () => {
    const { data: sessionData } = await supabase.from('sessions').select('*').eq('id', sessionId).single();
    if (sessionData) setSession(sessionData);

    const { data: participantsData } = await supabase.from('participants').select('*').eq('session_id', sessionId).order('created_at', { ascending: true });
    if (participantsData) {
      setParticipants(participantsData);
      
      const { data: resultsData } = await supabase.from('shooting_results').select('*').eq('session_id', sessionId);
      const resultsMap: Record<string, any> = {};
      if (resultsData) {
        resultsData.forEach(r => {
          resultsMap[r.participant_id] = r;
        });
      }
      setResults(resultsMap);
    }
    setLoading(false);
  };

  const handleAddParticipant = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.from('participants').insert([{
      ...newParticipant,
      session_id: sessionId
    }]).select().single();

    if (!error && data) {
      setParticipants([...participants, data]);
      setNewParticipant({ nickname: '', team_name: '', age_group: '', gender: '' });
    }
  };

  const handleSaveResult = async (participantId: string) => {
    const r = results[participantId] || {};
    const shots = parseInt(r.shots_fired) || 0;
    const hits = parseInt(r.hits) || 0;
    const acc = shots > 0 ? ((hits / shots) * 100).toFixed(2) : 0;

    const resultData = {
      session_id: sessionId,
      participant_id: participantId,
      rank: parseInt(r.rank) || 1,
      score: parseInt(r.score) || 0,
      shots_fired: shots,
      hits: hits,
      times_hit: parseInt(r.times_hit) || 0,
      accuracy: parseFloat(acc as string),
    };

    if (r.id) {
      await supabase.from('shooting_results').update(resultData).eq('id', r.id);
    } else {
      const { data } = await supabase.from('shooting_results').insert([resultData]).select().single();
      if (data) {
        setResults({ ...results, [participantId]: data });
      }
    }
    alert('저장되었습니다.');
    fetchSessionData();
  };

  const generateReport = async (participantId: string) => {
    const r = results[participantId];
    if (!r?.id) {
      alert('결과를 먼저 저장해주세요.');
      return;
    }

    const reportToken = Math.random().toString(36).substring(2, 10);
    const { data, error } = await supabase.from('reports').insert([{
      session_id: sessionId,
      participant_id: participantId,
      result_id: r.id,
      report_token: reportToken,
      report_status: 'ready'
    }]);

    if (error) {
      alert('리포트 생성 실패: ' + error.message);
    } else {
      alert('리포트가 생성되었습니다. 상태: 준비 중');
    }
  };

  if (loading) return <div style={{color: 'var(--admin-p)', textAlign: 'center', padding: '40px'}}>LOADING DATA...</div>;

  return (
    <section id="results">
      <div className="section-title">
        <div>
          <Link href="/admin/sessions" style={{color: 'var(--admin-muted)', fontSize: '13px', textDecoration: 'none', marginBottom: '8px', display: 'inline-block'}}>← 세션 목록으로</Link>
          <h2>경기 세션 상세 관리</h2>
          <p>[{session?.title}] 의 참가자를 추가하고 결과를 입력합니다.</p>
        </div>
      </div>

      <div className="result-layout">
        <div style={{display: 'flex', flexDirection: 'column', gap: '18px'}}>
          <form className="card" onSubmit={handleAddParticipant}>
            <div className="card-head">
              <div>
                <h3>참여자 추가</h3>
              </div>
              <button type="submit" className="btn cyan">추가하기</button>
            </div>
            <div className="card-body">
              <div className="form-grid">
                <div className="field">
                  <input type="text" placeholder="닉네임 (필수)" required value={newParticipant.nickname} onChange={e => setNewParticipant({...newParticipant, nickname: e.target.value})} />
                </div>
                <div className="field">
                  <input type="text" placeholder="팀 (선택)" value={newParticipant.team_name} onChange={e => setNewParticipant({...newParticipant, team_name: e.target.value})} />
                </div>
              </div>
            </div>
          </form>

          <div className="card input-table">
            <div className="card-head">
              <div>
                <h3>참여자별 슈팅 기록</h3>
                <p>정확도는 맞힌 수 ÷ 발사 수 × 100으로 자동 계산합니다.</p>
              </div>
            </div>
            <div className="card-body">
              <table>
                <thead>
                  <tr>
                    <th>닉네임</th>
                    <th>팀</th>
                    <th>랭킹</th>
                    <th>점수</th>
                    <th>발사 수</th>
                    <th>맞힌 수</th>
                    <th>맞은 수</th>
                    <th>정확도</th>
                    <th>상태/관리</th>
                  </tr>
                </thead>
                <tbody>
                  {participants.map(p => (
                    <tr key={p.id}>
                      <td>{p.nickname}</td>
                      <td>{p.team_name || '-'}</td>
                      <td><input type="number" placeholder="1" value={results[p.id]?.rank || ''} onChange={e => setResults({...results, [p.id]: {...results[p.id], rank: e.target.value}})} /></td>
                      <td><input type="number" placeholder="0" value={results[p.id]?.score || ''} onChange={e => setResults({...results, [p.id]: {...results[p.id], score: e.target.value}})} /></td>
                      <td><input type="number" placeholder="0" value={results[p.id]?.shots_fired || ''} onChange={e => setResults({...results, [p.id]: {...results[p.id], shots_fired: e.target.value}})} /></td>
                      <td><input type="number" placeholder="0" value={results[p.id]?.hits || ''} onChange={e => setResults({...results, [p.id]: {...results[p.id], hits: e.target.value}})} /></td>
                      <td><input type="number" placeholder="0" value={results[p.id]?.times_hit || ''} onChange={e => setResults({...results, [p.id]: {...results[p.id], times_hit: e.target.value}})} /></td>
                      <td className="calc">{results[p.id]?.accuracy !== undefined ? `${results[p.id].accuracy}%` : '-'}</td>
                      <td>
                        <div className="actions">
                          <button onClick={() => handleSaveResult(p.id)} className="btn">저장</button>
                          <button onClick={() => generateReport(p.id)} className="btn cyan">발급</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {participants.length === 0 && (
                    <tr>
                      <td colSpan={9} style={{textAlign: 'center', color: 'var(--admin-muted)'}}>등록된 참가자가 없습니다.</td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div className="note">총 플레이 횟수, 기록 변화율, 이전 회차 대비 분석은 이번 최소 범위에서 제외합니다.</div>
            </div>
          </div>
        </div>

        <aside className="qr-panel">
          <div className="kicker">QR Generator</div>
          <h2 style={{margin: '8px 0 4px', fontSize: '25px', letterSpacing: '-.055em'}}>리포트 QR 발급</h2>
          <p style={{margin: 0, color: 'var(--admin-muted)', lineHeight: '1.6', fontSize: '14px'}}>고유 토큰 URL을 생성하고 QR 이미지로 다운로드합니다.</p>
          <div className="qr">
            {/* Mock dots for aesthetic */}
            {Array.from({length: 81}).map((_, i) => <i key={i}></i>)}
          </div>
          <div className="url text-center" style={{textAlign: 'center', color: 'var(--admin-muted)'}}>
            리포트 관리를 열어 개별 발급 상태를 확인하세요.
          </div>
          <br />
          <div className="actions">
            <Link href={`/admin/sessions/${sessionId}/reports`} className="btn primary" style={{width: '100%'}}>QR 리포트 관리 페이지</Link>
          </div>
        </aside>
      </div>
    </section>
  );
}
