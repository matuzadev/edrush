import { createClient } from '@libsql/client';

// Prefer server-side env names. Your .env.local currently has TURSO_DB_URL and TURSO_AUTH_TOKEN.
// Avoid NEXT_PUBLIC_ for credentials (that would expose them to the browser).
const url = process.env.TURSO_DB_URL ?? process.env.NEXT_PUBLIC_TURSO_CONNECTION_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  throw new Error(
    'Turso configuration missing. Set TURSO_DB_URL (or NEXT_PUBLIC_TURSO_CONNECTION_URL) and TURSO_AUTH_TOKEN in .env.local and restart the dev server.'
  );
}

export const turso = createClient({
  url,
  authToken,
});