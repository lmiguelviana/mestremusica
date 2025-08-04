# Fase 5: Desenvolvimento do Frontend (MVP)

## Objetivo
Implementar a interface web com React/Next.js, incluindo páginas de autenticação, dashboards, busca de professores, agendamento e integração com a API backend.

## 5.1 Estrutura Base do Frontend

### Layout Principal (src/components/layout/Layout.tsx)
```typescript
import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
}

export function Layout({ 
  children, 
  showHeader = true, 
  showFooter = true 
}: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {showHeader && <Header />}
      <main className="flex-1">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
}
```

### Header Component (src/components/layout/Header.tsx)
```typescript
import Link from 'next/link';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            MusicSchool
          </Link>

          <nav className="hidden md:flex space-x-8">
            <Link href="/professores" className="text-gray-700 hover:text-blue-600">
              Encontrar Professores
            </Link>
            <Link href="/como-funciona" className="text-gray-700 hover:text-blue-600">
              Como Funciona
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                <Button onClick={logout} variant="outline">
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Entrar</Button>
                </Link>
                <Link href="/cadastro">
                  <Button>Cadastrar</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
```

## 5.2 Sistema de Autenticação

### Auth Hook (src/hooks/useAuth.ts)
```typescript
import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  type: 'STUDENT' | 'PROFESSOR' | 'ADMIN';
}

interface AuthContextData {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('@musicschool:token');
    if (token) {
      api.defaults.headers.authorization = `Bearer ${token}`;
      // Verificar se o token é válido
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  async function loadUser() {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data.user);
    } catch (error) {
      localStorage.removeItem('@musicschool:token');
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string) {
    const response = await api.post('/auth/login', { email, password });
    const { user, token } = response.data.data;

    localStorage.setItem('@musicschool:token', token);
    api.defaults.headers.authorization = `Bearer ${token}`;
    setUser(user);
  }

  async function register(data: RegisterData) {
    const response = await api.post('/auth/register', data);
    const { user, token } = response.data.data;

    localStorage.setItem('@musicschool:token', token);
    api.defaults.headers.authorization = `Bearer ${token}`;
    setUser(user);
  }

  function logout() {
    localStorage.removeItem('@musicschool:token');
    delete api.defaults.headers.authorization;
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
```

### Página de Login (src/pages/login.tsx)
```typescript
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Entre na sua conta
            </h2>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              
              <Input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              loading={loading}
            >
              Entrar
            </Button>

            <div className="text-center">
              <Link href="/cadastro" className="text-blue-600 hover:text-blue-500">
                Não tem conta? Cadastre-se
              </Link>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
```

## 5.3 Dashboard do Aluno

### Dashboard do Aluno (src/pages/dashboard/aluno.tsx)
```typescript
import { useEffect, useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { api } from '../../services/api';
import Link from 'next/link';

interface Lesson {
  id: string;
  startDateTime: string;
  endDateTime: string;
  status: string;
  professor: {
    user: {
      name: string;
    };
  };
}

export default function StudentDashboard() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLessons();
  }, []);

  async function loadLessons() {
    try {
      const response = await api.get('/lessons/student');
      setLessons(response.data.data);
    } catch (error) {
      console.error('Erro ao carregar aulas:', error);
    } finally {
      setLoading(false);
    }
  }

  const upcomingLessons = lessons.filter(
    lesson => new Date(lesson.startDateTime) > new Date() && 
    lesson.status === 'CONFIRMED'
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Meu Dashboard
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Próximas Aulas
              </h3>
              <p className="text-3xl font-bold text-blue-600">
                {upcomingLessons.length}
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Total de Aulas
              </h3>
              <p className="text-3xl font-bold text-green-600">
                {lessons.length}
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Ação Rápida
              </h3>
              <Link href="/professores">
                <Button className="w-full">
                  Encontrar Professor
                </Button>
              </Link>
            </Card>
          </div>

          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Próximas Aulas
            </h2>
            
            {loading ? (
              <p>Carregando...</p>
            ) : upcomingLessons.length > 0 ? (
              <div className="space-y-4">
                {upcomingLessons.map(lesson => (
                  <div key={lesson.id} className="border-l-4 border-blue-500 pl-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          Aula com {lesson.professor.user.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {new Date(lesson.startDateTime).toLocaleString('pt-BR')}
                        </p>
                      </div>
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                        {lesson.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">Nenhuma aula agendada.</p>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
}
```

## 5.4 Busca de Professores

### Página de Busca (src/pages/professores.tsx)
```typescript
import { useState, useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import { ProfessorCard } from '../components/professors/ProfessorCard';
import { SearchFilters } from '../components/professors/SearchFilters';
import { api } from '../services/api';

interface Professor {
  id: string;
  user: {
    name: string;
  };
  biography: string;
  baseHourlyRate: number;
  averageRating: number;
  totalReviews: number;
  instruments: Array<{
    instrument: {
      name: string;
    };
  }>;
}

export default function Professores() {
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    instrument: '',
    minPrice: '',
    maxPrice: '',
    location: '',
  });

  useEffect(() => {
    loadProfessors();
  }, [filters]);

  async function loadProfessors() {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await api.get(`/professors?${params.toString()}`);
      setProfessors(response.data.data);
    } catch (error) {
      console.error('Erro ao carregar professores:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Encontre seu Professor
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <SearchFilters 
                filters={filters}
                onFiltersChange={setFilters}
              />
            </div>

            <div className="lg:col-span-3">
              {loading ? (
                <div className="text-center py-8">
                  <p>Carregando professores...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {professors.map(professor => (
                    <ProfessorCard 
                      key={professor.id}
                      professor={professor}
                    />
                  ))}
                </div>
              )}

              {!loading && professors.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-600">
                    Nenhum professor encontrado com os filtros selecionados.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
```

### Card do Professor (src/components/professors/ProfessorCard.tsx)
```typescript
import Link from 'next/link';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { StarIcon } from '@heroicons/react/24/solid';

interface ProfessorCardProps {
  professor: {
    id: string;
    user: {
      name: string;
    };
    biography: string;
    baseHourlyRate: number;
    averageRating: number;
    totalReviews: number;
    instruments: Array<{
      instrument: {
        name: string;
      };
    }>;
  };
}

export function ProfessorCard({ professor }: ProfessorCardProps) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
        <div>
          <h3 className="font-semibold text-gray-900">
            {professor.user.name}
          </h3>
          <div className="flex items-center">
            <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
            <span className="text-sm text-gray-600">
              {professor.averageRating?.toFixed(1) || 'N/A'} 
              ({professor.totalReviews} avaliações)
            </span>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex flex-wrap gap-2 mb-2">
          {professor.instruments.map((item, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
            >
              {item.instrument.name}
            </span>
          ))}
        </div>
        
        <p className="text-sm text-gray-600 line-clamp-3">
          {professor.biography}
        </p>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-lg font-bold text-green-600">
          R$ {professor.baseHourlyRate}/hora
        </span>
        
        <Link href={`/professores/${professor.id}`}>
          <Button size="sm">
            Ver Perfil
          </Button>
        </Link>
      </div>
    </Card>
  );
}
```

## 5.5 Agendamento de Aulas

### Página de Agendamento (src/pages/agendar/[professorId].tsx)
```typescript
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '../../components/layout/Layout';
import { Calendar } from '../../components/ui/Calendar';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { api } from '../../services/api';

export default function AgendarAula() {
  const router = useRouter();
  const { professorId } = router.query;
  
  const [professor, setProfessor] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [duration, setDuration] = useState(60);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (professorId) {
      loadProfessor();
    }
  }, [professorId]);

  async function loadProfessor() {
    try {
      const response = await api.get(`/professors/${professorId}`);
      setProfessor(response.data.data);
    } catch (error) {
      console.error('Erro ao carregar professor:', error);
    }
  }

  async function handleBookLesson() {
    if (!selectedDate || !selectedTime) {
      alert('Selecione data e horário');
      return;
    }

    setLoading(true);
    
    try {
      const startDateTime = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(':');
      startDateTime.setHours(parseInt(hours), parseInt(minutes));
      
      const endDateTime = new Date(startDateTime);
      endDateTime.setMinutes(endDateTime.getMinutes() + duration);

      const lessonData = {
        professorId,
        startDateTime: startDateTime.toISOString(),
        endDateTime: endDateTime.toISOString(),
        durationMinutes: duration,
        totalPrice: professor.baseHourlyRate * (duration / 60),
      };

      const response = await api.post('/lessons', lessonData);
      const lesson = response.data.data;

      // Redirecionar para pagamento
      router.push(`/pagamento/${lesson.id}`);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Erro ao agendar aula');
    } finally {
      setLoading(false);
    }
  }

  if (!professor) {
    return (
      <Layout>
        <div className="text-center py-8">
          <p>Carregando...</p>
        </div>
      </Layout>
    );
  }

  const totalPrice = professor.baseHourlyRate * (duration / 60);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Agendar Aula com {professor.user.name}
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Selecione a Data
                </h2>
                <Calendar
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                />
              </Card>

              {selectedDate && (
                <Card className="p-6 mt-6">
                  <h2 className="text-xl font-semibold mb-4">
                    Horários Disponíveis
                  </h2>
                  <div className="grid grid-cols-3 gap-2">
                    {['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'].map(time => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? 'default' : 'outline'}
                        onClick={() => setSelectedTime(time)}
                        size="sm"
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </Card>
              )}
            </div>

            <div>
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Detalhes da Aula
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duração
                    </label>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value={30}>30 minutos</option>
                      <option value={60}>1 hora</option>
                      <option value={90}>1h 30min</option>
                    </select>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between mb-2">
                      <span>Professor:</span>
                      <span className="font-medium">{professor.user.name}</span>
                    </div>
                    
                    {selectedDate && (
                      <div className="flex justify-between mb-2">
                        <span>Data:</span>
                        <span className="font-medium">
                          {selectedDate.toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    )}
                    
                    {selectedTime && (
                      <div className="flex justify-between mb-2">
                        <span>Horário:</span>
                        <span className="font-medium">{selectedTime}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between mb-2">
                      <span>Duração:</span>
                      <span className="font-medium">{duration} minutos</span>
                    </div>
                    
                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                      <span>Total:</span>
                      <span className="text-green-600">
                        R$ {totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={handleBookLesson}
                    loading={loading}
                    disabled={!selectedDate || !selectedTime}
                    className="w-full"
                  >
                    Confirmar Agendamento
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
```

## 5.6 Componentes UI Reutilizáveis

### Button Component (src/components/ui/Button.tsx)
```typescript
import { ButtonHTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export function Button({
  children,
  variant = 'default',
  size = 'md',
  loading = false,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-blue-500',
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={clsx(
        baseClasses,
        variants[variant],
        sizes[size],
        (disabled || loading) && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  );
}
```

## Entregáveis da Fase 5
- [ ] Sistema de autenticação (login/registro)
- [ ] Dashboard do aluno
- [ ] Dashboard do professor
- [ ] Página de busca de professores
- [ ] Sistema de agendamento
- [ ] Componentes UI reutilizáveis
- [ ] Integração completa com API
- [ ] Responsividade mobile

## Próxima Fase
**Fase 6:** Integração de Pagamentos e Testes