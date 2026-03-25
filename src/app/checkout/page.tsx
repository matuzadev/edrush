'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { PAGBANK_PLANS } from '@/lib/pagbank';
import { CheckCircle2, Copy, Loader } from 'lucide-react';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const planId = searchParams.get('plan') || 'starter';
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [pixData, setPixData] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const plan = PAGBANK_PLANS.find((p) => p.id === planId);

  useEffect(() => {
    if (!user) return;
    generatePix();
  }, [user, planId]);

  const generatePix = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/pagbank/pix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          userEmail: user?.email,
          userId: user?.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao gerar PIX');
      }

      setPixData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (pixData?.copyPaste) {
      navigator.clipboard.writeText(pixData.copyPaste);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617] px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Finalizar Compra
          </h1>
          <p className="text-slate-400">
            Escolha seu plano e complete o pagamento via PIX
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Plano Selecionado */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg border border-slate-700 p-6">
            <h2 className="text-xl font-bold text-white mb-4">Resumo do Pedido</h2>

            {plan && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-400">Plano</p>
                  <p className="text-lg font-semibold text-white">{plan.name}</p>
                </div>

                <div>
                  <p className="text-sm text-slate-400">Descrição</p>
                  <p className="text-white">{plan.description}</p>
                </div>

                <div className="border-t border-slate-700 pt-4">
                  <p className="text-sm text-slate-400 mb-2">Inclui:</p>
                  <ul className="space-y-2">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-slate-300">
                        <CheckCircle2 size={16} className="text-emerald-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-slate-700 pt-4">
                  <p className="text-sm text-slate-400">Valor Total</p>
                  <p className="text-3xl font-bold text-emerald-400">
                    R$ {plan.price.toFixed(2)}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {plan.daysAccess} dias de acesso
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Pagamento via PIX */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg border border-slate-700 p-6">
            <h2 className="text-xl font-bold text-white mb-4">Pagar com PIX</h2>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader className="animate-spin text-emerald-400 mb-4" size={32} />
                <p className="text-slate-400">Gerando código PIX...</p>
              </div>
            ) : error ? (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-300 text-sm">
                {error}
                <button
                  onClick={generatePix}
                  className="block mt-4 text-emerald-400 hover:text-emerald-300 font-semibold"
                >
                  Tentar novamente
                </button>
              </div>
            ) : pixData ? (
              <div className="space-y-4">
                {/* QR Code */}
                {pixData.qrCode && (
                  <div className="bg-white p-4 rounded-lg flex items-center justify-center">
                    <img
                      src={`data:image/png;base64,${pixData.qrCode}`}
                      alt="PIX QR Code"
                      className="w-48 h-48"
                    />
                  </div>
                )}

                {/* Copy Paste */}
                {pixData.copyPaste && (
                  <div>
                    <p className="text-sm text-slate-400 mb-2">Ou copie e cole este código:</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={pixData.copyPaste}
                        readOnly
                        className="flex-1 bg-slate-700 border border-slate-600 rounded px-3 py-2 text-slate-200 text-xs font-mono"
                      />
                      <button
                        onClick={copyToClipboard}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded transition flex items-center gap-2"
                      >
                        <Copy size={16} />
                        {copied ? 'Copiado!' : 'Copiar'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Instruções */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mt-6">
                  <p className="text-sm text-blue-300 mb-2">
                    <strong>Como pagar:</strong>
                  </p>
                  <ol className="text-xs text-blue-200 space-y-1">
                    <li>1. Abra seu app do banco ou Pagbank</li>
                    <li>2. Leia o QR Code ou copie o código PIX</li>
                    <li>3. Complete o pagamento</li>
                    <li>4. Seu acesso será ativado automaticamente</li>
                  </ol>
                </div>

                {/* Status */}
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="text-sm text-yellow-300">
                    ⏱️ Aguardando pagamento...
                  </p>
                  <p className="text-xs text-yellow-200 mt-1">
                    Este código expira em 30 minutos
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617] flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400">Carregando checkout...</p>
          </div>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
