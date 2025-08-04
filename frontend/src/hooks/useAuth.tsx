import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authApi } from '../services/api';
import { User, AuthResponse, LoginData, RegisterData } from '../types/auth';
import toast from 'react-hot-toast';

interface AuthContextData {
  user: User | null;
  loading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
    
    // Setup token refresh interval (every 6 hours)
    const refreshInterval = setInterval(() => {
      if (localStorage.getItem('@mestresmusic:token')) {
        refreshToken();
      }
    }, 6 * 60 * 60 * 1000); // 6 hours

    return () => clearInterval(refreshInterval);
  }, []);

  async function loadUser() {
    try {
      const token = localStorage.getItem('@mestresmusic:token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await authApi.me();
      setUser(response.data.user);
    } catch (error) {
      console.error('Error loading user:', error);
      localStorage.removeItem('@mestresmusic:token');
    } finally {
      setLoading(false);
    }
  }

  async function login(data: LoginData) {
    try {
      const response: { data: AuthResponse } = await authApi.login(data);
      const { user, token } = response.data;

      localStorage.setItem('@mestresmusic:token', token);
      setUser(user);
      
      toast.success(`Bem-vindo, ${user.name}!`);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao fazer login';
      toast.error(message);
      throw error;
    }
  }

  async function register(data: RegisterData) {
    try {
      const response: { data: AuthResponse } = await authApi.register(data);
      const { user, token } = response.data;

      localStorage.setItem('@mestresmusic:token', token);
      setUser(user);
      
      toast.success(`Conta criada com sucesso! Bem-vindo, ${user.name}!`);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao criar conta';
      toast.error(message);
      throw error;
    }
  }

  async function refreshToken() {
    try {
      const response = await authApi.refreshToken();
      const { token } = response.data;
      localStorage.setItem('@mestresmusic:token', token);
    } catch (error) {
      console.error('Error refreshing token:', error);
      logout();
    }
  }

  function logout() {
    localStorage.removeItem('@mestresmusic:token');
    setUser(null);
    toast.success('Logout realizado com sucesso');
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}