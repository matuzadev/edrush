'use client';

// Botão CTA "Entrar / Sair" do grupo. Vive na página individual do grupo.
// - Owner: não pode sair (renderiza badge "Dono").
// - Não autenticado: redireciona pro login.
// - Privado e não-membro: mostra "Solicitar entrada" e exibe toast informativo
//   ("Convite necessário" — fluxo aprovação fica pra v2).
// - Otimista: muda label imediatamente, com rollback em erro.

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2, Check, LogOut, UserPlus, Crown, Lock } from 'lucide-react';
import type { GroupRole } from '@/lib/study-groups';

interface Props {
  slug: string;
  initialIsMember: boolean;
  initialRole: GroupRole | null;
  isOwner: boolean;
  isPrivate: boolean;
  authenticated: boolean;
  accentBase: string;
  accentGlow: string;
}

export function GroupMembershipButton({
  slug,
  initialIsMember,
  initialRole,
  isOwner,
  isPrivate,
  authenticated,
  accentBase,
  accentGlow,
}: Props) {
  const router = useRouter();
  const [isMember, setIsMember] = useState(initialIsMember);
  const [role, setRole] = useState<GroupRole | null>(initialRole);
  const [loading, setLoading] = useState(false);
  const [pendingMsg, setPendingMsg] = useState<string | null>(null);

  // Owner não pode sair — exibe badge fixo.
  if (isOwner) {
    return (
      <span
        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-black"
        style={{
          background: 'rgba(245,158,11,0.12)',
          border: '1px solid rgba(245,158,11,0.4)',
          color: '#fbbf24',
        }}
      >
        <Crown className="w-4 h-4" />
        Dono
      </span>
    );
  }

  async function toggle() {
    if (loading) return;

    if (!authenticated) {
      router.push('/auth/login');
      return;
    }

    setLoading(true);
    setPendingMsg(null);
    const previous = { isMember, role };
    // Otimismo
    if (isMember) {
      setIsMember(false);
      setRole(null);
    } else if (!isPrivate) {
      setIsMember(true);
      setRole('member');
    }

    try {
      const res = await fetch(`/api/groups/${encodeURIComponent(slug)}/membership`, {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        setIsMember(previous.isMember);
        setRole(previous.role);
        setPendingMsg(data?.error ?? 'Erro');
        return;
      }
      if (data.status === 'pending') {
        // privado → mantém estado como não-membro mas mostra mensagem
        setIsMember(false);
        setRole(null);
        setPendingMsg('Solicitação enviada. Aguarde aprovação do dono.');
      } else if (data.status === 'joined') {
        setIsMember(true);
        setRole('member');
        // Refresh do server component pra atualizar contagem na sidebar.
        router.refresh();
      } else if (data.status === 'left') {
        setIsMember(false);
        setRole(null);
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setIsMember(previous.isMember);
      setRole(previous.role);
      setPendingMsg('Erro de rede');
    } finally {
      setLoading(false);
    }
  }

  // Estilos dos 3 estados visuais
  const baseStyle = {
    boxShadow: `0 0 20px ${accentGlow}`,
  } as const;

  return (
    <div className="flex flex-col items-stretch sm:items-end gap-2">
      <button
        onClick={toggle}
        disabled={loading}
        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        style={
          isMember
            ? {
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#cbd5e1',
              }
            : {
                ...baseStyle,
                background: `linear-gradient(135deg, ${accentBase}, ${accentBase}cc)`,
                color: '#020617',
              }
        }
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isMember ? (
          <>
            <LogOut className="w-4 h-4" />
            Sair do grupo
          </>
        ) : isPrivate ? (
          <>
            <Lock className="w-4 h-4" />
            Solicitar entrada
          </>
        ) : (
          <>
            <UserPlus className="w-4 h-4" />
            Entrar no grupo
          </>
        )}
      </button>

      {isMember && role === 'member' && !loading && (
        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 justify-end">
          <Check className="w-3 h-3" />
          Você é membro
        </span>
      )}
      {pendingMsg && (
        <span className="text-[11px] text-amber-400 max-w-[200px] text-right leading-snug">
          {pendingMsg}
        </span>
      )}
    </div>
  );
}
