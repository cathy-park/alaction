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
      } catch (_) { }
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
          <div className="brand" style={{ marginBottom: '40px' }}>
            <img src="/logo.png" alt="Logo" style={{ width: '34px', height: '34px', objectFit: 'contain' }} />
            <div>
              <b>R,ACTION</b>
              <span>QR Report Admin</span>
            </div>
          </div>

          <div className="nav-title">관리 메뉴</div>
          <nav className="admin-nav">
            <Link href="/admin" className={pathname === '/admin' ? 'active' : ''}>대시보드</Link>
            <Link href="/admin/sessions/new" className={pathname === '/admin/sessions/new' ? 'active' : ''}>세션 생성</Link>
            <Link href="/admin/sessions" className={pathname === '/admin/sessions' ? 'active' : ''}>세션 목록</Link>
            <Link href="/admin/reports" className={pathname === '/admin/reports' ? 'active' : ''}>리포트 통합 관리</Link>
            <button onClick={handleLogout} className="text-left bg-transparent border-0 text-[#ff9aa9] font-bold text-sm hover:text-[#ff5f7a] cursor-pointer" style={{ padding: '0 13px', height: '46px', display: 'flex', alignItems: 'center', marginTop: '16px' }}>로그아웃</button>
          </nav>
        </aside>

        <main>
          {children}
        </main>
      </div>
    </div>
  );
}
