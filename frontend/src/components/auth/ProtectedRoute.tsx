import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredUserType?: 'STUDENT' | 'PROFESSOR' | 'ADMIN';
  redirectTo?: string;
}

export function ProtectedRoute({ 
  children, 
  requiredUserType, 
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // Not authenticated
      if (!user) {
        router.push(redirectTo);
        return;
      }

      // Wrong user type
      if (requiredUserType && user.type !== requiredUserType) {
        // Redirect based on user type
        if (user.type === 'STUDENT') {
          router.push('/dashboard');
        } else if (user.type === 'PROFESSOR') {
          router.push('/dashboard/professor');
        } else if (user.type === 'ADMIN') {
          router.push('/dashboard/admin');
        }
        return;
      }
    }
  }, [user, loading, router, requiredUserType, redirectTo]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated or wrong user type
  if (!user || (requiredUserType && user.type !== requiredUserType)) {
    return null;
  }

  return <>{children}</>;
}