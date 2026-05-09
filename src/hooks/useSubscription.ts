import { useEffect, useState } from 'react';

interface SubscriptionInfo {
  status: string;
  hasAccess: boolean;
<<<<<<< HEAD
  isTrial: boolean;
  isPaid: boolean;
  trialDaysRemaining: number;
  expiresAt: string | null;
=======
  isPaid: boolean;
  isTrial: boolean;
  trialDaysRemaining: number;
  expiresAt: string | null;
  isAdmin?: boolean;
>>>>>>> c0f05f4d6084f1210efa389d9dad642f1327a8d9
}

export function useSubscription() {
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/user/subscription')
<<<<<<< HEAD
      .then((res) => (res.ok ? res.json() : null))
=======
      .then(res => res.ok ? res.json() : null)
>>>>>>> c0f05f4d6084f1210efa389d9dad642f1327a8d9
      .then((data: SubscriptionInfo | null) => {
        if (data) {
          setSubscription(data);
          setIsActive(data.hasAccess);
<<<<<<< HEAD
          setDaysRemaining(data.trialDaysRemaining ?? 0);
=======
>>>>>>> c0f05f4d6084f1210efa389d9dad642f1327a8d9
        } else {
          setIsActive(false);
        }
      })
<<<<<<< HEAD
      .catch((err) => {
        console.error('Erro ao buscar assinatura:', err);
=======
      .catch(err => {
>>>>>>> c0f05f4d6084f1210efa389d9dad642f1327a8d9
        setError(err.message);
        setIsActive(false);
      })
      .finally(() => setLoading(false));
  }, []);

<<<<<<< HEAD
  return {
    subscription,
    isActive,
    daysRemaining,
    loading,
    error,
  };
=======
  // daysRemaining kept for backwards compatibility — always 0 (no more free trial)
  return { subscription, isActive, daysRemaining: 0, loading, error };
>>>>>>> c0f05f4d6084f1210efa389d9dad642f1327a8d9
}
