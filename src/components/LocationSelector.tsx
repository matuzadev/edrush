'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/db';

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

  // Carregar UFs
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

  // Carregar cidades quando UF mudar
  useEffect(() => {
    if (selectedUf) {
      const loadCidades = async () => {
        try {
          const response = await fetch(`/api/cidades?ufId=${selectedUf}`);
          const data = await response.json();
          setCidades(data);
          setSelectedCidade(null); // Reset cidade quando mudar UF
        } catch (error) {
          console.error('Erro ao carregar cidades:', error);
        }
      };

      loadCidades();
    } else {
      setCidades([]);
    }
  }, [selectedUf]);

  const handleUfChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const ufId = e.target.value ? parseInt(e.target.value) : null;
    setSelectedUf(ufId);
    onLocationChange?.(ufId, null);
  };

  const handleCidadeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cidadeId = e.target.value ? parseInt(e.target.value) : null;
    setSelectedCidade(cidadeId);
    onLocationChange?.(selectedUf, cidadeId);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Estado/UF</label>
        <select
          value={selectedUf || ''}
          onChange={handleUfChange}
          disabled={loading}
          className="w-full px-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="">Selecione um estado</option>
          {ufs.map((uf) => (
            <option key={uf.id} value={uf.id}>
              {uf.nome} ({uf.sigla})
            </option>
          ))}
        </select>
      </div>

      {selectedUf && (
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Cidade</label>
          <select
            value={selectedCidade || ''}
            onChange={handleCidadeChange}
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Selecione uma cidade</option>
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
