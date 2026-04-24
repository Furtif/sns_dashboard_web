/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import DashboardOperacional from '../../../src/components/DashboardOperacional';

const mockData = {
  totalAtendimentos: 100000,
  urgenciasFalsas: 30000,
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

describe('DashboardOperacional', () => {
  it('renders without data message when no data provided', () => {
    render(<DashboardOperacional data={{}} />);
    expect(screen.getByText('Sem dados para o período selecionado')).toBeInTheDocument();
  });

  it('renders without data message when totalAtendimentos is 0', () => {
    render(<DashboardOperacional data={{ totalAtendimentos: 0 }} />);
    expect(screen.getByText('Sem dados para o período selecionado')).toBeInTheDocument();
  });

  it('renders dashboard title when data is null', () => {
    render(<DashboardOperacional data={null} />);
    expect(screen.getByText('⚙️ Dashboard Operacional')).toBeInTheDocument();
    expect(screen.getByText('Sem dados para o período selecionado')).toBeInTheDocument();
  });

  it('renders KPIs when data is provided', () => {
    render(<DashboardOperacional data={mockData} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('does not render no data message when data is provided', () => {
    render(<DashboardOperacional data={mockData} dateRange={mockDateRange} />);
    expect(screen.queryByText('Sem dados para o período selecionado')).not.toBeInTheDocument();
  });

  it('renders with empty instituicoes array', () => {
    const dataWithEmptyInstituicoes = { ...mockData, instituicoes: [] };
    render(<DashboardOperacional data={dataWithEmptyInstituicoes} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with empty regioes array', () => {
    const dataWithEmptyRegioes = { ...mockData, regioes: [] };
    render(<DashboardOperacional data={dataWithEmptyRegioes} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with empty dadosBrutos array', () => {
    const dataWithEmptyDadosBrutos = { ...mockData, dadosBrutos: [] };
    render(<DashboardOperacional data={dataWithEmptyDadosBrutos} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders without dateRange', () => {
    render(<DashboardOperacional data={mockData} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with null triagemProcessed', () => {
    const dataWithNullTriagem = { ...mockData, triagemProcessed: null };
    render(<DashboardOperacional data={dataWithNullTriagem} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with undefined urgenciasFalsas', () => {
    const dataWithUndefinedUrgencias = { ...mockData, urgenciasFalsas: undefined };
    render(<DashboardOperacional data={dataWithUndefinedUrgencias} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with null instituicoes', () => {
    const dataWithNullInstituicoes = { ...mockData, instituicoes: null };
    render(<DashboardOperacional data={dataWithNullInstituicoes} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with null regioes', () => {
    const dataWithNullRegioes = { ...mockData, regioes: null };
    render(<DashboardOperacional data={dataWithNullRegioes} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with null dadosBrutos', () => {
    const dataWithNullDadosBrutos = { ...mockData, dadosBrutos: null };
    render(<DashboardOperacional data={dataWithNullDadosBrutos} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with null dateRange', () => {
    render(<DashboardOperacional data={mockData} dateRange={null} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with undefined dateRange', () => {
    render(<DashboardOperacional data={mockData} dateRange={undefined} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with empty object triagemProcessed', () => {
    const dataWithEmptyTriagem = { ...mockData, triagemProcessed: {} };
    render(<DashboardOperacional data={dataWithEmptyTriagem} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with negative urgenciasFalsas', () => {
    const dataWithNegativeUrgencias = { ...mockData, urgenciasFalsas: -100 };
    render(<DashboardOperacional data={dataWithNegativeUrgencias} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with zero urgenciasFalsas', () => {
    const dataWithZeroUrgencias = { ...mockData, urgenciasFalsas: 0 };
    render(<DashboardOperacional data={dataWithZeroUrgencias} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with very large totalAtendimentos', () => {
    const dataWithLargeTotal = { ...mockData, totalAtendimentos: 999999999 };
    render(<DashboardOperacional data={dataWithLargeTotal} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with single instituicao', () => {
    const dataWithSingleInstituicao = { ...mockData, instituicoes: [mockData.instituicoes[0]] };
    render(<DashboardOperacional data={dataWithSingleInstituicao} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with single regiao', () => {
    const dataWithSingleRegiao = { ...mockData, regioes: [mockData.regioes[0]] };
    render(<DashboardOperacional data={dataWithSingleRegiao} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with empty triagemProcessed totals', () => {
    const dataWithEmptyTotals = { ...mockData, triagemProcessed: { totals: {} } };
    render(<DashboardOperacional data={dataWithEmptyTotals} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with partial triagemProcessed totals', () => {
    const dataWithPartialTotals = { ...mockData, triagemProcessed: { totals: { Vermelha: 100 } } };
    render(<DashboardOperacional data={dataWithPartialTotals} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with dadosBrutos with single item', () => {
    const dataWithSingleItem = { ...mockData, dadosBrutos: [mockData.dadosBrutos[0]] };
    render(<DashboardOperacional data={dataWithSingleItem} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with dateRange start only', () => {
    const dateRangeStartOnly = { start: new Date('2024-01-01'), end: null };
    render(<DashboardOperacional data={mockData} dateRange={dateRangeStartOnly} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with dateRange end only', () => {
    const dateRangeEndOnly = { start: null, end: new Date('2024-12-31') };
    render(<DashboardOperacional data={mockData} dateRange={dateRangeEndOnly} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with empty object data', () => {
    render(<DashboardOperacional data={{}} dateRange={mockDateRange} />);
    expect(screen.getByText('Sem dados para o período selecionado')).toBeInTheDocument();
  });

  it('renders with data missing totalAtendimentos', () => {
    const dataWithoutTotal = { ...mockData };
    delete dataWithoutTotal.totalAtendimentos;
    render(<DashboardOperacional data={dataWithoutTotal} dateRange={mockDateRange} />);
    expect(screen.getByText('Sem dados para o período selecionado')).toBeInTheDocument();
  });

  it('renders with data missing instituicoes', () => {
    const dataWithoutInstituicoes = { ...mockData };
    delete dataWithoutInstituicoes.instituicoes;
    render(<DashboardOperacional data={dataWithoutInstituicoes} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with data missing regioes', () => {
    const dataWithoutRegioes = { ...mockData };
    delete dataWithoutRegioes.regioes;
    render(<DashboardOperacional data={dataWithoutRegioes} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with data missing dadosBrutos', () => {
    const dataWithoutDadosBrutos = { ...mockData };
    delete dataWithoutDadosBrutos.dadosBrutos;
    render(<DashboardOperacional data={dataWithoutDadosBrutos} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with data missing triagemProcessed', () => {
    const dataWithoutTriagem = { ...mockData };
    delete dataWithoutTriagem.triagemProcessed;
    render(<DashboardOperacional data={dataWithoutTriagem} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with data missing urgenciasFalsas', () => {
    const dataWithoutUrgencias = { ...mockData };
    delete dataWithoutUrgencias.urgenciasFalsas;
    render(<DashboardOperacional data={dataWithoutUrgencias} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with single instituicao in array', () => {
    const dataWithSingleInstituicao = { ...mockData, instituicoes: [mockData.instituicoes[0]] };
    render(<DashboardOperacional data={dataWithSingleInstituicao} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with single regiao in array', () => {
    const dataWithSingleRegiao = { ...mockData, regioes: [mockData.regioes[0]] };
    render(<DashboardOperacional data={dataWithSingleRegiao} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with single dadoBruto in array', () => {
    const dataWithSingleDado = { ...mockData, dadosBrutos: [mockData.dadosBrutos[0]] };
    render(<DashboardOperacional data={dataWithSingleDado} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with large number of instituicoes', () => {
    const manyInstituicoes = Array(10).fill(mockData.instituicoes[0]).map((item, i) => ({ ...item, InstituicaoID: i }));
    const dataWithManyInstituicoes = { ...mockData, instituicoes: manyInstituicoes };
    render(<DashboardOperacional data={dataWithManyInstituicoes} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with large number of regioes', () => {
    const manyRegioes = Array(10).fill(mockData.regioes[0]).map((item, i) => ({ ...item, RegiaoID: i }));
    const dataWithManyRegioes = { ...mockData, regioes: manyRegioes };
    render(<DashboardOperacional data={dataWithManyRegioes} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with empty triagemProcessed object', () => {
    const dataWithEmptyTriagem = { ...mockData, triagemProcessed: {} };
    render(<DashboardOperacional data={dataWithEmptyTriagem} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with triagemProcessed without totals', () => {
    const dataWithTriagemNoTotals = { ...mockData, triagemProcessed: { byMonth: {} } };
    render(<DashboardOperacional data={dataWithTriagemNoTotals} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with zero totalAtendimentos', () => {
    const dataWithZeroTotal = { ...mockData, totalAtendimentos: 0 };
    render(<DashboardOperacional data={dataWithZeroTotal} dateRange={mockDateRange} />);
    expect(screen.getByText('Sem dados para o período selecionado')).toBeInTheDocument();
  });

  it('renders with negative totalAtendimentos', () => {
    const dataWithNegativeTotal = { ...mockData, totalAtendimentos: -100 };
    render(<DashboardOperacional data={dataWithNegativeTotal} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with very small totalAtendimentos', () => {
    const dataWithSmallTotal = { ...mockData, totalAtendimentos: 1 };
    render(<DashboardOperacional data={dataWithSmallTotal} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with very large urgenciasFalsas', () => {
    const dataWithLargeUrgencias = { ...mockData, urgenciasFalsas: 999999999 };
    render(<DashboardOperacional data={dataWithLargeUrgencias} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with empty object triagemProcessed', () => {
    const dataWithEmptyTriagem = { ...mockData, triagemProcessed: {} };
    render(<DashboardOperacional data={dataWithEmptyTriagem} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with triagemProcessed with empty totals', () => {
    const dataWithEmptyTotals = { ...mockData, triagemProcessed: { totals: {} } };
    render(<DashboardOperacional data={dataWithEmptyTotals} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with triagemProcessed with partial totals', () => {
    const dataWithPartialTotals = { ...mockData, triagemProcessed: { totals: { Vermelha: 100 } } };
    render(<DashboardOperacional data={dataWithPartialTotals} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with dateRange with same start and end', () => {
    const sameDate = new Date('2024-01-01');
    const dateRangeSame = { start: sameDate, end: sameDate };
    render(<DashboardOperacional data={mockData} dateRange={dateRangeSame} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with dateRange with reversed dates', () => {
    const dateRangeReversed = { start: new Date('2024-12-31'), end: new Date('2024-01-01') };
    render(<DashboardOperacional data={mockData} dateRange={dateRangeReversed} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with dateRange with invalid dates', () => {
    const dateRangeInvalid = { start: new Date('invalid'), end: new Date('invalid') };
    render(<DashboardOperacional data={mockData} dateRange={dateRangeInvalid} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with very large number of dadosBrutos', () => {
    const manyDadosBrutos = Array(50).fill(mockData.dadosBrutos[0]).map((item, i) => ({ ...item, Período: `2024-${i + 1}` }));
    const dataWithManyDados = { ...mockData, dadosBrutos: manyDadosBrutos };
    render(<DashboardOperacional data={dataWithManyDados} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with instituicoes with missing properties', () => {
    const dataWithMissingProps = { ...mockData, instituicoes: [{ InstituicaoID: 1 }] };
    render(<DashboardOperacional data={dataWithMissingProps} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with regioes with missing properties', () => {
    const dataWithMissingProps = { ...mockData, regioes: [{ RegiaoID: 1 }] };
    render(<DashboardOperacional data={dataWithMissingProps} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with dadosBrutos with missing properties', () => {
    const dataWithMissingProps = { ...mockData, dadosBrutos: [{ Período: '2024-01' }] };
    render(<DashboardOperacional data={dataWithMissingProps} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with empty string totalAtendimentos', () => {
    const dataWithEmptyString = { ...mockData, totalAtendimentos: '' };
    render(<DashboardOperacional data={dataWithEmptyString} dateRange={mockDateRange} />);
    expect(screen.getByText('Sem dados para o período selecionado')).toBeInTheDocument();
  });

  it('renders with string totalAtendimentos', () => {
    const dataWithString = { ...mockData, totalAtendimentos: '100000' };
    render(<DashboardOperacional data={dataWithString} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with zero urgenciasFalsas', () => {
    const dataWithZeroUrgencias = { ...mockData, urgenciasFalsas: 0 };
    render(<DashboardOperacional data={dataWithZeroUrgencias} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with string urgenciasFalsas', () => {
    const dataWithStringUrgencias = { ...mockData, urgenciasFalsas: '30000' };
    render(<DashboardOperacional data={dataWithStringUrgencias} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with null urgenciasFalsas', () => {
    const dataWithNullUrgencias = { ...mockData, urgenciasFalsas: null };
    render(<DashboardOperacional data={dataWithNullUrgencias} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with undefined urgenciasFalsas', () => {
    const dataWithUndefinedUrgencias = { ...mockData, urgenciasFalsas: undefined };
    render(<DashboardOperacional data={dataWithUndefinedUrgencias} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with empty string urgenciasFalsas', () => {
    const dataWithEmptyStringUrgencias = { ...mockData, urgenciasFalsas: '' };
    render(<DashboardOperacional data={dataWithEmptyStringUrgencias} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with NaN urgenciasFalsas', () => {
    const dataWithNaNUrgencias = { ...mockData, urgenciasFalsas: NaN };
    render(<DashboardOperacional data={dataWithNaNUrgencias} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with Infinity urgenciasFalsas', () => {
    const dataWithInfinityUrgencias = { ...mockData, urgenciasFalsas: Infinity };
    render(<DashboardOperacional data={dataWithInfinityUrgencias} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with -Infinity urgenciasFalsas', () => {
    const dataWithNegativeInfinityUrgencias = { ...mockData, urgenciasFalsas: -Infinity };
    render(<DashboardOperacional data={dataWithNegativeInfinityUrgencias} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with object urgenciasFalsas', () => {
    const dataWithObjectUrgencias = { ...mockData, urgenciasFalsas: { value: 30000 } };
    render(<DashboardOperacional data={dataWithObjectUrgencias} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with array urgenciasFalsas', () => {
    const dataWithArrayUrgencias = { ...mockData, urgenciasFalsas: [30000] };
    render(<DashboardOperacional data={dataWithArrayUrgencias} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with boolean urgenciasFalsas', () => {
    const dataWithBooleanUrgencias = { ...mockData, urgenciasFalsas: true };
    render(<DashboardOperacional data={dataWithBooleanUrgencias} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with very small positive urgenciasFalsas', () => {
    const dataWithSmallUrgencias = { ...mockData, urgenciasFalsas: 0.1 };
    render(<DashboardOperacional data={dataWithSmallUrgencias} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with very large decimal urgenciasFalsas', () => {
    const dataWithLargeDecimalUrgencias = { ...mockData, urgenciasFalsas: 999999.99 };
    render(<DashboardOperacional data={dataWithLargeDecimalUrgencias} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with negative decimal urgenciasFalsas', () => {
    const dataWithNegativeDecimalUrgencias = { ...mockData, urgenciasFalsas: -123.45 };
    render(<DashboardOperacional data={dataWithNegativeDecimalUrgencias} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with string number urgenciasFalsas', () => {
    const dataWithStringNumberUrgencias = { ...mockData, urgenciasFalsas: '30000.50' };
    render(<DashboardOperacional data={dataWithStringNumberUrgencias} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with scientific notation urgenciasFalsas', () => {
    const dataWithScientificUrgencias = { ...mockData, urgenciasFalsas: 3e4 };
    render(<DashboardOperacional data={dataWithScientificUrgencias} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with negative scientific notation urgenciasFalsas', () => {
    const dataWithNegativeScientificUrgencias = { ...mockData, urgenciasFalsas: -3e4 };
    render(<DashboardOperacional data={dataWithNegativeScientificUrgencias} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with hex number urgenciasFalsas', () => {
    const dataWithHexUrgencias = { ...mockData, urgenciasFalsas: 0x7530 };
    render(<DashboardOperacional data={dataWithHexUrgencias} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with octal number urgenciasFalsas', () => {
    const dataWithOctalUrgencias = { ...mockData, urgenciasFalsas: 0o7530 };
    render(<DashboardOperacional data={dataWithOctalUrgencias} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with binary number urgenciasFalsas', () => {
    const dataWithBinaryUrgencias = { ...mockData, urgenciasFalsas: 0b1010101010101010 };
    render(<DashboardOperacional data={dataWithBinaryUrgencias} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with very small negative urgenciasFalsas', () => {
    const dataWithSmallNegativeUrgencias = { ...mockData, urgenciasFalsas: -0.0001 };
    render(<DashboardOperacional data={dataWithSmallNegativeUrgencias} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with null dateRange start', () => {
    const dateRangeWithNullStart = { start: null, end: new Date('2024-12-31') };
    render(<DashboardOperacional data={mockData} dateRange={dateRangeWithNullStart} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with null dateRange end', () => {
    const dateRangeWithNullEnd = { start: new Date('2024-01-01'), end: null };
    render(<DashboardOperacional data={mockData} dateRange={dateRangeWithNullEnd} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with undefined dateRange start', () => {
    const dateRangeWithUndefinedStart = { start: undefined, end: new Date('2024-12-31') };
    render(<DashboardOperacional data={mockData} dateRange={dateRangeWithUndefinedStart} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });

  it('renders with undefined dateRange end', () => {
    const dateRangeWithUndefinedEnd = { start: new Date('2024-01-01'), end: undefined };
    render(<DashboardOperacional data={mockData} dateRange={dateRangeWithUndefinedEnd} />);
    expect(screen.getByText(/Total Atendimentos/i)).toBeInTheDocument();
  });
});
