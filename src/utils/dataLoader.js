import Papa from 'papaparse';

// Cache para dados carregados
const dataCache = new Map();

// Função genérica para carregar CSV
export const loadCSV = async (filename, options = {}) => {
  const cacheKey = filename;
  
  // Verificar cache primeiro
  if (dataCache.has(cacheKey)) {
    return dataCache.get(cacheKey);
  }

  return new Promise((resolve, reject) => {
    Papa.parse(`/data/${filename}`, {
      download: true,
      header: true,
      delimiter: ';',
      skipEmptyLines: true,
      dynamicTyping: true,
      ...options,
      complete: (results) => {
        if (results.errors.length > 0) {
          console.warn(`Avisos ao carregar ${filename}:`, results.errors);
        }
        dataCache.set(cacheKey, results.data);
        resolve(results.data);
      },
      error: (error) => {
        console.error(`Erro ao carregar ${filename}:`, error);
        reject(error);
      }
    });
  });
};

// Carregar todos os dados necessários
export const loadAllData = async () => {
  try {
    const [
      atendimentos,
      monitorizacao,
      instituicoes,
      regioes,
      indicadores
    ] = await Promise.all([
      loadCSV('fact_atendimentos_urgencia_mensal.csv'),
      loadCSV('fact_monitorizacao_sazonal.csv'),
      loadCSV('dim/dim_instituicao.csv'),
      loadCSV('dim/dim_regiao.csv'),
      loadCSV('dim/dim_indicador.csv')
    ]);

    return {
      atendimentos,
      monitorizacao,
      instituicoes,
      regioes,
      indicadores
    };
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
    throw error;
  }
};

// Limpar cache
export const clearCache = () => {
  dataCache.clear();
};

// Funções de cálculo baseadas nas medidas DAX
export const calculateMetrics = (data) => {
  const { atendimentos, monitorizacao, instituicoes, regioes } = data;
  
  if (!atendimentos || atendimentos.length === 0) {
    return {};
  }

  // Métricas básicas de atendimento
  const totalAtendimentos = atendimentos.reduce((sum, row) => sum + (row.TotalAtendimentos || 0), 0);
  const atendimentosVermelha = atendimentos.reduce((sum, row) => sum + (row.Atendimentos_Vermelha || 0), 0);
  const atendimentosLaranja = atendimentos.reduce((sum, row) => sum + (row.Atendimentos_Laranja || 0), 0);
  const atendimentosAmarela = atendimentos.reduce((sum, row) => sum + (row.Atendimentos_Amarela || 0), 0);
  const atendimentosVerde = atendimentos.reduce((sum, row) => sum + (row.Atendimentos_Verde || 0), 0);
  const atendimentosAzul = atendimentos.reduce((sum, row) => sum + (row.Atendimentos_Azul || 0), 0);
  const atendimentosBranca = atendimentos.reduce((sum, row) => sum + (row.Atendimentos_Branca || 0), 0);

  // Urgências falsas (Verde + Azul + Branca)
  const urgenciasFalsas = atendimentosVerde + atendimentosAzul + atendimentosBranca;
  const percentUrgenciasFalsas = totalAtendimentos > 0 ? (urgenciasFalsas / totalAtendimentos) * 100 : 0;

  // Urgências urgentes (Vermelha + Laranja)
  const urgenciasUrgentes = atendimentosVermelha + atendimentosLaranja;
  const percentUrgenciasUrgentes = totalAtendimentos > 0 ? (urgenciasUrgentes / totalAtendimentos) * 100 : 0;

  // Recursos humanos
  const totalMedicos = atendimentos.reduce((sum, row) => sum + (row.Médicos || 0), 0);
  const totalMedicosInternos = atendimentos.reduce((sum, row) => sum + (row.MedicosInternos || 0), 0);
  const totalEnfermeiros = atendimentos.reduce((sum, row) => sum + (row.Enfermeiros || 0), 0);
  const totalProfissionais = totalMedicos + totalMedicosInternos + totalEnfermeiros;

  // Rácios
  const racioEnfermeiroMedico = totalMedicos > 0 ? totalEnfermeiros / totalMedicos : 0;
  const atendimentosPorMedico = totalMedicos > 0 ? totalAtendimentos / totalMedicos : 0;
  const atendimentosPorEnfermeiro = totalEnfermeiros > 0 ? totalAtendimentos / totalEnfermeiros : 0;
  const atendimentosPorProfissional = totalProfissionais > 0 ? totalAtendimentos / totalProfissionais : 0;

  // Custos estimados (150€ por episódio)
  const custoEstimadoPorEpisodio = 150;
  const despesaTotalEstimada = totalAtendimentos * custoEstimadoPorEpisodio;
  const custoDesperdicadoEstimado = urgenciasFalsas * 120; // Diferença entre urgência (150€) e centro de saúde (30€)

  // Tempo de espera (se houver dados de monitorização)
  let tempoEsperaMedio = 0;
  if (monitorizacao && monitorizacao.length > 0) {
    const tempoEsperaData = monitorizacao.filter(row => row.IndicadorID === 1); // Assumindo que ID 1 é tempo de espera
    if (tempoEsperaData.length > 0) {
      tempoEsperaMedio = tempoEsperaData.reduce((sum, row) => sum + (row.Valor || 0), 0) / tempoEsperaData.length;
    }
  }

  // Score de ineficiência global (0-100)
  const scoreNaoUrgentes = Math.min(percentUrgenciasFalsas / 100 * 50, 50); // Peso 50%
  const scoreTempoEspera = Math.min((tempoEsperaMedio / 120) * 35, 35); // Peso 35%
  const scoreProdutividade = totalMedicos > 0 ? Math.min((1 - Math.min(atendimentosPorMedico / 500, 1)) * 15, 15) : 0; // Peso 15%
  const scoreIneficienciaGlobal = scoreNaoUrgentes + scoreTempoEspera + scoreProdutividade;

  // Classificação
  let classificacaoIneficiencia = '⭐ Excelente';
  if (scoreIneficienciaGlobal >= 65) classificacaoIneficiencia = '⭐ Crítico';
  else if (scoreIneficienciaGlobal >= 50) classificacaoIneficiencia = '⭐⭐ Atenção';
  else if (scoreIneficienciaGlobal >= 35) classificacaoIneficiencia = '⭐⭐⭐ Satisfatório';
  else if (scoreIneficienciaGlobal >= 20) classificacaoIneficiencia = '⭐⭐⭐⭐ Bom';

  // Status
  let statusUrgenciasFalsas = '✅ Eficiente';
  if (percentUrgenciasFalsas >= 35) statusUrgenciasFalsas = '❌ Crítico';
  else if (percentUrgenciasFalsas >= 25) statusUrgenciasFalsas = '⚠️ Atenção';

  let statusRacioEnfMed = '✅ Ideal';
  if (racioEnfermeiroMedico < 1.5) statusRacioEnfMed = '❌ Défice Enfermeiros';
  else if (racioEnfermeiroMedico < 2) statusRacioEnfMed = '⚠️ Abaixo do Ideal';

  let statusTempoEspera = '✅ Dentro da Meta';
  if (tempoEsperaMedio > 90) statusTempoEspera = '❌ Crítico';
  else if (tempoEsperaMedio > 60) statusTempoEspera = '⚠️ Ligeiramente Acima';

  return {
    // Totais
    totalAtendimentos,
    atendimentosVermelha,
    atendimentosLaranja,
    atendimentosAmarela,
    atendimentosVerde,
    atendimentosAzul,
    atendimentosBranca,
    
    // Urgências falsas
    urgenciasFalsas,
    urgenciasUrgentes,
    percentUrgenciasFalsas,
    percentUrgenciasUrgentes,
    statusUrgenciasFalsas,
    
    // Recursos humanos
    totalMedicos,
    totalMedicosInternos,
    totalEnfermeiros,
    totalProfissionais,
    racioEnfermeiroMedico,
    atendimentosPorMedico,
    atendimentosPorEnfermeiro,
    atendimentosPorProfissional,
    statusRacioEnfMed,
    
    // Custos
    custoEstimadoPorEpisodio,
    despesaTotalEstimada,
    custoDesperdicadoEstimado,
    
    // Tempo de espera
    tempoEsperaMedio,
    statusTempoEspera,
    
    // Score global
    scoreIneficienciaGlobal,
    classificacaoIneficiencia,
    
    // Dados adicionais para análises
    instituicoes: instituicoes || [],
    regioes: regioes || [],
    dadosBrutos: atendimentos
  };
};

// Função para filtrar dados por período
export const filterByPeriod = (data, startDate, endDate) => {
  if (!data || !data.length) return [];
  
  return data.filter(row => {
    const period = row.Período;
    if (!period) return false;
    
    // Converter período "YYYY-MM" para data
    const [year, month] = period.split('-').map(Number);
    const rowDate = new Date(year, month - 1);
    
    return rowDate >= startDate && rowDate <= endDate;
  });
};

// Função para filtrar dados de monitorização por período (assumindo campo Data)
export const filterMonitorizacaoByPeriod = (data, startDate, endDate) => {
  if (!data || !data.length) return [];
  
  return data.filter(row => {
    // Tentar diferentes formatos de data
    let rowDate;
    
    if (row.Data) {
      // Se tiver campo Data direto
      rowDate = new Date(row.Data);
    } else if (row.Período) {
      // Se tiver período no formato YYYY-MM-DD
      const [year, month, day] = row.Período.split('-').map(Number);
      rowDate = new Date(year, month - 1, day || 1);
    } else {
      // Se não conseguir identificar, inclui no filtro
      return true;
    }
    
    return rowDate >= startDate && rowDate <= endDate;
  });
};

// Função para filtrar por instituição
export const filterByInstitution = (data, instituicaoId) => {
  if (!data || !data.length || !instituicaoId) return data;
  
  return data.filter(row => row.InstituicaoID === instituicaoId);
};

// Função para filtrar por região
export const filterByRegion = (data, regiaoId) => {
  if (!data || !data.length || !regiaoId) return data;
  
  return data.filter(row => row.RegiaoID === regiaoId);
};

// Função para agrupar dados por período
export const groupByPeriod = (data) => {
  if (!data || !data.length) return [];
  
  const grouped = {};
  
  data.forEach(row => {
    const period = row.Período;
    if (!grouped[period]) {
      grouped[period] = {
        period,
        totalAtendimentos: 0,
        urgenciasFalsas: 0,
        medicos: 0,
        enfermeiros: 0,
        count: 0
      };
    }
    
    grouped[period].totalAtendimentos += row.TotalAtendimentos || 0;
    grouped[period].urgenciasFalsas += (row.Atendimentos_Verde || 0) + (row.Atendimentos_Azul || 0) + (row.Atendimentos_Branca || 0);
    grouped[period].medicos += row.Médicos || 0;
    grouped[period].enfermeiros += row.Enfermeiros || 0;
    grouped[period].count++;
  });
  
  return Object.values(grouped).sort((a, b) => a.period.localeCompare(b.period));
};

// Função para calcular rankings
export const calculateRankings = (data) => {
  if (!data || !data.instituicoes || !data.atendimentos) return {};
  
  const instituicoes = data.instituicoes;
  const atendimentos = data.atendimentos;
  
  // Agrupar atendimentos por instituição
  const instituicoesData = {};
  
  instituicoes.forEach(inst => {
    instituicoesData[inst.InstituicaoID] = {
      ...inst,
      totalAtendimentos: 0,
      urgenciasFalsas: 0,
      medicos: 0,
      enfermeiros: 0
    };
  });
  
  atendimentos.forEach(row => {
    const instId = row.InstituicaoID;
    if (instituicoesData[instId]) {
      instituicoesData[instId].totalAtendimentos += row.TotalAtendimentos || 0;
      instituicoesData[instId].urgenciasFalsas += (row.Atendimentos_Verde || 0) + (row.Atendimentos_Azul || 0) + (row.Atendimentos_Branca || 0);
      instituicoesData[instId].medicos += row.Médicos || 0;
      instituicoesData[instId].enfermeiros += row.Enfermeiros || 0;
    }
  });
  
  // Calcular métricas por instituição
  const rankings = Object.values(instituicoesData).map(inst => {
    const percentUrgenciasFalsas = inst.totalAtendimentos > 0 ? (inst.urgenciasFalsas / inst.totalAtendimentos) * 100 : 0;
    const racioEnfermeiroMedico = inst.medicos > 0 ? inst.enfermeiros / inst.medicos : 0;
    const atendimentosPorMedico = inst.medicos > 0 ? inst.totalAtendimentos / inst.medicos : 0;
    
    return {
      ...inst,
      percentUrgenciasFalsas,
      racioEnfermeiroMedico,
      atendimentosPorMedico
    };
  });
  
  // Ordenar por diferentes critérios
  const rankingUrgenciasFalsas = [...rankings].sort((a, b) => b.percentUrgenciasFalsas - a.percentUrgenciasFalsas);
  const rankingProdutividade = [...rankings].filter(r => r.atendimentosPorMedico > 0).sort((a, b) => b.atendimentosPorMedico - a.atendimentosPorMedico);
  const rankingRacio = [...rankings].filter(r => r.racioEnfermeiroMedico > 0).sort((a, b) => a.racioEnfermeiroMedico - b.racioEnfermeiroMedico);
  
  return {
    rankingUrgenciasFalsas,
    rankingProdutividade,
    rankingRacio,
    topUrgenciasFalsas: rankingUrgenciasFalsas.slice(0, 10),
    topProdutividade: rankingProdutividade.slice(0, 10),
    bottomRacio: rankingRacio.slice(0, 10)
  };
};
