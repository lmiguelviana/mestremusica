import { useState, useEffect } from 'react';
import Head from 'next/head';
import { AuthenticatedLayout } from '../../components/layout/AuthenticatedLayout';
import { FinancialStats } from '../../components/dashboard/FinancialStats';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../services/api';
import toast from 'react-hot-toast';
import {
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  BanknotesIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

interface Lesson {
  id: string;
  startDateTime: string;
  endDateTime: string;
  durationMinutes: number;
  totalPrice: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  lessonType: string;
  studentNotes?: string;
  professorNotes?: string;
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
  student?: {
    user: {
      name: string;
      email: string;
    };
  };
  createdAt: string;
}

export default function ProfessorDashboard() {
  const { user } = useAuth();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'lessons' | 'financial'>('lessons');
  const [professorId, setProfessorId] = useState<string | null>(null);

  useEffect(() => {
    loadLessons();
    loadProfessorData();
  }, [selectedStatus]);

  const loadProfessorData = async () => {
    try {
      const response = await api.get('/auth/me');
      if (response.data.success && response.data.data.professor) {
        setProfessorId(response.data.data.professor.id);
      }
    } catch (error) {
      console.error('Error loading professor data:', error);
    }
  };

  const loadLessons = async () => {
    try {
      setLoading(true);
      const params = selectedStatus !== 'all' ? `?status=${selectedStatus}` : '';
      const response = await api.get(`/lessons/professor/list${params}`);
      
      if (response.data.success) {
        setLessons(response.data.data);
      }
    } catch (error) {
      console.error('Error loading lessons:', error);
      toast.error('Erro ao carregar aulas');
    } finally {
      setLoading(false);
    }
  };

  const updateLessonStatus = async (lessonId: string, status: string, professorNotes?: string) => {
    try {
      const response = await api.put(`/lessons/${lessonId}/status`, {
        status,
        professorNotes
      });

      if (response.data.success) {
        toast.success('Status atualizado com sucesso!');
        loadLessons();
        setShowModal(false);
        setSelectedLesson(null);
      }
    } catch (error: any) {
      console.error('Error updating lesson status:', error);
      toast.error(error.response?.data?.message || 'Erro ao atualizar status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'CONFIRMED':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'CANCELLED':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'COMPLETED':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Pendente';
      case 'CONFIRMED':
        return 'Confirmada';
      case 'CANCELLED':
        return 'Cancelada';
      case 'COMPLETED':
        return 'Concluída';
      default:
        return status;
    }
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString('pt-BR'),
      time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const getWhatsAppLink = (lesson: Lesson) => {
    const phone = lesson.studentPhone || '5511999999999';
    const message = encodeURIComponent(
      `Olá ${lesson.studentName}! Sobre sua solicitação de aula de música marcada para ${formatDateTime(lesson.startDateTime).date} às ${formatDateTime(lesson.startDateTime).time}.`
    );
    return `https://wa.me/${phone}?text=${message}`;
  };

  const pendingCount = lessons.filter(l => l.status === 'PENDING').length;
  const confirmedCount = lessons.filter(l => l.status === 'CONFIRMED').length;

  return (
    <>
      <Head>
        <title>Dashboard Professor - MestresMusic</title>
        <meta name="description" content="Gerencie suas aulas e solicitações de alunos" />
      </Head>

      <AuthenticatedLayout title="Dashboard do Professor">
        <div className="space-y-8">
          {/* Cards de Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 p-6 rounded-xl border border-yellow-500/20">
              <div className="flex items-center">
                <ClockIcon className="w-8 h-8 text-yellow-400 mr-3" />
                <div>
                  <p className="text-yellow-300 text-sm font-medium">Pendentes</p>
                  <p className="text-2xl font-bold text-white">{pendingCount}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 p-6 rounded-xl border border-green-500/20">
              <div className="flex items-center">
                <CheckCircleIcon className="w-8 h-8 text-green-400 mr-3" />
                <div>
                  <p className="text-green-300 text-sm font-medium">Confirmadas</p>
                  <p className="text-2xl font-bold text-white">{confirmedCount}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 p-6 rounded-xl border border-blue-500/20">
              <div className="flex items-center">
                <CalendarIcon className="w-8 h-8 text-blue-400 mr-3" />
                <div>
                  <p className="text-blue-300 text-sm font-medium">Total de Aulas</p>
                  <p className="text-2xl font-bold text-white">{lessons.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 p-6 rounded-xl border border-orange-500/20">
              <div className="flex items-center">
                <div className="text-orange-400 mr-3">💰</div>
                <div>
                  <p className="text-orange-300 text-sm font-medium">Receita Potencial</p>
                  <p className="text-2xl font-bold text-white">
                    R$ {lessons.reduce((sum, lesson) => sum + parseFloat(lesson.totalPrice), 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setSelectedStatus('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedStatus === 'all'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Todas ({lessons.length})
              </button>
              <button
                onClick={() => setSelectedStatus('PENDING')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedStatus === 'PENDING'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Pendentes ({pendingCount})
              </button>
              <button
                onClick={() => setSelectedStatus('CONFIRMED')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedStatus === 'CONFIRMED'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Confirmadas ({confirmedCount})
              </button>
            </div>
          </div>

          {/* Lista de Aulas */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
            <div className="p-6 border-b border-gray-800">
              <h2 className="text-xl font-bold text-white">Solicitações de Aulas</h2>
            </div>

            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-400">Carregando aulas...</p>
              </div>
            ) : lessons.length === 0 ? (
              <div className="p-8 text-center">
                <CalendarIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">Nenhuma solicitação de aula encontrada</p>
                <p className="text-gray-500 text-sm mt-2">
                  As solicitações aparecerão aqui quando os alunos agendarem aulas com você
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-800">
                {lessons.map((lesson) => {
                  const { date, time } = formatDateTime(lesson.startDateTime);
                  
                  return (
                    <div key={lesson.id} className="p-6 hover:bg-gray-800/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-3">
                            <div className="flex items-center space-x-2">
                              <UserIcon className="w-5 h-5 text-gray-400" />
                              <span className="text-white font-semibold">{lesson.studentName}</span>
                            </div>
                            
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(lesson.status)}`}>
                              {getStatusText(lesson.status)}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                            <div className="flex items-center text-gray-300">
                              <CalendarIcon className="w-4 h-4 mr-2 text-gray-500" />
                              {date} às {time}
                            </div>
                            
                            <div className="flex items-center text-gray-300">
                              <ClockIcon className="w-4 h-4 mr-2 text-gray-500" />
                              {lesson.durationMinutes} minutos
                            </div>
                            
                            <div className="flex items-center text-gray-300">
                              <div className="w-4 h-4 mr-2 text-gray-500">💰</div>
                              R$ {parseFloat(lesson.totalPrice).toFixed(2)}
                            </div>
                            
                            <div className="flex items-center text-gray-300">
                              <div className="w-4 h-4 mr-2 text-gray-500">
                                {lesson.lessonType === 'ONLINE' ? '💻' : '🏠'}
                              </div>
                              {lesson.lessonType === 'ONLINE' ? 'Online' : 'Presencial'}
                            </div>
                          </div>

                          {lesson.studentNotes && (
                            <div className="mt-3 p-3 bg-gray-800/50 rounded-lg">
                              <p className="text-gray-300 text-sm">
                                <ChatBubbleLeftRightIcon className="w-4 h-4 inline mr-2 text-gray-500" />
                                {lesson.studentNotes}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => {
                              setSelectedLesson(lesson);
                              setShowModal(true);
                            }}
                            className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
                          >
                            <EyeIcon className="w-4 h-4" />
                            <span>Ver</span>
                          </button>

                          {lesson.status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => updateLessonStatus(lesson.id, 'CONFIRMED')}
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
                              >
                                <CheckCircleIcon className="w-4 h-4" />
                                <span>Confirmar</span>
                              </button>
                              
                              <button
                                onClick={() => updateLessonStatus(lesson.id, 'CANCELLED')}
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
                              >
                                <XCircleIcon className="w-4 h-4" />
                                <span>Recusar</span>
                              </button>
                            </>
                          )}

                          <a
                            href={getWhatsAppLink(lesson)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
                          >
                            <PhoneIcon className="w-4 h-4" />
                            <span>WhatsApp</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Modal de Detalhes */}
        {showModal && selectedLesson && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 rounded-xl border border-gray-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-800">
                <h3 className="text-xl font-bold text-white">Detalhes da Aula</h3>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Informações do Aluno */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Informações do Aluno</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <UserIcon className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="text-gray-300">{selectedLesson.studentName}</span>
                    </div>
                    <div className="flex items-center">
                      <EnvelopeIcon className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="text-gray-300">{selectedLesson.studentEmail}</span>
                    </div>
                    {selectedLesson.studentPhone && (
                      <div className="flex items-center">
                        <PhoneIcon className="w-5 h-5 text-gray-400 mr-3" />
                        <span className="text-gray-300">{selectedLesson.studentPhone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Detalhes da Aula */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Detalhes da Aula</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm">Data e Hora</p>
                      <p className="text-white">
                        {formatDateTime(selectedLesson.startDateTime).date} às {formatDateTime(selectedLesson.startDateTime).time}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Duração</p>
                      <p className="text-white">{selectedLesson.durationMinutes} minutos</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Tipo</p>
                      <p className="text-white">
                        {selectedLesson.lessonType === 'ONLINE' ? 'Online' : 'Presencial'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Valor</p>
                      <p className="text-white">R$ {parseFloat(selectedLesson.totalPrice).toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                {/* Mensagem do Aluno */}
                {selectedLesson.studentNotes && (
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Mensagem do Aluno</h4>
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <p className="text-gray-300">{selectedLesson.studentNotes}</p>
                    </div>
                  </div>
                )}

                {/* Status */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Status</h4>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(selectedLesson.status)}`}>
                    {getStatusText(selectedLesson.status)}
                  </span>
                </div>
              </div>

              <div className="p-6 border-t border-gray-800 flex justify-end space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Fechar
                </button>
                
                {selectedLesson.status === 'PENDING' && (
                  <>
                    <button
                      onClick={() => updateLessonStatus(selectedLesson.id, 'CONFIRMED')}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Confirmar Aula
                    </button>
                    
                    <button
                      onClick={() => updateLessonStatus(selectedLesson.id, 'CANCELLED')}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Recusar Aula
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </AuthenticatedLayout>
    </>
  );
}