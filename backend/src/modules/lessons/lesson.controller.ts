import { Request, Response } from 'express';
import { LessonService, CreateLessonRequestDto, UpdateLessonStatusDto } from './lesson.service';

interface AuthRequest extends Request {
  user?: any;
}

export class LessonController {
  private lessonService = new LessonService();

  createLessonRequest = async (req: AuthRequest, res: Response) => {
    try {
      const {
        professorId,
        preferredDate,
        preferredTime,
        duration,
        lessonType,
        message,
        studentName,
        studentEmail,
        studentPhone
      } = req.body;

      // Validações básicas
      if (!professorId || !preferredDate || !preferredTime || !duration || !studentName || !studentEmail) {
        return res.status(400).json({
          success: false,
          message: 'Dados obrigatórios não fornecidos'
        });
      }

      // Se o usuário estiver logado, usar o ID dele, senão criar como guest
      const studentId = req.user?.student?.id || null;

      const lessonData: CreateLessonRequestDto = {
        professorId,
        studentId,
        preferredDate,
        preferredTime,
        duration: Number(duration),
        lessonType: lessonType || 'ONLINE',
        message,
        studentName,
        studentEmail,
        studentPhone
      };

      const lesson = await this.lessonService.createLessonRequest(lessonData);

      res.status(201).json({
        success: true,
        message: 'Solicitação de aula criada com sucesso',
        data: lesson
      });
    } catch (error) {
      console.error('❌ Create lesson request error:', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao criar solicitação de aula'
      });
    }
  };

  getProfessorLessons = async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user || req.user.type !== 'PROFESSOR') {
        return res.status(403).json({
          success: false,
          message: 'Acesso negado'
        });
      }

      const professorId = req.user.professor?.id;
      if (!professorId) {
        return res.status(404).json({
          success: false,
          message: 'Perfil de professor não encontrado'
        });
      }

      const { status } = req.query;
      const lessons = await this.lessonService.getProfessorLessons(
        professorId, 
        status as string
      );

      res.json({
        success: true,
        data: lessons
      });
    } catch (error) {
      console.error('❌ Get professor lessons error:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar aulas do professor'
      });
    }
  };

  getStudentLessons = async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user || req.user.type !== 'STUDENT') {
        return res.status(403).json({
          success: false,
          message: 'Acesso negado'
        });
      }

      const studentId = req.user.student?.id;
      if (!studentId) {
        return res.status(404).json({
          success: false,
          message: 'Perfil de aluno não encontrado'
        });
      }

      const lessons = await this.lessonService.getStudentLessons(studentId);

      res.json({
        success: true,
        data: lessons
      });
    } catch (error) {
      console.error('❌ Get student lessons error:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar aulas do aluno'
      });
    }
  };

  updateLessonStatus = async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Usuário não autenticado'
        });
      }

      const { id } = req.params;
      const { status, professorNotes } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          message: 'Status é obrigatório'
        });
      }

      const lesson = await this.lessonService.updateLessonStatus(
        id,
        status,
        req.user.id,
        professorNotes
      );

      res.json({
        success: true,
        message: 'Status da aula atualizado com sucesso',
        data: lesson
      });
    } catch (error) {
      console.error('❌ Update lesson status error:', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao atualizar status da aula'
      });
    }
  };

  getLessonById = async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const lesson = await this.lessonService.getLessonById(id);

      res.json({
        success: true,
        data: lesson
      });
    } catch (error) {
      console.error('❌ Get lesson by ID error:', error);
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : 'Aula não encontrada'
      });
    }
  };

  getDashboardData = async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Usuário não autenticado'
        });
      }

      let dashboardData: any = {};

      if (req.user.type === 'PROFESSOR') {
        const professorId = req.user.professor?.id;
        if (professorId) {
          const [pendingCount, upcomingLessons] = await Promise.all([
            this.lessonService.getPendingLessonsCount(professorId),
            this.lessonService.getUpcomingLessons(professorId, 'PROFESSOR')
          ]);

          dashboardData = {
            pendingLessonsCount: pendingCount,
            upcomingLessons,
            userType: 'PROFESSOR'
          };
        }
      } else if (req.user.type === 'STUDENT') {
        const studentId = req.user.student?.id;
        if (studentId) {
          const upcomingLessons = await this.lessonService.getUpcomingLessons(studentId, 'STUDENT');
          
          dashboardData = {
            upcomingLessons,
            userType: 'STUDENT'
          };
        }
      }

      res.json({
        success: true,
        data: dashboardData
      });
    } catch (error) {
      console.error('❌ Get dashboard data error:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar dados do dashboard'
      });
    }
  };
}