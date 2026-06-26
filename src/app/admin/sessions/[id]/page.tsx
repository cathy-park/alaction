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
      
      // Fetch results
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
    fetchSessionData(); // Refresh to get accuracy etc
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

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <Link href="/admin/sessions" className="text-[#20C6FF] text-sm hover:underline mb-2 inline-block">← 목록으로 돌아가기</Link>
          <h1 className="text-3xl font-bold font-['Orbitron']">{session?.title}</h1>
          <p className="text-[#BFBBCF] mt-1">{session?.play_date} | {session?.program_type} | 상태: {session?.status}</p>
        </div>
        <div>
          <Link href={`/admin/sessions/${sessionId}/reports`} className="bg-gradient-to-r from-[#FF2A9D] to-[#8C3FFF] hover:shadow-[0_0_20px_rgba(255,42,157,0.4)] text-white font-bold px-6 py-2 rounded-full transition-all">
            QR 리포트 관리 & 다운로드
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Participants Column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-2xl p-6">
            <h2 className="text-xl font-bold font-['Orbitron'] mb-4 text-[#FF2A9D]">참여자 추가</h2>
            <form onSubmit={handleAddParticipant} className="space-y-4">
              <input type="text" placeholder="닉네임 (필수)" required value={newParticipant.nickname} onChange={e => setNewParticipant({...newParticipant, nickname: e.target.value})} className="w-full bg-[#04040a] border border-[#60597A] rounded-lg px-3 py-2 text-white" />
              <input type="text" placeholder="팀명 (선택)" value={newParticipant.team_name} onChange={e => setNewParticipant({...newParticipant, team_name: e.target.value})} className="w-full bg-[#04040a] border border-[#60597A] rounded-lg px-3 py-2 text-white" />
              <button type="submit" className="w-full bg-[#20C6FF] hover:bg-[#1bb3e6] text-[#04040a] font-bold py-2 rounded-lg">추가</button>
            </form>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-2">
          <div className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-2xl p-6 overflow-x-auto">
            <h2 className="text-xl font-bold font-['Orbitron'] mb-4 text-[#B5FF2D]">슈팅 결과 입력</h2>
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-[rgba(255,255,255,0.1)] text-[#BFBBCF] text-xs">
                  <th className="p-2">닉네임(팀)</th>
                  <th className="p-2 w-16">순위</th>
                  <th className="p-2 w-20">점수</th>
                  <th className="p-2 w-20">발사수</th>
                  <th className="p-2 w-20">명중수</th>
                  <th className="p-2 w-20">피격수</th>
                  <th className="p-2 w-20">정확도</th>
                  <th className="p-2">액션</th>
                </tr>
              </thead>
              <tbody>
                {participants.map(p => (
                  <tr key={p.id} className="border-b border-[rgba(255,255,255,0.05)]">
                    <td className="p-2">
                      <div className="font-bold">{p.nickname}</div>
                      <div className="text-[10px] text-[#BFBBCF]">{p.team_name}</div>
                    </td>
                    <td className="p-2">
                      <input type="number" value={results[p.id]?.rank || ''} onChange={e => setResults({...results, [p.id]: {...results[p.id], rank: e.target.value}})} className="w-full bg-[#04040a] border border-[#60597A] rounded px-2 py-1 text-white text-sm" />
                    </td>
                    <td className="p-2">
                      <input type="number" value={results[p.id]?.score || ''} onChange={e => setResults({...results, [p.id]: {...results[p.id], score: e.target.value}})} className="w-full bg-[#04040a] border border-[#60597A] rounded px-2 py-1 text-white text-sm" />
                    </td>
                    <td className="p-2">
                      <input type="number" value={results[p.id]?.shots_fired || ''} onChange={e => setResults({...results, [p.id]: {...results[p.id], shots_fired: e.target.value}})} className="w-full bg-[#04040a] border border-[#60597A] rounded px-2 py-1 text-white text-sm" />
                    </td>
                    <td className="p-2">
                      <input type="number" value={results[p.id]?.hits || ''} onChange={e => setResults({...results, [p.id]: {...results[p.id], hits: e.target.value}})} className="w-full bg-[#04040a] border border-[#60597A] rounded px-2 py-1 text-white text-sm" />
                    </td>
                    <td className="p-2">
                      <input type="number" value={results[p.id]?.times_hit || ''} onChange={e => setResults({...results, [p.id]: {...results[p.id], times_hit: e.target.value}})} className="w-full bg-[#04040a] border border-[#60597A] rounded px-2 py-1 text-white text-sm" />
                    </td>
                    <td className="p-2 text-center text-sm font-bold text-[#FF2A9D]">
                      {results[p.id]?.accuracy !== undefined ? `${results[p.id].accuracy}%` : '-'}
                    </td>
                    <td className="p-2 flex gap-2">
                      <button onClick={() => handleSaveResult(p.id)} className="bg-[#60597A] hover:bg-[#8C3FFF] text-white text-xs px-2 py-1 rounded">저장</button>
                      <button onClick={() => generateReport(p.id)} className="bg-[#FF2A9D] hover:bg-[#ff4db1] text-white text-xs px-2 py-1 rounded">리포트</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
