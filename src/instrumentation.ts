export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { initializeDatabase } = await import('@/lib/db');
    console.log('🚀 Inicializando banco de dados...');
    await initializeDatabase();
    console.log('✓ Database initialized');
  }
}
