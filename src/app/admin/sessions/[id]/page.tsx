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

  const [isEditingSession, setIsEditingSession] = useState(false);
  const [editSessionTitle, setEditSessionTitle] = useState('');
  const [editSessionType, setEditSessionType] = useState('일반 이용');
  const [sessionStatus, setSessionStatus] = useState('');

  const handleToggleSessionStatus = async (newStatus: string) => {
    const { error } = await supabase.from('sessions').update({ status: newStatus }).eq('id', sessionId);
    if (!error) {
      setSession({ ...session, status: newStatus });
      setSessionStatus(newStatus);
    }
  };

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
    if (sessionData) {
      setSession(sessionData);
      setSessionStatus(sessionData.status || 'private');
    }

    const { data: participantsData } = await supabase.from('participants').select('*').eq('session_id', sessionId).order('created_at', { ascending: true });
    if (participantsData) {
      setParticipants(participantsData);
      
      const { data: resultsData } = await supabase.from('shooting_results').select('*').eq('session_id', sessionId);
      const resultsMap: Record<string, any> = {};
      if (resultsData) {
        resultsData.forEach((r: any) => {
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
      gpt_analysis: r.gpt_analysis || '',
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

  const handleDeleteParticipant = async (participantId: string) => {
    if (!confirm('이 참여자와 관련된 기록 및 리포트가 모두 삭제됩니다. 계속하시겠습니까?')) return;
    
    await supabase.from('reports').delete().eq('participant_id', participantId);
    await supabase.from('shooting_results').delete().eq('participant_id', participantId);
    await supabase.from('participants').delete().eq('id', participantId);
    
    setParticipants(participants.filter(p => p.id !== participantId));
    const newResults = { ...results };
    delete newResults[participantId];
    setResults(newResults);
  };

  const handleUpdateParticipant = async (participantId: string, field: string, value: string) => {
    const updated = participants.map(p => p.id === participantId ? { ...p, [field]: value } : p);
    setParticipants(updated);
    await supabase.from('participants').update({ [field]: value }).eq('id', participantId);
  };

  const handleUpdateResult = (participantId: string, field: string, value: string) => {
    setResults(prev => ({
      ...prev,
      [participantId]: {
        ...(prev[participantId] || {}),
        [field]: value
      }
    }));
  };

  const handleUpdateSession = async () => {
    if (!editSessionTitle.trim()) return;
    const { error } = await supabase.from('sessions').update({ 
      title: editSessionTitle,
      program_type: editSessionType 
    }).eq('id', sessionId);
    if (!error) {
      setSession({ ...session, title: editSessionTitle, program_type: editSessionType });
      setIsEditingSession(false);
    } else {
      alert('세션 정보 수정에 실패했습니다.');
    }
  };

  const handleDeleteSession = async () => {
    if (!confirm('이 세션과 관련된 모든 참가자, 기록, 리포트가 삭제됩니다. 계속하시겠습니까?')) return;
    
    const { data: pList } = await supabase.from('participants').select('id').eq('session_id', sessionId);
    if (pList && pList.length > 0) {
      const pIds = pList.map((p: any) => p.id);
      await supabase.from('reports').delete().in('participant_id', pIds);
      await supabase.from('shooting_results').delete().in('participant_id', pIds);
      await supabase.from('participants').delete().eq('session_id', sessionId);
    }
    
    await supabase.from('sessions').delete().eq('id', sessionId);
    router.push('/admin/sessions');
  };

  if (loading) return <div style={{color: 'var(--admin-p)', textAlign: 'center', padding: '40px'}}>LOADING DATA...</div>;

  return (
    <div id="results" className="admin-page-content">
      <div className="section-title">
        <div>
          <Link href="/admin/sessions" style={{color: 'var(--admin-muted)', fontSize: '13px', textDecoration: 'none', display: 'inline-block'}}>← 세션 목록으로</Link>
          {isEditingSession ? (
            <div style={{display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px'}}>
              <input type="text" value={editSessionTitle} onChange={e => setEditSessionTitle(e.target.value)} style={{fontSize: '24px', fontWeight: 'bold', background: 'var(--admin-surface)', border: '1px solid var(--admin-line)', color: 'var(--admin-ink)', padding: '4px 12px', borderRadius: '8px', width: '300px'}} />
              <select value={editSessionType} onChange={e => setEditSessionType(e.target.value)} style={{height: '38px', borderRadius: '8px', background: 'var(--admin-surface)', border: '1px solid var(--admin-line)', color: 'var(--admin-ink)', padding: '0 10px', fontSize: '14px', width: '150px'}}>
                <option value="일반 이용">일반 이용</option>
                <option value="단체 프로그램">단체 프로그램</option>
                <option value="대회/이벤트">대회/이벤트</option>
              </select>
              <button onClick={handleUpdateSession} className="btn primary" style={{height: '38px'}}>저장</button>
              <button onClick={() => setIsEditingSession(false)} className="btn" style={{height: '38px'}}>취소</button>
            </div>
          ) : (
            <div style={{display: 'flex', gap: '16px', alignItems: 'center'}}>
              <h2 style={{margin: '4px 0 0'}}>{session?.title} <span style={{fontSize: '16px', color: 'var(--admin-c)', fontWeight: 'normal', marginLeft: '8px'}}>[{session?.program_type || '일반 이용'}]</span></h2>
              <div style={{display: 'flex', gap: '8px', marginTop: '4px'}}>
                <button onClick={() => { setEditSessionTitle(session?.title || ''); setEditSessionType(session?.program_type || '일반 이용'); setIsEditingSession(true); }} className="btn" style={{height: '28px', fontSize: '11px', padding: '0 10px'}}>수정</button>
                <button onClick={handleDeleteSession} className="btn" style={{height: '28px', fontSize: '11px', padding: '0 10px', color: 'var(--admin-r)', borderColor: 'color-mix(in srgb, var(--admin-r) 35%, transparent)'}}>세션 삭제</button>
              </div>
            </div>
          )}
          <p>이 세션의 참가자를 추가하고 리포트를 발급/관리합니다.</p>
        </div>
        {/* 세션 공개/비공개 토글 */}
        <div style={{display:'flex', alignItems:'center', gap:'12px', padding:'14px 18px', background:'var(--admin-surface)', borderRadius:'12px', border:'1px solid var(--admin-line)'}}>
          <span style={{fontSize:'13px', color:'var(--admin-muted)', flexShrink:0}}>세션 상태</span>
          <div style={{display:'flex', gap:'8px', marginLeft:'auto'}}>
            <button onClick={() => handleToggleSessionStatus('private')} style={{padding:'5px 14px', borderRadius:'99px', fontSize:'12px', fontWeight:700, cursor:'pointer', border:'1px solid',
              background: sessionStatus !== 'published' ? 'var(--admin-ink)' : 'transparent',
              borderColor: sessionStatus !== 'published' ? 'var(--admin-ink)' : 'var(--admin-line)',
              color: sessionStatus !== 'published' ? '#fff' : 'var(--admin-muted)'}}>🔒 비공개</button>
            <button onClick={() => handleToggleSessionStatus('published')} style={{padding:'5px 14px', borderRadius:'99px', fontSize:'12px', fontWeight:700, cursor:'pointer', border:'1px solid',
              background: sessionStatus === 'published' ? 'color-mix(in srgb, var(--admin-g) 12%, transparent)' : 'transparent',
              borderColor: sessionStatus === 'published' ? 'color-mix(in srgb, var(--admin-g) 45%, transparent)' : 'var(--admin-line)',
              color: sessionStatus === 'published' ? 'var(--admin-g)' : 'var(--admin-muted)'}}>🌐 공개</button>
          </div>
        </div>
      </div>

      <div className="result-layout">
        <div style={{display: 'flex', flexDirection: 'column', gap: '18px', width: '100%'}}>
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
            <div className="card-body" style={{overflowX: 'auto'}}>
              <table style={{minWidth: '1000px'}}>
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
                  {participants.map(p => {
                    const r = results[p.id] || {};
                    return (
                    <tr key={p.id}>
                      <td><input type="text" value={p.nickname || ''} onChange={e => handleUpdateParticipant(p.id, 'nickname', e.target.value)} /></td>
                      <td><input type="text" value={p.team_name || ''} onChange={e => handleUpdateParticipant(p.id, 'team_name', e.target.value)} /></td>
                      <td><input type="number" placeholder="순위" value={r.rank || ''} onChange={e => handleUpdateResult(p.id, 'rank', e.target.value)} /></td>
                      <td><input type="number" placeholder="0" value={r.score || ''} onChange={e => handleUpdateResult(p.id, 'score', e.target.value)} /></td>
                      <td><input type="number" placeholder="0" value={r.shots_fired || ''} onChange={e => handleUpdateResult(p.id, 'shots_fired', e.target.value)} /></td>
                      <td><input type="number" placeholder="0" value={r.hits || ''} onChange={e => handleUpdateResult(p.id, 'hits', e.target.value)} /></td>
                      <td><input type="number" placeholder="0" value={r.times_hit || ''} onChange={e => handleUpdateResult(p.id, 'times_hit', e.target.value)} /></td>
                      <td style={{fontWeight: 900, color: 'var(--admin-c)'}}>{r.accuracy ? `${r.accuracy}%` : '-'}</td>
                      <td>
                        <div className="actions" style={{flexWrap: 'nowrap'}}>
                          <button onClick={() => handleSaveResult(p.id)} className="btn">저장</button>
                          <Link href={`/admin/sessions/${sessionId}/participant/${p.id}`} className="btn cyan">리포트 관리</Link>
                          <button onClick={() => handleDeleteParticipant(p.id)} className="btn red">삭제</button>
                        </div>
                      </td>
                    </tr>
                  )})}
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
      </div>
    </div>
  );
}
