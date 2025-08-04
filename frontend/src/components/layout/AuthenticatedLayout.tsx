import { ReactNode } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { Logo } from '../ui/Logo';

interface AuthenticatedLayoutProps {
  children: ReactNode;
  title?: string;
}

export function AuthenticatedLayout({ children, title }: AuthenticatedLayoutProps) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Header */}
      <header className="bg-dark-900 border-b border-dark-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo size="md" />
            
            <div className="flex items-center space-x-4">
              {/* User Info */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-white text-sm font-medium">{user?.name}</p>
                  <p className="text-gray-400 text-xs">
                    {user?.type === 'PROFESSOR' ? 'Professor' : 
                     user?.type === 'STUDENT' ? 'Aluno' : 'Admin'}
                  </p>
                </div>
              </div>

              {/* Navigation */}
              <nav className="hidden md:flex items-center space-x-4">
                {user?.type === 'STUDENT' && (
                  <>
                    <Button variant="ghost" size="sm">Professores</Button>
                    <Button variant="ghost" size="sm">Minhas Aulas</Button>
                  </>
                )}
                {user?.type === 'PROFESSOR' && (
                  <>
                    <Button variant="ghost" size="sm">Meu Perfil</Button>
                    <Button variant="ghost" size="sm">Alunos</Button>
                    <Button variant="outline" size="sm">Premium</Button>
                  </>
                )}
              </nav>

              {/* Logout */}
              <Button variant="ghost" onClick={logout} size="sm">
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {title && (
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white">{title}</h1>
            </div>
          )}
          {children}
        </div>
      </main>
    </div>
  );
}