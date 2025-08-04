import { Router } from 'express';
import { LessonController } from './lesson.controller';
import { authMiddleware, professorMiddleware, studentMiddleware } from '../../shared/middleware/auth.middleware';

const router = Router();
const lessonController = new LessonController();

// Rotas públicas (para usuários não logados também poderem solicitar aulas)
router.post('/request', lessonController.createLessonRequest);
router.get('/:id', lessonController.getLessonById);

// Rotas protegidas - Professor
router.get('/professor/list', authMiddleware, professorMiddleware, lessonController.getProfessorLessons);

// Rotas protegidas - Aluno
router.get('/student/list', authMiddleware, studentMiddleware, lessonController.getStudentLessons);

// Rotas protegidas - Ambos (professor e aluno podem atualizar status)
router.put('/:id/status', authMiddleware, lessonController.updateLessonStatus);

// Dashboard data
router.get('/dashboard/data', authMiddleware, lessonController.getDashboardData);

export { router as lessonRoutes };