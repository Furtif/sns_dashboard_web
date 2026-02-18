import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { formatNumber, formatCurrency, formatDecimal } from '../utils/formatters';

const DashboardRH = ({ data }) => {
  const [institutionRH, setInstitutionRH] = useState([]);
  const [timeSeriesRH, setTimeSeriesRH] = useState([]);
  const [productivityData, setProductivityData] = useState([]);
  const [regionRH, setRegionRH] = useState([]);

  useEffect(() => {
    if (data && data.dadosBrutos && data.instituicoes) {
      // Preparar dados RH por instituição
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
            medicos: 0,
            medicosInternos: 0,
            enfermeiros: 0,
            mesesComDados: 0
          };
        }

        const hasRHData = (row.Médicos || 0) > 0 || (row.Enfermeiros || 0) > 0;
        if (hasRHData) {
          institutions[instId].totalAtendimentos += row.TotalAtendimentos || 0;
          institutions[instId].medicos += row.Médicos || 0;
          institutions[instId].medicosInternos += row.MedicosInternos || 0;
          institutions[instId].enfermeiros += row.Enfermeiros || 0;
          institutions[instId].mesesComDados++;
        }
      });

      const instArray = Object.values(institutions)
        .filter(inst => inst.mesesComDados > 0)
        .map(inst => {
          const totalMedicos = inst.medicos + inst.medicosInternos;
          const totalProfissionais = totalMedicos + inst.enfermeiros;
          
          return {
            ...inst,
            totalMedicos,
            totalProfissionais,
            racioEnfermeiroMedico: totalMedicos > 0 ? inst.enfermeiros / totalMedicos : 0,
            atendimentosPorMedico: totalMedicos > 0 ? inst.totalAtendimentos / totalMedicos : 0,
            atendimentosPorEnfermeiro: inst.enfermeiros > 0 ? inst.totalAtendimentos / inst.enfermeiros : 0,
            atendimentosPorProfissional: totalProfissionais > 0 ? inst.totalAtendimentos / totalProfissionais : 0,
            medicosPorMes: inst.medicos / inst.mesesComDados,
            enfermeirosPorMes: inst.enfermeiros / inst.mesesComDados,
            coberturaDados: (inst.mesesComDados / data.dadosBrutos.filter(r => r.InstituicaoID === inst.instituicaoId).length) * 100
          };
        })
        .sort((a, b) => b.totalAtendimentos - a.totalAtendimentos);

      setInstitutionRH(instArray);

      // Preparar série temporal RH
      const monthlyRH = data.dadosBrutos
        .filter(row => (row.Médicos || 0) > 0 || (row.Enfermeiros || 0) > 0)
        .reduce((acc, row) => {
          const existing = acc.find(item => item.period === row.Período);
          if (existing) {
            existing.totalAtendimentos += row.TotalAtendimentos || 0;
            existing.medicos += row.Médicos || 0;
            existing.medicosInternos += row.MedicosInternos || 0;
            existing.enfermeiros += row.Enfermeiros || 0;
            existing.institutions++;
          } else {
            acc.push({
              period: row.Período,
              totalAtendimentos: row.TotalAtendimentos || 0,
              medicos: row.Médicos || 0,
              medicosInternos: row.MedicosInternos || 0,
              enfermeiros: row.Enfermeiros || 0,
              institutions: 1
            });
          }
          return acc;
        }, [])
        .map(item => {
          const totalMedicos = item.medicos + item.medicosInternos;
          const totalProfissionais = totalMedicos + item.enfermeiros;
          
          return {
            ...item,
            totalMedicos,
            totalProfissionais,
            racioEnfermeiroMedico: totalMedicos > 0 ? item.enfermeiros / totalMedicos : 0,
            atendimentosPorMedico: totalMedicos > 0 ? item.totalAtendimentos / totalMedicos : 0,
            atendimentosPorEnfermeiro: item.enfermeiros > 0 ? item.totalAtendimentos / item.enfermeiros : 0
          };
        })
        .sort((a, b) => a.period.localeCompare(b.period))
        .slice(-24); // Últimos 24 meses

      setTimeSeriesRH(monthlyRH);

      // Análise de produtividade
      const productivity = instArray
        .filter(inst => inst.atendimentosPorMedico > 0)
        .map(inst => ({
          instituicaoNome: inst.instituicaoNome,
          tipo: inst.tipo,
          atendimentosPorMedico: inst.atendimentosPorMedico,
          racioEnfermeiroMedico: inst.racioEnfermeiroMedico,
          totalAtendimentos: inst.totalAtendimentos,
          totalMedicos: inst.totalMedicos,
          enfermeiros: inst.enfermeiros
        }))
        .sort((a, b) => b.atendimentosPorMedico - a.atendimentosPorMedico)
        .slice(0, 20);

      setProductivityData(productivity);

      // Dados por região
      const regions = {};
      data.regioes?.forEach(regiao => {
        regions[regiao.RegiaoID] = {
          regiaoId: regiao.RegiaoID,
          regiaoNome: regiao.RegiaoNome,
          totalAtendimentos: 0,
          medicos: 0,
          medicosInternos: 0,
          enfermeiros: 0,
          instituicoes: 0
        };
      });

      instArray.forEach(inst => {
        if (regions[inst.regiaoId]) {
          regions[inst.regiaoId].totalAtendimentos += inst.totalAtendimentos;
          regions[inst.regiaoId].medicos += inst.medicos;
          regions[inst.regiaoId].medicosInternos += inst.medicosInternos;
          regions[inst.regiaoId].enfermeiros += inst.enfermeiros;
          regions[inst.regiaoId].instituicoes++;
        }
      });

      const regionArray = Object.values(regions)
        .filter(region => region.instituicoes > 0)
        .map(region => {
          const totalMedicos = region.medicos + region.medicosInternos;
          const totalProfissionais = totalMedicos + region.enfermeiros;
          
          return {
            ...region,
            totalMedicos,
            totalProfissionais,
            racioEnfermeiroMedico: totalMedicos > 0 ? region.enfermeiros / totalMedicos : 0,
            atendimentosPorMedico: totalMedicos > 0 ? region.totalAtendimentos / totalMedicos : 0,
            atendimentosPorEnfermeiro: region.enfermeiros > 0 ? region.totalAtendimentos / region.enfermeiros : 0
          };
        });

      setRegionRH(regionArray);
    }
  }, [data]);


  const getRacioColor = (racio) => {
    if (racio < 1.5) return '#dc2626';
    if (racio < 2) return '#ea580c';
    return '#16a34a';
  };

  const getProductivityColor = (productivity) => {
    const avg = productivityData.reduce((sum, p) => sum + p.atendimentosPorMedico, 0) / productivityData.length;
    if (productivity < avg * 0.8) return '#dc2626';
    if (productivity < avg) return '#ea580c';
    return '#16a34a';
  };

  if (!data || !data.totalAtendimentos || data.totalAtendimentos === 0) {
    return (
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">👥 Dashboard Recursos Humanos</h3>
        </div>
        <div className="text-center py-8">
          <div className="text-gray-500 text-lg mb-2">👥</div>
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

  const totalMedicosNacional = institutionRH.reduce((sum, inst) => sum + inst.totalMedicos, 0);
  const totalEnfermeirosNacional = institutionRH.reduce((sum, inst) => sum + inst.enfermeiros, 0);
  const totalProfissionaisNacional = totalMedicosNacional + totalEnfermeirosNacional;
  const racioNacional = totalMedicosNacional > 0 ? totalEnfermeirosNacional / totalMedicosNacional : 0;
  const avgProductivity = productivityData.length > 0 ? 
    productivityData.reduce((sum, p) => sum + p.atendimentosPorMedico, 0) / productivityData.length : 0;

  return (
    <div className="fade-in">
      {/* KPIs RH */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="metric-card">
          <div className="metric-value" style={{ color: '#1e40af' }}>
            {formatNumber(totalProfissionaisNacional)}
          </div>
          <div className="metric-label">Total Profissionais</div>
          <div className="metric-change neutral">
            {formatNumber(totalMedicosNacional)} médicos + {formatNumber(totalEnfermeirosNacional)} enfermeiros
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-value" style={{ color: getRacioColor(racioNacional) }}>
            {formatDecimal(racioNacional)}
          </div>
          <div className="metric-label">Rácio Nacional Enf./Méd.</div>
          <div className="metric-change neutral">
            Meta OMS: 2.0
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-value" style={{ color: '#059669' }}>
            {formatNumber(Math.round(avgProductivity))}
          </div>
          <div className="metric-label">Produtividade Média</div>
          <div className="metric-change neutral">
            Atendimentos por médico
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-value" style={{ color: '#7c3aed' }}>
            {institutionRH.length}
          </div>
          <div className="metric-label">Instituições com Dados RH</div>
          <div className="metric-change neutral">
            {((institutionRH.length / data.instituicoes?.length) * 100).toFixed(1)}% cobertura
          </div>
        </div>
      </div>

      {/* Gráficos RH */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Evolução Temporal RH */}
        <div className="chart-container">
          <h3 className="chart-title">Evolução de Recursos Humanos (24 meses)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeSeriesRH}>
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
                  name.includes('racio') ? formatDecimal(value) : formatNumber(value), 
                  name === 'medicos' ? 'Médicos' :
                  name === 'enfermeiros' ? 'Enfermeiros' :
                  name === 'racioEnfermeiroMedico' ? 'Rácio Enf./Méd.' :
                  name === 'atendimentosPorMedico' ? 'Atend./Médico' : name
                ]}
                labelFormatter={(label) => `Período: ${label}`}
              />
              <Legend />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="medicos" 
                stroke="#2563eb" 
                strokeWidth={2}
                name="Médicos"
              />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="enfermeiros" 
                stroke="#059669" 
                strokeWidth={2}
                name="Enfermeiros"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="racioEnfermeiroMedico" 
                stroke="#dc2626" 
                strokeWidth={2}
                name="Rácio Enf./Méd."
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Produtividade vs Rácio */}
        <div className="chart-container">
          <h3 className="chart-title">Análise de Produtividade vs Rácio Enf./Méd.</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart data={productivityData.slice(0, 50)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="racioEnfermeiroMedico" 
                name="Rácio Enf./Méd."
                tick={{ fontSize: 12 }}
                domain={[0, 'dataMax']}
              />
              <YAxis 
                dataKey="atendimentosPorMedico" 
                name="Atendimentos por Médico"
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
                        <p className="text-sm">Tipo: {data.tipo}</p>
                        <p className="text-sm">Rácio: {formatDecimal(data.racioEnfermeiroMedico)}</p>
                        <p className="text-sm">Produtividade: {formatNumber(data.atendimentosPorMedico)}</p>
                        <p className="text-sm">Total: {formatNumber(data.totalAtendimentos)}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter 
                dataKey="atendimentosPorMedico" 
                fill="#1e40af"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Análise por Região */}
      <div className="card mb-6">
        <div className="card-header">
          <h3 className="card-title">Análise de Recursos Humanos por Região</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {regionRH.map((region) => (
            <div key={region.regiaoId} className="metric-card">
              <div className="metric-value" style={{ color: '#1e40af' }}>
                {region.regiaoNome}
              </div>
              <div className="metric-label">{region.instituicoes} instituições</div>
              <div className="mt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Profissionais: </span>
                  <span className="font-medium">{formatNumber(region.totalProfissionais)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Rácio Enf./Méd.: </span>
                  <span 
                    className="font-medium"
                    style={{ color: getRacioColor(region.racioEnfermeiroMedico) }}
                  >
                    {formatDecimal(region.racioEnfermeiroMedico)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Atend./Médico: </span>
                  <span className="font-medium">{formatNumber(region.atendimentosPorMedico)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rankings de Produtividade */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Top Produtividade */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Top 10 - Maior Produtividade (Atend./Médico)</h3>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Instituição</th>
                  <th className="text-right">Tipo</th>
                  <th className="text-right">Atend./Médico</th>
                  <th className="text-right">Rácio</th>
                </tr>
              </thead>
              <tbody>
                {productivityData.slice(0, 10).map((inst, index) => (
                  <tr key={inst.instituicaoNome}>
                    <td className="font-medium">
                      <div className="flex items-center gap-2">
                        <div>
                          <div>{inst.instituicaoNome}</div>
                          <div className="text-xs text-gray-500 mobile-only">
                            {inst.tipo} Rácio: {formatDecimal(inst.racioEnfermeiroMedico)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="text-right">{inst.tipo}</td>
                    <td className="text-right font-medium">
                      <span 
                        className="px-2 py-1 rounded text-xs font-medium"
                        style={{ 
                          backgroundColor: getProductivityColor(inst.atendimentosPorMedico) + '20',
                          color: getProductivityColor(inst.atendimentosPorMedico)
                        }}
                      >
                        {formatNumber(inst.atendimentosPorMedico)}
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
                        {formatDecimal(inst.racioEnfermeiroMedico)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Instituições com Défice de Enfermeiros */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Défice Crítico de Enfermeiros (Rácio &lt; 1.5)</h3>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Instituição</th>
                  <th className="text-right">Tipo</th>
                  <th className="text-right">Rácio</th>
                  <th className="text-right">Défice</th>
                </tr>
              </thead>
              <tbody>
                {institutionRH
                  .filter(inst => inst.racioEnfermeiroMedico < 1.5)
                  .sort((a, b) => a.racioEnfermeiroMedico - b.racioEnfermeiroMedico)
                  .slice(0, 10)
                  .map((inst) => {
                    const deficitEnfermeiros = Math.max(0, inst.totalMedicos * 2 - inst.enfermeiros);
                    return (
                      <tr key={inst.instituicaoId}>
                        <td className="font-medium">
                          <div className="flex items-center gap-2">
                            <div>
                              <div>{inst.instituicaoNome}</div>
                              <div className="text-xs text-gray-500 mobile-only">
                                {inst.tipo} Défice: {formatNumber(deficitEnfermeiros)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="text-right">{inst.tipo}</td>
                        <td className="text-right">
                          <span 
                            className="px-2 py-1 rounded text-xs font-medium text-white"
                            style={{ backgroundColor: '#dc2626' }}
                          >
                            {formatDecimal(inst.racioEnfermeiroMedico)}
                          </span>
                        </td>
                        <td className="text-right font-medium text-red-600">
                          {formatNumber(deficitEnfermeiros)}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recomendações RH */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Recomendações de Recursos Humanos</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="font-semibold text-red-800 mb-2">🚨 Alertas Críticos</h4>
            <ul className="text-sm text-red-700 space-y-1">
              <li> {institutionRH.filter(inst => inst.racioEnfermeiroMedico < 1.5).length} instituições com défice crítico de enfermeiros</li>
              <li> Rácio nacional ({formatDecimal(racioNacional)}) abaixo da meta OMS (2.0)</li>
              <li> Necessidade de {formatNumber(Math.max(0, totalMedicosNacional * 2 - totalEnfermeirosNacional))} enfermeiros adicionais</li>
            </ul>
          </div>

          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">✅ Oportunidades de Melhoria</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li> Implementar programa de contratação de enfermeiros</li>
              <li> Otimizar escalas e distribuição de profissionais</li>
              <li> Investir em formação e especialização</li>
              <li> Revisar modelos de alocação por região</li>
            </ul>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="font-semibold mb-3">Projeção de Impacto - Meta OMS</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="metric-card border-blue-200 bg-blue-50">
              <div className="metric-value" style={{ color: '#1e40af' }}>
                {formatNumber(Math.max(0, totalMedicosNacional * 2 - totalEnfermeirosNacional))}
              </div>
              <div className="metric-label">Enfermeiros Necessários</div>
              <div className="text-sm text-blue-700 mt-2">
                Para atingir rácio 2:1
              </div>
            </div>

            <div className="metric-card border-green-200 bg-green-50">
              <div className="metric-value" style={{ color: '#059669' }}>
                {formatNumber(Math.round(avgProductivity * 1.2))}
              </div>
              <div className="metric-label">Produtividade Alvo</div>
              <div className="text-sm text-green-700 mt-2">
                +20% com otimização
              </div>
            </div>

            <div className="metric-card border-purple-200 bg-purple-50">
              <div className="metric-value" style={{ color: '#7c3aed' }}>
                {formatCurrency((totalMedicosNacional * 2 - totalEnfermeirosNacional) * 50000)}
              </div>
              <div className="metric-label">Investimento Estimado</div>
              <div className="text-sm text-purple-700 mt-2">
                Custo anual adicional
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardRH;
