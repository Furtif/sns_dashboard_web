/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import DashboardRH from '../../../src/components/DashboardRH';

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
});
