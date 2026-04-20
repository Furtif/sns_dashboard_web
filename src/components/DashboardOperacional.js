import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { formatNumber, formatPercent } from '../utils/formatters';

const DashboardOperacional = ({ data }) => {
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedInstitution, setSelectedInstitution] = useState('');
  const [institutionData, setInstitutionData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [covidOperationalData, setCovidOperationalData] = useState([]);

  useEffect(() => {
    if (data && data.dadosBrutos) {
      // Preparar dados mensais
      const monthly = data.dadosBrutos
        .filter(row => row.TotalAtendimentos > 0)
        .reduce((acc, row) => {
          const existing = acc.find(item => item.period === row.Período);
          if (existing) {
            existing.totalAtendimentos += row.TotalAtendimentos || 0;
            existing.urgenciasFalsas += (row.Atendimentos_Verde || 0) + (row.Atendimentos_Azul || 0) + (row.Atendimentos_Branca || 0);
            existing.medicos += row.Médicos || 0;
            existing.enfermeiros += row.Enfermeiros || 0;
            existing.institutions++;
          } else {
            acc.push({
              period: row.Período,
              totalAtendimentos: row.TotalAtendimentos || 0,
              urgenciasFalsas: (row.Atendimentos_Verde || 0) + (row.Atendimentos_Azul || 0) + (row.Atendimentos_Branca || 0),
              medicos: row.Médicos || 0,
              enfermeiros: row.Enfermeiros || 0,
              institutions: 1
            });
          }
          return acc;
        }, [])
        .map(item => ({
          ...item,
          percentUrgenciasFalsas: item.totalAtendimentos > 0 ? (item.urgenciasFalsas / item.totalAtendimentos) * 100 : 0,
          racioEnfermeiroMedico: item.medicos > 0 ? item.enfermeiros / item.medicos : 0,
          atendimentosPorMedico: item.medicos > 0 ? item.totalAtendimentos / item.medicos : 0
        }))
      const monthlySorted = [...monthly].sort((a, b) => a.period.localeCompare(b.period));
      setMonthlyData(monthlySorted);

      // Preparar dados por instituição
      const institutions = {};
      data.dadosBrutos.forEach(row => {
        const instId = row.InstituicaoID;
        if (!institutions[instId]) {
          const institution = data.instituicoes.find(i => i.InstituicaoID === instId);
          institutions[instId] = {
            instituicaoId: instId,
            instituicaoNome: institution?.InstituicaoNome || `Instituição ${instId}`,
            tipo: institution?.Tipo || 'N/A',
            regiaoId: row.RegiaoID,
            totalAtendimentos: 0,
            urgenciasFalsas: 0,
            medicos: 0,
            enfermeiros: 0,
            meses: 0
          };
        }

        institutions[instId].totalAtendimentos += row.TotalAtendimentos || 0;
        institutions[instId].urgenciasFalsas += (row.Atendimentos_Verde || 0) + (row.Atendimentos_Azul || 0) + (row.Atendimentos_Branca || 0);
        institutions[instId].medicos += row.Médicos || 0;
        institutions[instId].enfermeiros += row.Enfermeiros || 0;
        institutions[instId].meses++;
      });

      const instArray = Object.values(institutions)
        .map(inst => ({
          ...inst,
          percentUrgenciasFalsas: inst.totalAtendimentos > 0 ? (inst.urgenciasFalsas / inst.totalAtendimentos) * 100 : 0,
          racioEnfermeiroMedico: inst.medicos > 0 ? inst.enfermeiros / inst.medicos : 0,
          atendimentosPorMedico: inst.medicos > 0 ? inst.totalAtendimentos / inst.medicos : 0,
          atendimentosPorMes: inst.totalAtendimentos / inst.meses
        }))
      const instArraySorted = [...instArray].sort((a, b) => b.totalAtendimentos - a.totalAtendimentos);
      setInstitutionData(instArraySorted);

      // Preparar dados operacionais COVID-19 (2016-atualidade)
      const covidOpData = (data.dadosCovidCompletos || [])
        .reduce((acc, row) => {
          const existing = acc.find(item => item.period === row.Período);
          if (existing) {
            existing.casosCovid += row.CasosCovid || 0;
            existing.obitosCovid += row.ObitosCovid || 0;
            existing.internamentosCovid += row.InternamentosCovid || 0;
            existing.percentUrgenciasFalsas = (existing.urgenciasFalsas + (row.Atendimentos_Verde || 0) + (row.Atendimentos_Azul || 0) + (row.Atendimentos_Branca || 0)) /
              (existing.totalAtendimentos + (row.TotalAtendimentos || 0)) * 100;
            existing.urgenciasFalsas += (row.Atendimentos_Verde || 0) + (row.Atendimentos_Azul || 0) + (row.Atendimentos_Branca || 0);
            existing.totalAtendimentos += row.TotalAtendimentos || 0;
          } else {
            const urgenciasFalsas = (row.Atendimentos_Verde || 0) + (row.Atendimentos_Azul || 0) + (row.Atendimentos_Branca || 0);
            acc.push({
              period: row.Período,
              casosCovid: row.CasosCovid || 0,
              obitosCovid: row.ObitosCovid || 0,
              internamentosCovid: row.InternamentosCovid || 0,
              urgenciasFalsas: urgenciasFalsas,
              totalAtendimentos: row.TotalAtendimentos || 0,
              percentUrgenciasFalsas: (row.TotalAtendimentos || 0) > 0 ? (urgenciasFalsas / row.TotalAtendimentos) * 100 : 0
            });
          }
          return acc;
        }, []);
      const covidOpDataSorted = [...covidOpData].sort((a, b) => a.period.localeCompare(b.period));
      setCovidOperationalData(covidOpDataSorted);
    }
  }, [data]);


  const getEfficiencyColor = (percent) => {
    if (percent >= 35) return '#ec4899';
    if (percent >= 25) return '#ea580c';
    if (percent >= 15) return '#ca8a04';
    return '#16a34a';
  };

  const getRacioColor = (racio) => {
    if (racio < 1.5) return '#ec4899';
    if (racio < 2) return '#ea580c';
    return '#16a34a';
  };

  const filteredInstitutions = institutionData.filter(inst => {
    if (selectedRegion && inst.regiaoId !== parseInt(selectedRegion)) return false;
    if (selectedInstitution && inst.instituicaoId !== parseInt(selectedInstitution)) return false;
    return true;
  });

  const topInstitutions = filteredInstitutions.slice(0, 10);
  const worstEfficiency = [...filteredInstitutions]
    .sort((a, b) => b.percentUrgenciasFalsas - a.percentUrgenciasFalsas)
    .slice(0, 10);

  if (!data || !data.totalAtendimentos || data.totalAtendimentos === 0) {
    return (
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">⚙️ Dashboard Operacional</h3>
        </div>
        <div className="text-center py-8">
          <div className="text-gray-500 text-lg mb-2">⚙️</div>
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
      {/* Filtros */}
      <div className="filters">
        <div className="filter-group">
          <label className="filter-label">Região:</label>
          <select
            className="filter-select"
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
          >
            <option value="">Todas as Regiões</option>
            {data.regioes?.map(regiao => (
              <option key={regiao.RegiaoID} value={regiao.RegiaoID}>
                {regiao.RegiaoNome}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Instituição:</label>
          <select
            className="filter-select"
            value={selectedInstitution}
            onChange={(e) => setSelectedInstitution(e.target.value)}
          >
            <option value="">Todas as Instituições</option>
            {data.instituicoes?.map(inst => (
              <option key={inst.InstituicaoID} value={inst.InstituicaoID}>
                {inst.InstituicaoNome}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPIs Operacionais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="metric-card" style={{ borderLeft: '4px solid #7c3aed' }}>
          <div className="metric-value" style={{ color: '#1e40af' }}>
            {filteredInstitutions.length}
          </div>
          <div className="metric-label">Instituições Ativas</div>
          <div className="metric-change neutral">
            {selectedRegion || selectedInstitution ? 'Filtrado' : 'Total'}
          </div>
        </div>

        <div className="metric-card" style={{ borderLeft: '4px solid #8f2800ff' }}>
          <div className="metric-value" style={{
            color: getEfficiencyColor(
              filteredInstitutions.reduce((sum, inst) => sum + inst.percentUrgenciasFalsas, 0) / filteredInstitutions.length
            )
          }}>
            {filteredInstitutions.length > 0 ?
              formatPercent(filteredInstitutions.reduce((sum, inst) => sum + inst.percentUrgenciasFalsas, 0) / filteredInstitutions.length) :
              '0%'
            }
          </div>
          <div className="metric-label">Média Urgências Falsas</div>
          <div className="metric-change neutral">
            Por instituição
          </div>
        </div>

        <div className="metric-card" style={{ borderLeft: '4px solid #3aed4979' }}>
          <div className="metric-value" style={{
            color: getRacioColor(
              filteredInstitutions.filter(i => i.racioEnfermeiroMedico > 0)
                .reduce((sum, inst) => sum + inst.racioEnfermeiroMedico, 0) /
              filteredInstitutions.filter(i => i.racioEnfermeiroMedico > 0).length
            )
          }}>
            {filteredInstitutions.filter(i => i.racioEnfermeiroMedico > 0).length > 0 ?
              (filteredInstitutions.filter(i => i.racioEnfermeiroMedico > 0)
                .reduce((sum, inst) => sum + inst.racioEnfermeiroMedico, 0) /
                filteredInstitutions.filter(i => i.racioEnfermeiroMedico > 0).length).toFixed(2) :
              'N/A'
            }
          </div>
          <div className="metric-label">Rácio Médio Enf./Méd.</div>
          <div className="metric-change neutral">
            Apenas com dados RH
          </div>
        </div>

        <div className="metric-card" style={{ borderLeft: '4px solid #059669' }}>
          <div className="metric-value" style={{ color: '#059669' }}>
            {filteredInstitutions.length > 0 ?
              formatNumber(filteredInstitutions.reduce((sum, inst) => sum + inst.totalAtendimentos, 0)) :
              '0'
            }
          </div>
          <div className="metric-label">Total Atendimentos</div>
          <div className="metric-change neutral">
            Período selecionado
          </div>
        </div>

        {/* KPIs COVID-19 Operacional */}
        {data.totalCasosCovid > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
                {data.letalidadeCovid?.toFixed(2) || '0'}% letalidade
              </div>
            </div>

            <div className="metric-card" style={{ borderLeft: '4px solid #2563eb' }}>
              <div className="metric-value" style={{ color: '#2563eb' }}>
                {formatNumber(data.totalInternamentosCovid)}
              </div>
              <div className="metric-label">Internamentos COVID</div>
              <div className="metric-change neutral">
                {data.totalCasosCovid > 0 ? ((data.totalInternamentosCovid / data.totalCasosCovid) * 100).toFixed(1) : '0'}% taxa
              </div>
            </div>

            <div className="metric-card" style={{ borderLeft: '4px solid #059669' }}>
              <div className="metric-value" style={{ color: '#059669' }}>
                {formatPercent(data.percentCovidGlobal)}
              </div>
              <div className="metric-label">Impacto COVID</div>
              <div className="metric-change neutral">
                % do total urgências
              </div>
            </div>
          </div>
        )}
      </div>
      <div style={{ height: '20px' }}></div>

      {/* Gráficos Operacionais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Evolução Mensal */}
        <div className="chart-container">
          <h3 className="chart-title">Evolução Mensal de Indicadores (2016 - {new Date().getFullYear()})</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
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
                  name.includes('percent') ? formatPercent(value) : formatNumber(value),
                  name === 'percentUrgenciasFalsas' ? '% Urgências Falsas' :
                    name === 'racioEnfermeiroMedico' ? 'Rácio Enf./Méd.' :
                      name === 'atendimentosPorMedico' ? 'Atend./Médico' : name
                ]}
                labelFormatter={(label) => `Período: ${label}`}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="percentUrgenciasFalsas"
                stroke="#16a34a"
                strokeWidth={2}
                name="% Urgências Falsas"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="racioEnfermeiroMedico"
                stroke="#2563eb"
                strokeWidth={2}
                name="Rácio Enf./Méd."
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Dispersão: Eficiência vs Volume */}
        <div className="chart-container">
          <h3 className="chart-title">Análise de Eficiência vs Volume</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart data={filteredInstitutions}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="atendimentosPorMes"
                name="Volume Mensal"
                tick={{ fontSize: 12 }}
              />
              <YAxis
                dataKey="percentUrgenciasFalsas"
                name="% Urgências Falsas"
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 border rounded shadow-lg">
                        <p className="font-semibold">{data.instituicaoNome}</p>
                        <p className="text-sm">Volume: {formatNumber(data.atendimentosPorMes)}/mês</p>
                        <p className="text-sm">% Falsas: {formatPercent(data.percentUrgenciasFalsas)}</p>
                        <p className="text-sm">Rácio: {data.racioEnfermeiroMedico.toFixed(2)}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter
                dataKey="percentUrgenciasFalsas"
                fill="#1e40af"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico COVID-19 Operacional */}
      {covidOperationalData.length > 0 && (
        <div className="chart-container mb-6">
          <h3 className="chart-title">Evolução Operacional COVID-19 e Gripe Sazonal (2016 - {new Date().getFullYear()})</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={covidOperationalData}>
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
                  name.includes('percent') ? formatPercent(value) : formatNumber(value),
                  name === 'casosCovid' ? 'Casos COVID' :
                    name === 'obitosCovid' ? 'Óbitos COVID' :
                      name === 'internamentosCovid' ? 'Internamentos COVID' :
                        name === 'percentUrgenciasFalsas' ? '% Urgências Falsas' : name
                ]}
                labelFormatter={(label) => `Período: ${label}`}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="casosCovid"
                stroke="#f97316"
                strokeWidth={3}
                dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }}
                name="Casos COVID"
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="obitosCovid"
                stroke="#dc2626"
                strokeWidth={3}
                dot={{ fill: '#dc2626', strokeWidth: 2, r: 4 }}
                name="Óbitos COVID"
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="internamentosCovid"
                stroke="#0891b2"
                strokeWidth={3}
                dot={{ fill: '#0891b2', strokeWidth: 2, r: 4 }}
                name="Internamentos COVID"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="percentUrgenciasFalsas"
                stroke="#65a30d"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="% Urgências Falsas"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Tabelas de Ranking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Top Instituições por Volume */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Top 10 Instituições por Volume</h3>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Instituição</th>
                  <th>Tipo</th>
                  <th className="text-right">Atendimentos</th>
                  <th className="text-right">% Falsas</th>
                </tr>
              </thead>
              <tbody>
                {topInstitutions.map((inst, index) => (
                  <tr key={inst.instituicaoId}>
                    <td className="font-medium">
                      <div className="font-semibold">{inst.instituicaoNome}</div>
                      <div className="text-xs text-gray-500 mobile-only">
                        {inst.tipo} {formatNumber(inst.atendimentosPorMes)}/mês
                      </div>
                    </td>
                    <td style={{ verticalAlign: 'middle' }}>{inst.tipo}</td>
                    <td className="text-right font-medium">
                      {formatNumber(inst.totalAtendimentos)}
                    </td>
                    <td className="text-right">
                      <span
                        className="px-2 py-1 rounded text-xs font-medium"
                        style={{
                          backgroundColor: getEfficiencyColor(inst.percentUrgenciasFalsas) + '20',
                          color: getEfficiencyColor(inst.percentUrgenciasFalsas)
                        }}
                      >
                        {formatPercent(inst.percentUrgenciasFalsas)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pior Eficiência */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Maior Percentagem de Urgências Falsas</h3>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Instituição</th>
                  <th>Tipo</th>
                  <th className="text-right">% Falsas</th>
                  <th className="text-right">Rácio</th>
                </tr>
              </thead>
              <tbody>
                {worstEfficiency.map((inst, index) => (
                  <tr key={inst.instituicaoId}>
                    <td className="font-medium">
                      <div className="font-semibold">{inst.instituicaoNome}</div>
                      <div className="text-xs text-gray-500 mobile-only">
                        {inst.tipo} Rácio: {inst.racioEnfermeiroMedico.toFixed(2)}
                      </div>
                    </td>
                    <td style={{ verticalAlign: 'middle' }}>{inst.tipo}</td>
                    <td className="text-right">
                      <span
                        className="px-2 py-1 rounded text-xs font-medium text-white"
                        style={{ backgroundColor: getEfficiencyColor(inst.percentUrgenciasFalsas) }}
                      >
                        {formatPercent(inst.percentUrgenciasFalsas)}
                      </span>
                    </td>
                    <td className="text-right">
                      <span
                        className="px-2 py-1 rounded text-xs font-medium"
                        style={{
                          backgroundColor: getRacioColor(inst.racioEnfermeiroMedico) + '20',
                          color: getRacioColor(inst.racioEnfermeiroMedico)
                        }}
                      >
                        {inst.racioEnfermeiroMedico.toFixed(2)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Análise por Tipo de Instituição */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Análise por Tipo de Instituição</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {['CH', 'CHU', 'ULS', 'Hospital'].map(tipo => {
            const tipoData = filteredInstitutions.filter(inst => inst.tipo === tipo);
            if (tipoData.length === 0) return null;

            const avgPercentFalsas = tipoData.reduce((sum, inst) => sum + inst.percentUrgenciasFalsas, 0) / tipoData.length;
            const avgRacio = tipoData.filter(i => i.racioEnfermeiroMedico > 0)
              .reduce((sum, inst) => sum + inst.racioEnfermeiroMedico, 0) /
              tipoData.filter(i => i.racioEnfermeiroMedico > 0).length;

            return (
              <div key={tipo} className="metric-card">
                <div className="metric-value" style={{ color: '#1e40af' }}>
                  {tipo}
                </div>
                <div className="metric-label">{tipoData.length} instituições</div>
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">% Falsas médio: </span>
                    <span className="font-medium">{formatPercent(avgPercentFalsas)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Rácio médio: </span>
                    <span className="font-medium">{avgRacio.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardOperacional;
