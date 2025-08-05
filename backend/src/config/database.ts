import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || "postgresql://neondb_owner:npg_BlvRm5Zto0aw@ep-orange-frost-act3zl7j-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
    }
  }
});

export default prisma; 