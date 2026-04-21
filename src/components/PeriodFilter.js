import React, { useState, useEffect } from 'react';

const PeriodFilter = ({ onDateRangeChange, disabled = false }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [quickSelect, setQuickSelect] = useState('');

  // Opções de seleção rápida
  const quickOptions = [
    { value: 'last12', label: 'Últimos 12 meses', months: 12 },
    { value: 'last24', label: 'Últimos 24 meses', months: 24 },
    { value: 'last36', label: 'Últimos 36 meses', months: 36 },
    { value: 'currentYear', label: 'Ano 2026 (completo)', months: 'current' },
    { value: 'lastYear', label: 'Ano 2025', months: 'previous' },
    { value: 'last2years', label: 'Últimos 2 anos', months: 24 },
    { value: 'all', label: 'Todo o período (2016-2026)', months: 'all' },
    { value: 'custom', label: 'Personalizado', months: 'custom' }
  ];

  useEffect(() => {
    // Definir padrão para todo o período (2016-atualidade) após o componente montar
    const timer = setTimeout(() => {
      handleQuickSelect('all');
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const handleQuickSelect = (value) => {
    setQuickSelect(value);
    
    const now = new Date();
    let start, end;

    switch (value) {
      case 'last12':
        start = new Date(now.getFullYear(), now.getMonth() - 12, 1);
        end = now;
        break;

      case 'last24':
        start = new Date(now.getFullYear(), now.getMonth() - 24, 1);
        end = now;
        break;

      case 'last36':
        start = new Date(now.getFullYear(), now.getMonth() - 36, 1);
        end = now;
        break;
        
      case 'currentYear':
        // Ano corrente desde 01/01 até hoje (data atual)
        start = new Date(now.getFullYear(), 0, 1);
        end = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
        
      case 'lastYear':
        // Usar 2025 como "ano anterior" ao último ano completo (2025)
        start = new Date(2025, 0, 1);
        end = new Date(2025, 11, 31);
        break;
        
      case 'last2years':
        start = new Date(now.getFullYear(), now.getMonth() - 24, 1);
        end = now;
        break;
        
      case 'all':
        // Dados desde 2016 até hoje (data atual)
        start = new Date(2016, 0, 1);
        end = now;
        break;
        
      case 'custom':
        // Manter datas existentes ou definir padrão
        if (!startDate) {
          start = new Date(now.getFullYear(), now.getMonth() - 12, 1);
          end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        } else {
          start = new Date(startDate);
          end = new Date(endDate);
        }
        break;
        
      default:
        return;
    }

    setStartDate(formatDateForInput(start));
    setEndDate(formatDateForInput(end));
    
    if (value !== 'custom') {
      onDateRangeChange(start, end);
    }
  };

  const formatDateForInput = (date) => {
    return date.toISOString().split('T')[0];
  };

  const handleCustomDateChange = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (start <= end) {
        onDateRangeChange(start, end);
      } else {
        alert('A data de início deve ser anterior à data de fim');
      }
    }
  };

  const handleClearFilter = () => {
    setQuickSelect('all');
    handleQuickSelect('all');
  };

  const getDateRangeDisplay = () => {
    if (!startDate || !endDate) return 'Todo o período';
    
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      // Validar se as datas são válidas
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return 'Período inválido';
      }
      
      const options = { month: 'short', year: 'numeric' };
      const startStr = start.toLocaleDateString('pt-PT', options);
      const endStr = end.toLocaleDateString('pt-PT', options);
      
      return `${startStr} - ${endStr}`;
    } catch (error) {
      return 'Erro no período';
    }
  };

  return (
    <div className="card mb-6">
      <div className="card-header">
        <h3 className="card-title">📅 Filtro de Período</h3>
        <div className="text-sm text-gray-500">
          {getDateRangeDisplay()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Seleção Rápida */}
        <div className="md:col-span-2 lg:col-span-1">
          <label className="filter-label">Seleção Rápida: </label>
          <select 
            className="filter-select"
            value={quickSelect}
            onChange={(e) => handleQuickSelect(e.target.value)}
            disabled={disabled}
          >
            {quickOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          {/* Indicador visual para período selecionado */}
          {quickSelect === 'last12' ? (
            <div className="text-xs text-blue-600 mt-1">
              ⏱️ 1 ano de dados
            </div>
          ) : quickSelect === 'last24' ? (
            <div className="text-xs text-blue-600 mt-1">
              ⏱️ 2 anos de dados
            </div>
          ) : quickSelect === 'last36' ? (
            <div className="text-xs text-blue-600 mt-1">
              ⏱️ 3 anos de dados
            </div>
          ) : quickSelect === 'last2years' ? (
            <div className="text-xs text-blue-600 mt-1">
              📊 Análise bienal
            </div>
          ) : quickSelect === 'currentYear' ? (
            <div className="text-xs text-green-600 mt-1">
              ✅ Ano corrente ({new Date().getFullYear()})
            </div>
          ) : quickSelect === 'lastYear' ? (
            <div className="text-xs text-purple-600 mt-1">
              📅 Ano anterior (2025)
            </div>
          ) : quickSelect === 'all' ? (
            <div className="text-xs text-orange-600 mt-1">
              📊 Período completo (2016-2026)
            </div>
          ) : quickSelect === 'custom' ? (
            <div className="text-xs text-gray-600 mt-1">
              ⚙️ Período personalizado
            </div>
          ) : null}
        </div>

        {/* Data de Início */}
        <div>
          <label className="filter-label">Data de Início:</label>
          <input
            type="date"
            className="filter-select"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            onBlur={handleCustomDateChange}
            disabled={disabled || quickSelect !== 'custom'}
            max={endDate}
          />
        </div>

        {/* Data de Fim */}
        <div>
          <label className="filter-label">Data de Fim:</label>
          <input
            type="date"
            className="filter-select"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            onBlur={handleCustomDateChange}
            disabled={disabled || quickSelect !== 'custom'}
            min={startDate}
          />
        </div>
      </div>

      {/* Ações */}
      <div className="flex gap-3 mt-4">
        {quickSelect !== 'all' && (
          <button
            onClick={handleClearFilter}
            disabled={disabled}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            🔄 Limpar Filtro
          </button>
        )}
        
        <div className="text-sm text-gray-500 ml-auto">
          📊 {quickOptions.find(o => o.value === quickSelect)?.label}
        </div>
      </div>

      {/* Informações Adicionais */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">        
        <div style={{ height: '10px' }}></div>
        <div className="text-sm text-blue-700">
          <strong>ℹ️ Informações:</strong>
          <ul className="mt-1 ml-4 list-disc">
            <li>Período completo dos dados: Janeiro 2016 até {new Date().toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' })}</li>
            <li>Dados de atendimentos: baseados em dados públicos do SNS (transparência.sns.gov.pt)</li>
            <li>Dados COVID-19: estimados algoritmicamente com base em padrões históricos reais de Portugal</li>
            <li>Use seleção rápida para filtros predefinidos</li>
            <li>Personalizado permite datas específicas</li>
            <li>Filtros afetam todos os dashboards simultaneamente</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PeriodFilter;
