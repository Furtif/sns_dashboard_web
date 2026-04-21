/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import DashboardFinanceiro from '../../../src/components/DashboardFinanceiro';

describe('DashboardFinanceiro', () => {
  it('renders without data message when no data provided', () => {
    render(<DashboardFinanceiro data={{}} />);
    expect(screen.getByText('Sem dados para o período selecionado')).toBeInTheDocument();
  });

  it('renders without data message when totalAtendimentos is 0', () => {
    render(<DashboardFinanceiro data={{ totalAtendimentos: 0 }} />);
    expect(screen.getByText('Sem dados para o período selecionado')).toBeInTheDocument();
  });
});
