import { prisma } from '../../database/prisma';

export interface CreateLessonRequestDto {
  professorId: string;
  studentId: string;
  preferredDate: string;
  preferredTime: string;
  duration: number; // em minutos
  lessonType: 'ONLINE' | 'IN_PERSON';
  message?: string;
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
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

      // Criar a solicitação de aula
      const lesson = await prisma.lesson.create({
        data: {
          studentId: data.studentId,
          professorId: data.professorId,
          startDateTime: new Date(`${data.preferredDate}T${data.preferredTime}`),
          endDateTime: new Date(new Date(`${data.preferredDate}T${data.preferredTime}`).getTime() + data.duration * 60000),
          durationMinutes: data.duration,
          totalPrice: parseFloat(professor.baseHourlyRate.toString()) * (data.duration / 60),
          status: 'PENDING',
          lessonType: data.lessonType,
          studentNotes: data.message,
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

  async updateLessonStatus(lessonId: string, data: UpdateLessonStatusDto, userId: string) {
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

      // Verificar permissões (professor ou aluno podem atualizar)
      const canUpdate = 
        lesson.professor.user.id === userId || 
        lesson.student?.user.id === userId;

      if (!canUpdate) {
        throw new Error('Sem permissão para atualizar esta aula');
      }

      // Atualizar a aula
      const updatedLesson = await prisma.lesson.update({
        where: { id: lessonId },
        data: {
          status: data.status,
          professorNotes: data.professorNotes,
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