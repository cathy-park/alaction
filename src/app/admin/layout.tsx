'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

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

  if (loading) return <div className="min-h-screen bg-[#04040a] text-white flex items-center justify-center">Loading...</div>;

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#04040a] text-[#F0ECFF] font-['Noto_Sans_KR']">
      <nav className="bg-[rgba(255,255,255,0.03)] border-b border-[rgba(255,255,255,0.1)] px-6 py-4 flex justify-between items-center">
        <Link href="/admin" className="font-['Orbitron'] font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-[#FF2A9D] to-[#20C6FF]">
          ALACTION ADMIN
        </Link>
        <div className="flex gap-4">
          <Link href="/admin/sessions" className="text-[#BFBBCF] hover:text-white transition-colors">세션 관리</Link>
          <button 
            onClick={() => supabase.auth.signOut()}
            className="text-[#BFBBCF] hover:text-[#FF2A9D] transition-colors"
          >
            로그아웃
          </button>
        </div>
      </nav>
      <main className="p-6 max-w-6xl mx-auto">
        {children}
      </main>
    </div>
  );
}
