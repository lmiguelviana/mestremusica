const { PrismaClient } = require('@prisma/client');

async function checkDatabaseConnection() {
  const prisma = new PrismaClient();
  
  console.log('🔍 Verificando conexão com banco de dados...\n');
  
  try {
    // Teste básico de conexão
    await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Conexão com banco estabelecida com sucesso!');
    
    // Verificar se as tabelas existem
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    
    if (tables.length > 0) {
      console.log(`📊 Encontradas ${tables.length} tabelas no banco:`);
      tables.forEach(table => console.log(`   - ${table.table_name}`));
    } else {
      console.log('⚠️  Nenhuma tabela encontrada. Execute: npx prisma db push');
    }
    
  } catch (error) {
    console.log('❌ Erro de conexão com banco de dados:');
    console.log(`   ${error.message}`);
    console.log('\n💡 Possíveis soluções:');
    console.log('   1. Verificar se o banco Neon está ativo: https://console.neon.tech/');
    console.log('   2. Usar banco local: node setup-local-db.js');
    console.log('   3. Verificar a DATABASE_URL no arquivo .env');
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabaseConnection();