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

  // Cálculo preciso usando meses reais do calendário
  const startYear = dateRange.start.getFullYear();
  const startMonth = dateRange.start.getMonth();
  const startDay = dateRange.start.getDate();
  const endYear = dateRange.end.getFullYear();
  const endMonth = dateRange.end.getMonth();
  const endDay = dateRange.end.getDate();

  // Diferença em meses completos
  let monthsDiff = (endYear - startYear) * 12 + (endMonth - startMonth);

  // Verificar se o dia final é o último dia do mês
  const lastDayOfEndMonth = new Date(endYear, endMonth + 1, 0).getDate();
  const isEndOfMonth = endDay === lastDayOfEndMonth;

  // Se começamos no dia 1 e acabamos no último dia do mês, é um período de meses completos
  if (startDay === 1 && isEndOfMonth) {
    monthsDiff += 1;
  } else if (endDay < startDay) {
    // Ajuste para períodos que não começam no dia 1
    monthsDiff -= 1;
  }

  // Converter para anos com 1 casa decimal
  const yearsDiff = (monthsDiff / 12).toFixed(1);

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
