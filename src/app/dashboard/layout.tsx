import { SubscriptionGuard } from '@/components/SubscriptionGuard';
import { DashboardShell } from '@/components/DashboardShell';

export const metadata = {
  title: 'Dashboard - EdRush',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SubscriptionGuard>
      <DashboardShell>{children}</DashboardShell>
    </SubscriptionGuard>
  );
}
