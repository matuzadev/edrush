'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';

const FriendsChat = dynamic(
  () => import('@/components/FriendsChat').then((m) => m.FriendsChat),
  { ssr: false }
);

export default function FriendsChatLoader() {
  const pathname = usePathname();

  if (!pathname?.startsWith('/dashboard') || pathname.startsWith('/dashboard/simulado')) {
    return null;
  }

  return <FriendsChat />;
}
