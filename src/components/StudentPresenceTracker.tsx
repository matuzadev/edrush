'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const HEARTBEAT_INTERVAL_MS = 60 * 1000;

export function StudentPresenceTracker() {
  const { user, isLoading } = useAuth();
  const userId = user?.id;

  useEffect(() => {
    if (isLoading || !userId) return;

    let active = true;

    const sendHeartbeat = async () => {
      if (document.visibilityState !== 'visible') return;

      try {
        const response = await fetch('/api/presence', {
          method: 'POST',
          cache: 'no-store',
        });

        if (active && !response.ok && response.status !== 401) {
          console.error('Falha ao atualizar presença:', response.status);
        }
      } catch (error) {
        if (active) console.error('Falha ao atualizar presença:', error);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') void sendHeartbeat();
    };

    void sendHeartbeat();
    const intervalId = window.setInterval(sendHeartbeat, HEARTBEAT_INTERVAL_MS);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      active = false;
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isLoading, userId]);

  return null;
}
