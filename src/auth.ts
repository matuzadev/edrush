import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { DUMMY_BCRYPT_HASH, maskEmail } from '@/lib/sanitize';

// Mensagem genérica para erros de autenticação. Não diferenciar
// "usuário não existe" vs "senha incorreta" evita enumeração de e-mails.
const AUTH_ERROR_GENERIC = 'E-mail ou senha inválidos';

function hasVerifiedGoogleEmail(profile: unknown): boolean {
  return (
    typeof profile === 'object' &&
    profile !== null &&
    'email_verified' in profile &&
    profile.email_verified === true
  );
}

// Failsafe: detecta NEXTAUTH_SECRET ausente/placeholder. Em vez de travar o
// build (que roda com NODE_ENV=production), trava apenas em RUNTIME — no
// primeiro request de auth, via callback abaixo.
function assertNextAuthSecretSafe(): void {
  if (process.env.NODE_ENV !== 'production') return;
  const s = process.env.NEXTAUTH_SECRET;
  if (!s || s === 'gere-com-openssl-rand-base64-32' || s.length < 32) {
    throw new Error(
      'NEXTAUTH_SECRET ausente ou com valor placeholder. ' +
        'Gere com: openssl rand -base64 32',
    );
  }
}

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
        assertNextAuthSecretSafe();
        if (!credentials?.email || !credentials?.password) {
          console.error('❌ [AUTH] Credenciais vazias');
          throw new Error(AUTH_ERROR_GENERIC);
        }

        const email = (credentials.email as string).toLowerCase().trim();
        const password = credentials.password as string;

        console.log(`🔐 [AUTH] Tentando login com email: ${email}`);

        const result = await db.query.users.findFirst({
          where: eq(users.email, email),
        });

        console.log(`📊 [AUTH] Usuário encontrado: ${!!result} (${result?.email || 'N/A'})`);
        if (result) {
          console.log(`   ID: ${result.id}`);
          console.log(`   Nome: ${result.nome}`);
          console.log(`   Tem senha_hash: ${!!result.senha_hash}`);
        }

        // Sempre roda bcrypt.compare — mesmo quando usuário não existe — contra
        // um hash dummy. Isso elimina o oracle de tempo entre "não existe" e
        // "senha errada", e a mensagem de erro é a mesma nos dois casos.
        const hashToCheck = result?.senha_hash || DUMMY_BCRYPT_HASH;
        console.log(`🔑 [AUTH] Verificando senha com bcrypt...`);
        const isPasswordValid = await bcrypt.compare(password, hashToCheck);
        console.log(`✓ [AUTH] Senha válida: ${isPasswordValid}`);

        if (!result) {
          console.error('❌ [AUTH] FALHA: Usuário não encontrado');
          throw new Error(AUTH_ERROR_GENERIC);
        }

        if (!isPasswordValid) {
          console.error('❌ [AUTH] FALHA: Senha inválida');
          throw new Error(AUTH_ERROR_GENERIC);
        }

        if (!result.senha_hash) {
          console.error('❌ [AUTH] FALHA: Usuário sem hash de senha');
          throw new Error(AUTH_ERROR_GENERIC);
        }

        console.log(`✅ [AUTH] LOGIN SUCESSO para ${email}`);
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
      if (account?.provider === 'google') {
        if (!user.email || !hasVerifiedGoogleEmail(profile)) return false;

        try {
          const email = user.email.toLowerCase().trim();
          const existingUser = await db.query.users.findFirst({
            where: eq(users.email, email),
          });

          const userId = existingUser?.id || crypto.randomUUID();
          if (!existingUser) {
            const now = new Date().toISOString();
            await db.insert(users).values({
              id: userId,
              email,
              nome: user.name || '',
              foto_url: user.image || '',
              provider: 'google',
              provider_id: user.id,
              criado_em: now,
              atualizado_em: now,
            });
          } else {
            await db
              .update(users)
              .set({
                provider: 'google',
                provider_id: user.id,
                atualizado_em: new Date().toISOString(),
              })
              .where(eq(users.id, userId));
          }
          user.id = userId;
        } catch (error) {
          // Não logar `user`/`profile` — contém e-mail.
          console.error('Erro ao criar usuário Google (email mascarado):', maskEmail(user.email), error);
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
        token.googleEmailVerified = account.provider === 'google';
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
        session.user.id = token.id as string;
        session.user.provider = token.provider;
        session.user.googleEmailVerified = token.googleEmailVerified === true;
        session.user.onboardingCompleted = token.onboardingCompleted as boolean;
        session.user.concursoSlug = token.concursoSlug as string | null;
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
    // 14 dias é o sweet spot — JWT comprometido não fica 30d ativo, e o
    // usuário não precisa logar toda semana. Considerar revogação stateful
    // (tabela revoked_jwt) se precisar invalidar antes do TTL.
    maxAge: 14 * 24 * 60 * 60,
  },
  cookies: {
    // Cookies da sessão sempre Secure em prod. SameSite=lax mitiga CSRF
    // (mantendo navegação cross-site para autenticação Google).
    sessionToken: {
      name: process.env.NODE_ENV === 'production'
        ? '__Secure-next-auth.session-token'
        : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
};

// Cost factor 12 — recomendação OWASP 2024+ contra GPUs modernas. Custa ~250ms
// por hash em servidor médio (aceitável para login não-massivo).
const BCRYPT_COST = 12;

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(BCRYPT_COST);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
