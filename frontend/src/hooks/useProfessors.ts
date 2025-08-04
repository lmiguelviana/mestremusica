import { useState, useEffect } from 'react';
import { api } from '../services/api';

export interface Professor {
  id: string;
  user: {
    id: string;
    name: string;
    profileImageUrl?: string;
  };
  biography: string;
  experience?: string;
  methodology?: string;
  baseHourlyRate: string;
  averageRating?: number;
  totalReviews: number;
  onlineAvailable: boolean;
  inPersonLocation?: string;
  isPremium: boolean;
  phone?: string;
  whatsapp?: string;
  youtubeUrl?: string;
  instagramUrl?: string;
  soundcloudUrl?: string;
  instruments: Array<{
    instrument: {
      id: string;
      name: string;
    };
    proficiencyLevel: string;
  }>;
  _count: {
    reviews: number;
  };
}

export interface SearchFilters {
  instrument?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  onlineAvailable?: boolean;
  sortBy?: 'rating' | 'price' | 'name';
  sortOrder?: 'asc' | 'desc';
}

export interface ProfessorsResponse {
  professors: Professor[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export function useProfessors() {
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 20,
    offset: 0,
    hasMore: false,
  });

  const searchProfessors = async (filters: SearchFilters = {}, loadMore = false) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      
      // Add filters to params
      if (filters.instrument) params.append('instrument', filters.instrument);
      if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
      if (filters.location) params.append('location', filters.location);
      if (filters.onlineAvailable !== undefined) {
        params.append('onlineAvailable', filters.onlineAvailable.toString());
      }
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

      // Pagination
      const offset = loadMore ? pagination.offset + pagination.limit : 0;
      params.append('limit', pagination.limit.toString());
      params.append('offset', offset.toString());

      const response = await api.get(`/professors/search?${params.toString()}`);
      const data: ProfessorsResponse = response.data.data;

      if (loadMore) {
        setProfessors(prev => [...prev, ...data.professors]);
      } else {
        setProfessors(data.professors);
      }

      setPagination(data.pagination);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao buscar professores');
      console.error('Error searching professors:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = (filters: SearchFilters = {}) => {
    if (pagination.hasMore && !loading) {
      searchProfessors(filters, true);
    }
  };

  return {
    professors,
    loading,
    error,
    pagination,
    searchProfessors,
    loadMore,
  };
}

// Hook para buscar instrumentos
export function useInstruments() {
  const [instruments, setInstruments] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInstruments = async () => {
      try {
        setLoading(true);
        const response = await api.get('/professors/instruments');
        setInstruments(response.data.data);
      } catch (error) {
        console.error('Error fetching instruments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstruments();
  }, []);

  return { instruments, loading };
}