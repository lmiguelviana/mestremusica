export interface User {
  id: string;
  email: string;
  name: string;
  type: 'STUDENT' | 'PROFESSOR' | 'ADMIN';
  profileImageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  student?: Student;
  professor?: Professor;
}

export interface Student {
  id: string;
  userId: string;
  dateOfBirth?: string;
  phone?: string;
  address?: string;
  preferences?: any;
}

export interface Professor {
  id: string;
  userId: string;
  biography?: string;
  experience?: string;
  methodology?: string;
  baseHourlyRate: number;
  onlineAvailable: boolean;
  inPersonLocation?: string;
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  averageRating?: number;
  totalReviews: number;
  phone?: string;
  whatsapp?: string;
  youtubeUrl?: string;
  instagramUrl?: string;
  soundcloudUrl?: string;
  isPremium: boolean;
  premiumExpiresAt?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  type: 'STUDENT' | 'PROFESSOR';
}