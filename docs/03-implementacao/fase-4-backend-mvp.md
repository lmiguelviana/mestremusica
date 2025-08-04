# Fase 4: Desenvolvimento do Backend (MVP)

## Objetivo
Implementar a API backend com as funcionalidades essenciais do MVP, incluindo autenticação, gerenciamento de usuários, professores, agendamentos e pagamentos.

## 4.1 Estrutura Base do Servidor

### Server Setup (src/server.ts)
```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { authRoutes } from './modules/auth/auth.routes';
import { userRoutes } from './modules/users/user.routes';
import { professorRoutes } from './modules/professors/professor.routes';
import { lessonRoutes } from './modules/lessons/lesson.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/professors', professorRoutes);
app.use('/api/lessons', lessonRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## 4.2 Módulo de Autenticação

### Auth Service (src/modules/auth/auth.service.ts)
```typescript
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../database/prisma';
import { CreateUserDto, LoginDto } from './auth.dto';

export class AuthService {
  async register(data: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        type: data.type,
      },
    });

    // Criar perfil específico baseado no tipo
    if (data.type === 'STUDENT') {
      await prisma.student.create({
        data: { userId: user.id },
      });
    } else if (data.type === 'PROFESSOR') {
      await prisma.professor.create({
        data: { userId: user.id },
      });
    }

    const token = this.generateToken(user.id);
    return { user: this.sanitizeUser(user), token };
  }

  async login(data: LoginDto) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user || !await bcrypt.compare(data.password, user.password)) {
      throw new Error('Invalid credentials');
    }

    const token = this.generateToken(user.id);
    return { user: this.sanitizeUser(user), token };
  }

  private generateToken(userId: string): string {
    return jwt.sign(
      { userId },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
  }

  private sanitizeUser(user: any) {
    const { password, ...sanitized } = user;
    return sanitized;
  }
}
```

### Auth Controller (src/modules/auth/auth.controller.ts)
```typescript
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { validateDto } from '../../shared/validators';
import { CreateUserDto, LoginDto } from './auth.dto';

export class AuthController {
  private authService = new AuthService();

  async register(req: Request, res: Response) {
    try {
      const data = validateDto(CreateUserDto, req.body);
      const result = await this.authService.register(data);
      
      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const data = validateDto(LoginDto, req.body);
      const result = await this.authService.login(data);
      
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  }
}
```

## 4.3 Módulo de Professores

### Professor Service (src/modules/professors/professor.service.ts)
```typescript
import { prisma } from '../../database/prisma';
import { UpdateProfessorDto, SearchProfessorsDto } from './professor.dto';

export class ProfessorService {
  async getAll(filters: SearchProfessorsDto) {
    const where: any = {
      status: 'APPROVED',
    };

    if (filters.instrument) {
      where.instruments = {
        some: {
          instrument: {
            name: {
              contains: filters.instrument,
              mode: 'insensitive',
            },
          },
        },
      };
    }

    if (filters.minPrice || filters.maxPrice) {
      where.baseHourlyRate = {};
      if (filters.minPrice) where.baseHourlyRate.gte = filters.minPrice;
      if (filters.maxPrice) where.baseHourlyRate.lte = filters.maxPrice;
    }

    return await prisma.professor.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        instruments: {
          include: {
            instrument: true,
          },
        },
        _count: {
          select: {
            reviews: true,
          },
        },
      },
      take: filters.limit || 20,
      skip: filters.offset || 0,
    });
  }

  async getById(id: string) {
    return await prisma.professor.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        instruments: {
          include: {
            instrument: true,
          },
        },
        availability: true,
        reviews: {
          include: {
            student: {
              include: {
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
        },
      },
    });
  }

  async updateProfile(professorId: string, data: UpdateProfessorDto) {
    return await prisma.professor.update({
      where: { id: professorId },
      data: {
        biography: data.biography,
        experience: data.experience,
        methodology: data.methodology,
        baseHourlyRate: data.baseHourlyRate,
        onlineAvailable: data.onlineAvailable,
        inPersonLocation: data.inPersonLocation,
      },
    });
  }

  async updateAvailability(professorId: string, availability: any[]) {
    // Remover disponibilidade existente
    await prisma.professorAvailability.deleteMany({
      where: { professorId },
    });

    // Criar nova disponibilidade
    await prisma.professorAvailability.createMany({
      data: availability.map(slot => ({
        professorId,
        dayOfWeek: slot.dayOfWeek,
        startTime: slot.startTime,
        endTime: slot.endTime,
        isRecurring: slot.isRecurring,
      })),
    });

    return { success: true };
  }
}
```

## 4.4 Módulo de Agendamentos

### Lesson Service (src/modules/lessons/lesson.service.ts)
```typescript
import { prisma } from '../../database/prisma';
import { CreateLessonDto } from './lesson.dto';

export class LessonService {
  async create(studentId: string, data: CreateLessonDto) {
    // Verificar disponibilidade do professor
    const isAvailable = await this.checkAvailability(
      data.professorId,
      data.startDateTime,
      data.endDateTime
    );

    if (!isAvailable) {
      throw new Error('Professor not available at this time');
    }

    // Criar agendamento
    const lesson = await prisma.lesson.create({
      data: {
        studentId,
        professorId: data.professorId,
        startDateTime: data.startDateTime,
        endDateTime: data.endDateTime,
        durationMinutes: data.durationMinutes,
        totalPrice: data.totalPrice,
        status: 'PENDING',
      },
      include: {
        student: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        professor: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return lesson;
  }

  async getByStudent(studentId: string) {
    return await prisma.lesson.findMany({
      where: { studentId },
      include: {
        professor: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        startDateTime: 'desc',
      },
    });
  }

  async getByProfessor(professorId: string) {
    return await prisma.lesson.findMany({
      where: { professorId },
      include: {
        student: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        startDateTime: 'desc',
      },
    });
  }

  async updateStatus(lessonId: string, status: string, userId: string) {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        student: { include: { user: true } },
        professor: { include: { user: true } },
      },
    });

    if (!lesson) {
      throw new Error('Lesson not found');
    }

    // Verificar permissões
    const canUpdate = 
      lesson.student.user.id === userId || 
      lesson.professor.user.id === userId;

    if (!canUpdate) {
      throw new Error('Unauthorized');
    }

    return await prisma.lesson.update({
      where: { id: lessonId },
      data: { status },
    });
  }

  private async checkAvailability(
    professorId: string,
    startDateTime: Date,
    endDateTime: Date
  ): Promise<boolean> {
    const conflictingLessons = await prisma.lesson.findMany({
      where: {
        professorId,
        status: {
          in: ['PENDING', 'CONFIRMED'],
        },
        OR: [
          {
            startDateTime: {
              lt: endDateTime,
            },
            endDateTime: {
              gt: startDateTime,
            },
          },
        ],
      },
    });

    return conflictingLessons.length === 0;
  }
}
```

## 4.5 Módulo de Pagamentos

### Payment Service (src/modules/payments/payment.service.ts)
```typescript
import Stripe from 'stripe';
import { prisma } from '../../database/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export class PaymentService {
  async createPaymentIntent(lessonId: string, amount: number) {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        student: { include: { user: true } },
        professor: { include: { user: true } },
      },
    });

    if (!lesson) {
      throw new Error('Lesson not found');
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe usa centavos
      currency: 'brl',
      metadata: {
        lessonId,
        studentId: lesson.studentId,
        professorId: lesson.professorId,
      },
    });

    // Salvar informações do pagamento
    await prisma.payment.create({
      data: {
        lessonId,
        amount,
        currency: 'BRL',
        stripePaymentIntentId: paymentIntent.id,
        status: 'PENDING',
      },
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  }

  async handleWebhook(event: Stripe.Event) {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
        break;
      case 'payment_intent.payment_failed':
        await this.handlePaymentFailure(event.data.object as Stripe.PaymentIntent);
        break;
    }
  }

  private async handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
    const payment = await prisma.payment.findUnique({
      where: { stripePaymentIntentId: paymentIntent.id },
      include: { lesson: true },
    });

    if (payment) {
      await prisma.$transaction([
        prisma.payment.update({
          where: { id: payment.id },
          data: { status: 'COMPLETED' },
        }),
        prisma.lesson.update({
          where: { id: payment.lessonId },
          data: { status: 'CONFIRMED' },
        }),
      ]);
    }
  }

  private async handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
    await prisma.payment.updateMany({
      where: { stripePaymentIntentId: paymentIntent.id },
      data: { status: 'FAILED' },
    });
  }
}
```

## 4.6 Middleware de Autenticação

### Auth Middleware (src/shared/middleware/auth.middleware.ts)
```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../../database/prisma';

interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        student: true,
        professor: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token.',
    });
  }
};
```

## 4.7 Validação de Dados

### DTOs e Validação (src/shared/validators.ts)
```typescript
import { z } from 'zod';

export const CreateUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  type: z.enum(['STUDENT', 'PROFESSOR']),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const CreateLessonSchema = z.object({
  professorId: z.string().uuid(),
  startDateTime: z.string().datetime(),
  endDateTime: z.string().datetime(),
  durationMinutes: z.number().min(30).max(180),
  totalPrice: z.number().positive(),
});

export function validateDto<T>(schema: z.ZodSchema<T>, data: any): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(`Validation error: ${result.error.message}`);
  }
  return result.data;
}
```

## Entregáveis da Fase 4
- [ ] API de autenticação (registro/login)
- [ ] CRUD de usuários e professores
- [ ] Sistema de busca de professores
- [ ] API de agendamentos
- [ ] Integração com Stripe para pagamentos
- [ ] Middleware de autenticação
- [ ] Validação de dados
- [ ] Testes unitários básicos

## Próxima Fase
**Fase 5:** Desenvolvimento do Frontend (MVP)