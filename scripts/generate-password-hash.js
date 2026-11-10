const bcrypt = require('bcryptjs');

const BCRYPT_COST = 12;
const password = process.argv[2];

if (!password) {
  console.log('Uso: node scripts/generate-password-hash.js "suaSenhaAqui"');
  process.exit(1);
}

bcrypt.hash(password, BCRYPT_COST)
  .then((hash) => {
    console.log('Hash gerado para a senha informada:');
    console.log(hash);
    console.log('');
    console.log('Exemplo de uso no banco:');
    console.log(`UPDATE users SET senha_hash = '${hash}' WHERE email = 'seu-email@dominio.com';`);
  })
  .catch((error) => {
    console.error('Erro ao gerar hash:', error);
    process.exit(1);
  });
