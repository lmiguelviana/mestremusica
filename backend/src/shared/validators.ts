import { z } from 'zod';

// Auth DTOs
export const RegisterUserSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  type: z.enum(['STUDENT', 'PROFESSOR'], {
    errorMap: () => ({ message: 'Tipo deve ser STUDENT ou PROFESSOR' })
  }),
});

export const LoginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

export const UpdateProfileSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').optional(),
  profileImageUrl: z.string().url('URL da imagem inválida').optional(),
});

// Professor DTOs
export const UpdateProfessorSchema = z.object({
  biography: z.string().optional(),
  experience: z.string().optional(),
  methodology: z.string().optional(),
  baseHourlyRate: z.number().positive('Preço deve ser positivo').optional(),
  onlineAvailable: z.boolean().optional(),
  inPersonLocation: z.string().optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  youtubeUrl: z.string().url('URL do YouTube inválida').optional(),
  instagramUrl: z.string().url('URL do Instagram inválida').optional(),
  soundcloudUrl: z.string().url('URL do SoundCloud inválida').optional(),
});

// Student DTOs
export const UpdateStudentSchema = z.object({
  dateOfBirth: z.string().datetime('Data de nascimento inválida').optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  preferences: z.record(z.any()).optional(),
});

// Generic validation function
export function validateDto<T>(schema: z.ZodSchema<T>, data: any): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errors = result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
    throw new Error(`Validation error: ${errors.join(', ')}`);
  }
  return result.data;
}

// Type exports
export type RegisterUserDto = z.infer<typeof RegisterUserSchema>;
export type LoginDto = z.infer<typeof LoginSchema>;
export type UpdateProfileDto = z.infer<typeof UpdateProfileSchema>;
export type UpdateProfessorDto = z.infer<typeof UpdateProfessorSchema>;
export type UpdateStudentDto = z.infer<typeof UpdateStudentSchema>;