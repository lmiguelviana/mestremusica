import Link from 'next/link';
import { Professor } from '../../hooks/useProfessors';
import { StarIcon, MapPinIcon, VideoCameraIcon, PhoneIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

interface ProfessorCardProps {
  professor: Professor;
}

export function ProfessorCard({ professor }: ProfessorCardProps) {
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
          <StarIcon key={i} className="w-4 h-4 text-yellow-400" />
        );
      } else {
        stars.push(
          <StarOutlineIcon key={i} className="w-4 h-4 text-gray-600" />
        );
      }
    }

    return (
      <div className="flex items-center space-x-1">
        <div className="flex">{stars}</div>
        <span className="text-sm text-gray-400">
          {rating.toFixed(1)} ({professor._count.reviews})
        </span>
      </div>
    );
  };

  const formatPrice = (price: string) => {
    return `R$ ${parseFloat(price).toFixed(0)}`;
  };

  const getWhatsAppLink = () => {
    const message = encodeURIComponent(
      `Olá ${professor.user.name}! Vi seu perfil no MestresMusic e gostaria de saber mais sobre suas aulas.`
    );
    // Assumindo que o WhatsApp está no formato do banco (ex: 5511988888888)
    return `https://wa.me/5511988888888?text=${message}`;
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl border border-gray-800/50 overflow-hidden hover:border-orange-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/20 hover:scale-[1.02] group">
      {/* Header com foto e badge premium */}
      <div className="relative p-6 pb-4">
        {professor.isPremium && (
          <div className="absolute top-4 right-4">
            <span className="bg-gradient-to-r from-orange-500 via-orange-600 to-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg shadow-orange-500/30 animate-pulse">
              ⭐ PREMIUM
            </span>
          </div>
        )}
        
        <div className="flex items-start space-x-4">
          {/* Foto do professor */}
          <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center overflow-hidden ring-2 ring-gray-600/50 group-hover:ring-orange-500/50 transition-all duration-300">
            {professor.user.profileImageUrl ? (
              <img
                src={professor.user.profileImageUrl}
                alt={professor.user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl font-bold text-gray-300 group-hover:text-orange-300 transition-colors">
                {professor.user.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          {/* Nome e avaliação */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white truncate group-hover:text-orange-100 transition-colors">
              {professor.user.name}
            </h3>
            {renderStars(professor.averageRating)}
          </div>
        </div>
      </div>

      {/* Instrumentos */}
      <div className="px-6 pb-4">
        <div className="flex flex-wrap gap-2">
          {professor.instruments.slice(0, 3).map((item, index) => (
            <span
              key={index}
              className="bg-gradient-to-r from-orange-500/20 to-orange-600/20 text-orange-300 text-xs font-medium px-3 py-1 rounded-full border border-orange-500/30 hover:border-orange-400/50 transition-all duration-300 hover:scale-105"
            >
              {item.instrument.name}
            </span>
          ))}
          {professor.instruments.length > 3 && (
            <span className="text-xs text-gray-500 px-2 py-1">
              +{professor.instruments.length - 3} mais
            </span>
          )}
        </div>
      </div>

      {/* Biografia */}
      <div className="px-6 pb-4">
        <p className="text-sm text-gray-400 line-clamp-3">
          {professor.biography}
        </p>
      </div>

      {/* Informações adicionais */}
      <div className="px-6 pb-4 space-y-2">
        {/* Localização */}
        {professor.inPersonLocation && (
          <div className="flex items-center text-sm text-gray-400">
            <MapPinIcon className="w-4 h-4 mr-2 text-gray-500" />
            {professor.inPersonLocation}
          </div>
        )}

        {/* Aulas online */}
        {professor.onlineAvailable && (
          <div className="flex items-center text-sm text-green-400">
            <VideoCameraIcon className="w-4 h-4 mr-2" />
            Aulas online disponíveis
          </div>
        )}
      </div>

      {/* Footer com preço e ações */}
      <div className="px-6 py-4 bg-gradient-to-r from-gray-800/30 to-gray-900/50 border-t border-gray-800/50 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
              {formatPrice(professor.baseHourlyRate)}
            </span>
            <span className="text-sm text-gray-400 ml-1">/hora</span>
          </div>

          <div className="flex space-x-2">
            {/* Botão WhatsApp */}
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-1 shadow-lg shadow-green-600/25 hover:shadow-green-600/40 hover:scale-105"
            >
              <PhoneIcon className="w-4 h-4" />
              <span>Contato</span>
            </a>

            {/* Botão Ver Perfil */}
            <Link 
              href={`/professores/${professor.id}`}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 inline-flex items-center shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-105"
            >
              Ver Perfil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}