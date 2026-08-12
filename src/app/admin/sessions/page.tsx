'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function SessionsList() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterType, setFilterType] = useState('전체');

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    const { data } = await supabase
      .from('sessions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setSessions(data);
    setLoading(false);
  };

  const filteredSessions = sessions.filter(s => {
    if (filterType !== '전체' && s.program_type !== filterType) return false;
    if (searchKeyword && !s.title?.toLowerCase().includes(searchKeyword.toLowerCase())) return false;
    return true;
  });

  return (
    <div id="sessions-list" className="admin-page-content">
      <div className="section-title">
        <div>
          <h2>경기 세션 목록</h2>
          <p>모든 경기 세션의 상태를 확인하고 관리합니다.</p>
        </div>
        <Link href="/admin/sessions/new" className="btn primary">새 세션 생성</Link>
      </div>

      <div className="card">
        <div className="card-head">
          <div>
            <h3>전체 세션</h3>
            <p>세션별 참여자와 결과를 확인하고 리포트를 발급하세요.</p>
          </div>
          <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
            <select value={filterType} onChange={e => setFilterType(e.target.value)} style={{height: '38px', borderRadius: '8px', background: 'var(--admin-surface)', border: '1px solid var(--admin-line)', color: 'var(--admin-ink)', padding: '0 10px'}}>
              <option value="전체">모든 유형</option>
              <option value="일반 이용">일반 이용</option>
              <option value="단체 프로그램">단체 프로그램</option>
              <option value="대회/이벤트">대회/이벤트</option>
            </select>
            <input type="text" placeholder="세션명 검색" value={searchKeyword} onChange={e => setSearchKeyword(e.target.value)} style={{height: '38px', borderRadius: '8px', background: 'var(--admin-surface)', border: '1px solid var(--admin-line)', color: 'var(--admin-ink)', padding: '0 12px'}} />
          </div>
        </div>
        <div className="card-body">
          {loading ? (
            <div style={{color: 'var(--admin-p)', textAlign: 'center', padding: '40px'}}>LOADING DATA...</div>
          ) : (
            <div style={{overflowX: 'auto'}}>
              <table>
                <thead>
                  <tr>
                    <th>세션명</th>
                    <th>일자</th>
                    <th>유형</th>
                    <th>상태</th>
                    <th>생성일</th>
                    <th>관리</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSessions.map(session => (
                    <tr key={session.id}>
                      <td>{session.title}</td>
                      <td>{session.play_date}</td>
                      <td>{session.program_type}</td>
                      <td>
                        <button onClick={async () => {
                          const newStatus = session.status === 'published' ? 'private' : 'published';
                          const { error } = await supabase.from('sessions').update({ status: newStatus }).eq('id', session.id);
                          if (!error) {
                            setSessions(sessions.map(s => s.id === session.id ? { ...s, status: newStatus } : s));
                          }
                        }} className={`status ${
                          session.status === 'published' ? 'public' :
                          session.status === 'ready' ? 'pending' :
                          session.status === 'expired' ? 'expired' : 'private'
                        }`} style={{cursor: 'pointer', border: 'none'}}>
                          {session.status === 'published' ? '🌐 공개' : 
                           session.status === 'ready' ? '준비 중' : 
                           session.status === 'expired' ? '만료' : '🔒 비공개'}
                        </button>
                      </td>
                      <td style={{color: 'var(--admin-muted)'}}>{new Date(session.created_at).toLocaleDateString()}</td>
                      <td>
                        <Link href={`/admin/sessions/${session.id}`} className="btn cyan">관리</Link>
                      </td>
                    </tr>
                  ))}
                  {sessions.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{textAlign: 'center', color: 'var(--admin-muted)'}}>생성된 세션이 없습니다.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
