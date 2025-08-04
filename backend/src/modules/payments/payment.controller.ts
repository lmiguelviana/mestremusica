import { Request, Response } from 'express';
import Stripe from 'stripe';
import { PaymentService } from './payment.service';
import { LessonService } from '../lessons/lesson.service';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export class PaymentController {
  private paymentService: PaymentService;
  private lessonService: LessonService;

  constructor() {
    this.paymentService = new PaymentService();
    this.lessonService = new LessonService();
  }

  // Criar Payment Intent para cartão de crédito
  createPaymentIntent = async (req: Request, res: Response) => {
    try {
      const {
        professorId,
        startDateTime,
        endDateTime,
        durationMinutes,
        totalPrice,
        lessonType,
        studentName,
        studentEmail,
        studentPhone,
        studentNotes,
        paymentMethod
      } = req.body;

      // Validar dados
      if (!professorId || !startDateTime || !totalPrice || !studentName || !studentEmail) {
        return res.status(400).json({
          error: 'Dados obrigatórios não fornecidos'
        });
      }

      // Criar a aula primeiro
      const lesson = await this.lessonService.createLessonRequest({
        professorId,
        startDateTime: new Date(startDateTime),
        endDateTime: endDateTime ? new Date(endDateTime) : undefined,
        durationMinutes,
        totalPrice: parseFloat(totalPrice.toString()),
        lessonType,
        studentName,
        studentEmail,
        studentPhone,
        studentNotes
      });

      // Criar Payment Intent no Stripe
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(totalPrice * 100), // Stripe usa centavos
        currency: 'brl',
        payment_method_types: ['card'],
        metadata: {
          lessonId: lesson.id,
          professorId,
          studentEmail,
          studentName
        },
        description: `Aula de música - ${studentName}`,
      });

      // Salvar payment no banco
      await this.paymentService.createPayment({
        lessonId: lesson.id,
        amount: totalPrice,
        currency: 'BRL',
        stripePaymentIntentId: paymentIntent.id,
        paymentMethod: 'card'
      });

      res.json({
        clientSecret: paymentIntent.client_secret,
        lessonId: lesson.id
      });

    } catch (error) {
      console.error('Error creating payment intent:', error);
      res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  };

  // Criar pagamento PIX
  createPixPayment = async (req: Request, res: Response) => {
    try {
      const {
        professorId,
        startDateTime,
        endDateTime,
        durationMinutes,
        totalPrice,
        lessonType,
        studentName,
        studentEmail,
        studentPhone,
        studentNotes
      } = req.body;

      // Criar a aula primeiro
      const lesson = await this.lessonService.createLessonRequest({
        professorId,
        startDateTime: new Date(startDateTime),
        endDateTime: endDateTime ? new Date(endDateTime) : undefined,
        durationMinutes,
        totalPrice: parseFloat(totalPrice.toString()),
        lessonType,
        studentName,
        studentEmail,
        studentPhone,
        studentNotes
      });

      // Para PIX, vamos simular a geração do código
      // Em produção, você integraria com um gateway que suporte PIX
      const pixCode = this.generatePixCode(totalPrice, studentName, lesson.id);
      const qrCode = `data:image/png;base64,${this.generateQRCode(pixCode)}`;

      // Salvar payment no banco
      const payment = await this.paymentService.createPayment({
        lessonId: lesson.id,
        amount: totalPrice,
        currency: 'BRL',
        paymentMethod: 'pix'
      });

      res.json({
        pixCode,
        qrCode,
        paymentIntentId: payment.id,
        lessonId: lesson.id,
        expiresIn: 30 * 60 // 30 minutos
      });

    } catch (error) {
      console.error('Error creating PIX payment:', error);
      res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  };

  // Webhook do Stripe para confirmar pagamentos
  handleStripeWebhook = async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'] as string;
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return res.status(400).send('Webhook signature verification failed');
    }

    try {
      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
          break;
        
        case 'payment_intent.payment_failed':
          await this.handlePaymentFailure(event.data.object as Stripe.PaymentIntent);
          break;

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      res.json({ received: true });
    } catch (error) {
      console.error('Error handling webhook:', error);
      res.status(500).json({ error: 'Webhook handler failed' });
    }
  };

  // Confirmar pagamento PIX manualmente (simulação)
  confirmPixPayment = async (req: Request, res: Response) => {
    try {
      const { paymentId } = req.params;

      const payment = await this.paymentService.updatePaymentStatus(
        paymentId,
        'COMPLETED'
      );

      if (payment) {
        // Atualizar status da aula para confirmada
        await this.lessonService.updateLessonStatus(
          payment.lessonId,
          'CONFIRMED'
        );

        res.json({
          success: true,
          message: 'Pagamento PIX confirmado com sucesso'
        });
      } else {
        res.status(404).json({
          error: 'Pagamento não encontrado'
        });
      }
    } catch (error) {
      console.error('Error confirming PIX payment:', error);
      res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  };

  // Listar pagamentos (para dashboard)
  getPayments = async (req: Request, res: Response) => {
    try {
      const { professorId, studentId, status, page = 1, limit = 10 } = req.query;

      const payments = await this.paymentService.getPayments({
        professorId: professorId as string,
        studentId: studentId as string,
        status: status as any,
        page: parseInt(page as string),
        limit: parseInt(limit as string)
      });

      res.json(payments);
    } catch (error) {
      console.error('Error fetching payments:', error);
      res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  };

  // Obter estatísticas de pagamentos
  getPaymentStats = async (req: Request, res: Response) => {
    try {
      const { professorId, period = '30d' } = req.query;

      const stats = await this.paymentService.getPaymentStats(
        professorId as string,
        period as string
      );

      res.json(stats);
    } catch (error) {
      console.error('Error fetching payment stats:', error);
      res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  };

  // Handlers privados
  private async handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
    const lessonId = paymentIntent.metadata.lessonId;

    if (lessonId) {
      // Atualizar status do pagamento
      await this.paymentService.updatePaymentStatusByStripeId(
        paymentIntent.id,
        'COMPLETED'
      );

      // Atualizar status da aula para confirmada
      await this.lessonService.updateLessonStatus(lessonId, 'CONFIRMED');

      console.log(`Payment succeeded for lesson ${lessonId}`);
    }
  }

  private async handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
    const lessonId = paymentIntent.metadata.lessonId;

    if (lessonId) {
      // Atualizar status do pagamento
      await this.paymentService.updatePaymentStatusByStripeId(
        paymentIntent.id,
        'FAILED'
      );

      // Cancelar a aula
      await this.lessonService.updateLessonStatus(lessonId, 'CANCELLED');

      console.log(`Payment failed for lesson ${lessonId}`);
    }
  }

  // Utilitários para PIX (simulação)
  private generatePixCode(amount: number, payerName: string, lessonId: string): string {
    // Em produção, você usaria uma biblioteca real para gerar códigos PIX
    const timestamp = Date.now();
    return `00020126580014BR.GOV.BCB.PIX0136${lessonId}${timestamp}520400005303986540${amount.toFixed(2)}5802BR5925${payerName}6009SAO PAULO62070503***6304`;
  }

  private generateQRCode(pixCode: string): string {
    // Em produção, você geraria um QR Code real
    // Por simplicidade, retornando uma string base64 fake
    return 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
  }
}