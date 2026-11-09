async function setupDatabase() {
  const databaseUrl =
    process.env.TURSO_DB_URL ??
    process.env.TURSO_DATABASE_URL ??
    process.env.NEXT_PUBLIC_TURSO_CONNECTION_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  // Se não houver configuração do Turso e estivermos na Vercel, pula o setup silenciosamente
  if (!databaseUrl) {
    if (process.env.VERCEL) {
      console.log('⏭️ Skipping database setup on Vercel (no Turso configuration found).');
      return;
    }
    throw new Error(
      'Missing Turso configuration: set TURSO_DB_URL and TURSO_AUTH_TOKEN.',
    );
  }

  if (process.env.VERCEL && !/^(libsql|https):\/\//i.test(databaseUrl)) {
    console.log('⏭️ Skipping database setup on Vercel (local database URL detected).');
    return;
  }

  if (
    (databaseUrl.startsWith('libsql://') || process.env.VERCEL) &&
    !authToken
  ) {
    console.log('⏭️ Skipping database setup on Vercel (missing auth token).');
    return;
  }

  const { client, initializeDatabase } = await import('../src/lib/db');
  const failures: Error[] = [];
  const originalExecute = client.execute;
  const originalBatch = client.batch;

  client.execute = (async (...args: Parameters<typeof client.execute>) => {
    try {
      return await originalExecute.apply(client, args);
    } catch (error) {
      const statement: unknown = args[0];
      const sql =
        typeof statement === 'string'
          ? statement
          : typeof statement === 'object' &&
              statement !== null &&
              'sql' in statement &&
              typeof statement.sql === 'string'
            ? statement.sql
            : '';
      const message = error instanceof Error ? error.message : String(error);
      const isExistingColumn =
        /^\s*ALTER\s+TABLE\b[\s\S]*?\bADD\s+COLUMN\b/i.test(sql) &&
        /duplicate column/i.test(message);

      if (!isExistingColumn) {
        failures.push(
          error instanceof Error ? error : new Error(message),
        );
      }
      throw error;
    }
  }) as typeof client.execute;

  client.batch = (async (...args: Parameters<typeof client.batch>) => {
    try {
      return await originalBatch.apply(client, args);
    } catch (error) {
      failures.push(
        error instanceof Error ? error : new Error(String(error)),
      );
      throw error;
    }
  }) as typeof client.batch;

  try {
    console.log('🚀 Initializing database for this deployment...');
    await initializeDatabase();

    if (failures.length > 0) {
      throw new Error(
        `Database initialization suppressed ${failures.length} SQL error(s); first error: ${failures[0].message}`,
      );
    }

    console.log('✓ Database initialized');
  } finally {
    client.execute = originalExecute;
    client.batch = originalBatch;
    await client.close();
  }
}

setupDatabase().catch((error: unknown) => {
  console.error('❌ Database setup failed:', error);
  process.exitCode = 1;
});
