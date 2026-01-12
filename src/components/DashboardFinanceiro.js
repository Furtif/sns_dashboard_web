import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DashboardFinanceiro = ({ data }) => {
  const [regionData, setRegionData] = useState([]);
  const [costEvolution, setCostEvolution] = useState([]);
  const [wasteAnalysis, setWasteAnalysis] = useState([]);

  useEffect(() => {
    if (data && data.dadosBrutos && data.instituicoes) {
      // Preparar dados por região
      const regions = {};
      data.regioes?.forEach(regiao => {
        regions[regiao.RegiaoID] = {
          regiaoId: regiao.RegiaoID,
          regiaoNome: regiao.RegiaoNome,
          totalAtendimentos: 0,
          urgenciasFalsas: 0,
          custoTotal: 0,
          custoDesperdicado: 0
        };
      });

      data.dadosBrutos.forEach(row => {
        if (regions[row.RegiaoID]) {
          const totalAtendimentos = row.TotalAtendimentos || 0;
          const urgenciasFalsas = (row.Atendimentos_Verde || 0) + (row.Atendimentos_Azul || 0) + (row.Atendimentos_Branca || 0);
          
          regions[row.RegiaoID].totalAtendimentos += totalAtendimentos;
          regions[row.RegiaoID].urgenciasFalsas += urgenciasFalsas;
          regions[row.RegiaoID].custoTotal += totalAtendimentos * 150;
          regions[row.RegiaoID].custoDesperdicado += urgenciasFalsas * 120;
        }
      });

      const regionArray = Object.values(regions).map(region => ({
        ...region,
        percentUrgenciasFalsas: region.totalAtendimentos > 0 ? (region.urgenciasFalsas / region.totalAtendimentos) * 100 : 0,
        percentDesperdicio: region.custoTotal > 0 ? (region.custoDesperdicado / region.custoTotal) * 100 : 0
      }));

      setRegionData(regionArray);

      // Preparar evolução de custos mensais
      const monthly = data.dadosBrutos
        .filter(row => row.TotalAtendimentos > 0)
        .reduce((acc, row) => {
          const existing = acc.find(item => item.period === row.Período);
          const totalAtendimentos = row.TotalAtendimentos || 0;
          const urgenciasFalsas = (row.Atendimentos_Verde || 0) + (row.Atendimentos_Azul || 0) + (row.Atendimentos_Branca || 0);
          
          if (existing) {
            existing.custoTotal += totalAtendimentos * 150;
            existing.custoDesperdicado += urgenciasFalsas * 120;
            existing.totalAtendimentos += totalAtendimentos;
          } else {
            acc.push({
              period: row.Período,
              custoTotal: totalAtendimentos * 150,
              custoDesperdicado: urgenciasFalsas * 120,
              totalAtendimentos
            });
          }
          return acc;
        }, [])
        .map(item => ({
          ...item,
          percentDesperdicio: item.custoTotal > 0 ? (item.custoDesperdicado / item.custoTotal) * 100 : 0,
          custoMedioPorAtendimento: item.totalAtendimentos > 0 ? item.custoTotal / item.totalAtendimentos : 0
        }))
        .sort((a, b) => a.period.localeCompare(b.period))
        .slice(-24); // Últimos 24 meses

      setCostEvolution(monthly);

      // Análise de desperdício por tipo de instituição
      const wasteByType = {};
      ['CH', 'CHU', 'ULS', 'Hospital'].forEach(tipo => {
        wasteByType[tipo] = {
          tipo,
          totalAtendimentos: 0,
          urgenciasFalsas: 0,
          custoTotal: 0,
          custoDesperdicado: 0,
          instituicoes: 0
        };
      });

      data.dadosBrutos.forEach(row => {
        const institution = data.instituicoes.find(i => i.InstituicaoID === row.InstituicaoID);
        if (institution && wasteByType[institution.Tipo]) {
          const totalAtendimentos = row.TotalAtendimentos || 0;
          const urgenciasFalsas = (row.Atendimentos_Verde || 0) + (row.Atendimentos_Azul || 0) + (row.Atendimentos_Branca || 0);
          
          wasteByType[institution.Tipo].totalAtendimentos += totalAtendimentos;
          wasteByType[institution.Tipo].urgenciasFalsas += urgenciasFalsas;
          wasteByType[institution.Tipo].custoTotal += totalAtendimentos * 150;
          wasteByType[institution.Tipo].custoDesperdicado += urgenciasFalsas * 120;
          wasteByType[institution.Tipo].instituicoes++;
        }
      });

      const wasteArray = Object.values(wasteByType)
        .filter(item => item.instituicoes > 0)
        .map(item => ({
          ...item,
          percentUrgenciasFalsas: item.totalAtendimentos > 0 ? (item.urgenciasFalsas / item.totalAtendimentos) * 100 : 0,
          percentDesperdicio: item.custoTotal > 0 ? (item.custoDesperdicado / item.custoTotal) * 100 : 0
        }));

      setWasteAnalysis(wasteArray);
    }
  }, [data]);

  const formatCurrency = (num) => {
    return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(num);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('pt-PT').format(Math.round(num));
  };

  const formatPercent = (num) => {
    if (num === null || num === undefined || isNaN(num)) {
      return '0.0%';
    }
    return `${parseFloat(num).toFixed(1)}%`;
  };

  const getWasteColor = (percent) => {
    if (percent >= 20) return '#dc2626';
    if (percent >= 15) return '#ea580c';
    if (percent >= 10) return '#ca8a04';
    return '#16a34a';
  };

  const pieColors = ['#1e40af', '#dc2626', '#059669', '#ca8a04', '#7c3aed'];

  if (!data || !data.totalAtendimentos || data.totalAtendimentos === 0) {
    return (
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">💰 Dashboard Financeiro</h3>
        </div>
        <div className="text-center py-8">
          <div className="text-gray-500 text-lg mb-2">💰</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Sem dados para o período selecionado
          </h3>
          <p className="text-gray-500">
            Tente selecionar um período diferente ou verifique se há dados disponíveis.
          </p>
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="text-sm text-yellow-700">
              <strong>Dica:</strong> Os dados estão disponíveis de 2016 a 2025. 
              Use o filtro "Todo o período" ou "Últimos 24 meses" para garantir dados.
            </div>
          </div>
        </div>
      </div>
    );
  }

  const totalCustoNacional = regionData.reduce((sum, region) => sum + region.custoTotal, 0);
  const totalDesperdicioNacional = regionData.reduce((sum, region) => sum + region.custoDesperdicado, 0);
  const percentDesperdicioNacional = totalCustoNacional > 0 ? (totalDesperdicioNacional / totalCustoNacional) * 100 : 0;

  return (
    <div className="fade-in">
      {/* KPIs Financeiros */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="metric-card">
          <div className="metric-value" style={{ color: '#1e40af' }}>
            {formatCurrency(totalCustoNacional)}
          </div>
          <div className="metric-label">Custo Total Estimado</div>
          <div className="metric-change neutral">
            Base: 150€/atendimento
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-value" style={{ color: getWasteColor(percentDesperdicioNacional) }}>
            {formatCurrency(totalDesperdicioNacional)}
          </div>
          <div className="metric-label">Custo Desperdiçado</div>
          <div className="metric-change negative">
            {formatPercent(percentDesperdicioNacional)} do total
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-value" style={{ color: '#059669' }}>
            {formatCurrency(data.custoEstimadoPorEpisodio)}
          </div>
          <div className="metric-label">Custo por Episódio</div>
          <div className="metric-change neutral">
            Valor padrão SNS
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-value" style={{ color: '#ea580c' }}>
            {formatCurrency(120)}
          </div>
          <div className="metric-label">Diferença por Falsa</div>
          <div className="metric-change neutral">
            Urgência vs Centro Saúde
          </div>
        </div>
      </div>

      {/* Gráficos Financeiros */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Evolução de Custos */}
        <div className="chart-container">
          <h3 className="chart-title">Evolução de Custos e Desperdício (24 meses)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={costEvolution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="period" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
              <Tooltip 
                formatter={(value, name) => [
                  name.includes('percent') ? formatPercent(value) : formatCurrency(value), 
                  name === 'custoTotal' ? 'Custo Total' :
                  name === 'custoDesperdicado' ? 'Custo Desperdiçado' :
                  name === 'percentDesperdicio' ? '% Desperdício' : name
                ]}
                labelFormatter={(label) => `Período: ${label}`}
              />
              <Legend />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="custoTotal" 
                stroke="#1e40af" 
                strokeWidth={2}
                name="Custo Total"
              />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="custoDesperdicado" 
                stroke="#dc2626" 
                strokeWidth={2}
                name="Custo Desperdiçado"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="percentDesperdicio" 
                stroke="#ea580c" 
                strokeWidth={2}
                name="% Desperdício"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Distribuição por Região */}
        <div className="chart-container">
          <h3 className="chart-title">Distribuição de Custos por Região</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={regionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ regiaoNome, percent }) => `${regiaoNome}: ${(percent * 100).toFixed(1)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="custoTotal"
              >
                {regionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Análise de Desperdício */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Desperdício por Região */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Análise de Desperdício por Região</h3>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Região</th>
                  <th className="text-right">Custo Total</th>
                  <th className="text-right">Desperdício</th>
                  <th className="text-right">% Desperdício</th>
                </tr>
              </thead>
              <tbody>
                {regionData
                  .sort((a, b) => b.custoDesperdicado - a.custoDesperdicado)
                  .map((region) => (
                    <tr key={region.regiaoId}>
                      <td className="font-medium">{region.regiaoNome}</td>
                      <td className="text-right">{formatCurrency(region.custoTotal)}</td>
                      <td className="text-right font-medium text-red-600">
                        {formatCurrency(region.custoDesperdicado)}
                      </td>
                      <td className="text-right">
                        <span 
                          className="px-2 py-1 rounded text-xs font-medium"
                          style={{ 
                            backgroundColor: getWasteColor(region.percentDesperdicio) + '20',
                            color: getWasteColor(region.percentDesperdicio)
                          }}
                        >
                          {formatPercent(region.percentDesperdicio)}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Desperdício por Tipo de Instituição */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Desperdício por Tipo de Instituição</h3>
          </div>
          <div className="space-y-4">
            {wasteAnalysis.map((type) => (
              <div key={type.tipo} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-lg">{type.tipo}</h4>
                  <span className="text-sm text-gray-500">{type.instituicoes} instituições</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <div className="text-sm text-gray-600">Custo Total</div>
                    <div className="font-medium">{formatCurrency(type.custoTotal)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Desperdício</div>
                    <div className="font-medium text-red-600">{formatCurrency(type.custoDesperdicado)}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">% Urgências Falsas:</span>
                    <span className="font-medium">{formatPercent(type.percentUrgenciasFalsas)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">% Desperdício:</span>
                    <span className="font-medium">{formatPercent(type.percentDesperdicio)}</span>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${Math.min(type.percentDesperdicio, 100)}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {type.percentDesperdicio >= 20 ? 'Crítico' : 
                     type.percentDesperdicio >= 15 ? 'Elevado' :
                     type.percentDesperdicio >= 10 ? 'Moderado' : 'Aceitável'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Projeções e Impacto */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Projeções e Impacto de Melhorias</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cenário Otimista */}
          <div className="metric-card border-green-200 bg-green-50">
            <div className="metric-value" style={{ color: '#059669' }}>
              {formatCurrency(totalDesperdicioNacional * 0.5)}
            </div>
            <div className="metric-label">Redução 50% Falsas Urgências</div>
            <div className="text-sm text-green-700 mt-2">
              Economia anual se reduzirmos urgências falsas em 50%
            </div>
          </div>

          {/* Cenário Meta OMS */}
          <div className="metric-card border-blue-200 bg-blue-50">
            <div className="metric-value" style={{ color: '#1e40af' }}>
              {formatCurrency(totalDesperdicioNacional * 0.7)}
            </div>
            <div className="metric-label">Meta OMS: &lt;25% Falsas</div>
            <div className="text-sm text-blue-700 mt-2">
              Economia ao atingir meta da OMS para urgências falsas
            </div>
          </div>

          {/* Impacto por Ano */}
          <div className="metric-card border-purple-200 bg-purple-50">
            <div className="metric-value" style={{ color: '#7c3aed' }}>
              {formatCurrency(totalDesperdicioNacional * 12)}
            </div>
            <div className="metric-label">Impacto Anual Total</div>
            <div className="text-sm text-purple-700 mt-2">
              Desperdício projetado para um ano completo
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <h4 className="font-semibold text-orange-800 mb-2">💡 Recomendações Financeiras</h4>
          <ul className="text-sm text-orange-700 space-y-1">
            <li>• Investir em cuidados de saúde primários para reduzir urgências falsas</li>
            <li>• Implementar triagem avançada para desviar casos não urgentes</li>
            <li>• Campanhas de educação pública sobre uso adequado das urgências</li>
            <li>• Telemedicina para consultas de baixa complexidade</li>
            <li>• Revisão de protocolos para otimizar fluxos de atendimento</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardFinanceiro;
