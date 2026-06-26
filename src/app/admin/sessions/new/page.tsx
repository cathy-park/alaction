'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

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
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold font-['Orbitron'] mb-8">새 경기 세션 만들기</h1>
      
      <form onSubmit={handleSubmit} className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-2xl p-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-[#BFBBCF] mb-2">세션명 *</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
            placeholder="예: 6월 26일 오후 3시 일반 예약"
            className="w-full bg-[#04040a] border border-[#60597A] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FF2A9D] transition-colors"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[#BFBBCF] mb-2">경기 일자 *</label>
            <input
              type="date"
              required
              value={formData.play_date}
              onChange={e => setFormData({...formData, play_date: e.target.value})}
              className="w-full bg-[#04040a] border border-[#60597A] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FF2A9D] transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#BFBBCF] mb-2">프로그램 유형 *</label>
            <select
              value={formData.program_type}
              onChange={e => setFormData({...formData, program_type: e.target.value})}
              className="w-full bg-[#04040a] border border-[#60597A] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FF2A9D] transition-colors"
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
          <label className="block text-sm font-medium text-[#BFBBCF] mb-2">메모</label>
          <textarea
            value={formData.memo}
            onChange={e => setFormData({...formData, memo: e.target.value})}
            rows={3}
            placeholder="내부 관리용 메모"
            className="w-full bg-[#04040a] border border-[#60597A] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FF2A9D] transition-colors"
          />
        </div>

        <div className="pt-4 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 rounded-full border border-[#60597A] text-[#BFBBCF] hover:bg-[rgba(255,255,255,0.05)] transition-colors"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-[#FF2A9D] to-[#8C3FFF] hover:shadow-[0_0_20px_rgba(255,42,157,0.4)] text-white font-bold px-8 py-2 rounded-full transition-all disabled:opacity-50"
          >
            {loading ? '저장 중...' : '저장 및 다음 단계'}
          </button>
        </div>
      </form>
    </div>
  );
}
