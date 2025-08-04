const fs = require('fs');
const path = require('path');

console.log('🔄 Restaurando configuração do banco Neon...\n');

const envPath = path.join(__dirname, '.env');
const envBackupPath = path.join(__dirname, '.env.backup');

if (fs.existsSync(envBackupPath)) {
  fs.copyFileSync(envBackupPath, envPath);
  console.log('✅ Configuração do banco Neon restaurada');
  console.log('🔗 Verifique se o banco Neon está ativo em: https://console.neon.tech/');
} else {
  console.log('❌ Arquivo de backup não encontrado');
  console.log('💡 Atualize manualmente a DATABASE_URL no arquivo .env');
}