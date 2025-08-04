import { Request, Response } from 'express';
import { ProfessorService } from './professor.service';

export class ProfessorController {
  private professorService = new ProfessorService();

  searchProfessors = async (req: Request, res: Response) => {
    try {
      const filters = {
        instrument: req.query.instrument as string,
        minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
        location: req.query.location as string,
        onlineAvailable: req.query.onlineAvailable === 'true',
        limit: req.query.limit ? Number(req.query.limit) : 20,
        offset: req.query.offset ? Number(req.query.offset) : 0,
        sortBy: req.query.sortBy as 'rating' | 'price' | 'name',
        sortOrder: req.query.sortOrder as 'asc' | 'desc',
      };

      const result = await this.professorService.searchProfessors(filters);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('❌ Search professors error:', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao buscar professores',
      });
    }
  };

  getProfessorById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const professor = await this.professorService.getProfessorById(id);

      res.json({
        success: true,
        data: professor,
      });
    } catch (error) {
      console.error('❌ Get professor error:', error);
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : 'Professor não encontrado',
      });
    }
  };

  getInstruments = async (req: Request, res: Response) => {
    try {
      const instruments = await this.professorService.getInstruments();

      res.json({
        success: true,
        data: instruments,
      });
    } catch (error) {
      console.error('❌ Get instruments error:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar instrumentos',
      });
    }
  };

  getFeaturedProfessors = async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 6;
      const professors = await this.professorService.getFeaturedProfessors(limit);

      res.json({
        success: true,
        data: professors,
      });
    } catch (error) {
      console.error('❌ Get featured professors error:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar professores em destaque',
      });
    }
  };

  updateProfile = async (req: Request & { user?: any }, res: Response) => {
    try {
      if (!req.user || req.user.type !== 'PROFESSOR') {
        return res.status(403).json({
          success: false,
          message: 'Acesso negado',
        });
      }

      const professorId = req.user.professor?.id;
      if (!professorId) {
        return res.status(404).json({
          success: false,
          message: 'Perfil de professor não encontrado',
        });
      }

      const updatedProfessor = await this.professorService.updateProfessorProfile(
        professorId,
        req.body
      );

      res.json({
        success: true,
        message: 'Perfil atualizado com sucesso',
        data: updatedProfessor,
      });
    } catch (error) {
      console.error('❌ Update professor profile error:', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao atualizar perfil',
      });
    }
  };
}