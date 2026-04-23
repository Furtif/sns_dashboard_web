import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, PieChart, Pie, Cell } from 'recharts';
import { formatNumber, formatPercent, formatPeriodRange } from '../utils/formatters';

const DashboardOperacional = ({ data, dateRange }) => {
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedInstitution, setSelectedInstitution] = useState('');
  const [institutionData, setInstitutionData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [covidOperationalData, setCovidOperationalData] = useState([]);
  const [triagemData, setTriagemData] = useState(null);

  useEffect(() => {
    if (data && data.dadosBrutos) {
      // Preparar dados mensais (usar dados com RH 2016-2026)
      const monthly = data.dadosBrutos
        .filter(row => row.TotalAtendimentos > 0 && (row.Médicos > 0 || row.Enfermeiros > 0))
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

      // Preparar dados por instituição (ignorar 2013-2015 que não têm dados de RH)
      const institutions = {};
      data.dadosBrutos
        .filter(row => row.Período >= '2016' && (row.Médicos > 0 || row.Enfermeiros > 0))
        .forEach(row => {
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

      // Preparar dados operacionais COVID-19 (2013-atualidade)
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

      // Calcular dados de triagem a partir de dadosBrutos merged (consistente com Executivo)
      const triagemTotals = data.dadosBrutos.reduce((acc, row) => {
        acc.vermelha += row.Atendimentos_Vermelha || 0;
        acc.laranja += row.Atendimentos_Laranja || 0;
        acc.amarela += row.Atendimentos_Amarela || 0;
        acc.verde += row.Atendimentos_Verde || 0;
        acc.azul += row.Atendimentos_Azul || 0;
        acc.branca += row.Atendimentos_Branca || 0;
        acc.semTriagem += row.Atendimentos_SemTriagem || 0;
        acc.total += row.TotalAtendimentos || 0;
        return acc;
      }, { vermelha: 0, laranja: 0, amarela: 0, verde: 0, azul: 0, branca: 0, semTriagem: 0, total: 0 });

      const totalComTriagem = triagemTotals.total - triagemTotals.semTriagem;
      const percentages = totalComTriagem > 0 ? {
        vermelha: (triagemTotals.vermelha / totalComTriagem) * 100,
        laranja: (triagemTotals.laranja / totalComTriagem) * 100,
        amarela: (triagemTotals.amarela / totalComTriagem) * 100,
        verde: (triagemTotals.verde / totalComTriagem) * 100,
        azul: (triagemTotals.azul / totalComTriagem) * 100,
        branca: (triagemTotals.branca / totalComTriagem) * 100
      } : {};

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

      setTriagemData({
        totals: triagemTotals,
        percentages,
        byInstitution: Object.values(triagemByInstitution).sort((a, b) => b.total - a.total)
      });
    }
  }, [data, dateRange]);


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
              <strong>Dica:</strong> Os dados operacionais estão disponíveis de 2016 a 2026.
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
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="metric-card" style={{ borderLeft: '4px solid #1e40af' }}>
          <div className="metric-value" style={{ color: '#1e40af' }}>
            {filteredInstitutions.length}
          </div>
          <div className="metric-label">Instituições Ativas</div>
          <div className="metric-change neutral">
            {selectedRegion || selectedInstitution ? 'Filtrado' : 'Total'}
          </div>
        </div>

        <div className="metric-card" style={{ borderLeft: '4px solid ' + getEfficiencyColor(
              filteredInstitutions.reduce((sum, inst) => sum + inst.percentUrgenciasFalsas, 0) / filteredInstitutions.length
            ) }}>
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

        <div className="metric-card" style={{ borderLeft: '4px solid ' + getRacioColor(
              filteredInstitutions.filter(i => i.racioEnfermeiroMedico > 0)
                .reduce((sum, inst) => sum + inst.racioEnfermeiroMedico, 0) /
              filteredInstitutions.filter(i => i.racioEnfermeiroMedico > 0).length) }}>
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
      </div>

      {/* KPIs COVID-19 Operacional */}
      {data.totalCasosCovid > 0 && (
        <div className="grid grid-cols-4 gap-4 mb-6">
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
      <div style={{ height: '20px' }}></div>

      {/* Distribuição por Triagem Manchester */}
      {triagemData && (
        <div className="chart-container mb-6">
          <h3 className="chart-title">📊 Distribuição por Triagem Manchester</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[
              { name: 'Vermelha', value: triagemData.totals?.vermelha || 0, color: '#dc2626' },
              { name: 'Laranja', value: triagemData.totals?.laranja || 0, color: '#ea580c' },
              { name: 'Amarela', value: triagemData.totals?.amarela || 0, color: '#eab308' },
              { name: 'Verde', value: triagemData.totals?.verde || 0, color: '#16a34a' },
              { name: 'Azul', value: triagemData.totals?.azul || 0, color: '#2563eb' },
              { name: 'Branca', value: triagemData.totals?.branca || 0, color: '#6b7280' }
            ]} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tickFormatter={(value) => formatNumber(value)} />
              <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(value) => formatNumber(value)} />
              <Bar dataKey="value" name="Atendimentos">
                {[
                  { name: 'Vermelha', value: triagemData.totals?.vermelha || 0, color: '#dc2626' },
                  { name: 'Laranja', value: triagemData.totals?.laranja || 0, color: '#ea580c' },
                  { name: 'Amarela', value: triagemData.totals?.amarela || 0, color: '#eab308' },
                  { name: 'Verde', value: triagemData.totals?.verde || 0, color: '#16a34a' },
                  { name: 'Azul', value: triagemData.totals?.azul || 0, color: '#2563eb' },
                  { name: 'Branca', value: triagemData.totals?.branca || 0, color: '#6b7280' }
                ].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
      <div style={{ height: '20px' }}></div>

      {/* Dados Detalhados Triagem Manchester */}
      {triagemData && (
        <div className="card mb-6">
          <div className="card-header">
            <h3 className="card-title">🚑 Triagem Manchester Detalhada ({formatPeriodRange(dateRange)})</h3>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-6 gap-4 mb-4">
              <div className="metric-card" style={{ borderLeft: '4px solid #dc2626' }}>
                <div className="metric-value text-red-600">
                  {formatNumber(triagemData.totals?.vermelha || 0)}
                </div>
                <div className="metric-label">Vermelha (Imediata)</div>
                <div className="text-xs text-gray-500">
                  {formatPercent(triagemData.percentages?.vermelha || 0)}
                </div>
              </div>
              <div className="metric-card" style={{ borderLeft: '4px solid #ea580c' }}>
                <div className="metric-value text-orange-600">
                  {formatNumber(triagemData.totals?.laranja || 0)}
                </div>
                <div className="metric-label">Laranja (Muito Urgente)</div>
                <div className="text-xs text-gray-500">
                  {formatPercent(triagemData.percentages?.laranja || 0)}
                </div>
              </div>
              <div className="metric-card" style={{ borderLeft: '4px solid #eab308' }}>
                <div className="metric-value text-yellow-600">
                  {formatNumber(triagemData.totals?.amarela || 0)}
                </div>
                <div className="metric-label">Amarela (Urgente)</div>
                <div className="text-xs text-gray-500">
                  {formatPercent(triagemData.percentages?.amarela || 0)}
                </div>
              </div>
              <div className="metric-card" style={{ borderLeft: '4px solid #16a34a' }}>
                <div className="metric-value text-green-600">
                  {formatNumber(triagemData.totals?.verde || 0)}
                </div>
                <div className="metric-label">Verde (Pouco Urgente)</div>
                <div className="text-xs text-gray-500">
                  {formatPercent(triagemData.percentages?.verde || 0)}
                </div>
              </div>
              <div className="metric-card" style={{ borderLeft: '4px solid #2563eb' }}>
                <div className="metric-value text-blue-600">
                  {formatNumber(triagemData.totals?.azul || 0)}
                </div>
                <div className="metric-label">Azul (Não Urgente)</div>
                <div className="text-xs text-gray-500">
                  {formatPercent(triagemData.percentages?.azul || 0)}
                </div>
              </div>
              <div className="metric-card" style={{ borderLeft: '4px solid #6b7280' }}>
                <div className="metric-value text-gray-600">
                  {formatNumber(triagemData.totals?.branca || 0)}
                </div>
                <div className="metric-label">Branca (Não Urgente)</div>
                <div className="text-xs text-gray-500">
                  {formatPercent(triagemData.percentages?.branca || 0)}
                </div>
              </div>
            </div>
            <div style={{ height: '20px' }}></div>
            <h4 className="font-semibold mb-2">🏥 Top 20 Instituições por Volume</h4>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Instituição</th>
                    <th>Região</th>
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
                  {triagemData.byInstitution.slice(0, 20).map((inst, idx) => (
                    <tr key={idx}>
                      <td className="font-medium" data-label="Instituição">{inst.name}</td>
                      <td className="text-sm text-gray-500" data-label="Região">{inst.region}</td>
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
        </div>
      )}
      <div style={{ height: '20px' }}></div>

      {/* Gráficos Operacionais */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Evolução Mensal */}
        <div className="chart-container">
          <h3 className="chart-title">📈 Evolução Mensal de Indicadores (2016 - {new Date().getFullYear()})</h3>
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
              <YAxis yAxisId="left" tick={{ fontSize: 12 }} tickFormatter={(value) => formatNumber(value)} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} tickFormatter={(value) => formatNumber(value)} />
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
          <h3 className="chart-title">📊 Análise de Eficiência vs Volume</h3>
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
          <h3 className="chart-title">🦠 Evolução Operacional COVID-19 e Gripe Sazonal (2013 - {new Date().getFullYear()})</h3>
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
              <YAxis yAxisId="left" tick={{ fontSize: 12 }} tickFormatter={(value) => formatNumber(value)} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} tickFormatter={(value) => formatNumber(value)} />
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
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Top Instituições por Volume */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">🏆 Top 10 Instituições por Volume</h3>
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
                    <td className="font-medium" data-label="Instituição">
                      <div className="font-semibold">{inst.instituicaoNome}</div>
                      <div className="text-xs text-gray-500 mobile-only">
                        Vol: {formatNumber(inst.atendimentosPorMes)}/mês
                      </div>
                    </td>
                    <td style={{ verticalAlign: 'middle' }} data-label="Tipo">{inst.tipo}</td>
                    <td className="text-right font-medium" data-label="Atendimentos">
                      {formatNumber(inst.totalAtendimentos)}
                    </td>
                    <td className="text-right" data-label="% Falsas">
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
            <h3 className="card-title">⚠️ Maior Percentagem de Urgências Falsas</h3>
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
                    <td className="font-medium" data-label="Instituição">
                      <div className="font-semibold">{inst.instituicaoNome}</div>
                    </td>
                    <td style={{ verticalAlign: 'middle' }} data-label="Tipo">{inst.tipo}</td>
                    <td className="text-right" data-label="% Falsas">
                      <span
                        className="px-2 py-1 rounded text-xs font-medium text-white"
                        style={{ backgroundColor: getEfficiencyColor(inst.percentUrgenciasFalsas) }}
                      >
                        {formatPercent(inst.percentUrgenciasFalsas)}
                      </span>
                    </td>
                    <td className="text-right" data-label="Rácio">
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
          <h3 className="card-title">🏛️ Análise por Tipo de Instituição</h3>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {['CH', 'CHU', 'ULS', 'Hospital']
            .filter(tipo => filteredInstitutions.filter(inst => inst.tipo === tipo).length > 0)
            .map(tipo => {
              const tipoData = filteredInstitutions.filter(inst => inst.tipo === tipo);

            const avgPercentFalsas = tipoData.reduce((sum, inst) => sum + inst.percentUrgenciasFalsas, 0) / tipoData.length;
            const avgRacio = tipoData.filter(i => i.racioEnfermeiroMedico > 0)
              .reduce((sum, inst) => sum + inst.racioEnfermeiroMedico, 0) /
              tipoData.filter(i => i.racioEnfermeiroMedico > 0).length;

            // Classificação baseada em % Falsas (prioridade) e Rácio
            const statusClass = avgPercentFalsas >= 35 ? 'negative' : avgPercentFalsas >= 25 ? 'neutral' : 'positive';
            const statusText = avgPercentFalsas >= 35 ? 'Crítico' : avgPercentFalsas >= 25 ? 'Moderado' : 'Bom';
            const borderColor = avgPercentFalsas >= 35 ? '#dc2626' : avgPercentFalsas >= 25 ? '#ea580c' : '#16a34a';
            const barColor = avgPercentFalsas >= 35 ? '#dc2626' : avgPercentFalsas >= 25 ? '#ea580c' : '#16a34a';

            return (
              <div key={tipo} className="metric-card" style={{ borderLeft: '4px solid ' + borderColor }}>
                <div className="metric-value" style={{ color: borderColor }}>
                  {tipo}
                </div>
                <div className="metric-label">{tipoData.length} instituições</div>
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">% Falsas médio: </span>
                    <span className="font-medium" style={{ color: borderColor }}>{formatPercent(avgPercentFalsas)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Rácio médio: </span>
                    <span className="font-medium">{avgRacio.toFixed(2)}</span>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(avgPercentFalsas, 100)}%`, backgroundColor: barColor }}
                    ></div>
                  </div>
                </div>
                <div className={`metric-change ${statusClass}`}>
                  {statusText}
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
