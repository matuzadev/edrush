import NextAuth, { type NextAuthConfig } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db, initializeDatabase } from '@/lib/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

// Inicializar banco ao carregar
initializeDatabase();

const config = {
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

        try {
          // Buscar usuário no SQLite
          const result = await db.query.users.findFirst({
            where: eq(users.email, credentials.email as string),
            
          });

          if (!result) {
            throw new Error('Usuário não encontrado');
          }

          // Verificar senha com bcrypt
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
        } catch (error) {
          console.error('Erro ao autenticar:', error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' && profile) {
        try {
          // Verificar se usuário já existe
          const existingUser = await db.query.users.findFirst({
            where: eq(users.email, user.email || ''),
          });

          if (!existingUser) {
            // Criar novo usuário do Google
            const newUser = await db.insert(users).values({
              id: crypto.randomUUID(),
              email: user.email || '',
              nome: user.name || '',
              foto_url: user.image || '',
              provider: 'google',
              provider_id: user.id,
              subscription_status: 'free',
              criado_em: new Date().toISOString(),
              atualizado_em: new Date().toISOString(),
            });
          }
        } catch (error) {
          console.error('Erro ao criar usuário Google:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      if (account) {
        token.provider = account.provider;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
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
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);

// Função para hash de senha com bcrypt
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Função para verificar senha com bcrypt
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
