export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { initializeDatabase } = await import('@/lib/db');

    try {
      console.log('🚀 Inicializando banco de dados Turso...');
      await initializeDatabase();
      console.log('✓ Database initialized');
      console.log('✓ All tables created');
    } catch (error) {
      console.error('❌ Erro ao inicializar banco:', error);
    }
  }
}
