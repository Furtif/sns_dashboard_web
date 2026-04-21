/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import DashboardExecutivo from '../../../src/components/DashboardExecutivo';

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
});
