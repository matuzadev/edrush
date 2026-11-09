'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Check, ChevronLeft, Copy, Gift, Link2, Loader2, Share2, Users } from 'lucide-react';

interface ReferralData {
  code: string;
  referralUrl: string;
  total: number;
}

export default function ReferralPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [data, setData] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    fetch('/api/referral')
      .then(async (response) => {
        if (!response.ok) throw new Error('Não foi possível carregar seu convite.');
        const result = await response.json();
        setData(result);
      })
      .catch((error: unknown) => {
        console.error('Erro ao carregar convite:', error);
      })
      .finally(() => setLoading(false));
  }, [user]);

  const copyLink = useCallback(async () => {
    if (!data) return;
    await navigator.clipboard.writeText(data.referralUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }, [data]);

  const shareLink = useCallback(() => {
    if (!data) return;
    const message = encodeURIComponent(
      `Estude para concursos com o EdRush. Todos os recursos são gratuitos: ${data.referralUrl}`
    );
    window.open(`https://wa.me/?text=${message}`, '_blank');
  }, [data]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-400" size={36} />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#020617] px-4 py-8 text-white">
      <section className="mx-auto max-w-3xl rounded-3xl border border-emerald-500/20 bg-slate-900 p-6 sm:p-8">
        <Link href="/dashboard" className="mb-8 inline-flex items-center gap-2 text-slate-400 hover:text-white">
          <ChevronLeft size={18} /> Voltar ao painel
        </Link>
        <div className="mt-6 flex items-center gap-3">
          <Gift className="text-emerald-400" size={28} />
          <h1 className="text-2xl font-black">Convide amigos para o EdRush</h1>
        </div>
        <p className="mt-3 max-w-2xl text-slate-300">
          Compartilhe o convite e ajude outros concurseiros a estudar. A plataforma e todos os
          recursos de estudo são gratuitos para todos; não há assinatura nem recompensa ligada a pagamento.
        </p>

        {data && (
          <>
            <div className="mt-8 flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
              <Link2 className="shrink-0 text-slate-400" size={18} />
              <code className="min-w-0 flex-1 break-all text-sm text-emerald-300">{data.referralUrl}</code>
              <button
                onClick={copyLink}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 font-bold text-slate-950 hover:bg-emerald-400"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Copiado' : 'Copiar link'}
              </button>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-400">
              <span className="inline-flex items-center gap-2">
                <Users size={16} /> {data.total} pessoa(s) convidada(s)
              </span>
              <span>Código: <strong className="font-mono text-white">{data.code}</strong></span>
            </div>
            <button
              onClick={shareLink}
              className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 font-semibold text-slate-200 hover:bg-white/5"
            >
              <Share2 size={16} /> Compartilhar no WhatsApp
            </button>
          </>
        )}
      </section>
    </main>
  );
}
