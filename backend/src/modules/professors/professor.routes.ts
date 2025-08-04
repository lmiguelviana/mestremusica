import { Router } from 'express';
import { ProfessorController } from './professor.controller';
import { authMiddleware, professorMiddleware } from '../../shared/middleware/auth.middleware';

const router = Router();
const professorController = new ProfessorController();

// Public routes
router.get('/search', professorController.searchProfessors);
router.get('/featured', professorController.getFeaturedProfessors);
router.get('/instruments', professorController.getInstruments);
router.get('/:id', professorController.getProfessorById);

// Protected routes (professor only)
router.put('/profile', authMiddleware, professorMiddleware, professorController.updateProfile);

export { router as professorRoutes };