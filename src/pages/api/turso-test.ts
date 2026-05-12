import type { NextApiRequest, NextApiResponse } from 'next';
import { turso } from '../../../turso';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const urlPresent = !!process.env.TURSO_DB_URL || !!process.env.NEXT_PUBLIC_TURSO_CONNECTION_URL;
    const tokenPresent = !!process.env.TURSO_AUTH_TOKEN;

    console.log('TURSO_DB_URL present?', urlPresent);
    console.log('TURSO_AUTH_TOKEN present?', tokenPresent);

    const result = await turso.execute('SELECT 1 AS ok');

    return res.status(200).json({ ok: true, rows: result.rows ?? result });
  } catch (err) {
    console.error('Turso test error:', err);
    return res.status(500).json({ error: String(err) });
  }
}
