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

  it('renders with dadosBrutos with same period (triggers reduce accumulation)', () => {
    const dataWithSamePeriod = {
      ...mockData,
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
        },
        {
          Período: '2024-01',
          InstituicaoID: 2,
          RegiaoID: 2,
          TotalAtendimentos: 3000,
          Atendimentos_Vermelha: 50,
          Atendimentos_Laranja: 100,
          Atendimentos_Amarela: 150,
          Atendimentos_Verde: 600,
          Atendimentos_Azul: 300,
          Atendimentos_Branca: 200
        }
      ]
    };
    render(<DashboardExecutivo data={dataWithSamePeriod} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with dadosCovidCompletos data', () => {
    const dataWithCovid = {
      ...mockData,
      dadosCovidCompletos: [
        {
          Período: '2024-01',
          CasosCovid: 100,
          ObitosCovid: 5,
          InternamentosCovid: 20
        }
      ]
    };
    render(<DashboardExecutivo data={dataWithCovid} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with dadosCovidCompletos with same period (triggers reduce accumulation)', () => {
    const dataWithCovidSamePeriod = {
      ...mockData,
      dadosCovidCompletos: [
        {
          Período: '2024-01',
          CasosCovid: 100,
          ObitosCovid: 5,
          InternamentosCovid: 20
        },
        {
          Período: '2024-01',
          CasosCovid: 50,
          ObitosCovid: 2,
          InternamentosCovid: 10
        }
      ]
    };
    render(<DashboardExecutivo data={dataWithCovidSamePeriod} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with null dadosCovidCompletos', () => {
    const dataWithNullCovid = { ...mockData, dadosCovidCompletos: null };
    render(<DashboardExecutivo data={dataWithNullCovid} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with empty dadosCovidCompletos array', () => {
    const dataWithEmptyCovid = { ...mockData, dadosCovidCompletos: [] };
    render(<DashboardExecutivo data={dataWithEmptyCovid} dateRange={mockDateRange} />);
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
});
