import { useState, useEffect } from 'react';
import { SearchFilters, useInstruments } from '../../hooks/useProfessors';

interface SearchFiltersProps {
  onFiltersChange: (filters: SearchFilters) => void;
  loading?: boolean;
}

export function SearchFiltersComponent({ onFiltersChange, loading }: SearchFiltersProps) {
  const { instruments } = useInstruments();
  const [filters, setFilters] = useState<SearchFilters>({
    sortBy: 'rating',
    sortOrder: 'desc',
  });

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: SearchFilters = {
      sortBy: 'rating',
      sortOrder: 'desc',
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-950 p-6 rounded-xl border border-gray-800/50 shadow-xl backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
          🎛️ Filtros
        </h3>
        <button
          onClick={clearFilters}
          className="text-sm text-orange-400 hover:text-orange-300 transition-all duration-300 hover:scale-105 font-medium"
        >
          Limpar filtros
        </button>
      </div>

      <div className="space-y-6">
        {/* Instrumento */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Instrumento
          </label>
          <select
            value={filters.instrument || ''}
            onChange={(e) => handleFilterChange('instrument', e.target.value || undefined)}
            className="w-full bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-300 hover:bg-gray-800/70"
            disabled={loading}
          >
            <option value="">Todos os instrumentos</option>
            {instruments.map((instrument) => (
              <option key={instrument.id} value={instrument.name}>
                {instrument.name}
              </option>
            ))}
          </select>
        </div>

        {/* Faixa de Preço */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Faixa de Preço (R$/hora)
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Mín"
              value={filters.minPrice || ''}
              onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-300 hover:bg-gray-800/70"
              disabled={loading}
            />
            <input
              type="number"
              placeholder="Máx"
              value={filters.maxPrice || ''}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-300 hover:bg-gray-800/70"
              disabled={loading}
            />
          </div>
        </div>

        {/* Localização */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Localização
          </label>
          <input
            type="text"
            placeholder="Ex: São Paulo, SP"
            value={filters.location || ''}
            onChange={(e) => handleFilterChange('location', e.target.value || undefined)}
            className="w-full bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-300 hover:bg-gray-800/70"
            disabled={loading}
          />
        </div>

        {/* Aulas Online */}
        <div>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.onlineAvailable || false}
              onChange={(e) => handleFilterChange('onlineAvailable', e.target.checked || undefined)}
              className="w-4 h-4 text-orange-500 bg-gray-800 border-gray-700 rounded focus:ring-orange-500 focus:ring-2"
              disabled={loading}
            />
            <span className="text-sm text-gray-300">Aulas online disponíveis</span>
          </label>
        </div>

        {/* Ordenação */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Ordenar por
          </label>
          <div className="space-y-2">
            <select
              value={filters.sortBy || 'rating'}
              onChange={(e) => handleFilterChange('sortBy', e.target.value as 'rating' | 'price' | 'name')}
              className="w-full bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-300 hover:bg-gray-800/70"
              disabled={loading}
            >
              <option value="rating">⭐ Avaliação</option>
              <option value="price">💰 Preço</option>
              <option value="name">📝 Nome</option>
            </select>
            <select
              value={filters.sortOrder || 'desc'}
              onChange={(e) => handleFilterChange('sortOrder', e.target.value as 'asc' | 'desc')}
              className="w-full bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-300 hover:bg-gray-800/70"
              disabled={loading}
            >
              <option value="desc">Maior para menor</option>
              <option value="asc">Menor para maior</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}