import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { strictRateLimit } from '@/lib/rate-limit';

const USERNAME_RE = /^[a-zA-Z0-9_]{3,30}$/;

// Endpoint usado durante onboarding/edit de perfil para verificar se um
// username está livre. Anônimo MAS protegido por rate-limit estrito + regex
// rígida para impedir enumeração em massa da base de usernames.
export async function GET(req: NextRequest) {
  const limited = strictRateLimit(req);
  if (limited) return limited;

  const username = req.nextUrl.searchParams.get('username')?.trim().toLowerCase();
  if (!username || !USERNAME_RE.test(username)) {
    return NextResponse.json({ available: false });
  }

  const existing = await db.query.users.findFirst({
    where: eq(users.username, username),
    columns: { id: true },
  });

  return NextResponse.json({ available: !existing });
}
