'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

// Icons
const IconDashboard = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>;
const IconSessions = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>;
const IconLogout = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>;

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
    return <div className="min-h-screen bg-[#04040a] flex items-center justify-center text-[#FF2A9D] font-['Orbitron'] text-xl font-bold animate-pulse">LOADING SYSTEM...</div>;
  }

  if (pathname === '/admin/login') {
    return <div className="min-h-screen bg-[#04040a] text-white font-['Noto_Sans_KR']">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-[#04040a] text-[#F0ECFF] font-['Noto_Sans_KR'] flex">
      {/* Background ambient light */}
      <div className="fixed inset-0 pointer-events-none opacity-20" style={{ background: 'radial-gradient(circle at 0% 0%, var(--pink), transparent 40%), radial-gradient(circle at 100% 100%, var(--purple), transparent 40%)' }} />

      {/* Sidebar */}
      <div className="relative w-64 bg-[rgba(255,255,255,0.02)] backdrop-blur-xl border-r border-[rgba(255,255,255,0.05)] p-6 flex flex-col z-10 shadow-[4px_0_24px_rgba(0,0,0,0.5)]">
        <div className="mb-10">
          <Link href="/admin" className="font-['Orbitron'] font-black text-2xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#FF2A9D] to-[#20C6FF]">
            ALACTION
          </Link>
          <div className="text-[10px] text-[#60597A] font-['Rajdhani'] uppercase tracking-widest mt-1">Admin Console</div>
        </div>

        <nav className="space-y-2 flex-1">
          <Link 
            href="/admin" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${pathname === '/admin' ? 'bg-[rgba(255,42,157,0.15)] text-[#FF2A9D] border border-[rgba(255,42,157,0.3)] shadow-[0_0_15px_rgba(255,42,157,0.2)]' : 'text-[#BFBBCF] hover:bg-[rgba(255,255,255,0.05)] hover:text-white'}`}
          >
            <IconDashboard />
            <span className="font-bold text-sm">Dashboard</span>
          </Link>
          
          <Link 
            href="/admin/sessions" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${pathname.startsWith('/admin/sessions') ? 'bg-[rgba(32,198,255,0.15)] text-[#20C6FF] border border-[rgba(32,198,255,0.3)] shadow-[0_0_15px_rgba(32,198,255,0.2)]' : 'text-[#BFBBCF] hover:bg-[rgba(255,255,255,0.05)] hover:text-white'}`}
          >
            <IconSessions />
            <span className="font-bold text-sm">Sessions</span>
          </Link>
        </nav>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#60597A] hover:bg-[rgba(255,0,0,0.1)] hover:text-[#ff4444] transition-all duration-300 mt-auto"
        >
          <IconLogout />
          <span className="font-bold text-sm">Logout</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10 h-screen overflow-y-auto relative z-10 custom-scrollbar">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,42,157,0.5); }
      `}} />
    </div>
  );
}
