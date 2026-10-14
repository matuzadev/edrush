import { SubscriptionGuard } from '@/components/SubscriptionGuard';

export default function SimuladoLayout({ children }: { children: React.ReactNode }) {
  return <SubscriptionGuard premiumOnly>{children}</SubscriptionGuard>;
}