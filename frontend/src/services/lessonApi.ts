import { api } from './api';

export interface CreateLessonRequest {
  professorId: string;
  preferredDate: string;
  preferredTime: string;
  duration: number;
  lessonType: 'ONLINE' | 'IN_PERSON';
  message?: string;
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
}

export interface Lesson {
  id: string;
  startDateTime: string;
  endDateTime: string;
  durationMinutes: number;
  totalPrice: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  lessonType: string;
  studentNotes?: string;
  professorNotes?: string;
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
  student?: {
    user: {
      name: string;
      email: string;
    };
  };
  professor: {
    user: {
      name: string;
      email: string;
    };
  };
  createdAt: string;
}

export const lessonApi = {
  // Criar solicitação de aula
  async createLessonRequest(data: CreateLessonRequest): Promise<Lesson> {
    const response = await api.post('/lessons/request', data);
    return response.data.data;
  },

  // Listar aulas do professor
  async getProfessorLessons(status?: string): Promise<Lesson[]> {
    const params = status ? `?status=${status}` : '';
    const response = await api.get(`/lessons/professor/list${params}`);
    return response.data.data;
  },

  // Listar aulas do aluno
  async getStudentLessons(): Promise<Lesson[]> {
    const response = await api.get('/lessons/student/list');
    return response.data.data;
  },

  // Atualizar status da aula
  async updateLessonStatus(
    lessonId: string, 
    status: string, 
    professorNotes?: string
  ): Promise<Lesson> {
    const response = await api.put(`/lessons/${lessonId}/status`, {
      status,
      professorNotes
    });
    return response.data.data;
  },

  // Buscar aula por ID
  async getLessonById(lessonId: string): Promise<Lesson> {
    const response = await api.get(`/lessons/${lessonId}`);
    return response.data.data;
  },

  // Dados do dashboard
  async getDashboardData(): Promise<any> {
    const response = await api.get('/lessons/dashboard/data');
    return response.data.data;
  }
};