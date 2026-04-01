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