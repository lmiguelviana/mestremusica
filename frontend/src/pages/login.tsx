import Head from 'next/head';
import { LoginForm } from '../components/auth/LoginForm';
import { PublicRoute } from '../components/auth/PublicRoute';

export default function LoginPage() {
  return (
    <PublicRoute>
      <Head>
        <title>Login - MestresMusic</title>
        <meta name="description" content="Entre na sua conta MestresMusic" />
      </Head>
      <LoginForm />
    </PublicRoute>
  );
}