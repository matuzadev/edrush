'use client';

import { useState, useEffect } from 'react';

interface UF {
  id: number;
  sigla: string;
  nome: string;
}

interface Cidade {
  id: number;
  nome: string;
  uf_id: number;
}

export function LocationSelector({
  onLocationChange,
  initialUfId,
  initialCidadeId,
}: {
  onLocationChange?: (ufId: number | null, cidadeId: number | null) => void;
  initialUfId?: number;
  initialCidadeId?: number;
}) {
  const [ufs, setUfs] = useState<UF[]>([]);
  const [cidades, setCidades] = useState<Cidade[]>([]);
  const [selectedUf, setSelectedUf] = useState<number | null>(initialUfId || null);
  const [selectedCidade, setSelectedCidade] = useState<number | null>(initialCidadeId || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUFs = async () => {
      try {
        const response = await fetch('/api/ufs');
        const data = await response.json();
        setUfs(data);
      } catch (error) {
        console.error('Erro ao carregar UFs:', error);
      } finally {
        setLoading(false);
      }
    };
    loadUFs();
  }, []);

  useEffect(() => {
    if (!selectedUf) {
      setCidades([]);
      return;
    }
    const loadCidades = async () => {
      try {
        const response = await fetch(`/api/cidades?ufId=${selectedUf}`);
        const data = await response.json();
        setCidades(data);
        setSelectedCidade(null);
      } catch (error) {
        console.error('Erro ao carregar cidades:', error);
      }
    };
    loadCidades();
  }, [selectedUf]);

  const handleUfChange = (ufId: number | null) => {
    setSelectedUf(ufId);
    setSelectedCidade(null);
    onLocationChange?.(ufId, null);
  };

  const handleCidadeChange = (cidadeId: number | null) => {
    setSelectedCidade(cidadeId);
    onLocationChange?.(selectedUf, cidadeId);
  };

  if (loading) {
    return <div className="text-slate-400 text-sm">Carregando localidades...</div>;
  }

  return (
    <div className="flex flex-col gap-3">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Estado</label>
        <select
          value={selectedUf ?? ''}
          onChange={(e) => handleUfChange(e.target.value ? Number(e.target.value) : null)}
          className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="">Selecione o estado</option>
          {ufs.map((uf) => (
            <option key={uf.id} value={uf.id}>
              {uf.sigla} — {uf.nome}
            </option>
          ))}
        </select>
      </div>

      {selectedUf && (
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Cidade</label>
          <select
            value={selectedCidade ?? ''}
            onChange={(e) => handleCidadeChange(e.target.value ? Number(e.target.value) : null)}
            className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Selecione a cidade</option>
            {cidades.map((cidade) => (
              <option key={cidade.id} value={cidade.id}>
                {cidade.nome}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
