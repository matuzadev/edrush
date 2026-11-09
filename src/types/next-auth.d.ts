import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface User {
    onboardingCompleted?: boolean;
    concursoSlug?: string | null;
  }

  interface Session {
    user: {
      id: string;
      provider?: string;
      googleEmailVerified?: boolean;
      onboardingCompleted?: boolean;
      concursoSlug?: string | null;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    provider?: string;
    googleEmailVerified?: boolean;
    onboardingCompleted?: boolean;
    concursoSlug?: string | null;
  }
}
