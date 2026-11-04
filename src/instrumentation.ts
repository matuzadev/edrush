export async function register() {
  // Vercel runs database setup during the build, not in each runtime instance.
  if (process.env.NEXT_RUNTIME === 'nodejs' && !process.env.VERCEL) {
    const { initializeDatabase } = await import('@/lib/db');
    console.log('🚀 Inicializando banco de dados...');
    await initializeDatabase();
    console.log('✓ Database initialized');
  }
}
