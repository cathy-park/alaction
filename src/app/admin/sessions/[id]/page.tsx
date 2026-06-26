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

  if (loading) return <div className="p-16 text-center text-[#FF2A9D] font-['Orbitron'] font-bold text-lg animate-pulse">LOADING DATA...</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link href="/admin/sessions" className="text-[#20C6FF] text-xs font-bold uppercase tracking-widest hover:text-white transition-colors mb-2 inline-block">← Back to Sessions</Link>
          <h1 className="text-3xl font-bold font-['Orbitron'] tracking-wide">{session?.title}</h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-[#9A91B4] text-sm">{session?.play_date}</span>
            <span className="w-1 h-1 bg-[#60597A] rounded-full"></span>
            <span className="text-[#9A91B4] text-sm">{session?.program_type}</span>
            <span className="w-1 h-1 bg-[#60597A] rounded-full"></span>
            <span className={`text-xs font-bold font-['Rajdhani'] uppercase tracking-widest ${session?.status === 'published' ? 'text-[#20C6FF]' : session?.status === 'ready' ? 'text-[#B5FF2D]' : 'text-gray-400'}`}>STATUS: {session?.status}</span>
          </div>
        </div>
        <div>
          <Link href={`/admin/sessions/${sessionId}/reports`} className="group relative inline-flex items-center justify-center overflow-hidden rounded-full p-3 px-6 font-medium text-white transition-all duration-300 border border-[rgba(255,42,157,0.5)] bg-[rgba(255,42,157,0.1)] hover:bg-[rgba(255,42,157,0.3)] shadow-[0_0_15px_rgba(255,42,157,0.2)]">
            <span className="relative font-bold font-['Rajdhani'] uppercase tracking-widest text-sm">QR Reports Management →</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Participants Column */}
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-[rgba(255,255,255,0.02)] backdrop-blur-md border border-[rgba(255,255,255,0.05)] rounded-[1.5rem] p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FF2A9D] to-transparent opacity-50" />
            <h2 className="text-[#9A91B4] font-['Rajdhani'] uppercase tracking-widest text-xs font-bold mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF2A9D] shadow-[0_0_8px_#FF2A9D]"></span> Add Participant
            </h2>
            
            <form onSubmit={handleAddParticipant} className="space-y-4">
              <div>
                <input type="text" placeholder="Nickname (Required)" required value={newParticipant.nickname} onChange={e => setNewParticipant({...newParticipant, nickname: e.target.value})} className="w-full bg-[#070710] border border-[rgba(255,255,255,0.1)] rounded-xl px-4 py-3 text-white placeholder-[#60597A] focus:outline-none focus:border-[#FF2A9D] focus:shadow-[0_0_15px_rgba(255,42,157,0.2)] transition-all text-sm" />
              </div>
              <div>
                <input type="text" placeholder="Team Name (Optional)" value={newParticipant.team_name} onChange={e => setNewParticipant({...newParticipant, team_name: e.target.value})} className="w-full bg-[#070710] border border-[rgba(255,255,255,0.1)] rounded-xl px-4 py-3 text-white placeholder-[#60597A] focus:outline-none focus:border-[#20C6FF] focus:shadow-[0_0_15px_rgba(32,198,255,0.2)] transition-all text-sm" />
              </div>
              <button type="submit" className="w-full bg-[#20C6FF] hover:bg-[#1bb3e6] text-[#04040a] font-bold font-['Rajdhani'] uppercase tracking-widest text-sm py-3 rounded-xl transition-colors shadow-[0_0_15px_rgba(32,198,255,0.3)]">
                + Add Player
              </button>
            </form>
          </div>
        </div>

        {/* Results Column */}
        <div className="xl:col-span-3">
          <div className="bg-[rgba(255,255,255,0.02)] backdrop-blur-md border border-[rgba(255,255,255,0.05)] rounded-[2rem] p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#20C6FF] to-transparent opacity-50" />
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[#9A91B4] font-['Rajdhani'] uppercase tracking-widest text-xs font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#20C6FF] shadow-[0_0_8px_#20C6FF]"></span> Shooting Results Input
              </h2>
            </div>
            
            <div className="overflow-x-auto pb-4 custom-scrollbar">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b border-[rgba(255,255,255,0.05)] text-[#9A91B4] text-xs font-['Rajdhani'] uppercase tracking-wider">
                    <th className="p-3 font-bold w-[120px]">Player (Team)</th>
                    <th className="p-3 font-bold w-[70px]">Rank</th>
                    <th className="p-3 font-bold w-[90px]">Score</th>
                    <th className="p-3 font-bold w-[80px]">Shots</th>
                    <th className="p-3 font-bold w-[80px]">Hits</th>
                    <th className="p-3 font-bold w-[80px]">Damaged</th>
                    <th className="p-3 font-bold w-[90px] text-center">Accuracy</th>
                    <th className="p-3 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {participants.map(p => (
                    <tr key={p.id} className="border-b border-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                      <td className="p-3">
                        <div className="font-bold text-white text-sm">{p.nickname}</div>
                        <div className="text-[10px] text-[#60597A] uppercase tracking-wider">{p.team_name || 'No Team'}</div>
                      </td>
                      <td className="p-3">
                        <input type="number" placeholder="-" value={results[p.id]?.rank || ''} onChange={e => setResults({...results, [p.id]: {...results[p.id], rank: e.target.value}})} className="w-full bg-[#070710] border border-[rgba(255,255,255,0.1)] rounded-lg px-3 py-2 text-white text-sm text-center focus:outline-none focus:border-[#FF2A9D]" />
                      </td>
                      <td className="p-3">
                        <input type="number" placeholder="0" value={results[p.id]?.score || ''} onChange={e => setResults({...results, [p.id]: {...results[p.id], score: e.target.value}})} className="w-full bg-[#070710] border border-[rgba(255,255,255,0.1)] rounded-lg px-3 py-2 text-white text-sm text-center focus:outline-none focus:border-[#FF2A9D]" />
                      </td>
                      <td className="p-3">
                        <input type="number" placeholder="0" value={results[p.id]?.shots_fired || ''} onChange={e => setResults({...results, [p.id]: {...results[p.id], shots_fired: e.target.value}})} className="w-full bg-[#070710] border border-[rgba(255,255,255,0.1)] rounded-lg px-3 py-2 text-white text-sm text-center focus:outline-none focus:border-[#20C6FF]" />
                      </td>
                      <td className="p-3">
                        <input type="number" placeholder="0" value={results[p.id]?.hits || ''} onChange={e => setResults({...results, [p.id]: {...results[p.id], hits: e.target.value}})} className="w-full bg-[#070710] border border-[rgba(255,255,255,0.1)] rounded-lg px-3 py-2 text-white text-sm text-center focus:outline-none focus:border-[#20C6FF]" />
                      </td>
                      <td className="p-3">
                        <input type="number" placeholder="0" value={results[p.id]?.times_hit || ''} onChange={e => setResults({...results, [p.id]: {...results[p.id], times_hit: e.target.value}})} className="w-full bg-[#070710] border border-[rgba(255,255,255,0.1)] rounded-lg px-3 py-2 text-white text-sm text-center focus:outline-none focus:border-[#8C3FFF]" />
                      </td>
                      <td className="p-3 text-center">
                        <span className="font-['Orbitron'] font-bold text-[#B5FF2D] text-lg drop-shadow-[0_0_8px_rgba(181,255,45,0.4)]">
                          {results[p.id]?.accuracy !== undefined ? `${results[p.id].accuracy}%` : '-'}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => handleSaveResult(p.id)} className="border border-[rgba(255,255,255,0.1)] hover:border-[#20C6FF] text-[#BFBBCF] hover:text-[#20C6FF] text-xs font-bold px-3 py-2 rounded-lg transition-colors">SAVE</button>
                          <button onClick={() => generateReport(p.id)} className="bg-[rgba(255,42,157,0.1)] border border-[rgba(255,42,157,0.3)] hover:bg-[rgba(255,42,157,0.2)] text-[#FF2A9D] text-xs font-bold px-3 py-2 rounded-lg transition-colors">ISSUE QR</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {participants.length === 0 && (
                    <tr>
                      <td colSpan={8} className="p-12 text-center text-[#60597A] font-['Rajdhani'] uppercase tracking-widest text-sm">No players added yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
