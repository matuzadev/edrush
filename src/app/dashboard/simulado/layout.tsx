import { AuthGuard } from '@/components/AuthGuard';

export default function SimuladoLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}