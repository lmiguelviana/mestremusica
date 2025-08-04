import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { MainLayout } from '../../../components/layout/MainLayout';
import { Professor } from '../../../hooks/useProfessors';
import { api } from '../../../services/api';
import { useAuth } from '../../../hooks/useAuth';
import CheckoutForm from '../../../components/payments/CheckoutForm';
import toast from 'react-hot-toast';
import { 
  CalendarIcon,
  ClockIcon,
  VideoCameraIcon,
  MapPinIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

interface AgendarAulaProps {
  professor: Professor | null;
}

export default function AgendarAula({ professor }: AgendarAulaProps) {
  const router = useRouter();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    preferredDate: '',
    preferredTime: '',
    duration: 60,
    lessonType: 'ONLINE' as 'ONLINE' | 'IN_PERSON',
    message: '',
    studentName: user?.name || '',
    studentEmail: user?.email || '',
    studentPhone: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPayment, setShowPayment] = useState(false);
  const [lessonData, setLessonData] = useState<any>(null);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        studentName: user.name,
        studentEmail: user.email
      }));
    }
  }, [user]);

  if (!professor) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Professor não encontrado</h1>
            <button 
              onClick={() => router.push('/professores')}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Voltar para busca
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.preferredDate) {
      newErrors.preferredDate = 'Data é obrigatória';
    }

    if (!formData.preferredTime) {
      newErrors.preferredTime = 'Horário é obrigatório';
    }

    if (!formData.studentName.trim()) {
      newErrors.studentName = 'Nome é obrigatório';
    }

    if (!formData.studentEmail.trim()) {
      newErrors.studentEmail = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.studentEmail)) {
      newErrors.studentEmail = 'Email inválido';
    }

    // Validar se a data não é no passado
    const selectedDateTime = new Date(`${formData.preferredDate}T${formData.preferredTime}`);
    if (selectedDateTime <= new Date()) {
      newErrors.preferredDate = 'Data e horário devem ser no futuro';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      // Preparar dados da aula para pagamento
      const lessonPaymentData = {
        professorId: professor.id,
        professorName: professor.user.name,
        startDateTime: new Date(`${formData.preferredDate}T${formData.preferredTime}`).toISOString(),
        endDateTime: new Date(new Date(`${formData.preferredDate}T${formData.preferredTime}`).getTime() + formData.duration * 60000).toISOString(),
        durationMinutes: formData.duration,
        totalPrice: parseFloat(totalPrice),
        lessonType: formData.lessonType,
        studentName: formData.studentName,
        studentEmail: formData.studentEmail,
        studentPhone: formData.studentPhone,
        studentNotes: formData.message
      };

      setLessonData(lessonPaymentData);
      setShowPayment(true);
    } catch (error: any) {
      console.error('Error preparing lesson data:', error);
      toast.error('Erro ao processar dados da aula');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (paymentIntentId: string) => {
    toast.success('Pagamento realizado com sucesso!');
    
    // Gerar link do WhatsApp
    const whatsappMessage = `Olá ${professor.user.name}! Acabei de agendar e pagar uma aula através do MestresMusic.

✅ PAGAMENTO CONFIRMADO

📅 Data: ${new Date(formData.preferredDate).toLocaleDateString('pt-BR')}
⏰ Horário: ${formData.preferredTime}
⏱️ Duração: ${formData.duration} minutos
💰 Valor: R$ ${totalPrice}
📍 Tipo: ${formData.lessonType === 'ONLINE' ? 'Online' : 'Presencial'}

${formData.message ? `Mensagem: ${formData.message}` : ''}

A aula já está confirmada e paga. Aguardo mais detalhes sobre como proceder!`;

    const whatsappUrl = `https://wa.me/55${professor.whatsapp?.replace(/\D/g, '')}?text=${encodeURIComponent(whatsappMessage)}`;
    
    // Redirecionar para WhatsApp após um breve delay
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
      router.push('/dashboard');
    }, 2000);
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
    setLessonData(null);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const totalPrice = (parseFloat(professor.baseHourlyRate) * (formData.duration / 60)).toFixed(2);

  // Gerar horários disponíveis (das 8h às 20h)
  const timeSlots = [];
  for (let hour = 8; hour <= 20; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      timeSlots.push(timeString);
    }
  }

  return (
    <>
      <Head>
        <title>Agendar Aula com {professor.user.name} - MestresMusic</title>
        <meta
          name="description"
          content={`Agende sua aula de música com ${professor.user.name}. ${professor.instruments.map(i => i.instrument.name).join(', ')}.`}
        />
      </Head>

      <MainLayout>
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900">
          {showPayment && lessonData ? (
            <div className="py-12">
              <CheckoutForm
                lessonData={lessonData}
                onSuccess={handlePaymentSuccess}
                onCancel={handlePaymentCancel}
              />
            </div>
          ) : (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent mb-4">
                Agendar Aula
              </h1>
              <p className="text-xl text-gray-300">
                Solicite uma aula com <span className="text-orange-400 font-semibold">{professor.user.name}</span>
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Informações do Professor */}
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-gray-900 to-gray-950 p-6 rounded-xl border border-gray-800/50 sticky top-8">
                  {/* Foto e Nome */}
                  <div className="text-center mb-6">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center overflow-hidden ring-2 ring-orange-500/30 mb-4">
                      {professor.user.profileImageUrl ? (
                        <img
                          src={professor.user.profileImageUrl}
                          alt={professor.user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl font-bold text-gray-300">
                          {professor.user.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-white">{professor.user.name}</h3>
                    {professor.isPremium && (
                      <span className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full mt-2">
                        ⭐ PREMIUM
                      </span>
                    )}
                  </div>

                  {/* Instrumentos */}
                  <div className="mb-6">
                    <h4 className="text-white font-semibold mb-3">🎵 Instrumentos</h4>
                    <div className="space-y-2">
                      {professor.instruments.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-300">{item.instrument.name}</span>
                          <span className="text-orange-400 capitalize">{item.proficiencyLevel}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Preço */}
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
                    <div className="text-center">
                      <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
                        R$ {parseFloat(professor.baseHourlyRate).toFixed(0)}
                      </span>
                      <span className="text-gray-400 ml-1">/hora</span>
                    </div>
                  </div>

                  {/* Tipos de Aula */}
                  <div className="mt-6 space-y-3">
                    {professor.onlineAvailable && (
                      <div className="flex items-center text-sm text-green-400">
                        <VideoCameraIcon className="w-4 h-4 mr-2" />
                        Aulas online disponíveis
                      </div>
                    )}
                    {professor.inPersonLocation && (
                      <div className="flex items-center text-sm text-blue-400">
                        <MapPinIcon className="w-4 h-4 mr-2" />
                        {professor.inPersonLocation}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Formulário */}
              <div className="lg:col-span-2">
                <form onSubmit={handleSubmit} className="bg-gradient-to-br from-gray-900 to-gray-950 p-8 rounded-xl border border-gray-800/50">
                  <div className="space-y-6">
                    {/* Data e Horário */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          <CalendarIcon className="w-4 h-4 inline mr-2" />
                          Data Preferida
                        </label>
                        <input
                          type="date"
                          value={formData.preferredDate}
                          onChange={(e) => handleInputChange('preferredDate', e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-300"
                        />
                        {errors.preferredDate && (
                          <p className="text-red-400 text-sm mt-1">{errors.preferredDate}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          <ClockIcon className="w-4 h-4 inline mr-2" />
                          Horário Preferido
                        </label>
                        <select
                          value={formData.preferredTime}
                          onChange={(e) => handleInputChange('preferredTime', e.target.value)}
                          className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-300"
                        >
                          <option value="">Selecione um horário</option>
                          {timeSlots.map(time => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                        </select>
                        {errors.preferredTime && (
                          <p className="text-red-400 text-sm mt-1">{errors.preferredTime}</p>
                        )}
                      </div>
                    </div>

                    {/* Duração */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Duração da Aula
                      </label>
                      <select
                        value={formData.duration}
                        onChange={(e) => handleInputChange('duration', Number(e.target.value))}
                        className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-300"
                      >
                        <option value={30}>30 minutos - R$ {(parseFloat(professor.baseHourlyRate) * 0.5).toFixed(2)}</option>
                        <option value={60}>1 hora - R$ {parseFloat(professor.baseHourlyRate).toFixed(2)}</option>
                        <option value={90}>1h 30min - R$ {(parseFloat(professor.baseHourlyRate) * 1.5).toFixed(2)}</option>
                        <option value={120}>2 horas - R$ {(parseFloat(professor.baseHourlyRate) * 2).toFixed(2)}</option>
                      </select>
                    </div>

                    {/* Tipo de Aula */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        Tipo de Aula
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {professor.onlineAvailable && (
                          <label className="flex items-center p-4 bg-gray-800/30 rounded-lg border border-gray-700/50 cursor-pointer hover:border-orange-500/50 transition-all">
                            <input
                              type="radio"
                              name="lessonType"
                              value="ONLINE"
                              checked={formData.lessonType === 'ONLINE'}
                              onChange={(e) => handleInputChange('lessonType', e.target.value)}
                              className="w-4 h-4 text-orange-500 bg-gray-800 border-gray-600 focus:ring-orange-500"
                            />
                            <div className="ml-3">
                              <div className="flex items-center text-white font-medium">
                                <VideoCameraIcon className="w-5 h-5 mr-2 text-green-400" />
                                Aula Online
                              </div>
                              <p className="text-sm text-gray-400">Via videochamada</p>
                            </div>
                          </label>
                        )}

                        {professor.inPersonLocation && (
                          <label className="flex items-center p-4 bg-gray-800/30 rounded-lg border border-gray-700/50 cursor-pointer hover:border-orange-500/50 transition-all">
                            <input
                              type="radio"
                              name="lessonType"
                              value="IN_PERSON"
                              checked={formData.lessonType === 'IN_PERSON'}
                              onChange={(e) => handleInputChange('lessonType', e.target.value)}
                              className="w-4 h-4 text-orange-500 bg-gray-800 border-gray-600 focus:ring-orange-500"
                            />
                            <div className="ml-3">
                              <div className="flex items-center text-white font-medium">
                                <MapPinIcon className="w-5 h-5 mr-2 text-blue-400" />
                                Aula Presencial
                              </div>
                              <p className="text-sm text-gray-400">{professor.inPersonLocation}</p>
                            </div>
                          </label>
                        )}
                      </div>
                    </div>

                    {/* Dados do Aluno */}
                    <div className="border-t border-gray-800 pt-6">
                      <h3 className="text-lg font-semibold text-white mb-4">Seus Dados</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            <UserIcon className="w-4 h-4 inline mr-2" />
                            Nome Completo
                          </label>
                          <input
                            type="text"
                            value={formData.studentName}
                            onChange={(e) => handleInputChange('studentName', e.target.value)}
                            className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-300"
                            placeholder="Seu nome completo"
                          />
                          {errors.studentName && (
                            <p className="text-red-400 text-sm mt-1">{errors.studentName}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            <EnvelopeIcon className="w-4 h-4 inline mr-2" />
                            Email
                          </label>
                          <input
                            type="email"
                            value={formData.studentEmail}
                            onChange={(e) => handleInputChange('studentEmail', e.target.value)}
                            className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-300"
                            placeholder="seu@email.com"
                          />
                          {errors.studentEmail && (
                            <p className="text-red-400 text-sm mt-1">{errors.studentEmail}</p>
                          )}
                        </div>
                      </div>

                      <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          <PhoneIcon className="w-4 h-4 inline mr-2" />
                          Telefone (Opcional)
                        </label>
                        <input
                          type="tel"
                          value={formData.studentPhone}
                          onChange={(e) => handleInputChange('studentPhone', e.target.value)}
                          className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-300"
                          placeholder="(11) 99999-9999"
                        />
                      </div>
                    </div>

                    {/* Mensagem */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <ChatBubbleLeftRightIcon className="w-4 h-4 inline mr-2" />
                        Mensagem (Opcional)
                      </label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        rows={4}
                        className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-300"
                        placeholder="Conte um pouco sobre seus objetivos, nível atual ou qualquer informação que possa ajudar o professor..."
                      />
                    </div>

                    {/* Resumo do Pedido */}
                    <div className="bg-gray-800/30 p-6 rounded-lg border border-gray-700/50">
                      <h3 className="text-lg font-semibold text-white mb-4">Resumo da Solicitação</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Professor:</span>
                          <span className="text-white">{professor.user.name}</span>
                        </div>
                        {formData.preferredDate && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Data:</span>
                            <span className="text-white">
                              {new Date(formData.preferredDate).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                        )}
                        {formData.preferredTime && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Horário:</span>
                            <span className="text-white">{formData.preferredTime}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-400">Duração:</span>
                          <span className="text-white">{formData.duration} minutos</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Tipo:</span>
                          <span className="text-white">
                            {formData.lessonType === 'ONLINE' ? 'Online' : 'Presencial'}
                          </span>
                        </div>
                        <div className="flex justify-between text-lg font-bold border-t border-gray-700 pt-2 mt-4">
                          <span className="text-gray-300">Valor Total:</span>
                          <span className="text-orange-400">R$ {totalPrice}</span>
                        </div>
                      </div>
                    </div>

                    {/* Botões */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        type="button"
                        onClick={() => router.back()}
                        className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                      >
                        Voltar
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Processando...' : 'Continuar para Pagamento'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          )}
        </div>
      </MainLayout>
    </>
  );
}

// Server-side rendering para buscar dados do professor
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    const { id } = params!;
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/professors/${id}`);
    
    if (!response.ok) {
      return {
        props: {
          professor: null,
        },
      };
    }

    const data = await response.json();
    
    return {
      props: {
        professor: data.success ? data.data : null,
      },
    };
  } catch (error) {
    console.error('Error fetching professor:', error);
    return {
      props: {
        professor: null,
      },
    };
  }
};