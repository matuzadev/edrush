'use client';

import dynamic from 'next/dynamic';

const FriendsChat = dynamic(
  () => import('@/components/FriendsChat').then((m) => m.FriendsChat),
  { ssr: false }
);

export default function FriendsChatLoader() {
  return <FriendsChat />;
}
