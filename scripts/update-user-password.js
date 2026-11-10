const bcrypt = require('bcryptjs');
const { createClient } = require('@libsql/client');

const args = process.argv.slice(2);
const email = args[0];
const password = args[1];

if (!email || !password) {
  console.log('Uso: node scripts/update-user-password.js "usuario@email.com" "novaSenha123"');
  process.exit(1);
}

const url = process.env.TURSO_DB_URL || process.env.TURSO_DATABASE_URL || process.env.NEXT_PUBLIC_TURSO_CONNECTION_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  console.error('Variáveis do Turso ausentes. Defina TURSO_DB_URL/TURSO_DATABASE_URL e TURSO_AUTH_TOKEN antes de executar.');
  process.exit(1);
}

(async () => {
  try {
    const client = createClient({ url, authToken });
    const hash = await bcrypt.hash(password, 12);

    await client.execute({
      sql: `
        UPDATE users
        SET senha_hash = ?, atualizado_em = ?
        WHERE LOWER(email) = LOWER(?)
      `,
      args: [hash, new Date().toISOString(), email],
    });

    console.log(`Senha atualizada com sucesso para ${email}.`);
    console.log(`Hash salvo: ${hash}`);
  } catch (error) {
    console.error('Erro ao atualizar senha:', error);
    process.exit(1);
  }
})();
