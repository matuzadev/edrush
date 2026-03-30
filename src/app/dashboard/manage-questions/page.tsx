"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ManageQuestionsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the new questions SPA
    router.replace('/questions');
  }, [router]);

  return null;
}