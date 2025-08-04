import { useState, useEffect } from 'react';
import { paymentApi, PaymentStats } from '../../services/paymentApi';
import { useAuth } from '../../hooks/useAuth';
import {
  BanknotesIcon,
  ChartBarIcon,
  CreditCardIcon,
  TrendingUpIcon
} from '@heroicons/react/24/outline';

interface FinancialStatsProps {
  professorId?: string;
}

export const FinancialStats: React.FC<FinancialStatsProps> = ({ professorId }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30d');

  useEffect(() => {
    loadStats();
  }, [professorId, period]);

  const loadStats = async () => {
    try {
      setLoading(true);
      const id = professorId || user?.professor?.id;
      if (id) {
        const data = await paymentApi.getPaymentStats(id, period);
        setStats(data);
      }
    } catch (error) {
      console.error('Error loading financial stats:', error);
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

  if (loading) {
    return (
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <p className="text-gray-400 text-center">Nenhum dado financeiro disponível</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center">
          <ChartBarIcon className="w-6 h-6 mr-2 text-orange-400" />
          Estatísticas Financeiras
        </h2>
        
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm"
        >
          <option value="7d">Últimos 7 dias</option>
          <option value="30d">Últimos 30 dias</option>
          <option value="90d">Últimos 90 dias</option>
        </select>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 p-4 rounded-lg border border-green-500/20">
          <div className="flex items-center">
            <BanknotesIcon className="w-6 h-6 text-green-400 mr-2" />
            <div>
              <p className="text-green-300 text-xs font-medium">Receita Total</p>
              <p className="text-white font-bold">{formatCurrency(stats.summary.totalRevenue)}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 p-4 rounded-lg border border-blue-500/20">
          <div className="flex items-center">
            <TrendingUpIcon className="w-6 h-6 text-blue-400 mr-2" />
            <div>
              <p className="text-blue-300 text-xs font-medium">Ticket Médio</p>
              <p className="text-white font-bold">{formatCurrency(stats.summary.averagePayment)}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 p-4 rounded-lg border border-orange-500/20">
          <div className="flex items-center">
            <CreditCardIcon className="w-6 h-6 text-orange-400 mr-2" />
            <div>
              <p className="text-orange-300 text-xs font-medium">Pagamentos</p>
              <p className="text-white font-bold">{stats.summary.completedPayments}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 p-4 rounded-lg border border-purple-500/20">
          <div className="flex items-center">
            <ChartBarIcon className="w-6 h-6 text-purple-400 mr-2" />
            <div>
              <p className="text-purple-300 text-xs font-medium">Taxa Conversão</p>
              <p className="text-white font-bold">{stats.summary.conversionRate.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico de Receita Diária */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">Receita Diária</h3>
        <div className="h-40 bg-gray-800/50 rounded-lg p-4 flex items-end space-x-1">
          {stats.dailyRevenue.map((day, index) => {
            const maxRevenue = Math.max(...stats.dailyRevenue.map(d => d.revenue));
            const height = maxRevenue > 0 ? (day.revenue / maxRevenue) * 100 : 0;
            
            return (
              <div
                key={index}
                className="flex-1 bg-gradient-to-t from-orange-500 to-orange-400 rounded-t opacity-80 hover:opacity-100 transition-opacity"
                style={{ height: `${height}%`, minHeight: day.revenue > 0 ? '4px' : '0' }}
                title={`${new Date(day.date).toLocaleDateString('pt-BR')}: ${formatCurrency(day.revenue)}`}
              />
            );
          })}
        </div>
      </div>

      {/* Métodos de Pagamento */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Métodos de Pagamento</h3>
        <div className="space-y-3">
          {stats.paymentMethods.map((method, index) => {
            const percentage = stats.summary.totalRevenue > 0 
              ? (method.revenue / stats.summary.totalRevenue) * 100 
              : 0;
            
            return (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-orange-500 rounded-full mr-3"></div>
                  <span className="text-gray-300 capitalize">{method.method}</span>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">{formatCurrency(method.revenue)}</p>
                  <p className="text-gray-400 text-sm">{percentage.toFixed(1)}%</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};