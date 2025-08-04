import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../modules/auth/auth.service';

interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token de acesso não fornecido',
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const authService = new AuthService();
    
    // Verify and decode token
    const decoded = authService.verifyToken(token);
    
    // Get user data
    const user = await authService.getUserById(decoded.userId);
    
    req.user = user;
    next();
  } catch (error) {
    console.error('❌ Auth middleware error:', error);
    res.status(401).json({
      success: false,
      message: error instanceof Error ? error.message : 'Token inválido',
    });
  }
};

// Middleware to check if user is a professor
export const professorMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Usuário não autenticado',
    });
  }

  if (req.user.type !== 'PROFESSOR') {
    return res.status(403).json({
      success: false,
      message: 'Acesso restrito a professores',
    });
  }

  next();
};

// Middleware to check if user is a student
export const studentMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Usuário não autenticado',
    });
  }

  if (req.user.type !== 'STUDENT') {
    return res.status(403).json({
      success: false,
      message: 'Acesso restrito a alunos',
    });
  }

  next();
};

// Middleware to check if user is an admin
export const adminMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Usuário não autenticado',
    });
  }

  if (req.user.type !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      message: 'Acesso restrito a administradores',
    });
  }

  next();
};