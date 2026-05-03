'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface SubscriptionInfo {
  status: string;
  hasAccess: boolean;
  isTrial: boolean;
  isPaid: boolean;
  trialDaysRemaining: number;
  expiresAt: string | null;
  isAdmin?: boolean;
}

export function SubscriptionGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.push('/auth/login');
      return;
    }

    fetch('/api/user/subscription')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) setSubscription(data);
        else setSubscription({ status: 'free', hasAccess: false, isTrial: false, isPaid: false, trialDaysRemaining: 0, expiresAt: null });
      })
      .catch(() => {
        setSubscription({ status: 'free', hasAccess: false, isTrial: false, isPaid: false, trialDaysRemaining: 0, expiresAt: null });
      })
      .finally(() => setHasChecked(true));
  }, [user, isLoading, router]);

  // Redirect to paywall if no access
  useEffect(() => {
    if (hasChecked && subscription && !subscription.hasAccess) {
      router.push('/assinar');
    }
  }, [hasChecked, subscription, router]);

  if (isLoading || !hasChecked || (hasChecked && subscription && !subscription.hasAccess)) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
