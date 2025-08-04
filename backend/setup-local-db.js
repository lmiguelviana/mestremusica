const fs = require('fs');
const path = require('path');

console.log('🔧 Configurando banco de dados local...\n');

// Backup do .env atual
const envPath = path.join(__dirname, '.env');
const envBackupPath = path.join(__dirname, '.env.backup');

if (fs.existsSync(envPath)) {
  fs.copyFileSync(envPath, envBackupPath);
  console.log('✅ Backup do .env criado como .env.backup');
}

// Ler o arquivo .env atual
let envContent = fs.readFileSync(envPath, 'utf8');

// Substituir a DATABASE_URL
const localDatabaseUrl = 'postgresql://postgres:password@localhost:5432/mestresmusic?schema=public';
envContent = envContent.replace(
  /DATABASE_URL="[^"]*"/,
  `DATABASE_URL="${localDatabaseUrl}"`
);

// Escrever o novo .env
fs.writeFileSync(envPath, envContent);

console.log('✅ DATABASE_URL atualizada para banco local');
console.log('📝 URL do banco: ' + localDatabaseUrl);
console.log('\n🐳 Para usar Docker PostgreSQL, execute:');
console.log('docker run --name postgres-dev -e POSTGRES_PASSWORD=password -e POSTGRES_DB=mestresmusic -p 5432:5432 -d postgres:15');
console.log('\n🔄 Para restaurar o banco Neon, execute:');
console.log('node restore-neon-db.js');