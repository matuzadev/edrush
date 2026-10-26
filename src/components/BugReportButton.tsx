'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Bug } from 'lucide-react';

const BugReportDialog = dynamic(
  () => import('@/components/BugReportDialog').then((module) => module.BugReportDialog),
  { ssr: false }
);

export function BugReportButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Reportar um bug"
          title="Reportar um bug"
          className="group relative flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg transition-colors hover:bg-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2"
        >
          <Bug className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      {isOpen && <BugReportDialog onClose={() => setIsOpen(false)} />}
    </>
  );
}
