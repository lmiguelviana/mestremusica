import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';

interface PublicRouteProps {
  children: ReactNode;
  redirectIfAuthenticated?: boolean;
  redirectTo?: string;
}

export function PublicRoute({ 
  children, 
  redirectIfAuthenticated = true,
  redirectTo = '/dashboard'
}: PublicRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user && redirectIfAuthenticated) {
      // Redirect based on user type
      if (user.type === 'STUDENT') {
        router.push('/dashboard');
      } else if (user.type === 'PROFESSOR') {
        router.push('/dashboard/professor');
      } else if (user.type === 'ADMIN') {
        router.push('/dashboard/admin');
      } else {
        router.push(redirectTo);
      }
    }
  }, [user, loading, router, redirectIfAuthenticated, redirectTo]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  // Don't render if authenticated and should redirect
  if (user && redirectIfAuthenticated) {
    return null;
  }

  return <>{children}</>;
}