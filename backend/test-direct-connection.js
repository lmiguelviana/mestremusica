const { Client } = require('pg');

async function testDirectConnection() {
  const client = new Client({
    connectionString: 'postgresql://neondb_owner:npg_BlvRm5Zto0aw@ep-orange-frost-act3zl7j-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
    connectionTimeoutMillis: 10000,
  });

  try {
    console.log('🔍 Testando conexão direta com PostgreSQL...');
    console.log('🔗 URL:', 'ep-orange-frost-act3zl7j-pooler.sa-east-1.aws.neon.tech');
    
    await client.connect();
    console.log('✅ Conexão estabelecida com sucesso!');
    
    const result = await client.query('SELECT NOW() as current_time, version() as pg_version');
    console.log('✅ Query executada com sucesso!');
    console.log('📊 Resultado:', {
      time: result.rows[0].current_time,
      version: result.rows[0].pg_version.split(' ')[0] + ' ' + result.rows[0].pg_version.split(' ')[1]
    });
    
    // Verificar tabelas
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log('📋 Tabelas encontradas:');
    tables.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });
    
  } catch (error) {
    console.error('❌ Erro na conexão:', error.message);
    console.error('Código:', error.code);
  } finally {
    await client.end();
  }
}

testDirectConnection(); 