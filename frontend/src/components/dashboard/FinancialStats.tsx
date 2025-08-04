import React, { useState, useEffect } from 'react';
import { 
  BanknotesIcon,
  ChartBarIcon,
  CalendarDaysIcon,
  ArrowTrendingUpIcon,
  CreditCardIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { api } from '../../services/api';
import toast from 'react-hot-toast';

interface PaymentStats {
  summary: {
    totalPayments: number;
    completedPayments: number;
    pendingPayments: number;
    failedPayments: number;
    totalRevenue: number;
    averagePayment: number;
    conversionRate: number;
  };
  dailyRevenue: Array<{
    date: string;
    revenue: number;
  }>;
  paymentMethods: Array<{
    method: string;
    count: number;
    revenue: number;
  }>;
}

interface FinancialStatsProps {
  professorId?: string;
  period?: string;
}

export const FinancialStats: React.FC<FinancialStatsProps> = ({ 
  professorId, 
  period = '30d' 
}) => {
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState(period);

  useEffect(() => {
    fetchStats();
  }, [professorId, selectedPeriod]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (professorId) {
        params.append('professorId', professorId);
      }
      params.append('period', selectedPeriod);

      const response = await api.get(`/payments/stats?${params.toString()}`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching payment stats:', error);
      toast.error('Erro ao carregar estatísticas financeiras');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getPeriodLabel = (period: string) => {
    switch (period) {
      case '7d': return 'Últimos 7 dias';
      case '30d': return 'Últimos 30 dias';
      case '90d': return 'Últimos 90 dias';
      case '1y': return 'Último ano';
      default: return 'Período personalizado';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 animate-pulse">
              <div className="h-4 bg-gray-700 rounded mb-2"></div>
              <div className="h-8 bg-gray-700 rounded mb-2"></div>
              <div className="h-3 bg-gray-700 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-400">Nenhuma estatística disponível</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com seletor de período */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Estatísticas Financeiras</h2>
          <p className="text-gray-400">{getPeriodLabel(selectedPeriod)}</p>
        </div>
        
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="7d">Últimos 7 dias</option>
          <option value="30d">Últimos 30 dias</option>
          <option value="90d">Últimos 90 dias</option>
          <option value="1y">Último ano</option>
        </select>
      </div>

      {/* Cards de estatísticas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Receita Total */}
        <div className="bg-gradient-to-br from-green-900/50 to-green-800/30 p-6 rounded-xl border border-green-700/50">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <BanknotesIcon className="h-6 w-6 text-green-400" />
            </div>
            <span className="text-green-400 text-sm font-medium">
              +{formatPercentage(stats.summary.conversionRate)}
            </span>
          </div>
          <div>
            <p className="text-green-100 text-sm font-medium">Receita Total</p>
            <p className="text-2xl font-bold text-white">
              {formatCurrency(stats.summary.totalRevenue)}
            </p>
            <p className="text-green-300 text-xs mt-1">
              {stats.summary.completedPayments} pagamentos
            </p>
          </div>
        </div>

        {/* Ticket Médio */}
        <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 p-6 rounded-xl border border-blue-700/50">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-blue-400" />
            </div>
          </div>
          <div>
            <p className="text-blue-100 text-sm font-medium">Ticket Médio</p>
            <p className="text-2xl font-bold text-white">
              {formatCurrency(stats.summary.averagePayment)}
            </p>
            <p className="text-blue-300 text-xs mt-1">
              Por aula paga
            </p>
          </div>
        </div>

        {/* Pagamentos Pendentes */}
        <div className="bg-gradient-to-br from-orange-900/50 to-orange-800/30 p-6 rounded-xl border border-orange-700/50">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <ClockIcon className="h-6 w-6 text-orange-400" />
            </div>
          </div>
          <div>
            <p className="text-orange-100 text-sm font-medium">Pendentes</p>
            <p className="text-2xl font-bold text-white">
              {stats.summary.pendingPayments}
            </p>
            <p className="text-orange-300 text-xs mt-1">
              Aguardando pagamento
            </p>
          </div>
        </div>

        {/* Taxa de Conversão */}
        <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 p-6 rounded-xl border border-purple-700/50">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <ArrowTrendingUpIcon className="h-6 w-6 text-purple-400" />
            </div>
          </div>
          <div>
            <p className="text-purple-100 text-sm font-medium">Taxa de Conversão</p>
            <p className="text-2xl font-bold text-white">
              {formatPercentage(stats.summary.conversionRate)}
            </p>
            <p className="text-purple-300 text-xs mt-1">
              Solicitações → Pagamentos
            </p>
          </div>
        </div>
      </div>

      {/* Gráfico de receita diária */}
      <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
        <h3 className="text-lg font-semibold text-white mb-4">Receita Diária</h3>
        <div className="h-64 flex items-end justify-between space-x-1">
          {stats.dailyRevenue.map((day, index) => {
            const maxRevenue = Math.max(...stats.dailyRevenue.map(d => d.revenue));
            const height = maxRevenue > 0 ? (day.revenue / maxRevenue) * 100 : 0;
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-gradient-to-t from-orange-500 to-orange-400 rounded-t-sm min-h-[2px] transition-all duration-300 hover:from-orange-400 hover:to-orange-300"
                  style={{ height: `${height}%` }}
                  title={`${new Date(day.date).toLocaleDateString('pt-BR')}: ${formatCurrency(day.revenue)}`}
                />
                <span className="text-xs text-gray-400 mt-2 transform rotate-45 origin-left">
                  {new Date(day.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Métodos de pagamento */}
      <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
        <h3 className="text-lg font-semibold text-white mb-4">Métodos de Pagamento</h3>
        <div className="space-y-4">
          {stats.paymentMethods.map((method, index) => {
            const percentage = stats.summary.totalRevenue > 0 
              ? (method.revenue / stats.summary.totalRevenue) * 100 
              : 0;
            
            return (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-700/50 rounded-lg">
                    <CreditCardIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium capitalize">
                      {method.method === 'card' ? 'Cartão de Crédito' : 
                       method.method === 'pix' ? 'PIX' : method.method}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {method.count} transações
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">
                    {formatCurrency(method.revenue)}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {formatPercentage(percentage)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Resumo de comissões */}
      <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
        <h3 className="text-lg font-semibold text-white mb-4">Resumo Financeiro</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-gray-400 text-sm">Receita Bruta</p>
            <p className="text-2xl font-bold text-white">
              {formatCurrency(stats.summary.totalRevenue)}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Comissão Plataforma (10%)</p>
            <p className="text-2xl font-bold text-red-400">
              -{formatCurrency(stats.summary.totalRevenue * 0.1)}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Receita Líquida</p>
            <p className="text-2xl font-bold text-green-400">
              {formatCurrency(stats.summary.totalRevenue * 0.9)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};