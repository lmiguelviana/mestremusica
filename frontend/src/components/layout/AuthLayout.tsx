import { ReactNode } from 'react';
import Link from 'next/link';
import { Logo } from '../ui/Logo';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: ReactNode;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Simple Header */}
      <header className="bg-gray-900/50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo size="md" />
            
            <Link 
              href="/" 
              className="text-gray-400 hover:text-orange-400 transition-colors text-sm"
            >
              ← Voltar ao início
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Title */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">
              {title}
            </h2>
            {subtitle && (
              <div className="mt-2 text-gray-400">
                {subtitle}
              </div>
            )}
          </div>
          
          {/* Form Content */}
          {children}
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="bg-gray-900/30 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-400 text-sm">
            <p>&copy; 2024 MestresMusic. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}