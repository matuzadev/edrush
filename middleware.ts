import { NextResponse } from 'next/server';
import subjects from './src/data/subjects.json';

export function middleware(request: any) {
  const url = request.nextUrl.clone();
  const { pathname } = url;

  // Legacy chapter URLs of the form /dashboard/chapter/:id -> redirect to /dashboard/chapter/:subject/:id
  const match = pathname.match(/^\/dashboard\/chapter\/(\d+)\/?$/);
  if (match) {
    const id = match[1];
    for (const slug of Object.keys(subjects)) {
      const subj = (subjects as any)[slug];
      if (subj.chapters.some((c: any) => String(c.id) === String(id))) {
        url.pathname = `/dashboard/chapter/${slug}/${id}`;
        return NextResponse.redirect(url);
      }
    }
    // if no subject found, fallback to dashboard
    return NextResponse.redirect('/dashboard');
  }

  const response = NextResponse.next();

  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

  return response;
}

export const config = {
  matcher: ['/:path*'],
};
