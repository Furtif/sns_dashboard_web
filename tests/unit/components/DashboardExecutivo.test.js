/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import DashboardExecutivo from '../../../src/components/DashboardExecutivo';

const mockData = {
  totalAtendimentos: 100000,
  urgenciasFalsas: 30000,
  despesaTotalEstimada: 15000000,
  custoDesperdicadoEstimado: 3600000,
  instituicoes: [
    { InstituicaoID: 1, InstituicaoNome: 'Hospital A', Tipo: 'Hospital Central', RegiaoID: 1 },
    { InstituicaoID: 2, InstituicaoNome: 'Hospital B', Tipo: 'Hospital Distrital', RegiaoID: 2 }
  ],
  regioes: [
    { RegiaoID: 1, RegiaoNome: 'Norte' },
    { RegiaoID: 2, RegiaoNome: 'Lisboa' }
  ],
  dadosBrutos: [
    {
      Período: '2024-01',
      InstituicaoID: 1,
      RegiaoID: 1,
      TotalAtendimentos: 5000,
      Atendimentos_Vermelha: 100,
      Atendimentos_Laranja: 200,
      Atendimentos_Amarela: 300,
      Atendimentos_Verde: 1000,
      Atendimentos_Azul: 500,
      Atendimentos_Branca: 300
    }
  ],
  triagemProcessed: {
    totals: {
      Vermelha: 1000,
      Laranja: 2000,
      Amarela: 3000,
      Verde: 10000,
      Azul: 5000,
      Branca: 3000
    }
  }
};

const mockDateRange = {
  start: new Date('2024-01-01'),
  end: new Date('2024-12-31')
};

describe('DashboardExecutivo', () => {
  it('renders without data message when no data provided', () => {
    render(<DashboardExecutivo data={{}} />);
    expect(screen.getByText('Sem dados para o período selecionado')).toBeInTheDocument();
  });

  it('renders without data message when totalAtendimentos is 0', () => {
    render(<DashboardExecutivo data={{ totalAtendimentos: 0 }} />);
    expect(screen.getByText('Sem dados para o período selecionado')).toBeInTheDocument();
  });

  it('renders dashboard title when data is null', () => {
    render(<DashboardExecutivo data={null} />);
    expect(screen.getByText('📊 Dashboard Executivo')).toBeInTheDocument();
    expect(screen.getByText('Sem dados para o período selecionado')).toBeInTheDocument();
  });

  it('renders KPIs when data is provided', () => {
    render(<DashboardExecutivo data={mockData} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('does not render no data message when data is provided', () => {
    render(<DashboardExecutivo data={mockData} dateRange={mockDateRange} />);
    expect(screen.queryByText('Sem dados para o período selecionado')).not.toBeInTheDocument();
  });

  it('renders with empty instituicoes array', () => {
    const dataWithEmptyInstituicoes = { ...mockData, instituicoes: [] };
    render(<DashboardExecutivo data={dataWithEmptyInstituicoes} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with empty regioes array', () => {
    const dataWithEmptyRegioes = { ...mockData, regioes: [] };
    render(<DashboardExecutivo data={dataWithEmptyRegioes} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with empty dadosBrutos array', () => {
    const dataWithEmptyDadosBrutos = { ...mockData, dadosBrutos: [] };
    render(<DashboardExecutivo data={dataWithEmptyDadosBrutos} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders without dateRange', () => {
    render(<DashboardExecutivo data={mockData} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with null triagemProcessed', () => {
    const dataWithNullTriagem = { ...mockData, triagemProcessed: null };
    render(<DashboardExecutivo data={dataWithNullTriagem} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with undefined despesaTotalEstimada', () => {
    const dataWithUndefinedDespesa = { ...mockData, despesaTotalEstimada: undefined };
    render(<DashboardExecutivo data={dataWithUndefinedDespesa} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with null despesaTotalEstimada', () => {
    const dataWithNullDespesa = { ...mockData, despesaTotalEstimada: null };
    render(<DashboardExecutivo data={dataWithNullDespesa} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with undefined custoDesperdicadoEstimado', () => {
    const dataWithUndefinedCusto = { ...mockData, custoDesperdicadoEstimado: undefined };
    render(<DashboardExecutivo data={dataWithUndefinedCusto} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with null custoDesperdicadoEstimado', () => {
    const dataWithNullCusto = { ...mockData, custoDesperdicadoEstimado: null };
    render(<DashboardExecutivo data={dataWithNullCusto} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with negative despesaTotalEstimada', () => {
    const dataWithNegativeDespesa = { ...mockData, despesaTotalEstimada: -1000 };
    render(<DashboardExecutivo data={dataWithNegativeDespesa} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with zero despesaTotalEstimada', () => {
    const dataWithZeroDespesa = { ...mockData, despesaTotalEstimada: 0 };
    render(<DashboardExecutivo data={dataWithZeroDespesa} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with very large despesaTotalEstimada', () => {
    const dataWithLargeDespesa = { ...mockData, despesaTotalEstimada: 999999999999 };
    render(<DashboardExecutivo data={dataWithLargeDespesa} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with very large custoDesperdicadoEstimado', () => {
    const dataWithLargeCusto = { ...mockData, custoDesperdicadoEstimado: 999999999999 };
    render(<DashboardExecutivo data={dataWithLargeCusto} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with zero custoDesperdicadoEstimado', () => {
    const dataWithZeroCusto = { ...mockData, custoDesperdicadoEstimado: 0 };
    render(<DashboardExecutivo data={dataWithZeroCusto} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with negative custoDesperdicadoEstimado', () => {
    const dataWithNegativeCusto = { ...mockData, custoDesperdicadoEstimado: -1000 };
    render(<DashboardExecutivo data={dataWithNegativeCusto} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with triagemProcessed with empty totals', () => {
    const dataWithEmptyTotals = { ...mockData, triagemProcessed: { totals: {} } };
    render(<DashboardExecutivo data={dataWithEmptyTotals} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with triagemProcessed with partial totals', () => {
    const dataWithPartialTotals = { ...mockData, triagemProcessed: { totals: { Vermelha: 100 } } };
    render(<DashboardExecutivo data={dataWithPartialTotals} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with null triagemProcessed', () => {
    const dataWithNullTriagem = { ...mockData, triagemProcessed: null };
    render(<DashboardExecutivo data={dataWithNullTriagem} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with undefined triagemProcessed', () => {
    const dataWithUndefinedTriagem = { ...mockData, triagemProcessed: undefined };
    render(<DashboardExecutivo data={dataWithUndefinedTriagem} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with dateRange with same start and end', () => {
    const sameDate = new Date('2024-01-01');
    const dateRangeSame = { start: sameDate, end: sameDate };
    render(<DashboardExecutivo data={mockData} dateRange={dateRangeSame} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with dateRange with reversed dates', () => {
    const dateRangeReversed = { start: new Date('2024-12-31'), end: new Date('2024-01-01') };
    render(<DashboardExecutivo data={mockData} dateRange={dateRangeReversed} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with null dateRange start', () => {
    const dateRangeWithNullStart = { start: null, end: new Date('2024-12-31') };
    render(<DashboardExecutivo data={mockData} dateRange={dateRangeWithNullStart} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with null dateRange end', () => {
    const dateRangeWithNullEnd = { start: new Date('2024-01-01'), end: null };
    render(<DashboardExecutivo data={mockData} dateRange={dateRangeWithNullEnd} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with undefined dateRange start', () => {
    const dateRangeWithUndefinedStart = { start: undefined, end: new Date('2024-12-31') };
    render(<DashboardExecutivo data={mockData} dateRange={dateRangeWithUndefinedStart} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with undefined dateRange end', () => {
    const dateRangeWithUndefinedEnd = { start: new Date('2024-01-01'), end: undefined };
    render(<DashboardExecutivo data={mockData} dateRange={dateRangeWithUndefinedEnd} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with very large positive despesaTotalEstimada', () => {
    const dataWithLargeDespesa = { ...mockData, despesaTotalEstimada: 999999999999999 };
    render(<DashboardExecutivo data={dataWithLargeDespesa} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with very large negative despesaTotalEstimada', () => {
    const dataWithLargeNegativeDespesa = { ...mockData, despesaTotalEstimada: -999999999999999 };
    render(<DashboardExecutivo data={dataWithLargeNegativeDespesa} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with decimal despesaTotalEstimada', () => {
    const dataWithDecimalDespesa = { ...mockData, despesaTotalEstimada: 123456.78 };
    render(<DashboardExecutivo data={dataWithDecimalDespesa} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with very small positive despesaTotalEstimada', () => {
    const dataWithSmallDespesa = { ...mockData, despesaTotalEstimada: 0.01 };
    render(<DashboardExecutivo data={dataWithSmallDespesa} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });
});
