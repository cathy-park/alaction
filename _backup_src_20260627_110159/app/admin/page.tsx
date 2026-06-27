'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    ready: 0,
    expired: 0,
  });
  const [recentSessions, setRecentSessions] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const { count: totalSessions } = await supabase.from('sessions').select('*', { count: 'exact', head: true });
    const { count: published } = await supabase.from('reports').select('*', { count: 'exact', head: true }).eq('report_status', 'published');
    const { count: ready } = await supabase.from('reports').select('*', { count: 'exact', head: true }).eq('report_status', 'ready');
    const { count: expired } = await supabase.from('reports').select('*', { count: 'exact', head: true }).eq('report_status', 'expired');

    setStats({
      total: totalSessions || 0,
      published: published || 0,
      ready: ready || 0,
      expired: expired || 0,
    });

    const { data: sessions } = await supabase
      .from('sessions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (sessions) setRecentSessions(sessions);
  };

  return (
    <div id="dashboard" className="admin-page-content">
      <div className="top">
        <div>
          <div className="kicker">Admin Dashboard</div>
          <h1>알액션 QR 슈팅 리포트 관리</h1>
        </div>
        <div className="actions">
          <Link href="/admin/sessions" className="btn">리포트 목록</Link>
          <Link href="/admin/sessions/new" className="btn primary">+ 새 경기 세션</Link>
        </div>
      </div>
      
      <div className="stats">
        <Link href="/admin/sessions" className="stat" style={{textDecoration: 'none'}}><small>전체 세션</small><b>{stats.total}</b><span>총 생성된 경기 세션</span></Link>
        <Link href="/admin/reports" className="stat" style={{textDecoration: 'none'}}><small>공개 리포트</small><b>{stats.published}</b><span>QR 열람 가능</span></Link>
        <Link href="/admin/reports" className="stat" style={{textDecoration: 'none'}}><small>준비 중</small><b>{stats.ready}</b><span>데이터 입력 대기</span></Link>
      </div>
      
      <div className="content">
        <div className="card">
          <div className="card-head">
            <div>
              <h3>최근 경기 세션</h3>
              <p>세션별 참여자와 리포트 상태를 확인합니다.</p>
            </div>
            <Link href="/admin/sessions" className="btn">전체 보기</Link>
          </div>
          <div className="card-body">
            <table>
              <thead>
                <tr>
                  <th>세션명</th>
                  <th>일자</th>
                  <th>유형</th>
                  <th>상태</th>
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                {recentSessions.map(session => (
                  <tr key={session.id}>
                    <td>{session.title}</td>
                    <td>{session.play_date}</td>
                    <td>{session.program_type}</td>
                    <td>
                      <span className={`status ${
                        session.status === 'published' ? 'public' :
                        session.status === 'ready' ? 'pending' :
                        session.status === 'expired' ? 'expired' : 'private'
                      }`}>
                        {session.status === 'published' ? '공개' : 
                         session.status === 'ready' ? '준비 중' : 
                         session.status === 'expired' ? '만료' : '비공개'}
                      </span>
                    </td>
                    <td>
                      <Link href={`/admin/sessions/${session.id}`} className="btn">관리</Link>
                    </td>
                  </tr>
                ))}
                {recentSessions.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{textAlign: 'center', color: 'var(--admin-muted)'}}>최근 경기 세션이 없습니다.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        

      </div>
    </div>
  );
}
