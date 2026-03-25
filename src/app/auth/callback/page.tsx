'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // O Supabase trata automaticamente o código de confirmação
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          router.push('/dashboard');
        } else {
          router.push('/auth/login');
        }
      } catch (error) {
        console.error('Erro no callback:', error);
        router.push('/auth/login');
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-400">Confirmando sua conta...</p>
      </div>
    </div>
  );
}
