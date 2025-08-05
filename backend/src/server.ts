import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { prisma } from './database/prisma';
import postgresClient from './database/postgres';
import env from './config/env';
import { authRoutes } from './modules/auth/auth.routes';
import { professorRoutes } from './modules/professors/professor.routes';
import { lessonRoutes } from './modules/lessons/lesson.routes';
import { paymentRoutes } from './modules/payments/payment.routes';

const app = express();

// Middlewares
app.use(helmet());
app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/professors', professorRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/payments', paymentRoutes);

// Health check route
app.get('/health', async (req, res) => {
  try {
    // Test database connection using direct PostgreSQL client
    const result = await postgresClient.query('SELECT 1 as test');
    
    res.json({
      status: 'ok',
      message: 'MestresMusic API is running!',
      timestamp: new Date().toISOString(),
      database: 'connected',
      test: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Test route to get instruments
app.get('/api/instruments', async (req, res) => {
  try {
    const result = await postgresClient.query('SELECT * FROM instruments');
    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch instruments',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Test route to get premium plans
app.get('/api/premium-plans', async (req, res) => {
  try {
    const result = await postgresClient.query('SELECT * FROM premium_plans WHERE is_active = true');
    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch premium plans',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Test route to get professors
app.get('/api/professors', async (req, res) => {
  try {
    const result = await postgresClient.query(`
      SELECT p.*, u.name, u.profile_image_url 
      FROM professors p 
      JOIN users u ON p.user_id = u.id 
      WHERE p.approval_status = 'APPROVED'
      LIMIT 10
    `);
    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch professors',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
  });
});

// Error handler
app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ Server Error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
  });
});

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`🚀 MestresMusic API running on port ${PORT}`);
  console.log(`📊 Environment: ${env.NODE_ENV}`);
  console.log(`🌐 Frontend URL: ${env.FRONTEND_URL}`);
  console.log(`💾 Database: Connected to Neon PostgreSQL`);
  console.log(`\n🔗 Health check: http://localhost:${PORT}/health`);
});