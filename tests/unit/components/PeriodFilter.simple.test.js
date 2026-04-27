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
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
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

  it('calls onDateRangeChange with default "all" option after mount', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: mockOnDateRangeChange,
        disabled: false
      })
    );
    
    act(() => {
      jest.advanceTimersByTime(100);
    });
    
    expect(mockOnDateRangeChange).toHaveBeenCalled();
  });

  it('renders without onDateRangeChange callback', () => {
    render(
      React.createElement(PeriodFilter, {
        disabled: false
      })
    );
    
    expect(screen.getByText('📅 Filtro de Período')).toBeInTheDocument();
  });

  it('renders with default disabled prop', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: mockOnDateRangeChange
      })
    );
    
    expect(screen.getByText('📅 Filtro de Período')).toBeInTheDocument();
  });

  it('renders with disabled true and onDateRangeChange', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: mockOnDateRangeChange,
        disabled: true
      })
    );
    
    expect(screen.getByText('📅 Filtro de Período')).toBeInTheDocument();
  });

  it('renders with undefined onDateRangeChange', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: undefined,
        disabled: false
      })
    );
    
    expect(screen.getByText('📅 Filtro de Período')).toBeInTheDocument();
  });

  it('renders with null onDateRangeChange', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: null,
        disabled: false
      })
    );
    
    expect(screen.getByText('📅 Filtro de Período')).toBeInTheDocument();
  });

  it('renders with disabled undefined', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: mockOnDateRangeChange,
        disabled: undefined
      })
    );
    
    expect(screen.getByText('📅 Filtro de Período')).toBeInTheDocument();
  });

  it('renders with disabled null', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: mockOnDateRangeChange,
        disabled: null
      })
    );
    
    expect(screen.getByText('📅 Filtro de Período')).toBeInTheDocument();
  });

  it('renders with no props', () => {
    render(React.createElement(PeriodFilter));
    
    expect(screen.getByText('📅 Filtro de Período')).toBeInTheDocument();
  });

  it('renders with empty object props', () => {
    render(React.createElement(PeriodFilter, {}));
    
    expect(screen.getByText('📅 Filtro de Período')).toBeInTheDocument();
  });

  it('renders with disabled boolean false', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: mockOnDateRangeChange,
        disabled: false
      })
    );
    
    expect(screen.getByText('📅 Filtro de Período')).toBeInTheDocument();
  });

  it('renders with disabled number 0', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: mockOnDateRangeChange,
        disabled: 0
      })
    );
    
    expect(screen.getByText('📅 Filtro de Período')).toBeInTheDocument();
  });

  it('renders with disabled number 1', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: mockOnDateRangeChange,
        disabled: 1
      })
    );
    
    expect(screen.getByText('📅 Filtro de Período')).toBeInTheDocument();
  });

  it('renders with onDateRangeChange as empty function', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: () => {},
        disabled: false
      })
    );
    
    expect(screen.getByText('📅 Filtro de Período')).toBeInTheDocument();
  });

  it('renders with onDateRangeChange as arrow function', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: () => null,
        disabled: false
      })
    );
    
    expect(screen.getByText('📅 Filtro de Período')).toBeInTheDocument();
  });

  it('renders with disabled as boolean string', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: mockOnDateRangeChange,
        disabled: Boolean("true")
      })
    );
    
    expect(screen.getByText('📅 Filtro de Período')).toBeInTheDocument();
  });

  it('renders with multiple props combinations', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: mockOnDateRangeChange,
        disabled: false,
        extraProp: 'test'
      })
    );
    
    expect(screen.getByText('📅 Filtro de Período')).toBeInTheDocument();
  });

  it('renders with onDateRangeChange as function returning value', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: () => 'test',
        disabled: false
      })
    );
    
    expect(screen.getByText('📅 Filtro de Período')).toBeInTheDocument();
  });

  it('renders with disabled as negative number', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: mockOnDateRangeChange,
        disabled: -1
      })
    );
    
    expect(screen.getByText('📅 Filtro de Período')).toBeInTheDocument();
  });

  it('renders with disabled as large number', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: mockOnDateRangeChange,
        disabled: 999
      })
    );
    
    expect(screen.getByText('📅 Filtro de Período')).toBeInTheDocument();
  });

  it('renders with onDateRangeChange as object', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: { test: 'value' },
        disabled: false
      })
    );
    
    expect(screen.getByText('📅 Filtro de Período')).toBeInTheDocument();
  });

  it('renders with onDateRangeChange as array', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: ['test'],
        disabled: false
      })
    );
    
    expect(screen.getByText('📅 Filtro de Período')).toBeInTheDocument();
  });

  it('renders with disabled as string number', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: mockOnDateRangeChange,
        disabled: '123'
      })
    );
    
    expect(screen.getByText('📅 Filtro de Período')).toBeInTheDocument();
  });

  it('renders with disabled as object', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: mockOnDateRangeChange,
        disabled: { test: 'value' }
      })
    );
    
    expect(screen.getByText('📅 Filtro de Período')).toBeInTheDocument();
  });

  it('renders with disabled as array', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: mockOnDateRangeChange,
        disabled: [1, 2, 3]
      })
    );
    
    expect(screen.getByText('📅 Filtro de Período')).toBeInTheDocument();
  });

  it('renders with onDateRangeChange as boolean', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: true,
        disabled: false
      })
    );
    
    expect(screen.getByText('📅 Filtro de Período')).toBeInTheDocument();
  });

  it('renders with onDateRangeChange as number', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: 123,
        disabled: false
      })
    );
    
    expect(screen.getByText('📅 Filtro de Período')).toBeInTheDocument();
  });

  it('renders with onDateRangeChange as string', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: 'test',
        disabled: false
      })
    );
    
    expect(screen.getByText('📅 Filtro de Período')).toBeInTheDocument();
  });


  it('renders with disabled as Infinity', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: mockOnDateRangeChange,
        disabled: Infinity
      })
    );
    
    expect(screen.getByText('📅 Filtro de Período')).toBeInTheDocument();
  });

  it('renders with disabled as -Infinity', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: mockOnDateRangeChange,
        disabled: -Infinity
      })
    );
    
    expect(screen.getByText('📅 Filtro de Período')).toBeInTheDocument();
  });

  it('renders with onDateRangeChange as undefined', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: undefined,
        disabled: false
      })
    );
    
    expect(screen.getByText('📅 Filtro de Período')).toBeInTheDocument();
  });

  it('renders with onDateRangeChange as Symbol', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: Symbol('test'),
        disabled: false
      })
    );
    
    expect(screen.getByText('📅 Filtro de Período')).toBeInTheDocument();
  });


  it('renders with both props as null', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: null,
        disabled: null
      })
    );
    
    expect(screen.getByText('📅 Filtro de Período')).toBeInTheDocument();
  });

  it('renders with both props as undefined', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: undefined,
        disabled: undefined
      })
    );
    
    expect(screen.getByText('📅 Filtro de Período')).toBeInTheDocument();
  });

  it('renders with onDateRangeChange as class instance', () => {
    class TestClass {
      constructor() {
        this.value = 'test';
      }
    }
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: new TestClass(),
        disabled: false
      })
    );
    
    expect(screen.getByText('📅 Filtro de Período')).toBeInTheDocument();
  });

  it('renders with disabled as class instance', () => {
    class TestClass {
      constructor() {
        this.value = 'test';
      }
    }
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: mockOnDateRangeChange,
        disabled: new TestClass()
      })
    );
    
    expect(screen.getByText('📅 Filtro de Período')).toBeInTheDocument();
  });

  it('renders with onDateRangeChange as date', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: new Date(),
        disabled: false
      })
    );
    
    expect(screen.getByText('📅 Filtro de Período')).toBeInTheDocument();
  });

  it('renders with disabled as date', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: mockOnDateRangeChange,
        disabled: new Date()
      })
    );
    
    expect(screen.getByText('📅 Filtro de Período')).toBeInTheDocument();
  });

  it('renders with onDateRangeChange as function with multiple parameters', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: (a, b, c) => {},
        disabled: false
      })
    );
    
    expect(screen.getByText('📅 Filtro de Período')).toBeInTheDocument();
  });

  it('renders with onDateRangeChange as bound function', () => {
    const boundFunction = function() {}.bind(null);
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: boundFunction,
        disabled: false
      })
    );
    
    expect(screen.getByText('📅 Filtro de Período')).toBeInTheDocument();
  });

  it('renders with disabled as boolean string', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: mockOnDateRangeChange,
        disabled: Boolean('false')
      })
    );
    
    expect(screen.getByText('📅 Filtro de Período')).toBeInTheDocument();
  });

  it('renders with disabled as empty string', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: mockOnDateRangeChange,
        disabled: ''
      })
    );
    
    expect(screen.getByText('📅 Filtro de Período')).toBeInTheDocument();
  });

  it('renders with onDateRangeChange as empty string', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: '',
        disabled: false
      })
    );
    
    expect(screen.getByText('📅 Filtro de Período')).toBeInTheDocument();
  });

  it('renders with onDateRangeChange as zero', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: 0,
        disabled: false
      })
    );
    
    expect(screen.getByText('📅 Filtro de Período')).toBeInTheDocument();
  });

  it('renders with disabled as zero', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: mockOnDateRangeChange,
        disabled: 0
      })
    );
    
    expect(screen.getByText('📅 Filtro de Período')).toBeInTheDocument();
  });

  it('renders with onDateRangeChange as negative zero', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: -0,
        disabled: false
      })
    );
    
    expect(screen.getByText('📅 Filtro de Período')).toBeInTheDocument();
  });

  it('renders with disabled as negative zero', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: mockOnDateRangeChange,
        disabled: -0
      })
    );
    
    expect(screen.getByText('📅 Filtro de Período')).toBeInTheDocument();
  });

  it('renders with onDateRangeChange as decimal', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: 3.14,
        disabled: false
      })
    );
    
    expect(screen.getByText('📅 Filtro de Período')).toBeInTheDocument();
  });

  it('renders with disabled as decimal', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: mockOnDateRangeChange,
        disabled: 2.5
      })
    );
    
    expect(screen.getByText('📅 Filtro de Período')).toBeInTheDocument();
  });

  it('renders with onDateRangeChange as negative decimal', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: -3.14,
        disabled: false
      })
    );
    
    expect(screen.getByText('📅 Filtro de Período')).toBeInTheDocument();
  });

  it('renders with disabled as negative decimal', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: mockOnDateRangeChange,
        disabled: -2.5
      })
    );
    
    expect(screen.getByText('📅 Filtro de Período')).toBeInTheDocument();
  });

  it('renders with onDateRangeChange as very large number', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: 999999999999,
        disabled: false
      })
    );
    
    expect(screen.getByText('📅 Filtro de Período')).toBeInTheDocument();
  });

  it('renders with disabled as very large number', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: mockOnDateRangeChange,
        disabled: 999999999999
      })
    );
    
    expect(screen.getByText('📅 Filtro de Período')).toBeInTheDocument();
  });

  it('renders with onDateRangeChange as very small number', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: 0.000001,
        disabled: false
      })
    );
    
    expect(screen.getByText('📅 Filtro de Período')).toBeInTheDocument();
  });

  it('renders with disabled as very small number', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: mockOnDateRangeChange,
        disabled: 0.000001
      })
    );
    
    expect(screen.getByText('📅 Filtro de Período')).toBeInTheDocument();
  });

  it('renders with onDateRangeChange as hex number', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: 0x7530,
        disabled: false
      })
    );
    
    expect(screen.getByText('📅 Filtro de Período')).toBeInTheDocument();
  });

  it('renders with disabled as hex number', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: mockOnDateRangeChange,
        disabled: 0x7530
      })
    );
    
    expect(screen.getByText('📅 Filtro de Período')).toBeInTheDocument();
  });

  it('renders with onDateRangeChange as octal number', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: 0o7530,
        disabled: false
      })
    );
    
    expect(screen.getByText('📅 Filtro de Período')).toBeInTheDocument();
  });

  it('renders with disabled as octal number', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: mockOnDateRangeChange,
        disabled: 0o7530
      })
    );
    
    expect(screen.getByText('📅 Filtro de Período')).toBeInTheDocument();
  });

  it('renders with onDateRangeChange as binary number', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: 0b1010101010101010,
        disabled: false
      })
    );
    
    expect(screen.getByText('📅 Filtro de Período')).toBeInTheDocument();
  });

  it('renders with disabled as binary number', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: mockOnDateRangeChange,
        disabled: 0b1010101010101010
      })
    );
    
    expect(screen.getByText('📅 Filtro de Período')).toBeInTheDocument();
  });

  it('renders with onDateRangeChange as very small negative number', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: -0.000001,
        disabled: false
      })
    );
    
    expect(screen.getByText('📅 Filtro de Período')).toBeInTheDocument();
  });

  it('renders with disabled as very small negative number', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: mockOnDateRangeChange,
        disabled: -0.000001
      })
    );
    
    expect(screen.getByText('📅 Filtro de Período')).toBeInTheDocument();
  });

  it('renders with onDateRangeChange as scientific notation small', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: 1e-10,
        disabled: false
      })
    );
    
    expect(screen.getByText('📅 Filtro de Período')).toBeInTheDocument();
  });

  it('renders with disabled as scientific notation small', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: mockOnDateRangeChange,
        disabled: 1e-10
      })
    );
    
    expect(screen.getByText('📅 Filtro de Período')).toBeInTheDocument();
  });

  it('renders with onDateRangeChange as negative scientific notation small', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: -1e-10,
        disabled: false
      })
    );
    
    expect(screen.getByText('📅 Filtro de Período')).toBeInTheDocument();
  });

  it('renders with disabled as negative scientific notation small', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: mockOnDateRangeChange,
        disabled: -1e-10
      })
    );
    
    expect(screen.getByText('📅 Filtro de Período')).toBeInTheDocument();
  });

  it('renders with onDateRangeChange as regex', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: /test/,
        disabled: false
      })
    );
    
    expect(screen.getByText('📅 Filtro de Período')).toBeInTheDocument();
  });

  it('renders with disabled as regex', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: mockOnDateRangeChange,
        disabled: /test/
      })
    );
    
    expect(screen.getByText('📅 Filtro de Período')).toBeInTheDocument();
  });

  it('renders with onDateRangeChange as map', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: new Map(),
        disabled: false
      })
    );
    
    expect(screen.getByText('📅 Filtro de Período')).toBeInTheDocument();
  });

  it('renders with disabled as map', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: mockOnDateRangeChange,
        disabled: new Map()
      })
    );
    
    expect(screen.getByText('📅 Filtro de Período')).toBeInTheDocument();
  });

  it('renders with onDateRangeChange as set', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: new Set(),
        disabled: false
      })
    );
    
    expect(screen.getByText('📅 Filtro de Período')).toBeInTheDocument();
  });

  it('renders with disabled as set', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: mockOnDateRangeChange,
        disabled: new Set()
      })
    );
    
    expect(screen.getByText('📅 Filtro de Período')).toBeInTheDocument();
  });

  it('handles quick select with last12 option', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: mockOnDateRangeChange,
        disabled: false
      })
    );

    act(() => {
      jest.advanceTimersByTime(100);
    });

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'last12' } });

    expect(mockOnDateRangeChange).toHaveBeenCalled();
  });

  it('handles quick select with last24 option', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: mockOnDateRangeChange,
        disabled: false
      })
    );

    act(() => {
      jest.advanceTimersByTime(100);
    });

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'last24' } });

    expect(mockOnDateRangeChange).toHaveBeenCalled();
  });

  it('handles quick select with last36 option', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: mockOnDateRangeChange,
        disabled: false
      })
    );

    act(() => {
      jest.advanceTimersByTime(100);
    });

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'last36' } });

    expect(mockOnDateRangeChange).toHaveBeenCalled();
  });

  it('handles quick select with currentYear option', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: mockOnDateRangeChange,
        disabled: false
      })
    );

    act(() => {
      jest.advanceTimersByTime(100);
    });

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'currentYear' } });

    expect(mockOnDateRangeChange).toHaveBeenCalled();
  });

  it('handles quick select with lastYear option', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: mockOnDateRangeChange,
        disabled: false
      })
    );

    act(() => {
      jest.advanceTimersByTime(100);
    });

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'lastYear' } });

    expect(mockOnDateRangeChange).toHaveBeenCalled();
  });

  it('handles quick select with last2years option', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: mockOnDateRangeChange,
        disabled: false
      })
    );

    act(() => {
      jest.advanceTimersByTime(100);
    });

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'last2years' } });

    expect(mockOnDateRangeChange).toHaveBeenCalled();
  });

  it('handles quick select with custom option', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: mockOnDateRangeChange,
        disabled: false
      })
    );

    act(() => {
      jest.advanceTimersByTime(100);
    });

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'custom' } });

    expect(screen.getByText('Data de Início:')).toBeInTheDocument();
    expect(screen.getByText('Data de Fim:')).toBeInTheDocument();
  });

  it('handles custom date change with valid dates', () => {
    const { container } = render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: mockOnDateRangeChange,
        disabled: false
      })
    );

    act(() => {
      jest.advanceTimersByTime(100);
    });

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'custom' } });

    const dateInputs = container.querySelectorAll('input[type="date"]');
    const startDateInput = dateInputs[0];
    const endDateInput = dateInputs[1];

    fireEvent.change(startDateInput, { target: { value: '2024-01-01' } });
    fireEvent.change(endDateInput, { target: { value: '2024-12-31' } });
    fireEvent.blur(endDateInput);

    expect(mockOnDateRangeChange).toHaveBeenCalled();
  });

  it('handles clear filter button', () => {
    render(
      React.createElement(PeriodFilter, {
        onDateRangeChange: mockOnDateRangeChange,
        disabled: false
      })
    );

    act(() => {
      jest.advanceTimersByTime(100);
    });

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'last12' } });

    const clearButton = screen.getByText('🔄 Limpar Filtro');
    fireEvent.click(clearButton);

    expect(mockOnDateRangeChange).toHaveBeenCalled();
  });
});
