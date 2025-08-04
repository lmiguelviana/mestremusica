const { Client } = require('pg');

async function testNeonConnection() {
  const connectionString = 'postgresql://neondb_owner:npg_BlvRm5Zto0aw@ep-orange-frost-act3zl7j-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
  
  console.log('🔍 Testando conexão direta com Neon PostgreSQL...\n');
  console.log('🔗 Endpoint:', 'ep-orange-frost-act3zl7j-pooler.sa-east-1.aws.neon.tech');
  
  const client = new Client({
    connectionString,
    connectionTimeoutMillis: 10000, // 10 segundos
  });

  try {
    console.log('⏳ Conectando...');
    await client.connect();
    console.log('✅ Conexão estabelecida com sucesso!');
    
    console.log('🧪 Executando query de teste...');
    const result = await client.query('SELECT NOW() as current_time, version() as pg_version');
    console.log('✅ Query executada com sucesso!');
    console.log('📊 Resultado:', {
      time: result.rows[0].current_time,
      version: result.rows[0].pg_version.split(' ')[0] + ' ' + result.rows[0].pg_version.split(' ')[1]
    });
    
    // Testar se as tabelas existem
    console.log('\n🔍 Verificando tabelas existentes...');
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    if (tables.rows.length > 0) {
      console.log(`📊 Encontradas ${tables.rows.length} tabelas:`);
      tables.rows.forEach(row => console.log(`   - ${row.table_name}`));
    } else {
      console.log('⚠️  Nenhuma tabela encontrada. Schema precisa ser aplicado.');
    }
    
  } catch (error) {
    console.log('❌ Erro de conexão:');
    console.log(`   Código: ${error.code}`);
    console.log(`   Mensagem: ${error.message}`);
    
    if (error.code === 'ENOTFOUND') {
      console.log('\n💡 Possíveis causas:');
      console.log('   - Banco Neon pausado (inativo por mais de 5 minutos)');
      console.log('   - Problemas de DNS/conectividade');
      console.log('   - Endpoint alterado no console Neon');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Possíveis causas:');
      console.log('   - Banco Neon pausado ou suspenso');
      console.log('   - Firewall bloqueando conexão');
    } else if (error.code === 'ETIMEDOUT') {
      console.log('\n💡 Possíveis causas:');
      console.log('   - Timeout de conexão (banco muito lento para responder)');
      console.log('   - Banco Neon pausado');
    }
    
    console.log('\n🔧 Soluções recomendadas:');
    console.log('   1. Acesse https://console.neon.tech/ e verifique o status');
    console.log('   2. Se pausado, clique em "Resume" no projeto');
    console.log('   3. Verifique se a connection string mudou');
    console.log('   4. Use banco local: node setup-local-db.js');
    
  } finally {
    await client.end();
  }
}

testNeonConnection();