import api from './api';

export interface SearchFilters {
  instrument?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  onlineAvailable?: boolean;
  limit?: number;
  offset?: number;
  sortBy?: 'rating' | 'price' | 'name';
  sortOrder?: 'asc' | 'desc';
}

export interface Professor {
  id: string;
  biography?: string;
  experience?: string;
  methodology?: string;
  baseHourlyRate: number;
  onlineAvailable: boolean;
  inPersonLocation?: string;
  approvalStatus: string;
  averageRating?: number;
  totalReviews: number;
  phone?: string;
  whatsapp?: string;
  youtubeUrl?: string;
  instagramUrl?: string;
  soundcloudUrl?: string;
  isPremium: boolean;
  user: {
    id: string;
    name: string;
    profileImageUrl?: string;
  };
  instruments: Array<{
    instrument: {
      id: string;
      name: string;
    };
    proficiencyLevel: string;
  }>;
  _count?: {
    reviews: number;
  };
}

export interface ProfessorDetail extends Professor {
  pdfMaterials: Array<{
    id: string;
    title: string;
    description?: string;
    category: string;
    uploadedAt: string;
  }>;
  youtubeMusicLinks: Array<{
    id: string;
    title: string;
    youtubeUrl: string;
    description?: string;
    category: string;
    addedAt: string;
  }>;
  certifications: Array<{
    id: string;
    title: string;
    institution: string;
    year: number;
    description?: string;
  }>;
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    year: number;
    type: string;
  }>;
  reviews: Array<{
    id: string;
    rating: number;
    comment?: string;
    createdAt: string;
    student: {
      user: {
        name: string;
      };
    };
  }>;
}

export interface Instrument {
  id: string;
  name: string;
}

export const professorApi = {
  search: async (filters: SearchFilters) => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await api.get(`/api/professors/search?${params.toString()}`);
    return response.data;
  },

  getById: async (id: string): Promise<{ data: ProfessorDetail }> => {
    const response = await api.get(`/api/professors/${id}`);
    return response.data;
  },

  getFeatured: async (limit = 6) => {
    const response = await api.get(`/api/professors/featured?limit=${limit}`);
    return response.data;
  },

  getInstruments: async (): Promise<{ data: Instrument[] }> => {
    const response = await api.get('/api/professors/instruments');
    return response.data;
  },

  updateProfile: async (data: Partial<Professor>) => {
    const response = await api.put('/api/professors/profile', data);
    return response.data;
  },
};