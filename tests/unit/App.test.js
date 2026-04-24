/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import App from '../../src/App';

// Mock the dataLoader functions
jest.mock('../../src/utils/dataLoader', () => ({
  loadAllData: jest.fn(() => Promise.resolve({
    atendimentos: [],
    atendimentosTriagem: [],
    monitorizacao: [],
    monitorizacaoCSH: [],
    trabalhadores: [],
    instituicoes: [],
    regioes: [],
    indicadores: []
  })),
  calculateMetrics: jest.fn(() => ({
    totalAtendimentos: 0,
    dadosBrutos: [],
    percentUrgenciasFalsas: 0
  })),
  clearCache: jest.fn(),
  filterByPeriod: jest.fn(() => []),
  filterMonitorizacaoByPeriod: jest.fn(() => []),
  processTrabalhadoresData: jest.fn(() => null),
  processTriagemData: jest.fn(() => null),
  processMonitorizacaoCSH: jest.fn(() => null)
}));

// Mock formatters
jest.mock('../../src/utils/formatters', () => ({
  formatNumber: jest.fn((num) => num?.toLocaleString() || '0'),
  formatCurrency: jest.fn(),
  formatPercent: jest.fn(),
  formatPeriodRange: jest.fn()
}));

describe('App', () => {
  it('renders loading state initially', () => {
    render(<App />);
    expect(screen.getByText(/SNS Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/A carregar dados/i)).toBeInTheDocument();
  });

  it('renders dashboard tabs after loading', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText(/A carregar dados/i)).not.toBeInTheDocument();
    });

    expect(screen.getByText(/Operacional/i)).toBeInTheDocument();
    expect(screen.getByText(/Financeiro/i)).toBeInTheDocument();
    expect(screen.getByText(/Recursos Humanos/i)).toBeInTheDocument();
  });

  it('renders PeriodFilter component', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText(/A carregar dados/i)).not.toBeInTheDocument();
    });

    expect(screen.getByText(/Filtro de Período/i)).toBeInTheDocument();
  });

  it('renders footer', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText(/A carregar dados/i)).not.toBeInTheDocument();
    });

    expect(screen.getByText(/Portal Transparência SNS/i)).toBeInTheDocument();
  });

  it('renders mobile menu button', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText(/A carregar dados/i)).not.toBeInTheDocument();
    });

    const mobileMenuBtn = screen.getByLabelText('Menu');
    expect(mobileMenuBtn).toBeInTheDocument();
  });

  it('clicks mobile menu button to toggle menu', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText(/A carregar dados/i)).not.toBeInTheDocument();
    });

    const mobileMenuBtn = screen.getByLabelText('Menu');
    fireEvent.click(mobileMenuBtn);
  });

  it('clicks dashboard tab to switch tabs', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText(/A carregar dados/i)).not.toBeInTheDocument();
    });

    const operacionalTab = screen.getByText(/Operacional/i);
    fireEvent.click(operacionalTab);
  });

  it('clicks financeiro tab to switch tabs', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText(/A carregar dados/i)).not.toBeInTheDocument();
    });

    const financeiroTab = screen.getByText(/Financeiro/i);
    fireEvent.click(financeiroTab);
  });

  it('clicks rh tab to switch tabs', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText(/A carregar dados/i)).not.toBeInTheDocument();
    });

    const rhTab = screen.getByText(/Recursos Humanos/i);
    fireEvent.click(rhTab);
  });

  it('renders PeriodFilter component', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText(/A carregar dados/i)).not.toBeInTheDocument();
    });

    expect(screen.getByText('📅 Filtro de Período')).toBeInTheDocument();
  });

  it('renders footer', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText(/A carregar dados/i)).not.toBeInTheDocument();
    });

    expect(screen.getByText(/Desenvolvimento:/i)).toBeInTheDocument();
  });

  it('renders mobile menu button', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText(/A carregar dados/i)).not.toBeInTheDocument();
    });

    expect(screen.getByLabelText('Menu')).toBeInTheDocument();
  });
});
