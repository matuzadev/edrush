import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRole) {
    return NextResponse.json({ error: 'Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL' }, { status: 500 });
  }

  const admin = createClient(supabaseUrl, serviceRole, { auth: { persistSession: false } });

  try {
    const body = await req.json();
    const { email, password, fullName } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'email and password are required' }, { status: 400 });
    }

    // Create user as admin and mark email confirmed
    // Note: this endpoint must run server-side only and the service role key must NOT be public
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName ?? '' },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const user = (data as any)?.user ?? data;

    // Ensure there's a profile row (common pattern in Supabase starter schemas)
    if (user?.id) {
      try {
        await admin.from('profiles').upsert({ id: user.id, full_name: fullName ?? '', role: 'admin' });
      } catch (e) {
        // non-fatal, continue
        console.error('Failed to upsert profile for admin user', e);
      }
    }

    return NextResponse.json({ user });
  } catch (err: any) {
    console.error('create-admin error', err);
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 });
  }
}
