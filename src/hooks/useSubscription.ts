import { useEffect, useState } from 'react';

interface SubscriptionInfo {
  status: string;
  hasAccess: boolean;
  isTrial: boolean;
  isPaid: boolean;
  trialDaysRemaining: number;
  expiresAt: string | null;
}

export function useSubscription() {
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/user/subscription')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: SubscriptionInfo | null) => {
        if (data) {
          setSubscription(data);
          setIsActive(data.hasAccess);
          setDaysRemaining(data.trialDaysRemaining ?? 0);
        } else {
          setIsActive(false);
        }
      })
      .catch((err) => {
        console.error('Erro ao buscar assinatura:', err);
        setError(err.message);
        setIsActive(false);
      })
      .finally(() => setLoading(false));
  }, []);

  return {
    subscription,
    isActive,
    daysRemaining,
    loading,
    error,
  };
}
