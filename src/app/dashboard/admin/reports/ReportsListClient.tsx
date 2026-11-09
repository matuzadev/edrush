'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminReportCard, type AdminReport } from '@/components/admin/AdminReportCard';

interface Props {
  initialReports: AdminReport[];
  status: string;
}

/**
 * Wrapper client-side: mantém uma cópia local da lista de reports para
 * remoção otimista após uma ação. Faz `router.refresh()` para revalidar
 * o contador de pendentes do server component pai.
 */
export function ReportsListClient({ initialReports, status }: Props) {
  const router = useRouter();
  const [reports, setReports] = useState<AdminReport[]>(initialReports);

  function handleActionComplete(reportId: string) {
    // Remove da lista local — em qualquer aba (pending/resolved/dismissed)
    // o item desaparece após a ação.
    setReports((prev) => prev.filter((r) => r.id !== reportId));
    // Revalida server component para atualizar contador de pendentes.
    router.refresh();
  }

  if (reports.length === 0) {
    return (
      <div
        className="text-center py-20 rounded-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(15,23,42,0.85), rgba(15,23,42,0.40))',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <p className="text-base font-black text-white">
          Nenhuma denúncia {status === 'pending' ? 'pendente' : status === 'resolved' ? 'resolvida' : 'dispensada'} no momento.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reports.map((report) => (
        <AdminReportCard
          key={report.id}
          report={report}
          onActionComplete={handleActionComplete}
        />
      ))}
    </div>
  );
}
