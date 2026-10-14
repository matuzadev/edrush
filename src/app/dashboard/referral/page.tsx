'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import {
  Gift, Copy, Check, Share2, Users, Star, Trophy, ChevronLeft,
  Zap, Clock, CheckCircle2, XCircle, Loader2, WholeWord, MessageCircle,
  Link2, ArrowRight, Sparkles, Crown
} from 'lucide-react';

interface ReferralEntry {
  email: string;
  status: 'registered' | 'subscribed' | 'rewarded';
  date: string;
  rewardAt: string | null;
}

interface ReferralData {
  code: string;
  referralUrl: string;
  total: number;
  subscribed: number;
  rewarded: number;
  list: ReferralEntry[];
}

const STATUS_LABEL: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  registered: { label: 'Cadastrou', color: 'text-blue-400', icon: Users },
  subscribed: { label: 'Assinou', color: 'text-emerald-400', icon: CheckCircle2 },
  rewarded:   { label: 'Recompensado', color: 'text-yellow-400', icon: Trophy },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function ReferralPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [data, setData] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    fetch('/api/referral')
      .then(r => r.json())
      .then(d => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const copy = useCallback((text: string, which: 'code' | 'url') => {
    navigator.clipboard.writeText(text).then(() => {
      if (which === 'code') { setCopiedCode(true); setTimeout(() => setCopiedCode(false), 2000); }
      else { setCopiedUrl(true); setTimeout(() => setCopiedUrl(false), 2000); }
    });
  }, []);

  const shareWhatsApp = useCallback(() => {
    if (!data) return;
    const msg = encodeURIComponent(
      `🎯 Estou estudando para concursos no EdRush e recomendo muito!\n\nUse meu link de convite e se você assinar, ganho 1 mês grátis 🎁\n\n${data.referralUrl}`
    );
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  }, [data]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-400" size={36} />
      </div>
    );
  }

  if (!data) return null;

  const conversionRate = data.total > 0 ? Math.round((data.subscribed / data.total) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      {/* Header */}
      <div className="border-b border-white/5 bg-slate-900/40 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard" className="p-2 rounded-xl hover:bg-white/5 transition-colors">
            <ChevronLeft size={20} className="text-slate-400" />
          </Link>
          <div>
            <h1 className="text-lg font-black text-white">Programa de Indicação</h1>
            <p className="text-xs text-slate-500">Convide amigos e ganhe meses grátis</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">

        {/* Hero Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-900/40 via-slate-800/60 to-slate-900/80 border border-emerald-500/20 rounded-3xl p-8">
          {/* Decorative blobs */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
              <div>
                <div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 rounded-full px-3 py-1 mb-3">
                  <Gift size={14} className="text-emerald-400" />
                  <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">Ganhe 1 mês grátis</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
                  Indique e <span className="text-emerald-400">Ganhe</span>
                </h2>
                <p className="text-slate-300 mt-2 max-w-md">
                  Compartilhe seu link. Quando um amigo assinar pela primeira vez, você recebe automaticamente <strong className="text-white">30 dias gratuitos</strong> na plataforma.
                </p>
              </div>
              <div className="text-right">
                <div className="text-5xl font-black text-emerald-400">{data.rewarded}</div>
                <div className="text-slate-400 text-sm">mês{data.rewarded !== 1 ? 'es' : ''} ganho{data.rewarded !== 1 ? 's' : ''}</div>
              </div>
            </div>

            {/* Steps */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              {[
                { n: '1', label: 'Copie seu link', desc: 'Único e personalizado para você', icon: Link2, color: 'emerald' },
                { n: '2', label: 'Amigo se cadastra', desc: 'Ele usa seu link para criar conta', icon: Users, color: 'blue' },
                { n: '3', label: 'Amigo assina', desc: 'Na primeira assinatura, você ganha 1 mês', icon: Crown, color: 'yellow' },
              ].map(step => {
                const Icon = step.icon;
                const colors = {
                  emerald: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
                  blue:    'bg-blue-500/15 border-blue-500/30 text-blue-400',
                  yellow:  'bg-yellow-500/15 border-yellow-500/30 text-yellow-400',
                }[step.color as string] ?? '';
                return (
                  <div key={step.n} className="bg-white/[0.03] border border-white/8 rounded-2xl p-4 flex gap-3 items-start">
                    <div className={`w-8 h-8 rounded-xl border flex items-center justify-center flex-shrink-0 ${colors}`}>
                      <Icon size={15} />
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">{step.label}</p>
                      <p className="text-slate-500 text-xs">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Code + URL */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-5 py-3 flex-1 min-w-0">
                  <span className="text-slate-500 text-xs font-bold uppercase tracking-widest flex-shrink-0">Código</span>
                  <span className="font-mono font-black text-emerald-400 text-xl tracking-widest">{data.code}</span>
                </div>
                <button
                  onClick={() => copy(data.code, 'code')}
                  className="flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all"
                >
                  {copiedCode ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} className="text-slate-400" />}
                  <span className="text-sm font-semibold text-slate-300">{copiedCode ? 'Copiado!' : 'Copiar código'}</span>
                </button>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 flex-1 min-w-0 overflow-hidden">
                  <Link2 size={14} className="text-slate-500 flex-shrink-0" />
                  <span className="text-slate-400 text-sm font-mono truncate">{data.referralUrl}</span>
                </div>
                <button
                  onClick={() => copy(data.referralUrl, 'url')}
                  className="flex items-center gap-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-400 rounded-2xl transition-all font-bold text-white shadow-lg shadow-emerald-500/30"
                >
                  {copiedUrl ? <Check size={16} /> : <Copy size={16} />}
                  <span className="text-sm">{copiedUrl ? 'Copiado!' : 'Copiar link'}</span>
                </button>
              </div>
            </div>

            {/* Share buttons */}
            <div className="flex gap-3 mt-4 flex-wrap">
              <button
                onClick={shareWhatsApp}
                className="flex items-center gap-2 px-4 py-2.5 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 rounded-xl transition-all text-green-400 text-sm font-semibold"
              >
                <MessageCircle size={16} />
                Compartilhar no WhatsApp
              </button>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: 'EdRush — 1 mês grátis para você!', url: data.referralUrl });
                  } else {
                    copy(data.referralUrl, 'url');
                  }
                }}
                className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all text-slate-300 text-sm font-semibold"
              >
                <Share2 size={16} />
                Compartilhar
              </button>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Convidados', value: data.total, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
            { label: 'Assinaram', value: data.subscribed, icon: Zap, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
            { label: 'Meses ganhos', value: data.rewarded, icon: Gift, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
          ].map(stat => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className={`${stat.bg} border rounded-2xl p-5 text-center`}>
                <Icon size={20} className={`${stat.color} mx-auto mb-2`} />
                <div className={`text-3xl font-black ${stat.color}`}>{stat.value}</div>
                <div className="text-slate-500 text-xs mt-1">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Conversion rate */}
        {data.total > 0 && (
          <div className="bg-slate-800/40 border border-white/8 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-slate-300">Taxa de conversão</span>
              <span className="text-sm font-black text-emerald-400">{conversionRate}%</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-700"
                style={{ width: `${conversionRate}%` }}
              />
            </div>
            <p className="text-slate-500 text-xs mt-2">
              {data.subscribed} de {data.total} convidado{data.total !== 1 ? 's' : ''} assinou a plataforma
            </p>
          </div>
        )}

        {/* Invitee List */}
        <div className="bg-slate-800/40 border border-white/8 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/8 flex items-center justify-between">
            <h3 className="font-black text-white">Seus convidados</h3>
            <span className="text-slate-500 text-sm">{data.total} total</span>
          </div>

          {data.list.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="w-16 h-16 bg-white/[0.03] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users size={28} className="text-slate-600" />
              </div>
              <p className="text-slate-400 font-semibold">Nenhum convidado ainda</p>
              <p className="text-slate-600 text-sm mt-1">Compartilhe seu link e comece a ganhar meses grátis!</p>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {data.list.map((entry, i) => {
                const s = STATUS_LABEL[entry.status] ?? STATUS_LABEL.registered;
                const Icon = s.icon;
                return (
                  <div key={i} className="px-6 py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 bg-white/5 rounded-xl flex items-center justify-center flex-shrink-0 text-slate-400 font-bold text-sm">
                        {entry.email.slice(0, 1).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-white text-sm truncate">{entry.email}</p>
                        <p className="text-slate-500 text-xs">{formatDate(entry.date)}</p>
                      </div>
                    </div>
                    <div className={`flex items-center gap-1.5 flex-shrink-0 ${s.color}`}>
                      <Icon size={14} />
                      <span className="text-xs font-bold">{s.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-emerald-900/30 to-blue-900/20 border border-emerald-500/20 rounded-2xl p-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="font-black text-white text-lg">Não tem assinatura ativa?</p>
            <p className="text-slate-400 text-sm mt-0.5">Assine o EdRush e desbloqueie questões ilimitadas, simulados e análises.</p>
          </div>
          <Link
            href="/assinar"
            className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-black rounded-xl transition-all shadow-lg shadow-emerald-500/30"
          >
            <Sparkles size={16} />
            Assinar agora
            <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </div>
  );
}
