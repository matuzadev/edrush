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

export function useSubscription() {
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/user/subscription')
      .then(res => res.ok ? res.json() : null)
      .then((data: SubscriptionInfo | null) => {
        if (data) {
          setSubscription(data);
          setIsActive(data.hasAccess);
        } else {
          setIsActive(false);
        }
      })
      .catch(err => {
        setError(err.message);
        setIsActive(false);
      })
      .finally(() => setLoading(false));
  }, []);

  // daysRemaining kept for backwards compatibility — always 0 (no more free trial)
  return { subscription, isActive, daysRemaining: 0, loading, error };
}
