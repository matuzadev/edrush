import { createClient } from '@libsql/client';

export const turso = createClient({
  url: process.env.NEXT_PUBLIC_TURSO_CONNECTION_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});