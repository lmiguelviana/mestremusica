import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { AuthenticatedLayout } from '../components/layout/AuthenticatedLayout';

export default function DashboardPage() {
    const { user } = useAuth();

    return (
        <ProtectedRoute>
            <Head>
                <title>Dashboard - MestresMusic</title>
                <meta name="description" content="Seu dashboard MestresMusic" />
            </Head>

            <AuthenticatedLayout title="Dashboard">
                <p className="text-gray-400 mb-8">
                    Bem-vindo ao seu painel de controle MestresMusic
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* User Info Card */}
                    <Card>
                        <h3 className="text-lg font-medium text-white mb-4">
                            Informações da Conta
                        </h3>
                        <div className="space-y-2">
                            <div>
                                <span className="text-gray-400">Nome:</span>
                                <span className="ml-2 text-white">{user?.name}</span>
                            </div>
                            <div>
                                <span className="text-gray-400">Email:</span>
                                <span className="ml-2 text-white">{user?.email}</span>
                            </div>
                            <div>
                                <span className="text-gray-400">Tipo:</span>
                                <span className="ml-2">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${user?.type === 'PROFESSOR'
                                        ? 'bg-primary-500/20 text-primary-400'
                                        : 'bg-blue-500/20 text-blue-400'
                                        }`}>
                                        {user?.type === 'PROFESSOR' ? 'Professor' : 'Aluno'}
                                    </span>
                                </span>
                            </div>
                        </div>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                        <h3 className="text-lg font-medium text-white mb-4">
                            Ações Rápidas
                        </h3>
                        <div className="space-y-3">
                            {user?.type === 'STUDENT' ? (
                                <>
                                    <Link href="/professores">
                                        <Button variant="outline" fullWidth>
                                            Buscar Professores
                                        </Button>
                                    </Link>
                                    <Button variant="outline" fullWidth>
                                        Minhas Aulas
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button variant="outline" fullWidth>
                                        Gerenciar Perfil
                                    </Button>
                                    <Button variant="outline" fullWidth>
                                        Meus Alunos
                                    </Button>
                                    <Button variant="primary" fullWidth>
                                        Upgrade Premium
                                    </Button>
                                </>
                            )}
                        </div>
                    </Card>

                    {/* Status Card */}
                    <Card>
                        <h3 className="text-lg font-medium text-white mb-4">
                            Status
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-400">Conta:</span>
                                <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-medium">
                                    Ativa
                                </span>
                            </div>

                            {user?.type === 'PROFESSOR' && user?.professor && (
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400">Aprovação:</span>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${user.professor.approvalStatus === 'APPROVED'
                                        ? 'bg-green-500/20 text-green-400'
                                        : user.professor.approvalStatus === 'PENDING'
                                            ? 'bg-yellow-500/20 text-yellow-400'
                                            : 'bg-red-500/20 text-red-400'
                                        }`}>
                                        {user.professor.approvalStatus === 'APPROVED' ? 'Aprovado' :
                                            user.professor.approvalStatus === 'PENDING' ? 'Pendente' : 'Rejeitado'}
                                    </span>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Welcome Message */}
                <Card className="mt-8">
                    <div className="text-center py-8">
                        <h2 className="text-2xl font-bold text-white mb-4">
                            🎵 Bem-vindo ao MestresMusic!
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            {user?.type === 'STUDENT'
                                ? 'Explore nossa plataforma e encontre os melhores professores de música para sua jornada de aprendizado.'
                                : 'Configure seu perfil e comece a conectar-se com alunos interessados em aprender música.'
                            }
                        </p>
                        <div className="mt-6">
                            {user?.type === 'STUDENT' ? (
                                <Link href="/professores">
                                    <Button size="lg">Explorar Professores</Button>
                                </Link>
                            ) : (
                                <Button size="lg">Configurar Perfil</Button>
                            )}
                        </div>
                    </div>
                </Card>
            </AuthenticatedLayout>
        </ProtectedRoute>
    );
}