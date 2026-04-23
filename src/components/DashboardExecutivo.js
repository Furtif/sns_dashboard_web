import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatNumber, formatCurrency, formatPercent, formatPeriodRange } from '../utils/formatters';

const DashboardExecutivo = ({ data, dateRange }) => {
  const [timeSeriesData, setTimeSeriesData] = useState([]);
  const [triagemData, setTriagemData] = useState([]);
  const [triagemPercentages, setTriagemPercentages] = useState({});
  const [covidTimeSeriesData, setCovidTimeSeriesData] = useState([]);
  const [triagemProcessedData, setTriagemProcessedData] = useState([]);

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
        }, []);
      const seriesDataSorted = [...seriesData].sort((a, b) => a.period.localeCompare(b.period));
      setTimeSeriesData(seriesDataSorted);

      // Preparar dados para gráfico de triagem (a partir de dadosBrutos merged para consistência)
      const triagemTotals = data.dadosBrutos.reduce((acc, row) => {
        acc.vermelha += row.Atendimentos_Vermelha || 0;
        acc.laranja += row.Atendimentos_Laranja || 0;
        acc.amarela += row.Atendimentos_Amarela || 0;
        acc.verde += row.Atendimentos_Verde || 0;
        acc.azul += row.Atendimentos_Azul || 0;
        acc.branca += row.Atendimentos_Branca || 0;
        acc.total += row.TotalAtendimentos || 0;
        return acc;
      }, { vermelha: 0, laranja: 0, amarela: 0, verde: 0, azul: 0, branca: 0, total: 0 });

      const totalComTriagem = triagemTotals.total;
      const triagemPercentages = totalComTriagem > 0 ? {
        vermelha: (triagemTotals.vermelha / totalComTriagem) * 100,
        laranja: (triagemTotals.laranja / totalComTriagem) * 100,
        amarela: (triagemTotals.amarela / totalComTriagem) * 100,
        verde: (triagemTotals.verde / totalComTriagem) * 100,
        azul: (triagemTotals.azul / totalComTriagem) * 100,
        branca: (triagemTotals.branca / totalComTriagem) * 100
      } : {};

      const triagem = [
        { name: 'Vermelha', value: triagemTotals.vermelha, color: '#dc2626' },
        { name: 'Laranja', value: triagemTotals.laranja, color: '#ea580c' },
        { name: 'Amarela', value: triagemTotals.amarela, color: '#ca8a04' },
        { name: 'Verde', value: triagemTotals.verde, color: '#16a34a' },
        { name: 'Azul', value: triagemTotals.azul, color: '#2563eb' },
        { name: 'Branca', value: triagemTotals.branca, color: '#6b7280' }
      ].filter(item => item.value > 0);

      setTriagemData(triagem);
      setTriagemPercentages(triagemPercentages);

      // Preparar dados de triagem por instituição (a partir de dadosBrutos merged)
      const triagemByInstitution = {};
      data.dadosBrutos.forEach(row => {
        const instId = row.InstituicaoID;
        if (!triagemByInstitution[instId]) {
          const institution = data.instituicoes?.find(i => i.InstituicaoID === instId);
          triagemByInstitution[instId] = {
            name: institution?.InstituicaoNome || `Instituição ${instId}`,
            region: data.regioes?.find(r => r.RegiaoID === row.RegiaoID)?.RegiaoNome || '',
            vermelha: 0, laranja: 0, amarela: 0, verde: 0, azul: 0, branca: 0, total: 0
          };
        }
        triagemByInstitution[instId].vermelha += row.Atendimentos_Vermelha || 0;
        triagemByInstitution[instId].laranja += row.Atendimentos_Laranja || 0;
        triagemByInstitution[instId].amarela += row.Atendimentos_Amarela || 0;
        triagemByInstitution[instId].verde += row.Atendimentos_Verde || 0;
        triagemByInstitution[instId].azul += row.Atendimentos_Azul || 0;
        triagemByInstitution[instId].branca += row.Atendimentos_Branca || 0;
        triagemByInstitution[instId].total += row.TotalAtendimentos || 0;
      });

      const triagemByInstitutionArray = Object.values(triagemByInstitution)
        .sort((a, b) => b.total - a.total);
      setTriagemProcessedData(triagemByInstitutionArray);

      // Preparar dados COVID-19 para série temporal (2016-atualidade, independente do filtro)
      const covidData = (data.dadosCovidCompletos || [])
        .reduce((acc, row) => {
          const existing = acc.find(item => item.period === row.Período);
          if (existing) {
            existing.casosCovid += row.CasosCovid || 0;
            existing.obitosCovid += row.ObitosCovid || 0;
            existing.internamentosCovid += row.InternamentosCovid || 0;
          } else {
            acc.push({
              period: row.Período,
              casosCovid: row.CasosCovid || 0,
              obitosCovid: row.ObitosCovid || 0,
              internamentosCovid: row.InternamentosCovid || 0
            });
          }
          return acc;
        }, []);
      const covidDataSorted = [...covidData].sort((a, b) => a.period.localeCompare(b.period));
      setCovidTimeSeriesData(covidDataSorted);
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
        <div className="metric-card" style={{ borderLeft: '4px solid #1e40af' }}>
          <div className="metric-value" style={{ color: '#1e40af' }}>
            {formatNumber(data.totalAtendimentos)}
          </div>
          <div className="metric-label">Total Atendimentos</div>
          <div className="metric-change neutral">
            Período analisado
          </div>
        </div>

        <div className="metric-card" style={{ borderLeft: '4px solid ' + getScoreColor(data.scoreIneficienciaGlobal) }}>
          <div className="metric-value" style={{ color: getScoreColor(data.scoreIneficienciaGlobal) }}>
            {data.scoreIneficienciaGlobal?.toFixed(1) || '0'}
          </div>
          <div className="metric-label">Score Ineficiência</div>
          <div className={`metric-change ${data.scoreIneficienciaGlobal >= 65 ? 'negative' : data.scoreIneficienciaGlobal >= 35 ? 'neutral' : 'positive'}`}>
            {data.classificacaoIneficiencia || 'N/A'}
          </div>
        </div>

        <div className="metric-card" style={{ borderLeft: '4px solid ' + (data.percentUrgenciasFalsas >= 35 ? '#dc2626' : data.percentUrgenciasFalsas >= 25 ? '#ea580c' : '#16a34a') }}>
          <div className="metric-value" style={{ color: data.percentUrgenciasFalsas >= 35 ? '#dc2626' : data.percentUrgenciasFalsas >= 25 ? '#ea580c' : '#16a34a' }}>
            {formatPercent(data.percentUrgenciasFalsas)}
          </div>
          <div className="metric-label">Urgências Falsas</div>
          <div className={`metric-change ${data.percentUrgenciasFalsas >= 35 ? 'negative' : data.percentUrgenciasFalsas >= 25 ? 'neutral' : 'positive'}`}>
            {data.statusUrgenciasFalsas}
          </div>
        </div>

        <div className="metric-card" style={{ borderLeft: '4px solid #059669' }}>
          <div className="metric-value" style={{ color: '#059669' }}>
            {formatCurrency(data.custoDesperdicadoEstimado)}
          </div>
          <div className="metric-label">Custo Desperdiçado</div>
          <div className="metric-change neutral">
            Estimativa anual
          </div>
        </div>
      </div>


      {/* KPIs COVID-19 */}
      {data.totalCasosCovid > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div style={{ height: '1px' }}></div>
          <div className="metric-card" style={{ borderLeft: '4px solid #7c3aed' }}>
            <div className="metric-value" style={{ color: '#7c3aed' }}>
              {formatNumber(data.totalCasosCovid)}
            </div>
            <div className="metric-label">Casos COVID-19</div>
            <div className="metric-change neutral">
              Nas urgências
            </div>
          </div>

          <div className="metric-card" style={{ borderLeft: '4px solid #dc2626' }}>
            <div className="metric-value" style={{ color: '#dc2626' }}>
              {formatNumber(data.totalObitosCovid)}
            </div>
            <div className="metric-label">Óbitos COVID-19</div>
            <div className="metric-change negative">
              Letalidade: {data.letalidadeCovid?.toFixed(2) || '0'}%
            </div>
          </div>

          <div className="metric-card" style={{ borderLeft: '4px solid #2563eb' }}>
            <div className="metric-value" style={{ color: '#2563eb' }}>
              {formatNumber(data.totalInternamentosCovid)}
            </div>
            <div className="metric-label">Internamentos COVID</div>
            <div className="metric-change neutral">
              {data.totalCasosCovid > 0 ? ((data.totalInternamentosCovid / data.totalCasosCovid) * 100).toFixed(1) : '0'}% dos casos
            </div>
          </div>

          <div className="metric-card" style={{ borderLeft: '4px solid #059669' }}>
            <div className="metric-value" style={{ color: '#059669' }}>
              {formatPercent(data.percentCovidGlobal)}
            </div>
            <div className="metric-label">% COVID/Urgências</div>
            <div className="metric-change neutral">
              Do total de atendimentos
            </div>
          </div>
        </div>
      )}
      <div style={{ height: '20px' }}></div>

      {/* Gráficos Principais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Evolução Temporal */}
        <div className="chart-container">
          <h3 className="chart-title">📈 Evolução dos Atendimentos (2016 - {new Date().getFullYear()})</h3>
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
          <h3 className="chart-title">🥧 Distribuição por Triagem Manchester</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={triagemData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                outerRadius={70}
                fill="#8884d8"
                dataKey="value"
                labelStyle={{ fontSize: '11px' }}
              >
                {triagemData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatNumber(value)} />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Dados Detalhados Triagem Manchester (merged 2013-2026) */}
      {triagemProcessedData.length > 0 && (
        <div className="card mb-6">
          <div className="card-header">
            <h3 className="card-title">🚑 Triagem Manchester Detalhada ({formatPeriodRange(dateRange)})</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
            <div className="metric-card" style={{ borderLeft: '4px solid #dc2626' }}>
              <div className="metric-value text-red-600">{formatNumber(triagemData.find(t => t.name === 'Vermelha')?.value || 0)}</div>
              <div className="metric-label">Vermelha</div>
              <div className="text-xs text-gray-500">{formatPercent(triagemPercentages?.vermelha || 0)}</div>
            </div>
            <div className="metric-card" style={{ borderLeft: '4px solid #ea580c' }}>
              <div className="metric-value text-orange-600">{formatNumber(triagemData.find(t => t.name === 'Laranja')?.value || 0)}</div>
              <div className="metric-label">Laranja</div>
              <div className="text-xs text-gray-500">{formatPercent(triagemPercentages?.laranja || 0)}</div>
            </div>
            <div className="metric-card" style={{ borderLeft: '4px solid #eab308' }}>
              <div className="metric-value text-yellow-600">{formatNumber(triagemData.find(t => t.name === 'Amarela')?.value || 0)}</div>
              <div className="metric-label">Amarela</div>
              <div className="text-xs text-gray-500">{formatPercent(triagemPercentages?.amarela || 0)}</div>
            </div>
            <div className="metric-card" style={{ borderLeft: '4px solid #16a34a' }}>
              <div className="metric-value text-green-600">{formatNumber(triagemData.find(t => t.name === 'Verde')?.value || 0)}</div>
              <div className="metric-label">Verde (Falsa)</div>
              <div className="text-xs text-gray-500">{formatPercent(triagemPercentages?.verde || 0)}</div>
            </div>
            <div className="metric-card" style={{ borderLeft: '4px solid #2563eb' }}>
              <div className="metric-value text-blue-600">{formatNumber(triagemData.find(t => t.name === 'Azul')?.value || 0)}</div>
              <div className="metric-label">Azul (Falsa)</div>
              <div className="text-xs text-gray-500">{formatPercent(triagemPercentages?.azul || 0)}</div>
            </div>
            <div className="metric-card" style={{ borderLeft: '4px solid #6b7280' }}>
              <div className="metric-value text-gray-600">{formatNumber(triagemData.find(t => t.name === 'Branca')?.value || 0)}</div>
              <div className="metric-label">Branca (Falsa)</div>
              <div className="text-xs text-gray-500">{formatPercent(triagemPercentages?.branca || 0)}</div>
            </div>
          </div>
          <div style={{ height: '20px' }}></div>
          <h4 className="font-semibold mb-2 px-4">🏥 Top 10 Instituições por Volume (Manchester)</h4>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Instituição</th>
                  <th className="text-right">Total</th>
                  <th className="text-right">Vermelha</th>
                  <th className="text-right">Laranja</th>
                  <th className="text-right">Amarela</th>
                  <th className="text-right">Verde</th>
                  <th className="text-right">Azul</th>
                  <th className="text-right">Branca</th>
                </tr>
              </thead>
              <tbody>
                {triagemProcessedData.slice(0, 10).map((inst, idx) => (
                  <tr key={idx}>
                    <td className="font-medium" data-label="Instituição">
                      <div>{inst.name}</div>
                      <div className="text-xs text-gray-500 mobile-only">{inst.region}</div>
                    </td>
                    <td className="text-right font-medium" data-label="Total">{formatNumber(inst.total)}</td>
                    <td className="text-right" data-label="Vermelha">{formatNumber(inst.vermelha)}</td>
                    <td className="text-right" data-label="Laranja">{formatNumber(inst.laranja)}</td>
                    <td className="text-right" data-label="Amarela">{formatNumber(inst.amarela)}</td>
                    <td className="text-right" data-label="Verde">{formatNumber(inst.verde)}</td>
                    <td className="text-right" data-label="Azul">{formatNumber(inst.azul)}</td>
                    <td className="text-right" data-label="Branca">{formatNumber(inst.branca)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Métricas Operacionais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">👥 Recursos Humanos</h3>
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
            <h3 className="card-title">⏱️ Tempos de Espera</h3>
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
            <h3 className="card-title">💰 Impacto Financeiro</h3>
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

      {/* Gráfico COVID-19 */}
      {covidTimeSeriesData.length > 0 && (
        <div className="chart-container mb-6">
          <h3 className="chart-title">🦠 Evolução COVID-19 e Gripe Sazonal nas Urgências (2016 - {new Date().getFullYear()})</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={covidTimeSeriesData}>
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
                  name === 'casosCovid' ? 'Casos COVID' :
                    name === 'obitosCovid' ? 'Óbitos COVID' :
                      name === 'internamentosCovid' ? 'Internamentos COVID' : name
                ]}
                labelFormatter={(label) => `Período: ${label}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="casosCovid"
                stroke="#f97316"
                strokeWidth={3}
                dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }}
                name="Casos COVID"
              />
              <Line
                type="monotone"
                dataKey="obitosCovid"
                stroke="#dc2626"
                strokeWidth={3}
                dot={{ fill: '#dc2626', strokeWidth: 2, r: 4 }}
                name="Óbitos COVID"
              />
              <Line
                type="monotone"
                dataKey="internamentosCovid"
                stroke="#0891b2"
                strokeWidth={3}
                dot={{ fill: '#0891b2', strokeWidth: 2, r: 4 }}
                name="Internamentos COVID"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

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
