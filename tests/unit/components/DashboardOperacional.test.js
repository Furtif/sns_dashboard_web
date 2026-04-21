/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import DashboardOperacional from '../../../src/components/DashboardOperacional';

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
});
