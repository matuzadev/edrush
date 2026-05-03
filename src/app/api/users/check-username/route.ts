import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get('username')?.trim().toLowerCase();
  if (!username) return NextResponse.json({ available: false });

  const existing = await db.query.users.findFirst({
    where: eq(users.username, username),
    columns: { id: true },
  });

  return NextResponse.json({ available: !existing });
}
