import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { Logo } from '../ui/Logo';

export function RegisterForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    type: 'STUDENT' as 'STUDENT' | 'PROFESSOR',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { register } = useAuth();
  const router = useRouter();

  function validateForm() {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
    }

    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      await register({
        name: formData.name.trim(),
        email: formData.email,
        password: formData.password,
        type: formData.type,
      });
      
      // Redirect based on user type
      if (formData.type === 'PROFESSOR') {
        router.push('/dashboard/professor/setup');
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      // Error is handled by the useAuth hook
    } finally {
      setLoading(false);
    }
  }

  function handleInputChange(field: string, value: string) {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Logo size="lg" showTagline />
          <h2 className="mt-6 text-3xl font-bold text-white">
            Crie sua conta
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Ou{' '}
            <Link href="/login" className="text-primary-500 hover:text-primary-400 transition-colors">
              entre na sua conta existente
            </Link>
          </p>
        </div>

        <Card variant="elevated">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* User Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Tipo de conta
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleInputChange('type', 'STUDENT')}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    formData.type === 'STUDENT'
                      ? 'border-primary-500 bg-primary-500/10 text-primary-400'
                      : 'border-dark-700 bg-dark-800 text-gray-300 hover:border-dark-600'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">🎓</div>
                    <div className="font-medium">Aluno</div>
                    <div className="text-xs text-gray-400 mt-1">
                      Quero aprender música
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleInputChange('type', 'PROFESSOR')}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    formData.type === 'PROFESSOR'
                      ? 'border-primary-500 bg-primary-500/10 text-primary-400'
                      : 'border-dark-700 bg-dark-800 text-gray-300 hover:border-dark-600'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">🎵</div>
                    <div className="font-medium">Professor</div>
                    <div className="text-xs text-gray-400 mt-1">
                      Quero ensinar música
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <Input
              label="Nome completo"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              error={errors.name}
              placeholder="Seu nome completo"
              autoComplete="name"
            />

            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              error={errors.email}
              placeholder="seu@email.com"
              autoComplete="email"
            />

            <Input
              label="Senha"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              error={errors.password}
              placeholder="••••••••"
              autoComplete="new-password"
              helperText="Mínimo de 6 caracteres"
            />

            <Input
              label="Confirmar senha"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              error={errors.confirmPassword}
              placeholder="••••••••"
              autoComplete="new-password"
            />

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-primary-500 bg-dark-800 border-dark-600 rounded focus:ring-primary-500 focus:ring-2"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-300">
                Concordo com os{' '}
                <Link href="/terms" className="text-primary-500 hover:text-primary-400">
                  Termos de Uso
                </Link>{' '}
                e{' '}
                <Link href="/privacy" className="text-primary-500 hover:text-primary-400">
                  Política de Privacidade
                </Link>
              </label>
            </div>

            <Button
              type="submit"
              loading={loading}
              fullWidth
              size="lg"
            >
              {loading ? 'Criando conta...' : 'Criar conta'}
            </Button>
          </form>

          {formData.type === 'PROFESSOR' && (
            <div className="mt-6 p-4 bg-primary-500/10 border border-primary-500/20 rounded-lg">
              <div className="flex items-start">
                <div className="text-primary-400 mr-3">ℹ️</div>
                <div>
                  <h4 className="text-sm font-medium text-primary-400 mb-1">
                    Conta de Professor
                  </h4>
                  <p className="text-xs text-gray-300">
                    Após o cadastro, você precisará completar seu perfil e aguardar aprovação 
                    para começar a receber alunos.
                  </p>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}