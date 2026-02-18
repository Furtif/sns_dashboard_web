import React from 'react';
import { formatNumber, formatCurrency, formatPercent } from '../utils/formatters';

const PeriodSummary = ({ data, dateRange }) => {
  if (!data || !dateRange.start || !dateRange.end) {
    return null;
  }


  const formatPeriod = (date) => {
    return new Intl.DateTimeFormat('pt-PT', {
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  const monthsDiff = Math.round((dateRange.end - dateRange.start) / (1000 * 60 * 60 * 24 * 30));
  const yearsDiff = isFinite(monthsDiff) ? (monthsDiff / 12).toFixed(1) : '0.0';

  return (
    <div className="period-filter-summary">
      <div className="summary-title">📊 Resumo do Período Selecionado</div>
      <div className="summary-details">
        <div className="summary-item">
          <div className="summary-value">{formatPeriod(dateRange.start)}</div>
          <div className="summary-label">Início</div>
        </div>
        <div className="summary-item">
          <div className="summary-value">{formatPeriod(dateRange.end)}</div>
          <div className="summary-label">Fim</div>
        </div>
        <div className="summary-item">
          <div className="summary-value">{yearsDiff} anos</div>
          <div className="summary-label">Duração</div>
        </div>
        <div className="summary-item">
          <div className="summary-value">{formatNumber(data.totalAtendimentos)}</div>
          <div className="summary-label">Atendimentos</div>
        </div>
        <div className="summary-item">
          <div className="summary-value">{formatPercent(data.percentUrgenciasFalsas)}</div>
          <div className="summary-label">Urgências Falsas</div>
        </div>
        <div className="summary-item">
          <div className="summary-value">{formatCurrency(data.custoDesperdicadoEstimado)}</div>
          <div className="summary-label">Custo Desperdiçado</div>
        </div>
      </div>
    </div>
  );
};

export default PeriodSummary;
