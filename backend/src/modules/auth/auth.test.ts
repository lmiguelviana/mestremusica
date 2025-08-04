import { AuthService } from './auth.service';
import { prisma } from '../../database/prisma';

// Mock Prisma for testing
jest.mock('../../database/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

describe('AuthService', () => {
  let authService: AuthService;
  const mockPrisma = prisma as jest.Mocked<typeof prisma>;

  beforeEach(() => {
    authService = new AuthService();
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should create a new user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        type: 'STUDENT' as const,
      };

      const mockUser = {
        id: '1',
        email: userData.email,
        name: userData.name,
        type: userData.type,
        passwordHash: 'hashedpassword',
        isActive: true,
        profileImageUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        student: {},
        professor: null,
      };

      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue(mockUser);

      const result = await authService.register(userData);

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');
      expect(result.user.email).toBe(userData.email);
      expect(result.user.name).toBe(userData.name);
      expect(result.user).not.toHaveProperty('passwordHash');
    });

    it('should throw error if email already exists', async () => {
      const userData = {
        email: 'existing@example.com',
        password: 'password123',
        name: 'Test User',
        type: 'STUDENT' as const,
      };

      mockPrisma.user.findUnique.mockResolvedValue({
        id: '1',
        email: userData.email,
      } as any);

      await expect(authService.register(userData)).rejects.toThrow('Email já está em uso');
    });
  });

  describe('login', () => {
    it('should login user with correct credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockUser = {
        id: '1',
        email: loginData.email,
        name: 'Test User',
        type: 'STUDENT',
        passwordHash: '$2a$12$hashedpassword', // This would be a real bcrypt hash
        isActive: true,
        profileImageUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        student: {},
        professor: null,
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      // Mock bcrypt.compare to return true
      const bcrypt = require('bcryptjs');
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await authService.login(loginData);

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');
      expect(result.user.email).toBe(loginData.email);
    });

    it('should throw error for invalid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(authService.login(loginData)).rejects.toThrow('Email ou senha incorretos');
    });
  });
});