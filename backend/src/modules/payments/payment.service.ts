import { PrismaClient, PaymentStatus } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreatePaymentData {
  lessonId: string;
  amount: number;
  currency: string;
  stripePaymentIntentId?: string;
  paymentMethod: string;
}

export interface PaymentFilters {
  professorId?: string;
  studentId?: string;
  status?: PaymentStatus;
  page: number;
  limit: number;
}

export class PaymentService {
  // Criar novo pagamento
  async createPayment(data: CreatePaymentData) {
    return await prisma.payment.create({
      data: {
        lessonId: data.lessonId,
        amount: data.amount,
        currency: data.currency,
        stripePaymentIntentId: data.stripePaymentIntentId,
        paymentMethod: data.paymentMethod,
        status: 'PENDING'
      },
      include: {
        lesson: {
          include: {
            professor: {
              include: {
                user: true
              }
            },
            student: {
              include: {
                user: true
              }
            }
          }
        }
      }
    });
  }

  // Atualizar status do pagamento por ID
  async updatePaymentStatus(paymentId: string, status: PaymentStatus) {
    return await prisma.payment.update({
      where: { id: paymentId },
      data: { status },
      include: {
        lesson: true
      }
    });
  }

  // Atualizar status do pagamento por Stripe ID
  async updatePaymentStatusByStripeId(stripePaymentIntentId: string, status: PaymentStatus) {
    return await prisma.payment.update({
      where: { stripePaymentIntentId },
      data: { status },
      include: {
        lesson: true
      }
    });
  }

  // Buscar pagamento por ID
  async getPaymentById(paymentId: string) {
    return await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        lesson: {
          include: {
            professor: {
              include: {
                user: true
              }
            },
            student: {
              include: {
                user: true
              }
            }
          }
        }
      }
    });
  }

  // Listar pagamentos com filtros
  async getPayments(filters: PaymentFilters) {
    const { professorId, studentId, status, page, limit } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (professorId) {
      where.lesson = {
        professorId
      };
    }

    if (studentId) {
      where.lesson = {
        ...where.lesson,
        studentId
      };
    }

    if (status) {
      where.status = status;
    }

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          lesson: {
            include: {
              professor: {
                include: {
                  user: true
                }
              },
              student: {
                include: {
                  user: true
                }
              }
            }
          }
        }
      }),
      prisma.payment.count({ where })
    ]);

    return {
      payments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  // Obter estatísticas de pagamentos
  async getPaymentStats(professorId?: string, period: string = '30d') {
    const periodDays = this.parsePeriod(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - periodDays);

    const where: any = {
      createdAt: {
        gte: startDate
      }
    };

    if (professorId) {
      where.lesson = {
        professorId
      };
    }

    // Estatísticas gerais
    const [
      totalPayments,
      completedPayments,
      pendingPayments,
      failedPayments,
      totalRevenue,
      averagePayment
    ] = await Promise.all([
      // Total de pagamentos
      prisma.payment.count({ where }),
      
      // Pagamentos completados
      prisma.payment.count({
        where: { ...where, status: 'COMPLETED' }
      }),
      
      // Pagamentos pendentes
      prisma.payment.count({
        where: { ...where, status: 'PENDING' }
      }),
      
      // Pagamentos falhados
      prisma.payment.count({
        where: { ...where, status: 'FAILED' }
      }),
      
      // Receita total
      prisma.payment.aggregate({
        where: { ...where, status: 'COMPLETED' },
        _sum: { amount: true }
      }),
      
      // Valor médio por pagamento
      prisma.payment.aggregate({
        where: { ...where, status: 'COMPLETED' },
        _avg: { amount: true }
      })
    ]);

    // Receita por dia (últimos 30 dias)
    const dailyRevenue = await this.getDailyRevenue(professorId, 30);

    // Métodos de pagamento mais usados
    const paymentMethods = await prisma.payment.groupBy({
      by: ['paymentMethod'],
      where: { ...where, status: 'COMPLETED' },
      _count: true,
      _sum: { amount: true }
    });

    return {
      summary: {
        totalPayments,
        completedPayments,
        pendingPayments,
        failedPayments,
        totalRevenue: totalRevenue._sum.amount || 0,
        averagePayment: averagePayment._avg.amount || 0,
        conversionRate: totalPayments > 0 ? (completedPayments / totalPayments) * 100 : 0
      },
      dailyRevenue,
      paymentMethods: paymentMethods.map(method => ({
        method: method.paymentMethod,
        count: method._count,
        revenue: method._sum.amount || 0
      }))
    };
  }

  // Obter receita diária
  private async getDailyRevenue(professorId?: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const where: any = {
      status: 'COMPLETED',
      createdAt: {
        gte: startDate
      }
    };

    if (professorId) {
      where.lesson = {
        professorId
      };
    }

    const payments = await prisma.payment.findMany({
      where,
      select: {
        amount: true,
        createdAt: true
      }
    });

    // Agrupar por dia
    const dailyData: { [key: string]: number } = {};
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      dailyData[dateKey] = 0;
    }

    payments.forEach(payment => {
      const dateKey = payment.createdAt.toISOString().split('T')[0];
      if (dailyData.hasOwnProperty(dateKey)) {
        dailyData[dateKey] += Number(payment.amount);
      }
    });

    return Object.entries(dailyData)
      .map(([date, revenue]) => ({ date, revenue }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  // Parsear período (30d, 7d, 90d, etc.)
  private parsePeriod(period: string): number {
    const match = period.match(/^(\d+)([dwmy])$/);
    if (!match) return 30;

    const [, num, unit] = match;
    const number = parseInt(num);

    switch (unit) {
      case 'd': return number;
      case 'w': return number * 7;
      case 'm': return number * 30;
      case 'y': return number * 365;
      default: return 30;
    }
  }

  // Obter pagamentos de um professor
  async getProfessorPayments(professorId: string, page: number = 1, limit: number = 10) {
    return this.getPayments({
      professorId,
      page,
      limit
    });
  }

  // Obter pagamentos de um aluno
  async getStudentPayments(studentId: string, page: number = 1, limit: number = 10) {
    return this.getPayments({
      studentId,
      page,
      limit
    });
  }

  // Calcular comissão da plataforma
  async calculatePlatformCommission(paymentId: string, commissionRate: number = 0.1) {
    const payment = await this.getPaymentById(paymentId);
    
    if (!payment) {
      throw new Error('Pagamento não encontrado');
    }

    const commission = Number(payment.amount) * commissionRate;
    const professorAmount = Number(payment.amount) - commission;

    return {
      totalAmount: Number(payment.amount),
      commission,
      professorAmount,
      commissionRate
    };
  }

  // Processar repasse para professor
  async processProfessorPayout(professorId: string, period: string = '30d') {
    const stats = await this.getPaymentStats(professorId, period);
    const totalRevenue = Number(stats.summary.totalRevenue) || 0;
    const commission = totalRevenue * 0.1; // 10% de comissão
    const professorAmount = totalRevenue - commission;

    // Aqui você integraria com Stripe Connect ou outro sistema de repasse
    // Por enquanto, apenas retornamos os valores calculados

    return {
      professorId,
      period,
      totalRevenue,
      commission,
      professorAmount,
      status: 'calculated' // Em produção seria 'processed'
    };
  }
}