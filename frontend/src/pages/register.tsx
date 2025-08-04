import Head from 'next/head';
import { RegisterForm } from '../components/auth/RegisterForm';
import { PublicRoute } from '../components/auth/PublicRoute';

export default function RegisterPage() {
  return (
    <PublicRoute>
      <Head>
        <title>Cadastro - MestresMusic</title>
        <meta name="description" content="Crie sua conta MestresMusic" />
      </Head>
      <RegisterForm />
    </PublicRoute>
  );
}