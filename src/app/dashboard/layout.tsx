import { SubscriptionGuard } from '@/components/SubscriptionGuard';
import { DashboardShell } from '@/components/DashboardShell';
import { FocoSentinela } from '@/components/FocoSentinela';

export const metadata = {
  title: 'Dashboard - Foco Federal',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SubscriptionGuard>
      <DashboardShell>{children}</DashboardShell>
      <FocoSentinela />
    </SubscriptionGuard>
  );
}
