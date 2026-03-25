import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Subscription {
  id: number;
  user_id: string;
  plan_id: string;
  status: string;
  expiry_date: string;
  active: boolean;
}

export function useSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const fetchSubscription = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
          throw fetchError;
        }

        if (data) {
          setSubscription(data);

          // Verificar se a assinação ainda está ativa
          const expiryDate = new Date(data.expiry_date);
          const today = new Date();
          const isSubscriptionActive = expiryDate > today && data.active;

          setIsActive(isSubscriptionActive);

          // Calcular dias restantes
          if (isSubscriptionActive) {
            const daysLeft = Math.ceil(
              (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
            );
            setDaysRemaining(Math.max(0, daysLeft));
          }
        } else {
          setIsActive(false);
          setDaysRemaining(0);
        }
      } catch (err: any) {
        console.error('Erro ao buscar assinação:', err);
        setError(err.message);
        setIsActive(false);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();

    // Configurar polling a cada 5 minutos para verificar expiração
    const interval = setInterval(fetchSubscription, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user?.id]);

  return {
    subscription,
    isActive,
    daysRemaining,
    loading,
    error,
  };
}
