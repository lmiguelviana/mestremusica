import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { MainLayout } from '../../components/layout/MainLayout';
import { Professor } from '../../hooks/useProfessors';
import { api } from '../../services/api';
import { 
  StarIcon, 
  MapPinIcon, 
  VideoCameraIcon, 
  PhoneIcon,
  ClockIcon,
  AcademicCapIcon,
  TrophyIcon,
  PlayIcon,
  CalendarIcon
} from '@heroicons/react/24/solid';
import Link from 'next/link';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

interface ProfessorProfileProps {
  professor: Professor | null;
}

export default function ProfessorProfile({ professor }: ProfessorProfileProps) {
  const router = useRouter();

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

  const renderStars = (rating: number | undefined) => {
    if (!rating) {
      return (
        <div className="flex items-center text-gray-500">
          <span className="text-sm">Sem avaliações</span>
        </div>
      );
    }

    const stars = [];
    const fullStars = Math.floor(rating);

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <StarIcon key={i} className="w-5 h-5 text-yellow-400" />
        );
      } else {
        stars.push(
          <StarOutlineIcon key={i} className="w-5 h-5 text-gray-600" />
        );
      }
    }

    return (
      <div className="flex items-center space-x-2">
        <div className="flex">{stars}</div>
        <span className="text-lg font-semibold text-gray-300">
          {rating.toFixed(1)} ({professor._count.reviews} avaliações)
        </span>
      </div>
    );
  };

  const getWhatsAppLink = () => {
    const message = encodeURIComponent(
      `Olá ${professor.user.name}! Vi seu perfil no MestresMusic e gostaria de saber mais sobre suas aulas.`
    );
    return `https://wa.me/5511988888888?text=${message}`;
  };

  return (
    <>
      <Head>
        <title>{professor.user.name} - Professor de Música | MestresMusic</title>
        <meta
          name="description"
          content={`Conheça ${professor.user.name}, professor de ${professor.instruments.map(i => i.instrument.name).join(', ')}. ${professor.biography}`}
        />
      </Head>

      <MainLayout>
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900">
          {/* Hero Section */}
          <div className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-800/50">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-transparent to-orange-600/10"></div>
            
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Foto e Info Básica */}
                <div className="lg:col-span-1">
                  <div className="text-center">
                    {/* Foto do Professor */}
                    <div className="w-48 h-48 mx-auto bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center overflow-hidden ring-4 ring-orange-500/30 shadow-2xl">
                      {professor.user.profileImageUrl ? (
                        <img
                          src={professor.user.profileImageUrl}
                          alt={professor.user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-6xl font-bold text-gray-300">
                          {professor.user.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>

                    {/* Badge Premium */}
                    {professor.isPremium && (
                      <div className="mt-4">
                        <span className="bg-gradient-to-r from-orange-500 via-orange-600 to-yellow-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg shadow-orange-500/30">
                          ⭐ PROFESSOR PREMIUM
                        </span>
                      </div>
                    )}

                    {/* Preço */}
                    <div className="mt-6 p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
                      <div className="text-center">
                        <span className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
                          R$ {parseFloat(professor.baseHourlyRate).toFixed(0)}
                        </span>
                        <span className="text-gray-400 ml-2">/hora</span>
                      </div>
                    </div>

                    {/* Botões de Ação */}
                    <div className="mt-6 space-y-3">
                      <Link
                        href={`/professores/${professor.id}/agendar`}
                        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-105"
                      >
                        <CalendarIcon className="w-6 h-6" />
                        <span>Agendar Aula</span>
                      </Link>
                      
                      <a
                        href={getWhatsAppLink()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg shadow-green-600/25 hover:shadow-green-600/40 hover:scale-105"
                      >
                        <PhoneIcon className="w-6 h-6" />
                        <span>Contato Direto</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Informações Principais */}
                <div className="lg:col-span-2">
                  <div className="space-y-6">
                    {/* Nome e Avaliação */}
                    <div>
                      <h1 className="text-4xl font-bold text-white mb-4">
                        {professor.user.name}
                      </h1>
                      {renderStars(professor.averageRating)}
                    </div>

                    {/* Instrumentos */}
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3">🎵 Instrumentos</h3>
                      <div className="flex flex-wrap gap-3">
                        {professor.instruments.map((item, index) => (
                          <span
                            key={index}
                            className="bg-gradient-to-r from-orange-500/20 to-orange-600/20 text-orange-300 px-4 py-2 rounded-full border border-orange-500/30 font-medium"
                          >
                            {item.instrument.name} ({item.proficiencyLevel})
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Informações de Localização */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {professor.inPersonLocation && (
                        <div className="flex items-center space-x-3 p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
                          <MapPinIcon className="w-6 h-6 text-orange-400" />
                          <div>
                            <p className="text-white font-medium">Aulas Presenciais</p>
                            <p className="text-gray-400 text-sm">{professor.inPersonLocation}</p>
                          </div>
                        </div>
                      )}

                      {professor.onlineAvailable && (
                        <div className="flex items-center space-x-3 p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
                          <VideoCameraIcon className="w-6 h-6 text-green-400" />
                          <div>
                            <p className="text-white font-medium">Aulas Online</p>
                            <p className="text-gray-400 text-sm">Disponível via videochamada</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Conteúdo Principal */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Coluna Principal */}
              <div className="lg:col-span-2 space-y-8">
                {/* Biografia */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-950 p-8 rounded-xl border border-gray-800/50">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <AcademicCapIcon className="w-7 h-7 text-orange-400 mr-3" />
                    Sobre o Professor
                  </h2>
                  <p className="text-gray-300 leading-relaxed text-lg">
                    {professor.biography}
                  </p>
                </div>

                {/* Experiência */}
                {professor.experience && (
                  <div className="bg-gradient-to-br from-gray-900 to-gray-950 p-8 rounded-xl border border-gray-800/50">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                      <TrophyIcon className="w-7 h-7 text-orange-400 mr-3" />
                      Experiência
                    </h2>
                    <p className="text-gray-300 leading-relaxed text-lg">
                      {professor.experience}
                    </p>
                  </div>
                )}

                {/* Metodologia */}
                {professor.methodology && (
                  <div className="bg-gradient-to-br from-gray-900 to-gray-950 p-8 rounded-xl border border-gray-800/50">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                      <ClockIcon className="w-7 h-7 text-orange-400 mr-3" />
                      Metodologia
                    </h2>
                    <p className="text-gray-300 leading-relaxed text-lg">
                      {professor.methodology}
                    </p>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                {/* Vídeos do YouTube */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-950 p-6 rounded-xl border border-gray-800/50">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <PlayIcon className="w-6 h-6 text-red-500 mr-2" />
                    Vídeos
                  </h3>
                  
                  {professor.youtubeUrl ? (
                    <div className="space-y-4">
                      <a
                        href={professor.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-red-500/50 transition-all duration-300 group"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                            <PlayIcon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="text-white font-medium">Canal no YouTube</p>
                            <p className="text-gray-400 text-sm">Ver vídeos do professor</p>
                          </div>
                        </div>
                      </a>
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm">Nenhum vídeo disponível</p>
                  )}
                </div>

                {/* Redes Sociais */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-950 p-6 rounded-xl border border-gray-800/50">
                  <h3 className="text-xl font-bold text-white mb-4">🌐 Redes Sociais</h3>
                  
                  <div className="space-y-3">
                    {professor.instagramUrl && (
                      <a
                        href={professor.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-3 p-3 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-lg border border-pink-500/30 hover:border-pink-400/50 transition-all duration-300"
                      >
                        <span className="text-pink-400">📸</span>
                        <span className="text-white">Instagram</span>
                      </a>
                    )}

                    {professor.soundcloudUrl && (
                      <a
                        href={professor.soundcloudUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-3 p-3 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg border border-orange-500/30 hover:border-orange-400/50 transition-all duration-300"
                      >
                        <span className="text-orange-400">🎵</span>
                        <span className="text-white">SoundCloud</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Informações de Contato */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-950 p-6 rounded-xl border border-gray-800/50">
                  <h3 className="text-xl font-bold text-white mb-4">📞 Contato</h3>
                  
                  <div className="space-y-3">
                    {professor.phone && (
                      <div className="flex items-center space-x-3">
                        <PhoneIcon className="w-5 h-5 text-orange-400" />
                        <span className="text-gray-300">{professor.phone}</span>
                      </div>
                    )}

                    {professor.whatsapp && (
                      <div className="flex items-center space-x-3">
                        <span className="text-green-400">💬</span>
                        <span className="text-gray-300">WhatsApp disponível</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    </>
  );
}

// Server-side rendering para SEO
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