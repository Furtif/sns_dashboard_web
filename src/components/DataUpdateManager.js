import React, { useState, useEffect } from 'react';
import { simulateDataUpdate, getUpdateHistory, createBackup, restoreBackup, listBackups, clearCache } from '../utils/dataManager';

const DataUpdateManager = ({ onDataUpdated }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateStatus, setUpdateStatus] = useState('');
  const [lastUpdate, setLastUpdate] = useState(null);
  const [activeScript, setActiveScript] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [showBackups, setShowBackups] = useState(false);
  const [availableBackups, setAvailableBackups] = useState([]);
  const [updateHistory, setUpdateHistory] = useState([]);

  useEffect(() => {
    // Carregar histórico de atualizações
    const history = getUpdateHistory();
    setUpdateHistory(history);
    
    // Carregar backups disponíveis
    const backups = listBackups();
    setAvailableBackups(backups);
    
    // Carregar data da última atualização
    const saved = localStorage.getItem('sns_last_update');
    if (saved) {
      setLastUpdate(new Date(saved));
    }
  }, []);

  const executeUpdate = async (scriptId) => {
    setIsUpdating(true);
    setUpdateStatus('A iniciar atualização...');
    setActiveScript(scriptId);

    try {
      const result = await simulateDataUpdate(scriptId);
      
      if (result.success) {
        setUpdateStatus(`✅ ${result.message}`);
        
        // Atualizar timestamp da última atualização
        localStorage.setItem('sns_last_update', new Date().toISOString());
        setLastUpdate(new Date());
        
        // Criar backup APÓS a atualização com os novos dados
        await createBackup();
        
        // Limpar cache para forçar recarregamento dos novos dados
        clearCache();
        
        // Atualizar lista de backups disponíveis
        const backups = listBackups();
        setAvailableBackups(backups);
        
        // Notificar componente pai para recarregar dados
        if (onDataUpdated) {
          setTimeout(() => {
            onDataUpdated();
          }, 1000);
        }
      } else {
        setUpdateStatus(`❌ Erro: ${result.error}`);
      }
    } catch (error) {
      console.error('Erro na atualização:', error);
      setUpdateStatus(`❌ Erro: ${error.message}`);
    } finally {
      setIsUpdating(false);
      setActiveScript('');
      
      // Limpar status após 5 segundos
      setTimeout(() => {
        setUpdateStatus('');
      }, 5000);
    }
  };

  const handleRestoreBackup = async (backupId) => {
    setUpdateStatus('A restaurar backup...');
    
    const success = restoreBackup(backupId);
    
    if (success) {
      setUpdateStatus('✅ Backup restaurado com sucesso');
      
      // Limpar cache para forçar recarregamento dos dados restaurados
      clearCache();
      
      // Recarregar dados
      if (onDataUpdated) {
        setTimeout(() => {
          onDataUpdated();
        }, 1000);
      }
    } else {
      setUpdateStatus('❌ Erro ao restaurar backup');
    }
    
    setTimeout(() => {
      setUpdateStatus('');
    }, 3000);
  };

  const formatDateTime = (date) => {
    if (!date) return 'Nunca';
    
    // Verificar se é uma data válida
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return 'Data inválida';
    }
    
    return new Intl.DateTimeFormat('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(dateObj);
  };

  const getScriptDescription = (scriptId) => {
    const scripts = {
      'update_atendimentos': {
        name: 'Atualizar Dados de Atendimentos',
        description: 'Atualiza dados de atendimentos de urgência com triagem Manchester',
        icon: '📊',
        color: 'blue'
      },
      'update_monitorizacao': {
        name: 'Atualizar Dados de Monitorização',
        description: 'Atualiza dados diários de monitorização sazonal',
        icon: '📈',
        color: 'green'
      },
      'update_instituicoes': {
        name: 'Atualizar Cadastro de Instituições',
        description: 'Atualiza dados das instituições e regiões',
        icon: '🏥',
        color: 'purple'
      },
      'update_all': {
        name: 'Atualizar Todos os Dados',
        description: 'Executa todos os scripts de atualização em sequência',
        icon: '🚀',
        color: 'red'
      }
    };
    
    return scripts[scriptId] || { name: 'Script Desconhecido', description: '', icon: '❓', color: 'gray' };
  };

  const scripts = [
    { id: 'update_atendimentos', ...getScriptDescription('update_atendimentos') },
    { id: 'update_monitorizacao', ...getScriptDescription('update_monitorizacao') },
    { id: 'update_instituicoes', ...getScriptDescription('update_instituicoes') },
    { id: 'update_all', ...getScriptDescription('update_all') }
  ];

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">🔄 Gestor de Atualização de Dados</h3>
        <div className="text-sm text-gray-500">
          Última atualização: {formatDateTime(lastUpdate)}
        </div>
      </div>

      <div className="space-y-6">
        {/* Status da Atualização */}
        {(updateStatus || isUpdating) && (
          <div className={`p-4 rounded-lg border ${
            updateStatus.includes('✅') ? 'bg-green-50 border-green-200' :
            updateStatus.includes('❌') ? 'bg-red-50 border-red-200' :
            'bg-blue-50 border-blue-200'
          }`}>
            <div className="flex items-center gap-2">
              {isUpdating && (
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              )}
              <span className={`font-medium ${
                updateStatus.includes('✅') ? 'text-green-700' :
                updateStatus.includes('❌') ? 'text-red-700' :
                'text-blue-700'
              }`}>
                {updateStatus}
              </span>
            </div>
          </div>
        )}

        {/* Scripts Disponíveis */}
        <div>
          <h4 className="font-semibold mb-3">Scripts de Atualização Disponíveis</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scripts.map((script) => (
              <div 
                key={script.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-lg ${
                  activeScript === script.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => !isUpdating && executeUpdate(script.id)}
              >
                <div className="flex items-center gap-3">
                  <div className={`text-2xl`} style={{ color: script.color }}>
                    {script.icon}
                  </div>
                  <div className="flex items-start gap-3">
                    <h5 className="font-medium text-gray-900">{script.name}</h5>
                    <p className="text-sm text-gray-600 mt-1">{script.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => activeScript && executeUpdate(activeScript)}
            disabled={!activeScript || isUpdating}
            className={`update-button ${!activeScript || isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isUpdating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                A Executar...
              </>
            ) : (
              <>
                ⚡ Executar Script Selecionado
              </>
            )}
          </button>

          <button
            onClick={() => executeUpdate('update_all')}
            disabled={isUpdating}
            className={`update-button ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
            style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)' }}
          >
            {isUpdating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                🚀 Atualizar Todos os Dados
              </>
            ) : (
              <>
                🚀 Atualizar Todos os Dados
              </>
            )}
          </button>
        </div>

        {/* Histórico de Atualizações */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-semibold">📋 Histórico de Atualizações</h4>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {showHistory ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>

          {showHistory && (
            <div className="space-y-2 max-h-40 overflow-y-auto border rounded-lg p-4 bg-gray-50">
              {updateHistory.length === 0 ? (
                <div className="text-center text-gray-500 py-4">
                  Nenhuma atualização registrada
                </div>
              ) : (
                updateHistory.map((update, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white rounded border">
                    <div>
                      <div className="font-medium">{update.scriptName}</div>
                      <div className="text-sm text-gray-500">
                        {formatDateTime(update.timestamp)}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        update.result.success 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {update.result.success ? 'Sucesso' : 'Erro'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Gestão de Backups */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold">💾 Gestão de Backups</h4>
              <button
                onClick={() => setShowBackups(!showBackups)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {showBackups ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>

            {showBackups && (
              <div className="space-y-2">
                {availableBackups.length === 0 ? (
                  <div className="text-center text-gray-500 py-4">
                    Nenhum backup disponível
                  </div>
                ) : (
                  availableBackups.map((backup) => (
                    <div key={backup.id} className="flex items-center justify-between p-3 bg-white rounded border">
                      <div>
                        <div className="font-medium">Backup</div>
                        <div className="text-sm text-gray-500">
                          {formatDateTime(backup.timestamp)}
                        </div>
                        <div className="text-xs text-gray-400">
                          {(backup.size / 1024).toFixed(1)} KB
                        </div>
                      </div>
                      <div className="text-right">
                        <button
                          onClick={() => handleRestoreBackup(backup.id)}
                          disabled={isUpdating}
                          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 text-sm"
                        >
                          Restaurar
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Informações Adicionais */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 mb-2">ℹ️ Informações Importantes</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• <strong>Fonte de Dados:</strong> Simulação local para demonstração</li>
            <li>• <strong>Atualização Real:</strong> Em produção, integrar com scripts Python reais</li>
            <li>• <strong>Backup Automático:</strong> Criado antes de cada atualização</li>
            <li>• <strong>Histórico:</strong> Mantém últimas 10 atualizações</li>
            <li>• <strong>Segurança:</strong> Validação de dados antes de aplicar</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DataUpdateManager;
