import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../database/prisma';
import { RegisterUserDto, LoginDto } from '../../shared/validators';
import env from '../../config/env';

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    type: string;
    profileImageUrl?: string;
    isActive: boolean;
  };
  token: string;
}

export class AuthService {
  async register(data: RegisterUserDto): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error('Email já está em uso');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Create user with profile
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash: hashedPassword,
        name: data.name,
        type: data.type,
        // Create specific profile based on type
        ...(data.type === 'STUDENT' && {
          student: {
            create: {},
          },
        }),
        ...(data.type === 'PROFESSOR' && {
          professor: {
            create: {
              baseHourlyRate: 50.00, // Default rate
              approvalStatus: 'PENDING',
            },
          },
        }),
      },
      include: {
        student: true,
        professor: true,
      },
    });

    const token = this.generateToken(user.id);
    return {
      user: this.sanitizeUser(user),
      token,
    };
  }

  async login(data: LoginDto): Promise<AuthResponse> {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: data.email },
      include: {
        student: true,
        professor: true,
      },
    });

    if (!user) {
      throw new Error('Email ou senha incorretos');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new Error('Conta desativada. Entre em contato com o suporte.');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error('Email ou senha incorretos');
    }

    const token = this.generateToken(user.id);
    return {
      user: this.sanitizeUser(user),
      token,
    };
  }

  async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        student: true,
        professor: {
          include: {
            instruments: {
              include: {
                instrument: true,
              },
            },
            premiumPlan: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    return this.sanitizeUser(user);
  }

  async refreshToken(userId: string): Promise<string> {
    // Verify user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.isActive) {
      throw new Error('Token inválido');
    }

    return this.generateToken(userId);
  }

  private generateToken(userId: string): string {
    return jwt.sign(
      { userId },
      env.JWT_SECRET,
      { 
        expiresIn: '7d',
        issuer: 'mestresmusic',
        audience: 'mestresmusic-users',
      }
    );
  }

  verifyToken(token: string): { userId: string } {
    try {
      const secret = env.JWT_SECRET;
      const options: jwt.VerifyOptions = {
        issuer: 'mestresmusic',
        audience: 'mestresmusic-users',
      };
      
      const decoded = jwt.verify(token, secret, options) as { userId: string };
      return decoded;
    } catch (error) {
      throw new Error('Token inválido ou expirado');
    }
  }

  private sanitizeUser(user: any) {
    const { passwordHash, ...sanitized } = user;
    return sanitized;
  }
}