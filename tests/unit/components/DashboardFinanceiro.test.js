/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import DashboardFinanceiro from '../../../src/components/DashboardFinanceiro';

const mockData = {
  totalAtendimentos: 100000,
  urgenciasFalsas: 30000,
  despesaTotalEstimada: 15000000,
  custoDesperdicadoEstimado: 3600000,
  instituicoes: [
    { InstituicaoID: 1, InstituicaoNome: 'Hospital A', Tipo: 'CH', RegiaoID: 1 },
    { InstituicaoID: 2, InstituicaoNome: 'Hospital B', Tipo: 'ULS', RegiaoID: 2 }
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
      Atendimentos_Verde: 1000,
      Atendimentos_Azul: 500,
      Atendimentos_Branca: 300
    },
    {
      Período: '2024-02',
      InstituicaoID: 2,
      RegiaoID: 2,
      TotalAtendimentos: 4000,
      Atendimentos_Verde: 800,
      Atendimentos_Azul: 400,
      Atendimentos_Branca: 200
    }
  ]
};

const mockDateRange = {
  start: new Date('2024-01-01'),
  end: new Date('2024-12-31')
};

describe('DashboardFinanceiro', () => {
  it('renders without data message when no data provided', () => {
    render(<DashboardFinanceiro data={{}} />);
    expect(screen.getByText('Sem dados para o período selecionado')).toBeInTheDocument();
  });

  it('renders without data message when totalAtendimentos is 0', () => {
    render(<DashboardFinanceiro data={{ totalAtendimentos: 0 }} />);
    expect(screen.getByText('Sem dados para o período selecionado')).toBeInTheDocument();
  });

  it('renders dashboard title when data is null', () => {
    render(<DashboardFinanceiro data={null} />);
    expect(screen.getByText('💰 Dashboard Financeiro')).toBeInTheDocument();
    expect(screen.getByText('Sem dados para o período selecionado')).toBeInTheDocument();
  });

  it('does not render no data message when data is provided', () => {
    render(<DashboardFinanceiro data={mockData} dateRange={mockDateRange} />);
    expect(screen.queryByText('Sem dados para o período selecionado')).not.toBeInTheDocument();
  });
});
