import { api } from './api';

export interface CreatePaymentIntentRequest {
  professorId: string;
  startDateTime: string;
  endDateTime?: string;
  durationMinutes: number;
  totalPrice: number;
  lessonType: 'ONLINE' | 'IN_PERSON';
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
  studentNotes?: string;
}

export interface PaymentIntentResponse {
  clientSecret: string;
  lessonId: string;
}

export interface PixPaymentResponse {
  pixCode: string;
  qrCode: string;
  paymentIntentId: string;
  lessonId: string;
  expiresIn: number;
}

export interface PaymentStats {
  summary: {
    totalPayments: number;
    completedPayments: number;
    pendingPayments: number;
    failedPayments: number;
    totalRevenue: number;
    averagePayment: number;
    conversionRate: number;
  };
  dailyRevenue: Array<{
    date: string;
    revenue: number;
  }>;
  paymentMethods: Array<{
    method: string;
    count: number;
    revenue: number;
  }>;
}

export const paymentApi = {
  // Criar Payment Intent para cartão
  async createPaymentIntent(data: CreatePaymentIntentRequest): Promise<PaymentIntentResponse> {
    const response = await api.post('/payments/create-intent', data);
    return response.data;
  },

  // Criar pagamento PIX
  async createPixPayment(data: CreatePaymentIntentRequest): Promise<PixPaymentResponse> {
    const response = await api.post('/payments/create-pix', data);
    return response.data;
  },

  // Confirmar pagamento PIX
  async confirmPixPayment(paymentId: string): Promise<void> {
    await api.post(`/payments/pix/${paymentId}/confirm`);
  },

  // Obter estatísticas de pagamentos
  async getPaymentStats(professorId?: string, period?: string): Promise<PaymentStats> {
    const params = new URLSearchParams();
    if (professorId) params.append('professorId', professorId);
    if (period) params.append('period', period);
    
    const response = await api.get(`/payments/stats?${params.toString()}`);
    return response.data;
  },

  // Listar pagamentos
  async getPayments(filters?: {
    professorId?: string;
    studentId?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<any> {
    const params = new URLSearchParams();
    if (filters?.professorId) params.append('professorId', filters.professorId);
    if (filters?.studentId) params.append('studentId', filters.studentId);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    
    const response = await api.get(`/payments?${params.toString()}`);
    return response.data;
  }
};