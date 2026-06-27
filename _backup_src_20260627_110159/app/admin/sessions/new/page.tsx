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
    program_type: '학교·학원·청소년 활동',
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
    <div id="session" className="admin-page-content">
      <div className="section-title">
        <div>
          <h2>경기 세션 생성</h2>
          <p>방문/예약 단위로 세션을 만들고 결과를 연결합니다.</p>
        </div>
        <div className="actions">
          <Link href="/admin/sessions" className="btn">취소</Link>
          <button onClick={handleSubmit} disabled={loading} className="btn primary">저장하기</button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card">
        <div className="card-head">
          <div>
            <h3>세션 기본 정보</h3>
            <p>경기 일자, 프로그램 유형을 설정합니다.</p>
          </div>
        </div>
        <div className="card-body">
          <div className="form-grid">
            <div className="field">
              <label>세션명 *</label>
              <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="예: 평택청소년센터 A팀" />
            </div>
            <div className="field">
              <label>경기 일자 *</label>
              <input type="date" required value={formData.play_date} onChange={e => setFormData({...formData, play_date: e.target.value})} />
            </div>
            <div className="field">
              <label>프로그램 유형</label>
              <select value={formData.program_type} onChange={e => setFormData({...formData, program_type: e.target.value})}>
                <option>기업 워크샵 / 팀빌딩</option>
                <option>학교·학원·청소년 활동</option>
                <option>회식 / 친목 모임</option>
                <option>생일파티 / 가족 모임</option>
                <option>일반 이용</option>
              </select>
            </div>
            <div className="field full">
              <label>관리자 메모</label>
              <textarea value={formData.memo} onChange={e => setFormData({...formData, memo: e.target.value})} placeholder="내부 관리용 메모를 입력하세요"></textarea>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
