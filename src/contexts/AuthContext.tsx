'use client';

import { createContext, useContext } from 'react';
import { useSession, signOut as nextAuthSignOut, SessionProvider } from 'next-auth/react';

interface AuthUser {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  const user = session?.user
    ? {
        id: (session.user as any).id as string,
        email: session.user.email as string,
        name: session.user.name,
        image: session.user.image,
      }
    : null;

  const signOut = async () => {
    await nextAuthSignOut({ callbackUrl: '/auth/login' });
  };

  return (
    <AuthContext.Provider value={{ user, isLoading: status === 'loading', signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthContextProvider>{children}</AuthContextProvider>
    </SessionProvider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}
