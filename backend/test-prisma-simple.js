const { PrismaClient } = require('@prisma/client');

console.log('🔍 Testando Prisma com connection string direta...');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://neondb_owner:npg_BlvRm5Zto0aw@ep-orange-frost-act3zl7j-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
    }
  }
});

async function testPrisma() {
  try {
    console.log('⏳ Tentando conectar...');
    
    // Teste simples
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Prisma conectou com sucesso!');
    console.log('Resultado:', result);
    
    // Teste de tabela
    const users = await prisma.user.findMany({
      take: 1
    });
    console.log('✅ Query de usuários funcionou!');
    console.log('Usuários encontrados:', users.length);
    
  } catch (error) {
    console.error('❌ Erro no Prisma:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

testPrisma(); 