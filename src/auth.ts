import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db, initializeDatabase } from '@/lib/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

// Inicializar banco ao carregar
initializeDatabase();

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email e senha são obrigatórios');
        }

        const result = await db.query.users.findFirst({
          where: eq(users.email, credentials.email as string),
        });

        if (!result) {
          throw new Error('Usuário não encontrado');
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          result.senha_hash || ''
        );

        if (!isPasswordValid) {
          throw new Error('Senha incorreta');
        }

        return {
          id: result.id,
          email: result.email,
          name: result.nome,
          image: result.foto_url,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' && profile) {
        try {
          const existingUser = await db.query.users.findFirst({
            where: eq(users.email, user.email || ''),
          });

          if (!existingUser) {
            const now = new Date().toISOString();
            await db.insert(users).values({
              id: crypto.randomUUID(),
              email: user.email || '',
              nome: user.name || '',
              foto_url: user.image || '',
              provider: 'google',
              provider_id: user.id,
              subscription_status: 'free',
              criado_em: now,
              atualizado_em: now,
            });
          }
        } catch (error) {
          console.error('Erro ao criar usuário Google:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account, trigger }) {
      if (user) {
        token.id = user.id;
        // Carregar dados de onboarding do banco na primeira autenticação
        const dbUser = await db.query.users.findFirst({
          where: eq(users.id, user.id as string),
        });
        token.onboardingCompleted = (dbUser?.onboarding_completed ?? 0) === 1;
        token.concursoSlug = dbUser?.selected_concurso_slug ?? null;
      }
      if (account) {
        token.provider = account.provider;
      }
      // Atualizar token quando session.update() for chamado (pós-onboarding)
      if (trigger === 'update') {
        const dbUser = await db.query.users.findFirst({
          where: eq(users.id, token.id as string),
        });
        token.onboardingCompleted = (dbUser?.onboarding_completed ?? 0) === 1;
        token.concursoSlug = dbUser?.selected_concurso_slug ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).onboardingCompleted = token.onboardingCompleted as boolean;
        (session.user as any).concursoSlug = token.concursoSlug as string | null;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
};

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
