'use client';

import { Modal } from '@/components/ui/Modal';
import { BugReportForm } from '@/components/BugReportForm';

export function BugReportDialog({ onClose }: { onClose: () => void }) {
  return (
    <Modal isOpen onClose={onClose} title="Reportar um Bug" size="md">
      <BugReportForm onClose={onClose} />
    </Modal>
  );
}
