/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import DashboardRH from '../../../src/components/DashboardRH';

const mockData = {
  totalAtendimentos: 100000,
  instituicoes: [
    { InstituicaoID: 1, InstituicaoNome: 'Hospital A', Tipo: 'Hospital Central' },
    { InstituicaoID: 2, InstituicaoNome: 'Hospital B', Tipo: 'Hospital Distrital' }
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
      Médicos: 100,
      MedicosInternos: 20,
      Enfermeiros: 200
    },
    {
      Período: '2024-02',
      InstituicaoID: 1,
      RegiaoID: 1,
      TotalAtendimentos: 5200,
      Médicos: 105,
      MedicosInternos: 22,
      Enfermeiros: 205
    }
  ],
  trabalhadoresProcessed: {
    totals: {
      medicos: 1000,
      medicosInternos: 200,
      enfermeiros: 2000,
      tecnicosSuperioresSaude: 500,
      farmaceuticos: 150,
      farmaceuticosResidentes: 50,
      tsdt: 800,
      assistentesTecnicos: 600,
      assistentesOperacionais: 1200,
      tecnicosAuxiliares: 400,
      informaticos: 100,
      outros: 300,
      total: 7300
    },
    byInstitution: [
      { name: 'Hospital A', region: 'Norte', total: 5000, medicos: 500, medicosInternos: 100, enfermeiros: 1000 },
      { name: 'Hospital B', region: 'Lisboa', total: 3000, medicos: 300, medicosInternos: 60, enfermeiros: 600 }
    ]
  }
};

const mockDateRange = {
  start: new Date('2024-01-01'),
  end: new Date('2024-12-31')
};

describe('DashboardRH', () => {
  it('renders without data message when no data provided', () => {
    render(<DashboardRH data={{}} />);
    expect(screen.getByText('Sem dados para o período selecionado')).toBeInTheDocument();
  });

  it('renders without data message when instituicoes is empty array', () => {
    render(<DashboardRH data={{ instituicoes: [] }} />);
    expect(screen.getByText('Sem dados para o período selecionado')).toBeInTheDocument();
  });

  it('renders without data message when totalAtendimentos is 0', () => {
    render(<DashboardRH data={{ totalAtendimentos: 0 }} />);
    expect(screen.getByText('Sem dados para o período selecionado')).toBeInTheDocument();
  });

  it('renders dashboard title when data is null', () => {
    render(<DashboardRH data={null} />);
    expect(screen.getByText('👥 Dashboard Recursos Humanos')).toBeInTheDocument();
    expect(screen.getByText('Sem dados para o período selecionado')).toBeInTheDocument();
  });

  it('renders KPIs when data is provided', () => {
    render(<DashboardRH data={mockData} dateRange={mockDateRange} />);
    expect(screen.getByText(/Total Profissionais/i)).toBeInTheDocument();
  });
});
