import { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { MainLayout } from '../components/layout/MainLayout';
import { useProfessors, SearchFilters } from '../hooks/useProfessors';
import { SearchFiltersComponent } from '../components/professors/SearchFilters';
import { ProfessorList } from '../components/professors/ProfessorList';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

interface ProfessoresPageProps {
  initialFilters?: SearchFilters;
}

export default function ProfessoresPage({ initialFilters = {} }: ProfessoresPageProps) {
  const { professors, loading, error, pagination, searchProfessors, loadMore } = useProfessors();
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Buscar professores quando os filtros mudarem
  useEffect(() => {
    searchProfessors(filters);
  }, [filters]);

  // Buscar professores quando a página carregar
  useEffect(() => {
    searchProfessors(initialFilters);
  }, []);

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
  };

  const handleSearch = () => {
    const searchFilters = {
      ...filters,
      instrument: searchTerm || filters.instrument,
    };
    setFilters(searchFilters);
  };

  const handleLoadMore = () => {
    loadMore(filters);
  };

  return (
    <>
      <Head>
        <title>Encontre seu Professor - MestresMusic</title>
        <meta
          name="description"
          content="Encontre os melhores professores de música. Violão, piano, guitarra, canto e muito mais. Aulas presenciais e online."
        />
      </Head>

      <MainLayout>
        {/* Header da página */}
        <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-black border-b border-gray-800/50 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-transparent to-orange-600/5"></div>
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-8">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent mb-6">
                Encontre seu Professor de Música
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Conecte-se com professores qualificados e transforme sua paixão pela música em realidade
              </p>
            </div>

            {/* Barra de busca principal */}
            <div className="max-w-3xl mx-auto">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-6 w-6 text-gray-400 group-focus-within:text-orange-400 transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar por instrumento, professor ou estilo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="block w-full pl-12 pr-24 py-5 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-300 text-lg shadow-xl"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                  <button
                    onClick={handleSearch}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-105"
                  >
                    Buscar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar com filtros - Desktop */}
            <div className="hidden lg:block lg:w-80 flex-shrink-0">
              <div className="sticky top-8">
                <SearchFiltersComponent
                  onFiltersChange={handleFiltersChange}
                  loading={loading}
                />
              </div>
            </div>

            {/* Conteúdo principal */}
            <div className="flex-1 min-w-0">
              {/* Header dos resultados com filtros mobile */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Professores Disponíveis
                  </h2>
                  {!loading && (
                    <p className="text-gray-400 mt-1">
                      {pagination.total} professor{pagination.total !== 1 ? 'es' : ''} encontrado{pagination.total !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>

                {/* Botão filtros mobile */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md border border-gray-700 flex items-center space-x-2"
                >
                  <AdjustmentsHorizontalIcon className="w-5 h-5" />
                  <span>Filtros</span>
                </button>
              </div>

              {/* Filtros mobile (colapsável) */}
              {showFilters && (
                <div className="lg:hidden mb-6">
                  <SearchFiltersComponent
                    onFiltersChange={handleFiltersChange}
                    loading={loading}
                  />
                </div>
              )}

              {/* Mensagem de erro */}
              {error && (
                <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-6">
                  <p>{error}</p>
                </div>
              )}

              {/* Lista de professores */}
              <ProfessorList
                professors={professors}
                loading={loading}
                hasMore={pagination.hasMore}
                onLoadMore={handleLoadMore}
              />
            </div>
          </div>
        </div>
      </MainLayout>
    </>
  );
}

// Server-side props para SEO e filtros iniciais
export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const initialFilters: SearchFilters = {};

  // Capturar filtros da URL
  if (query.instrument) {
    initialFilters.instrument = query.instrument as string;
  }
  if (query.minPrice) {
    initialFilters.minPrice = Number(query.minPrice);
  }
  if (query.maxPrice) {
    initialFilters.maxPrice = Number(query.maxPrice);
  }
  if (query.location) {
    initialFilters.location = query.location as string;
  }
  if (query.online) {
    initialFilters.onlineAvailable = query.online === 'true';
  }

  return {
    props: {
      initialFilters,
    },
  };
};