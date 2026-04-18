import React from 'react';
import { render, screen } from '@testing-library/react';
import PeriodSummary from '../../../src/components/PeriodSummary';

// Mock the formatters
jest.mock('../../../src/utils/formatters', () => ({
  formatNumber: (num) => num?.toString() || '0',
  formatPercent: (num) => `${num?.toFixed?.(1) || 0}%`,
  formatCurrency: (num) => `${num?.toString() || '0'} €`,
}));

describe('PeriodSummary', () => {
  const mockData = {
    totalAtendimentos: 100000,
    percentUrgenciasFalsas: 15.5,
    tempoMedioEspera: 120,
    custoDesperdicadoEstimado: 500000,
  };

  const mockDateRange = {
    start: new Date('2024-01-01'),
    end: new Date('2024-12-31'),
  };

  it('renders without crashing', () => {
    render(
      <PeriodSummary
        data={mockData}
        dateRange={mockDateRange}
      />
    );
  });

  it('displays the date range in the title', () => {
    render(
      <PeriodSummary
        data={mockData}
        dateRange={mockDateRange}
      />
    );

    expect(screen.getByText(/Resumo do Período/i)).toBeInTheDocument();
    // Verifica que as datas formatadas aparecem (Início e Fim)
    expect(screen.getByText(/Início/i)).toBeInTheDocument();
    expect(screen.getByText(/Fim/i)).toBeInTheDocument();
  });

  it('displays the total attendances', () => {
    render(
      <PeriodSummary
        data={mockData}
        dateRange={mockDateRange}
      />
    );

    expect(screen.getByText(/Atendimentos/i)).toBeInTheDocument();
  });
});
