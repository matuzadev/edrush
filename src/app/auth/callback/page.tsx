'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function AuthCallback() {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      // Register referral from localStorage (set during signup with ?ref= param)
      const ref = localStorage.getItem('ff_ref');
      if (ref) {
        fetch('/api/referral/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ referralCode: ref }),
        }).then(() => localStorage.removeItem('ff_ref')).catch(() => {});
      }
      router.push('/dashboard');
    } else if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-400">Confirmando sua conta...</p>
      </div>
    </div>
  );
}
