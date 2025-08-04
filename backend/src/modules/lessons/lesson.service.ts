import { prisma } from '../../database/prisma';

export interface CreateLessonRequestDto {
  professorId: string;
  studentId?: string | null;
  preferredDate?: string;
  preferredTime?: string;
  startDateTime?: Date;
  endDateTime?: Date;
  duration?: number; // em minutos
  durationMinutes?: number;
  lessonType: 'ONLINE' | 'IN_PERSON';
  message?: string;
  studentNotes?: string;
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
  totalPrice?: number;
}

export interface UpdateLessonStatusDto {
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  professorNotes?: string;
}

export class LessonService {
  async createLessonRequest(data: CreateLessonRequestDto) {
    try {
      // Verificar se o professor existe e está aprovado
      const professor = await prisma.professor.findUnique({
        where: { 
          id: data.professorId,
          approvalStatus: 'APPROVED'
        },
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      });

      if (!professor) {
        throw new Error('Professor não encontrado ou não aprovado');
      }

      // Calcular datas se não fornecidas
      let startDateTime: Date;
      let endDateTime: Date;
      let durationMinutes: number;

      if (data.startDateTime && data.endDateTime) {
        startDateTime = data.startDateTime;
        endDateTime = data.endDateTime;
        durationMinutes = data.durationMinutes || Math.round((endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60));
      } else if (data.preferredDate && data.preferredTime && data.duration) {
        startDateTime = new Date(`${data.preferredDate}T${data.preferredTime}`);
        endDateTime = new Date(startDateTime.getTime() + data.duration * 60000);
        durationMinutes = data.duration;
      } else {
        throw new Error('Dados de data/hora insuficientes');
      }

      // Calcular preço se não fornecido
      const totalPrice = data.totalPrice || parseFloat(professor.baseHourlyRate.toString()) * (durationMinutes / 60);

      // Criar a solicitação de aula
      const lesson = await prisma.lesson.create({
        data: {
          studentId: data.studentId || null,
          professorId: data.professorId,
          startDateTime,
          endDateTime,
          durationMinutes,
          totalPrice,
          status: 'PENDING',
          lessonType: data.lessonType,
          studentNotes: data.message || data.studentNotes,
          // Dados do aluno para casos onde não há cadastro
          studentName: data.studentName,
          studentEmail: data.studentEmail,
          studentPhone: data.studentPhone,
        },
        include: {
          professor: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true
                }
              }
            }
          },
          student: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true
                }
              }
            }
          }
        }
      });

      return lesson;
    } catch (error) {
      console.error('Error creating lesson request:', error);
      throw error;
    }
  }

  async getProfessorLessons(professorId: string, status?: string) {
    try {
      const where: any = { professorId };
      
      if (status) {
        where.status = status;
      }

      const lessons = await prisma.lesson.findMany({
        where,
        include: {
          student: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true
                }
              }
            }
          }
        },
        orderBy: {
          startDateTime: 'desc'
        }
      });

      return lessons;
    } catch (error) {
      console.error('Error fetching professor lessons:', error);
      throw error;
    }
  }

  async getStudentLessons(studentId: string) {
    try {
      const lessons = await prisma.lesson.findMany({
        where: { studentId },
        include: {
          professor: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true
                }
              }
            }
          }
        },
        orderBy: {
          startDateTime: 'desc'
        }
      });

      return lessons;
    } catch (error) {
      console.error('Error fetching student lessons:', error);
      throw error;
    }
  }

  async updateLessonStatus(lessonId: string, status: string, userId?: string, professorNotes?: string) {
    try {
      // Verificar se a aula existe e se o usuário tem permissão
      const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        include: {
          professor: { include: { user: true } },
          student: { include: { user: true } }
        }
      });

      if (!lesson) {
        throw new Error('Aula não encontrada');
      }

      // Verificar permissões se userId fornecido
      if (userId) {
        const canUpdate = 
          lesson.professor.user.id === userId || 
          lesson.student?.user.id === userId;

        if (!canUpdate) {
          throw new Error('Sem permissão para atualizar esta aula');
        }
      }

      // Atualizar a aula
      const updatedLesson = await prisma.lesson.update({
        where: { id: lessonId },
        data: {
          status: status as any,
          professorNotes: professorNotes,
          updatedAt: new Date()
        },
        include: {
          professor: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true
                }
              }
            }
          },
          student: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true
                }
              }
            }
          }
        }
      });

      return updatedLesson;
    } catch (error) {
      console.error('Error updating lesson status:', error);
      throw error;
    }
  }

  async getLessonById(lessonId: string) {
    try {
      const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        include: {
          professor: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true
                }
              }
            }
          },
          student: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true
                }
              }
            }
          }
        }
      });

      if (!lesson) {
        throw new Error('Aula não encontrada');
      }

      return lesson;
    } catch (error) {
      console.error('Error fetching lesson:', error);
      throw error;
    }
  }

  async getPendingLessonsCount(professorId: string) {
    try {
      const count = await prisma.lesson.count({
        where: {
          professorId,
          status: 'PENDING'
        }
      });

      return count;
    } catch (error) {
      console.error('Error counting pending lessons:', error);
      throw error;
    }
  }

  async getUpcomingLessons(userId: string, userType: 'STUDENT' | 'PROFESSOR') {
    try {
      const where: any = {
        status: 'CONFIRMED',
        startDateTime: {
          gte: new Date()
        }
      };

      if (userType === 'STUDENT') {
        where.studentId = userId;
      } else {
        where.professorId = userId;
      }

      const lessons = await prisma.lesson.findMany({
        where,
        include: {
          professor: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true
                }
              }
            }
          },
          student: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true
                }
              }
            }
          }
        },
        orderBy: {
          startDateTime: 'asc'
        },
        take: 5
      });

      return lessons;
    } catch (error) {
      console.error('Error fetching upcoming lessons:', error);
      throw error;
    }
  }
}