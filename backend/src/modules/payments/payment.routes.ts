import { Router } from 'express';
import { PaymentController } from './payment.controller';
import { authenticateToken } from '../../shared/middleware/auth';

const router = Router();
const paymentController = new PaymentController();

// Rotas públicas (não precisam de autenticação)
router.post('/create-intent', paymentController.createPaymentIntent);
router.post('/create-pix', paymentController.createPixPayment);
router.post('/webhook/stripe', paymentController.handleStripeWebhook);

// Rotas protegidas (precisam de autenticação)
router.use(authenticateToken);

router.get('/', paymentController.getPayments);
router.get('/stats', paymentController.getPaymentStats);
router.post('/pix/:paymentId/confirm', paymentController.confirmPixPayment);

export { router as paymentRoutes };