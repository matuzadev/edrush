import { useEffect, useState } from 'react';

interface SubscriptionInfo {
  status: string;
  hasAccess: boolean;
  isPaid: boolean;
  isTrial: boolean;
  trialDaysRemaining: number;
  expiresAt: string | null;
  isAdmin?: boolean;
}

// Cache de módulo: vários componentes que chamam useSubscription compartilham
// o mesmo fetch ao invés de cada um disparar um GET /api/user/subscription.
const SUB_TTL_MS = 60_000;
let _subCache: { data: SubscriptionInfo | null; at: number } | null = null;
let _subInFlight: Promise<SubscriptionInfo | null> | null = null;

async function loadSubscription(): Promise<SubscriptionInfo | null> {
  const now = Date.now();
  if (_subCache && now - _subCache.at < SUB_TTL_MS) return _subCache.data;
  if (_subInFlight) return _subInFlight;
  _subInFlight = (async () => {
    try {
      const res = await fetch('/api/user/subscription');
      const data = res.ok ? ((await res.json()) as SubscriptionInfo) : null;
      _subCache = { data, at: Date.now() };
      return data;
    } finally {
      _subInFlight = null;
    }
  })();
  return _subInFlight;
}

export function useSubscription() {
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(
    () => _subCache?.data ?? null
  );
  const [isActive, setIsActive] = useState(() => !!_subCache?.data?.hasAccess);
  const [loading, setLoading] = useState(() => !_subCache);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadSubscription()
      .then((data) => {
        if (cancelled) return;
        setSubscription(data);
        setIsActive(!!data?.hasAccess);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message);
        setIsActive(false);
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  // daysRemaining kept for backwards compatibility — always 0 (no more free trial)
  return { subscription, isActive, daysRemaining: 0, loading, error };
}
