import { Client } from 'pg';

const client = new Client({
  connectionString: process.env.DATABASE_URL || "postgresql://neondb_owner:npg_BlvRm5Zto0aw@ep-orange-frost-act3zl7j-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
  connectionTimeoutMillis: 10000,
});

// Conectar ao banco
client.connect().catch(console.error);

export default client; 