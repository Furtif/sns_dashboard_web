import Papa from 'papaparse';

// Cache para dados carregados
const dataCache = new Map();
const updateHistory = [];

// Dados mock para simulação (em produção, viria de API real)
const mockUpdateResults = {
  'update_atendimentos': {
    success: true,
    message: 'Dados de atendimentos atualizados com sucesso (2,451 registros)',
    recordsUpdated: 2451,
    executionTime: '12.3s',
    dataGenerated: generateMockAtendimentos()
  },
  'update_monitorizacao': {
    success: true,
    message: 'Dados de monitorização atualizados com sucesso (8,934 registros)',
    recordsUpdated: 8934,
    executionTime: '8.7s',
    dataGenerated: generateMockMonitorizacao()
  },
  'update_instituicoes': {
    success: true,
    message: 'Cadastro de instituições atualizado (75 instituições)',
    recordsUpdated: 75,
    executionTime: '2.1s',
    dataGenerated: generateMockInstituicoes()
  },
  'update_all': {
    success: true,
    message: 'Todos os dados atualizados com sucesso (11,460 registros totais)',
    recordsUpdated: 11460,
    executionTime: '23.4s',
    dataGenerated: {
      atendimentos: generateMockAtendimentos(),
      monitorizacao: generateMockMonitorizacao(),
      instituicoes: generateMockInstituicoes(),
      regioes: generateMockRegioes(),
      indicadores: generateMockIndicadores()
    }
  }
};

// Função para gerar dados mock de atendimentos
function generateMockAtendimentos() {
  const data = [];
  const now = new Date();
  const currentYear = now.getFullYear();
  
  // Gerar dados para os últimos 24 meses
  for (let i = 0; i < 24; i++) {
    const date = new Date(currentYear, now.getMonth() - i, 1);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const period = `${year}-${month}`;
    
    // Gerar dados para diferentes instituições
    for (let instId = 1; instId <= 10; instId++) {
      const baseAtendimentos = Math.floor(Math.random() * 5000) + 1000;
      const seasonalFactor = 1 + (Math.sin(i / 12 * Math.PI) * 0.2); // Sazonalidade
      
      data.push({
        Período: period,
        TimeKey: parseInt(year + month + '01'),
        RegiaoID: Math.floor(Math.random() * 5) + 1,
        InstituicaoID: instId,
        Atendimentos_Vermelha: Math.floor(baseAtendimentos * 0.02 * seasonalFactor),
        Atendimentos_Laranja: Math.floor(baseAtendimentos * 0.15 * seasonalFactor),
        Atendimentos_Amarela: Math.floor(baseAtendimentos * 0.40 * seasonalFactor),
        Atendimentos_Verde: Math.floor(baseAtendimentos * 0.25 * seasonalFactor),
        Atendimentos_Azul: Math.floor(baseAtendimentos * 0.10 * seasonalFactor),
        Atendimentos_Branca: Math.floor(baseAtendimentos * 0.05 * seasonalFactor),
        Atendimentos_SemTriagem: Math.floor(baseAtendimentos * 0.03 * seasonalFactor),
        TotalAtendimentos: baseAtendimentos,
        Médicos: Math.floor(Math.random() * 50) + 10,
        MedicosInternos: Math.floor(Math.random() * 20) + 5,
        Enfermeiros: Math.floor(Math.random() * 100) + 20,
        Despesa: 0,
        NumDoentes: baseAtendimentos,
        CustoMedio: 0
      });
    }
  }
  
  return data;
}

// Função para gerar dados mock de monitorização
function generateMockMonitorizacao() {
  const data = [];
  const now = new Date();
  const currentYear = now.getFullYear();
  
  // Gerar dados para os últimos 30 dias
  for (let i = 0; i < 30; i++) {
    const date = new Date(currentYear, now.getMonth(), now.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    // Dados de monitorização diária
    data.push({
      Período: dateStr,
      TimeKey: parseInt(dateStr.replace(/-/g, '')),
      RegiaoID: Math.floor(Math.random() * 5) + 1,
      IndicadorID: 1,
      Valor: 45 + Math.random() * 30, // Tempo médio de espera
      Data: dateStr
    });
    
    data.push({
      Período: dateStr,
      TimeKey: parseInt(dateStr.replace(/-/g, '')),
      RegiaoID: Math.floor(Math.random() * 5) + 1,
      IndicadorID: 2,
      Valor: 25 + Math.random() * 15, // Taxa verde/azul
      Data: dateStr
    });
    
    data.push({
      Período: dateStr,
      TimeKey: parseInt(dateStr.replace(/-/g, '')),
      RegiaoID: Math.floor(Math.random() * 5) + 1,
      IndicadorID: 3,
      Valor: 15 + Math.random() * 10, // Taxa internamento
      Data: dateStr
    });
    
    data.push({
      Período: dateStr,
      TimeKey: parseInt(dateStr.replace(/-/g, '')),
      RegiaoID: Math.floor(Math.random() * 5) + 1,
      IndicadorID: 4,
      Valor: 1000 + Math.random() * 500, // Nº episódios
      Data: dateStr
    });
  }
  
  return data;
}

// Função para gerar dados mock de instituições
function generateMockInstituicoes() {
  const instituicoes = [
    { InstituicaoID: 1, InstituicaoNome: 'Centro Hospitalar Barreiro/Montijo EPE', Tipo: 'CH', RegiaoID: 3 },
    { InstituicaoID: 2, InstituicaoNome: 'Centro Hospitalar Entre Douro e Vouga EPE', Tipo: 'CH', RegiaoID: 1 },
    { InstituicaoID: 3, InstituicaoNome: 'Centro Hospitalar Médio Tejo EPE', Tipo: 'CH', RegiaoID: 3 },
    { InstituicaoID: 4, InstituicaoNome: 'Centro Hospitalar Póvoa de Varzim/Vila do Conde EPE', Tipo: 'CH', RegiaoID: 1 },
    { InstituicaoID: 5, InstituicaoNome: 'Centro Hospitalar Tondela-Viseu EPE', Tipo: 'CH', RegiaoID: 2 },
    { InstituicaoID: 6, InstituicaoNome: 'Centro Hospitalar Trás-os-Montes e Alto Douro EPE', Tipo: 'CH', RegiaoID: 1 },
    { InstituicaoID: 7, InstituicaoNome: 'Centro Hospitalar Tâmega e Sousa EPE', Tipo: 'CH', RegiaoID: 1 },
    { InstituicaoID: 8, InstituicaoNome: 'Centro Hospitalar Universitário Cova da Beira EPE', Tipo: 'CHU', RegiaoID: 2 },
    { InstituicaoID: 9, InstituicaoNome: 'Centro Hospitalar Universitário de Lisboa Central EPE', Tipo: 'CHU', RegiaoID: 3 },
    { InstituicaoID: 10, InstituicaoNome: 'Hospital de Santa Maria Maior', Tipo: 'Hospital', RegiaoID: 1 }
  ];
  
  return instituicoes;
}

// Função para gerar dados mock de regiões
function generateMockRegioes() {
  return [
    { RegiaoID: 1, RegiaoNome: 'Região de Saúde Norte' },
    { RegiaoID: 2, RegiaoNome: 'Região de Saúde Centro' },
    { RegiaoID: 3, RegiaoNome: 'Região de Saúde Lisboa e Vale do Tejo' },
    { RegiaoID: 4, RegiaoNome: 'Região de Saúde do Alentejo' },
    { RegiaoID: 5, RegiaoNome: 'Região de Saúde do Algarve' }
  ];
}

// Função para gerar dados mock de indicadores
function generateMockIndicadores() {
  return [
    { IndicadorID: 1, IndicadorNome: 'Tempo Médio Espera Triagem-Observação' },
    { IndicadorID: 2, IndicadorNome: 'Taxa Atendimentos Verde/Azul' },
    { IndicadorID: 3, IndicadorNome: 'Taxa Atendimentos c/ Internamento' },
    { IndicadorID: 4, IndicadorNome: 'Nº Episódios Urgência' }
  ];
}

// Função para carregar CSV (mantida para compatibilidade)
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
    console.log('📥 Iniciando carregamento de todos os dados...');
    
    const [
      atendimentos,
      monitorizacao,
      instituicoes,
      regioes,
      indicadores
    ] = await Promise.all([
      loadCSV('fact_atendimentos_urgencia_mensal.csv'),
      loadCSV('fact_monitorizacao_sazonal.csv'),
      loadCSV('dim_instituicao.csv'),
      loadCSV('dim_regiao.csv'),
      loadCSV('dim_indicador.csv')
    ]);

    console.log('✅ Dados carregados:', {
      atendimentos: atendimentos?.length || 0,
      monitorizacao: monitorizacao?.length || 0,
      instituicoes: instituicoes?.length || 0,
      regioes: regioes?.length || 0,
      indicadores: indicadores?.length || 0
    });

    const result = {
      atendimentos,
      monitorizacao,
      instituicoes,
      regioes,
      indicadores
    };

    console.log('📊 Retornando dados carregados');
    return result;
  } catch (error) {
    console.error('❌ Erro detalhado ao carregar dados:', {
      message: error.message,
      stack: error.stack,
      error: error
    });
    throw error;
  }
};

// Simular atualização de dados
export const simulateDataUpdate = async (scriptId) => {
  return new Promise((resolve) => {
    // Simular tempo de processamento
    const processingTime = 2000 + Math.random() * 3000; // 2-5 segundos
    
    setTimeout(() => {
      const result = mockUpdateResults[scriptId] || {
        success: false,
        error: 'Script não encontrado'
      };
      
      // Adicionar ao histórico
      updateHistory.unshift({
        timestamp: new Date(),
        scriptId,
        result,
        scriptName: mockUpdateResults[scriptId]?.message || 'Erro desconhecido'
      });
      
      // Manter apenas as últimas 10 atualizações
      if (updateHistory.length > 10) {
        updateHistory.pop();
      }
      
      // Se sucesso, atualizar cache com novos dados
      if (result.success && result.dataGenerated) {
        console.log('🔄 Atualizando cache com novos dados gerados...');
        
        if (result.dataGenerated.atendimentos) {
          dataCache.set('fact_atendimentos_urgencia_mensal.csv', result.dataGenerated.atendimentos);
          console.log('✅ Cache atualizado: atendimentos', result.dataGenerated.atendimentos.length, 'registros');
        }
        
        if (result.dataGenerated.monitorizacao) {
          dataCache.set('fact_monitorizacao_sazonal.csv', result.dataGenerated.monitorizacao);
          console.log('✅ Cache atualizado: monitorização', result.dataGenerated.monitorizacao.length, 'registros');
        }
        
        if (result.dataGenerated.instituicoes) {
          dataCache.set('dim_instituicao.csv', result.dataGenerated.instituicoes);
          console.log('✅ Cache atualizado: instituições', result.dataGenerated.instituicoes.length, 'registros');
        }
        
        if (result.dataGenerated.regioes) {
          dataCache.set('dim_regiao.csv', result.dataGenerated.regioes);
          console.log('✅ Cache atualizado: regiões', result.dataGenerated.regioes.length, 'registros');
        }
        
        if (result.dataGenerated.indicadores) {
          dataCache.set('dim_indicador.csv', result.dataGenerated.indicadores);
          console.log('✅ Cache atualizado: indicadores', result.dataGenerated.indicadores.length, 'registros');
        }
      }
      
      resolve(result);
    }, processingTime);
  });
};

// Obter histórico de atualizações
export const getUpdateHistory = () => {
  return updateHistory;
};

// Limpar cache
export const clearCache = () => {
  dataCache.clear();
};

// Função para criar backup dos dados atuais
export const createBackup = async () => {
  const backup = {
    timestamp: new Date(),
    data: {}
  };
  
  try {
    console.log('🔄 Iniciando criação de backup...');
    
    // Garantir que os dados estejam carregados no cache
    console.log('📥 Carregando dados dos CSVs...');
    await loadAllData();
    console.log('✅ Dados carregados com sucesso');
    
    // Verificar estado do cache
    console.log('📊 Verificando cache:', {
      atendimentos: dataCache.has('fact_atendimentos_urgencia_mensal.csv'),
      monitorizacao: dataCache.has('fact_monitorizacao_sazonal.csv'),
      instituicoes: dataCache.has('dim_instituicao.csv'),
      regioes: dataCache.has('dim_regiao.csv'),
      indicadores: dataCache.has('dim_indicador.csv')
    });
    
    // Obter dados do cache (dados reais carregados dos CSVs)
    const atendimentos = dataCache.get('fact_atendimentos_urgencia_mensal.csv');
    const monitorizacao = dataCache.get('fact_monitorizacao_sazonal.csv');
    const instituicoes = dataCache.get('dim_instituicao.csv');
    const regioes = dataCache.get('dim_regiao.csv');
    const indicadores = dataCache.get('dim_indicador.csv');
    
    console.log('📈 Dados encontrados:', {
      atendimentos: atendimentos?.length || 0,
      monitorizacao: monitorizacao?.length || 0,
      instituicoes: instituicoes?.length || 0,
      regioes: regioes?.length || 0,
      indicadores: indicadores?.length || 0
    });
    
    if (atendimentos && atendimentos.length > 0) {
      backup.data.atendimentos = atendimentos;
      localStorage.setItem('sns_atendimentos_backup', JSON.stringify(atendimentos));
      console.log('✅ Backup atendimentos criado:', atendimentos.length, 'registros');
    }
    
    if (monitorizacao && monitorizacao.length > 0) {
      backup.data.monitorizacao = monitorizacao;
      localStorage.setItem('sns_monitorizacao_backup', JSON.stringify(monitorizacao));
      console.log('✅ Backup monitorização criado:', monitorizacao.length, 'registros');
    }
    
    if (instituicoes && instituicoes.length > 0) {
      backup.data.instituicoes = instituicoes;
      localStorage.setItem('sns_instituicoes_backup', JSON.stringify(instituicoes));
      console.log('✅ Backup instituições criado:', instituicoes.length, 'registros');
    }
    
    if (regioes && regioes.length > 0) {
      backup.data.regioes = regioes;
      localStorage.setItem('sns_regioes_backup', JSON.stringify(regioes));
      console.log('✅ Backup regiões criado:', regioes.length, 'registros');
    }
    
    if (indicadores && indicadores.length > 0) {
      backup.data.indicadores = indicadores;
      localStorage.setItem('sns_indicadores_backup', JSON.stringify(indicadores));
      console.log('✅ Backup indicadores criado:', indicadores.length, 'registros');
    }
    
    // Criar backup no localStorage com timestamp único
    const backupKey = 'sns_backup_' + Date.now();
    localStorage.setItem(backupKey, JSON.stringify(backup));
    
    const backupSize = JSON.stringify(backup.data).length;
    console.log('✅ Backup criado com sucesso:', {
      key: backupKey,
      dataSize: backupSize,
      sizeKB: (backupSize / 1024).toFixed(1) + ' KB',
      records: {
        atendimentos: backup.data.atendimentos?.length || 0,
        monitorizacao: backup.data.monitorizacao?.length || 0,
        instituicoes: backup.data.instituicoes?.length || 0,
        regioes: backup.data.regioes?.length || 0,
        indicadores: backup.data.indicadores?.length || 0
      }
    });
    
    return backup;
  } catch (error) {
    console.error('❌ Erro detalhado ao criar backup:', {
      message: error.message,
      stack: error.stack,
      error: error
    });
    return backup;
  }
};

// Restaurar backup
export const restoreBackup = (backupId) => {
  try {
    const backup = localStorage.getItem(backupId);
    if (backup) {
      const data = JSON.parse(backup);
      
      // Restaurar dados no cache
      if (data.data.atendimentos) {
        dataCache.set('fact_atendimentos_urgencia_mensal.csv', data.data.atendimentos);
        localStorage.setItem('sns_atendimentos_backup', JSON.stringify(data.data.atendimentos));
      }
      
      if (data.data.monitorizacao) {
        dataCache.set('fact_monitorizacao_sazonal.csv', data.data.monitorizacao);
        localStorage.setItem('sns_monitorizacao_backup', JSON.stringify(data.data.monitorizacao));
      }
      
      if (data.data.instituicoes) {
        dataCache.set('dim_instituicao.csv', data.data.instituicoes);
        localStorage.setItem('sns_instituicoes_backup', JSON.stringify(data.data.instituicoes));
      }
      
      if (data.data.regioes) {
        dataCache.set('dim_regiao.csv', data.data.regioes);
        localStorage.setItem('sns_regioes_backup', JSON.stringify(data.data.regioes));
      }
      
      if (data.data.indicadores) {
        dataCache.set('dim_indicador.csv', data.data.indicadores);
        localStorage.setItem('sns_indicadores_backup', JSON.stringify(data.data.indicadores));
      }
      
      console.log('Backup restaurado com sucesso:', {
        backupId,
        recordsRestored: {
          atendimentos: data.data.atendimentos?.length || 0,
          monitorizacao: data.data.monitorizacao?.length || 0,
          instituicoes: data.data.instituicoes?.length || 0,
          regioes: data.data.regioes?.length || 0,
          indicadores: data.data.indicadores?.length || 0
        }
      });
      return true;
    }
  } catch (error) {
    console.error('Erro ao restaurar backup:', error);
    return false;
  }
};

// Listar backups disponíveis
export const listBackups = () => {
  const backups = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('sns_backup_')) {
      try {
        const backup = JSON.parse(localStorage.getItem(key));
        backups.push({
          id: key,
          timestamp: backup.timestamp,
          size: JSON.stringify(backup.data).length
        });
      } catch (error) {
        console.error('Erro ao ler backup:', key, error);
      }
    }
  }
  
  return backups.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};
