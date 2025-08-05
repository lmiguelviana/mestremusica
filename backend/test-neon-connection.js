const { PrismaClient } = require('@prisma/client');

// Testar com connection string completa
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://neondb_owner:npg_BlvRm5Zto0aw@ep-orange-frost-act3zl7j-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
    }
  }
});

async function testConnection() {
  try {
    console.log('🔍 Testando conexão com Neon Database...');
    console.log('🔗 URL:', 'ep-orange-frost-act3zl7j-pooler.sa-east-1.aws.neon.tech');
    
    // Teste básico de conexão
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Conexão bem-sucedida!');
    console.log('Resultado:', result);
    
    // Verificar tabelas existentes
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    
    console.log('📋 Tabelas encontradas:');
    tables.forEach(table => {
      console.log(`  - ${table.table_name}`);
    });
    
  } catch (error) {
    console.error('❌ Erro na conexão:', error.message);
    
    // Sugestões de solução
    console.log('\n🔧 Possíveis soluções:');
    console.log('1. Verifique se o banco Neon está ativo em https://console.neon.tech/');
    console.log('2. Se pausado, clique em "Resume"');
    console.log('3. Verifique se a connection string está correta');
    console.log('4. Teste sem channel_binding=require');
    
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();