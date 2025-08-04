import { Professor } from '../../hooks/useProfessors';
import { ProfessorCard } from './ProfessorCard';

interface ProfessorListProps {
  professors: Professor[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

export function ProfessorList({ professors, loading, hasMore, onLoadMore }: ProfessorListProps) {
  if (loading && professors.length === 0) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton */}
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-gray-900 rounded-lg border border-gray-800 p-6 animate-pulse">
            <div className="flex items-start space-x-4 mb-4">
              <div className="w-16 h-16 bg-gray-700 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-gray-700 rounded w-1/3"></div>
                <div className="h-4 bg-gray-700 rounded w-1/4"></div>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-700 rounded w-2/3"></div>
            </div>
            <div className="flex justify-between items-center">
              <div className="h-6 bg-gray-700 rounded w-20"></div>
              <div className="h-8 bg-gray-700 rounded w-24"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (professors.length === 0 && !loading) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
          <svg
            className="w-12 h-12 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">
          Nenhum professor encontrado
        </h3>
        <p className="text-gray-400 mb-6">
          Tente ajustar os filtros de busca para encontrar mais professores.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md font-medium transition-colors"
        >
          Limpar filtros
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Lista de professores */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {professors.map((professor) => (
          <ProfessorCard key={professor.id} professor={professor} />
        ))}
      </div>

      {/* Botão carregar mais */}
      {hasMore && (
        <div className="text-center pt-6">
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-md font-medium transition-colors border border-gray-700 hover:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Carregando...</span>
              </div>
            ) : (
              'Carregar mais professores'
            )}
          </button>
        </div>
      )}

      {/* Contador de resultados */}
      <div className="text-center text-sm text-gray-500">
        Mostrando {professors.length} professores
      </div>
    </div>
  );
}