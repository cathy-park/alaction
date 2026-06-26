'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewSession() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    play_date: new Date().toISOString().split('T')[0],
    program_type: '일반 이용',
    memo: '',
    status: 'ready',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase
      .from('sessions')
      .insert([formData])
      .select()
      .single();

    if (error) {
      alert('세션 생성에 실패했습니다: ' + error.message);
      setLoading(false);
    } else {
      router.push(`/admin/sessions/${data.id}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <Link href="/admin/sessions" className="text-[#20C6FF] text-sm hover:underline mb-2 inline-block font-bold">← Back to Sessions</Link>
        <h1 className="text-3xl font-bold font-['Orbitron'] tracking-wide">CREATE SESSION</h1>
        <p className="text-[#9A91B4] text-sm mt-1">새로운 경기 세션을 생성하고 참여자를 관리하세요.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-[rgba(255,255,255,0.03)] backdrop-blur-2xl border border-[rgba(255,255,255,0.05)] rounded-[2rem] p-10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative">
        <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-[#FF2A9D] to-transparent opacity-50" />

        <div className="space-y-8">
          <div>
            <label className="block text-xs font-bold font-['Rajdhani'] uppercase tracking-wider text-[#9A91B4] mb-3">Session Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              placeholder="예: 6월 26일 오후 3시 일반 예약"
              className="w-full bg-[#070710] border border-[rgba(255,255,255,0.1)] rounded-xl px-4 py-3 text-white placeholder-[#60597A] focus:outline-none focus:border-[#FF2A9D] focus:shadow-[0_0_15px_rgba(255,42,157,0.2)] transition-all"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold font-['Rajdhani'] uppercase tracking-wider text-[#9A91B4] mb-3">Play Date *</label>
              <input
                type="date"
                required
                value={formData.play_date}
                onChange={e => setFormData({...formData, play_date: e.target.value})}
                className="w-full bg-[#070710] border border-[rgba(255,255,255,0.1)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#20C6FF] focus:shadow-[0_0_15px_rgba(32,198,255,0.2)] transition-all [color-scheme:dark]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold font-['Rajdhani'] uppercase tracking-wider text-[#9A91B4] mb-3">Program Type *</label>
              <select
                value={formData.program_type}
                onChange={e => setFormData({...formData, program_type: e.target.value})}
                className="w-full bg-[#070710] border border-[rgba(255,255,255,0.1)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8C3FFF] focus:shadow-[0_0_15px_rgba(140,63,255,0.2)] transition-all"
              >
                <option>일반 이용</option>
                <option>기업 워크샵</option>
                <option>회식/친목</option>
                <option>학교·학원·청소년 활동</option>
                <option>생일파티/가족 모임</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold font-['Rajdhani'] uppercase tracking-wider text-[#9A91B4] mb-3">Internal Memo</label>
            <textarea
              value={formData.memo}
              onChange={e => setFormData({...formData, memo: e.target.value})}
              rows={3}
              placeholder="내부 관리용 메모를 입력하세요 (선택)"
              className="w-full bg-[#070710] border border-[rgba(255,255,255,0.1)] rounded-xl px-4 py-3 text-white placeholder-[#60597A] focus:outline-none focus:border-[#B5FF2D] focus:shadow-[0_0_15px_rgba(181,255,45,0.2)] transition-all resize-none"
            />
          </div>

          <div className="pt-8 mt-8 border-t border-[rgba(255,255,255,0.05)] flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 rounded-xl border border-[rgba(255,255,255,0.1)] text-[#BFBBCF] hover:bg-[rgba(255,255,255,0.05)] hover:text-white transition-colors font-bold text-sm"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={loading}
              className="relative group overflow-hidden px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-50 border border-[rgba(255,42,157,0.5)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#FF2A9D] to-[#8C3FFF] opacity-80 group-hover:opacity-100 transition-opacity" />
              <span className="relative text-white font-bold font-['Rajdhani'] uppercase tracking-widest text-base">
                {loading ? 'SAVING...' : 'CREATE & PROCEED'}
              </span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
