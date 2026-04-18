/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import PeriodFilter from '../../../src/components/PeriodFilter';

describe('PeriodFilter Simple Tests', () => {
  const mockOnDateRangeChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: mockOnDateRangeChange,
        disabled: false
      })
    );
    
    expect(screen.getByText('📅 Filtro de Período')).toBeInTheDocument();
  });

  it('renders with disabled state', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: mockOnDateRangeChange,
        disabled: true
      })
    );
    
    expect(screen.getByText('📅 Filtro de Período')).toBeInTheDocument();
  });

  it('displays quick select dropdown', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: mockOnDateRangeChange,
        disabled: false
      })
    );
    
    expect(screen.getByText('Seleção Rápida:')).toBeInTheDocument();
  });

  it('contains all quick select options', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: mockOnDateRangeChange,
        disabled: false
      })
    );
    
    expect(screen.getByText('Últimos 12 meses')).toBeInTheDocument();
    expect(screen.getByText('Últimos 24 meses')).toBeInTheDocument();
    expect(screen.getByText('Todo o período (2016-2026)')).toBeInTheDocument();
    expect(screen.getByText('Personalizado')).toBeInTheDocument();
  });

  it('has date input fields', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: mockOnDateRangeChange,
        disabled: false
      })
    );
    
    expect(screen.getByText('Data de Início:')).toBeInTheDocument();
    expect(screen.getByText('Data de Fim:')).toBeInTheDocument();
  });

  it('displays info section', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: mockOnDateRangeChange,
        disabled: false
      })
    );
    
    expect(screen.getByText('ℹ️ Informações:')).toBeInTheDocument();
    expect(screen.getByText(/Período completo dos dados:/i)).toBeInTheDocument();
  });
});
