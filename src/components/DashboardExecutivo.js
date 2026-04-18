import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatNumber, formatCurrency, formatPercent } from '../utils/formatters';

const DashboardExecutivo = ({ data }) => {
  const [timeSeriesData, setTimeSeriesData] = useState([]);
  const [triagemData, setTriagemData] = useState([]);

  useEffect(() => {
    if (data && data.dadosBrutos) {
      // Preparar dados para série temporal
      const seriesData = data.dadosBrutos
        .filter(row => row.TotalAtendimentos > 0)
        .reduce((acc, row) => {
          const existing = acc.find(item => item.period === row.Período);
          if (existing) {
            existing.totalAtendimentos += row.TotalAtendimentos || 0;
            existing.urgenciasFalsas += (row.Atendimentos_Verde || 0) + (row.Atendimentos_Azul || 0) + (row.Atendimentos_Branca || 0);
          } else {
            acc.push({
              period: row.Período,
              totalAtendimentos: row.TotalAtendimentos || 0,
              urgenciasFalsas: (row.Atendimentos_Verde || 0) + (row.Atendimentos_Azul || 0) + (row.Atendimentos_Branca || 0),
              urgenciasUrgentes: (row.Atendimentos_Vermelha || 0) + (row.Atendimentos_Laranja || 0)
            });
          }
          return acc;
        }, [])
        .sort((a, b) => a.period.localeCompare(b.period));

      setTimeSeriesData(seriesData);

      // Preparar dados para gráfico de triagem
      const triagem = [
        { name: 'Vermelha', value: data.atendimentosVermelha || 0, color: '#dc2626' },
        { name: 'Laranja', value: data.atendimentosLaranja || 0, color: '#ea580c' },
        { name: 'Amarela', value: data.atendimentosAmarela || 0, color: '#ca8a04' },
        { name: 'Verde', value: data.atendimentosVerde || 0, color: '#16a34a' },
        { name: 'Azul', value: data.atendimentosAzul || 0, color: '#2563eb' },
        { name: 'Branca', value: data.atendimentosBranca || 0, color: '#6b7280' }
      ].filter(item => item.value > 0);

      setTriagemData(triagem);
    }
  }, [data]);


  const getScoreColor = (score) => {
    if (score >= 65) return '#dc2626';
    if (score >= 50) return '#ea580c';
    if (score >= 35) return '#ca8a04';
    if (score >= 20) return '#16a34a';
    return '#059669';
  };

  const getStatusClass = (status) => {
    if (!status || typeof status !== 'string') {
      return 'status-neutral';
    }
    if (status.includes('Crítico')) return 'status-critical';
    if (status.includes('⚠️')) return 'status-warning';
    return 'status-good';
  };

  if (!data || !data.totalAtendimentos || data.totalAtendimentos === 0) {
    return (
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">📊 Dashboard Executivo</h3>
        </div>
        <div className="text-center py-8">
          <div className="text-gray-500 text-lg mb-2">📅</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Sem dados para o período selecionado
          </h3>
          <p className="text-gray-500">
            Tente selecionar um período diferente ou verifique se há dados disponíveis.
          </p>
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="text-sm text-yellow-700">
              <strong>Dica:</strong> Os dados estão disponíveis de 2016 a 2026. 
              Use o filtro "Todo o período" ou "Últimos 24 meses" para garantir dados.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* KPIs Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="metric-card">
          <div className="metric-value" style={{ color: '#1e40af' }}>
            {formatNumber(data.totalAtendimentos)}
          </div>
          <div className="metric-label">Total Atendimentos</div>
          <div className="metric-change neutral">
            Período analisado
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-value" style={{ color: getScoreColor(data.scoreIneficienciaGlobal) }}>
            {data.scoreIneficienciaGlobal?.toFixed(1) || '0'}
          </div>
          <div className="metric-label">Score Ineficiência</div>
          <div className={`metric-change ${data.scoreIneficienciaGlobal >= 65 ? 'negative' : data.scoreIneficienciaGlobal >= 35 ? 'neutral' : 'positive'}`}>
            {data.classificacaoIneficiencia || 'N/A'}
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-value" style={{ color: data.percentUrgenciasFalsas >= 35 ? '#dc2626' : data.percentUrgenciasFalsas >= 25 ? '#ea580c' : '#16a34a' }}>
            {formatPercent(data.percentUrgenciasFalsas)}
          </div>
          <div className="metric-label">Urgências Falsas</div>
          <div className={`metric-change ${data.percentUrgenciasFalsas >= 35 ? 'negative' : data.percentUrgenciasFalsas >= 25 ? 'neutral' : 'positive'}`}>
            {data.statusUrgenciasFalsas}
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-value" style={{ color: '#059669' }}>
            {formatCurrency(data.custoDesperdicadoEstimado)}
          </div>
          <div className="metric-label">Custo Desperdiçado</div>
          <div className="metric-change neutral">
            Estimativa anual
          </div>
        </div>
      </div>

      {/* Gráficos Principais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Evolução Temporal */}
        <div className="chart-container">
          <h3 className="chart-title">Evolução dos Atendimentos no Período</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="period" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                formatter={(value, name) => [
                  formatNumber(value), 
                  name === 'totalAtendimentos' ? 'Total Atendimentos' : 
                  name === 'urgenciasFalsas' ? 'Urgências Falsas' : name
                ]}
                labelFormatter={(label) => `Período: ${label}`}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="totalAtendimentos" 
                stroke="#1e40af" 
                strokeWidth={2}
                name="Total Atendimentos"
              />
              <Line 
                type="monotone" 
                dataKey="urgenciasFalsas" 
                stroke="#dc2626" 
                strokeWidth={2}
                name="Urgências Falsas"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Distribuição por Triagem */}
        <div className="chart-container">
          <h3 className="chart-title">Distribuição por Triagem Manchester</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={triagemData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {triagemData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatNumber(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Métricas Operacionais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recursos Humanos</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Profissionais</span>
              <span className="font-semibold" style={{ marginLeft: '0.5rem', letterSpacing: '0.02em' }}>{formatNumber(data.totalProfissionais)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Rácio Enf./Méd.</span>
              <span className="font-semibold" style={{ marginLeft: '0.5rem', letterSpacing: '0.02em' }}>{data.racioEnfermeiroMedico?.toFixed(2) || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Atend./Médico</span>
              <span className="font-semibold" style={{ marginLeft: '0.5rem', letterSpacing: '0.02em' }}>{formatNumber(data.atendimentosPorMedico)}</span>
            </div>
            <div className="mt-2">
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusClass(data.statusRacioEnfMed)}`}>
                {data.statusRacioEnfMed}
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Tempos de Espera</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Tempo Médio</span>
              <span className="font-semibold" style={{ marginLeft: '0.5rem', letterSpacing: '0.02em' }}>{Math.round(data.tempoEsperaMedio)} min</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Meta Manchester</span>
              <span className="font-semibold" style={{ marginLeft: '0.5rem', letterSpacing: '0.02em' }}>60 min</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Desvio</span>
              <span className="font-semibold" style={{ marginLeft: '0.5rem', letterSpacing: '0.02em' }}>
                {data.tempoEsperaMedio > 60 ? `+${Math.round(data.tempoEsperaMedio - 60)} min` : 'Dentro meta'}
              </span>
            </div>
            <div className="mt-2">
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusClass(data.statusTempoEspera)}`}>
                {data.statusTempoEspera}
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Impacto Financeiro</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Custo Total Est.</span>
              <span className="font-semibold" style={{ marginLeft: '0.5rem', letterSpacing: '0.02em' }}>{formatCurrency(data.despesaTotalEstimada)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Desperdício</span>
              <span className="font-semibold text-red-600" style={{ marginLeft: '0.5rem', letterSpacing: '0.02em' }}>{formatCurrency(data.custoDesperdicadoEstimado)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">% Desperdício</span>
              <span className="font-semibold" style={{ marginLeft: '0.5rem', letterSpacing: '0.02em' }}>
                {data.despesaTotalEstimada > 0 ? 
                  formatPercent((data.custoDesperdicadoEstimado / data.despesaTotalEstimada) * 100) : 
                  'N/A'
                }
              </span>
            </div>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-600 h-2 rounded-full" 
                  style={{ 
                    width: `${data.despesaTotalEstimada > 0 ? 
                      (data.custoDesperdicadoEstimado / data.despesaTotalEstimada) * 100 : 0}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alertas e Recomendações */}
      {(data.percentUrgenciasFalsas >= 25 || data.scoreIneficienciaGlobal >= 35) && (
        <div className="card border-l-4 border-orange-500 bg-orange-50">
          <div className="card-header">
            <h3 className="card-title text-orange-800">⚠️ Análise Crítica</h3>
          </div>
          <div className="space-y-2">
            {data.percentUrgenciasFalsas >= 35 && (
              <div className="text-sm text-orange-700">
                <strong>Crítico:</strong> Percentagem de urgências falsas muito elevada. 
                Recomenda-se campanha de sensibilização e reforço de cuidados de saúde primários.
              </div>
            )}
            {data.racioEnfermeiroMedico < 1.5 && (
              <div className="text-sm text-orange-700">
                <strong>Recursos Humanos:</strong> Défice crítico de enfermeiros. 
                Rácio recomendado OMS: 2:1 (enfermeiros:médicos).
              </div>
            )}
            {data.tempoEsperaMedio > 90 && (
              <div className="text-sm text-orange-700">
                <strong>Tempos de Espera:</strong> Valores perigosos acima de 90 minutos. 
                Necessária intervenção imediata no fluxo de triagem.
              </div>
            )}
            {data.scoreIneficienciaGlobal >= 50 && (
              <div className="text-sm text-orange-700">
                <strong>Score Global:</strong> Sistema com baixa eficiência geral. 
                Recomenda-se auditoria completa e plano de melhoria.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardExecutivo;
