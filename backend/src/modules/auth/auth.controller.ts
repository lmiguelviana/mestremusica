import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { validateDto, RegisterUserSchema, LoginSchema } from '../../shared/validators';

export class AuthController {
  private authService = new AuthService();

  register = async (req: Request, res: Response) => {
    try {
      const data = validateDto(RegisterUserSchema, req.body);
      const result = await this.authService.register(data);
      
      res.status(201).json({
        success: true,
        message: 'Usuário criado com sucesso',
        data: result,
      });
    } catch (error) {
      console.error('❌ Registration error:', error);
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao criar usuário',
      });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const data = validateDto(LoginSchema, req.body);
      const result = await this.authService.login(data);
      
      res.json({
        success: true,
        message: 'Login realizado com sucesso',
        data: result,
      });
    } catch (error) {
      console.error('❌ Login error:', error);
      res.status(401).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao fazer login',
      });
    }
  };

  me = async (req: Request & { user?: any }, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Token não fornecido',
        });
      }

      const user = await this.authService.getUserById(req.user.id);
      
      res.json({
        success: true,
        data: { user },
      });
    } catch (error) {
      console.error('❌ Get user error:', error);
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao buscar usuário',
      });
    }
  };

  refreshToken = async (req: Request & { user?: any }, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Token não fornecido',
        });
      }

      const newToken = await this.authService.refreshToken(req.user.id);
      
      res.json({
        success: true,
        message: 'Token renovado com sucesso',
        data: { token: newToken },
      });
    } catch (error) {
      console.error('❌ Refresh token error:', error);
      res.status(401).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao renovar token',
      });
    }
  };

  logout = async (req: Request, res: Response) => {
    // For JWT, logout is handled on the client side by removing the token
    // Here we can add token blacklisting if needed in the future
    res.json({
      success: true,
      message: 'Logout realizado com sucesso',
    });
  };
}