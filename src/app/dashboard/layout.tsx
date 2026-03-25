import { SubscriptionGuard } from '@/components/SubscriptionGuard';

export const metadata = {
  title: 'Dashboard - Foco Federal',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SubscriptionGuard>{children}</SubscriptionGuard>;
}
