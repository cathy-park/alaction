'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import './admin.css'; // Import the specific admin styles

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session && pathname !== '/admin/login') {
        router.push('/admin/login');
      } else {
        setLoading(false);
      }
    };
    checkUser();

    const authListener = supabase.auth.onAuthStateChange((event: any, session: any) => {
      if (!session && pathname !== '/admin/login') {
        router.push('/admin/login');
      }
    });

    return () => {
      try {
        authListener?.data?.subscription?.unsubscribe();
      } catch (_) {}
    };
  }, [pathname, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading && pathname !== '/admin/login') {
    return <div className="admin-wrapper"><div className="min-h-screen flex items-center justify-center text-[var(--admin-c)] font-bold">LOADING SYSTEM...</div></div>;
  }

  if (pathname === '/admin/login') {
    return <div className="admin-wrapper">{children}</div>;
  }

  return (
    <div className="admin-wrapper">
      <div className="app">
        <aside style={{ zIndex: 50, position: 'relative' }}>
          <div className="brand" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '6px', marginBottom: '40px' }}>
            <img src="/logo.png" alt="ALACTION" style={{ width: '90px', height: 'auto', objectFit: 'contain' }} />
            <span style={{ color: 'var(--admin-muted)', fontSize: '11px', fontWeight: 800, paddingLeft: '4px' }}>QR Report Admin</span>
          </div>
          
          <div className="nav-title">관리 메뉴</div>
          <nav className="nav" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Link href="/admin" className={pathname === '/admin' ? 'active' : ''} style={{ display: 'flex', alignItems: 'center', height: '46px', padding: '0 13px', zIndex: 60, position: 'relative' }}>대시보드</Link>
            <Link href="/admin/sessions/new" className={pathname === '/admin/sessions/new' ? 'active' : ''} style={{ display: 'flex', alignItems: 'center', height: '46px', padding: '0 13px', zIndex: 60, position: 'relative' }}>세션 생성</Link>
            <Link href="/admin/sessions" className={pathname === '/admin/sessions' ? 'active' : ''} style={{ display: 'flex', alignItems: 'center', height: '46px', padding: '0 13px', zIndex: 60, position: 'relative' }}>세션 목록</Link>
            <button onClick={handleLogout} className="text-left bg-transparent border-0 text-[#ff9aa9] font-bold text-sm hover:text-[#ff5f7a] cursor-pointer" style={{padding: '0 13px', height: '46px', display: 'flex', alignItems: 'center', zIndex: 60, position: 'relative', marginTop: '16px'}}>로그아웃</button>
          </nav>

          <div className="help">
            <b>1차 MVP 범위</b>
            <p>수동 입력 기반으로 랭킹, 점수, 발사 수, 맞힌 수, 맞은 수, 정확도만 관리합니다.</p>
            <Link href="/admin/sessions" className="btn cyan" style={{display: 'inline-flex', width: '100%'}}>세션 목록 가기</Link>
          </div>
        </aside>

        <main>
          {children}
        </main>
      </div>
    </div>
  );
}
