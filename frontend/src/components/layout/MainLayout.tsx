import { ReactNode } from 'react';
import Link from 'next/link';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { Logo } from '../ui/Logo';

interface MainLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
}

export function MainLayout({ 
  children, 
  showHeader = true, 
  showFooter = true 
}: MainLayoutProps) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Header */}
      {showHeader && (
        <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <Logo size="md" />
              
              {/* Navigation */}
              <nav className="hidden md:flex items-center space-x-8">
                <Link 
                  href="/professores" 
                  className="text-gray-300 hover:text-orange-400 transition-all duration-300 font-medium relative group"
                >
                  Encontrar Professores
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-400 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link 
                  href="/como-funciona" 
                  className="text-gray-300 hover:text-orange-400 transition-all duration-300 font-medium relative group"
                >
                  Como Funciona
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-400 group-hover:w-full transition-all duration-300"></span>
                </Link>
                {user?.type === 'PROFESSOR' && (
                  <Link 
                    href="/dashboard/professor" 
                    className="text-gray-300 hover:text-orange-400 transition-all duration-300 font-medium relative group"
                  >
                    Meu Perfil
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-400 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                )}
              </nav>

              {/* User Actions */}
              <div className="flex items-center space-x-4">
                {user ? (
                  <>
                    {/* User Info */}
                    <div className="hidden sm:flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/25 ring-2 ring-orange-500/20">
                        <span className="text-white text-sm font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-white text-sm font-semibold">{user.name}</p>
                        <p className="text-gray-400 text-xs">
                          {user.type === 'PROFESSOR' ? '🎵 Professor' : 
                           user.type === 'STUDENT' ? '🎓 Aluno' : '⚙️ Admin'}
                        </p>
                      </div>
                    </div>

                    {/* Dashboard Link */}
                    <Link 
                      href="/dashboard"
                      className="text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-gray-800/50 border border-transparent hover:border-gray-700"
                    >
                      Dashboard
                    </Link>

                    {/* Logout */}
                    <Button variant="ghost" onClick={logout} size="sm">
                      Sair
                    </Button>
                  </>
                ) : (
                  <>
                    <Link 
                      href="/login"
                      className="text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-gray-800/50 border border-transparent hover:border-gray-700"
                    >
                      Entrar
                    </Link>
                    <Link 
                      href="/register"
                      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-300 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-105"
                    >
                      Cadastrar
                    </Link>
                  </>
                )}
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button className="text-gray-400 hover:text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      {showFooter && (
        <footer className="bg-gray-900 border-t border-gray-800 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Logo e Descrição */}
              <div className="col-span-1 md:col-span-2">
                <Logo size="md" showTagline />
                <p className="text-gray-400 mt-4 max-w-md">
                  A plataforma brasileira que conecta alunos e professores de música, 
                  criando uma comunidade musical forte e colaborativa.
                </p>
              </div>
              
              {/* Links da Plataforma */}
              <div>
                <h4 className="text-white font-medium mb-4">Plataforma</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <Link href="/professores" className="hover:text-orange-400 transition-colors">
                      Encontrar Professores
                    </Link>
                  </li>
                  <li>
                    <Link href="/como-funciona" className="hover:text-orange-400 transition-colors">
                      Como Funciona
                    </Link>
                  </li>
                  <li>
                    <Link href="/precos" className="hover:text-orange-400 transition-colors">
                      Preços
                    </Link>
                  </li>
                  <li>
                    <Link href="/contato" className="hover:text-orange-400 transition-colors">
                      Contato
                    </Link>
                  </li>
                </ul>
              </div>
              
              {/* Links Legais */}
              <div>
                <h4 className="text-white font-medium mb-4">Legal</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <Link href="/termos" className="hover:text-orange-400 transition-colors">
                      Termos de Uso
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacidade" className="hover:text-orange-400 transition-colors">
                      Privacidade
                    </Link>
                  </li>
                  <li>
                    <Link href="/cookies" className="hover:text-orange-400 transition-colors">
                      Cookies
                    </Link>
                  </li>
                  <li>
                    <Link href="/suporte" className="hover:text-orange-400 transition-colors">
                      Suporte
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Copyright */}
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 MestresMusic. Todos os direitos reservados.</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}