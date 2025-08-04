import { useRouter } from 'next/router';
import { useAuth } from './useAuth';

export function useRedirect() {
  const router = useRouter();
  const { user } = useAuth();

  const redirectToDashboard = () => {
    if (!user) {
      router.push('/login');
      return;
    }

    switch (user.type) {
      case 'STUDENT':
        router.push('/dashboard');
        break;
      case 'PROFESSOR':
        router.push('/dashboard/professor');
        break;
      case 'ADMIN':
        router.push('/dashboard/admin');
        break;
      default:
        router.push('/dashboard');
    }
  };

  const redirectToLogin = () => {
    router.push('/login');
  };

  const redirectToRegister = (userType?: 'STUDENT' | 'PROFESSOR') => {
    const url = userType ? `/register?type=${userType.toLowerCase()}` : '/register';
    router.push(url);
  };

  return {
    redirectToDashboard,
    redirectToLogin,
    redirectToRegister,
  };
}