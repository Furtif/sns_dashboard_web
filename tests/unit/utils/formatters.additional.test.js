/**
 * Testes adicionais para formatters
 */
import { formatCurrency, formatNumber, formatDecimal, formatPercent } from '../../../src/utils/formatters';

describe('formatters - casos edge', () => {
  describe('formatCurrency', () => {
    it('handles null', () => {
      expect(formatCurrency(null)).toBe('0 €');
    });

    it('handles undefined', () => {
      expect(formatCurrency(undefined)).toBe('0 €');
    });

    it('handles NaN', () => {
      expect(formatCurrency(NaN)).toBe('0 €');
    });

    it('handles negative numbers', () => {
      expect(formatCurrency(-1000)).toBe('-1.000 €');
    });

    it('handles very large numbers', () => {
      expect(formatCurrency(1000000000)).toBe('1.000.000.000 €');
    });

    it('handles decimals by rounding', () => {
      expect(formatCurrency(1000.5)).toBe('1.001 €');
      expect(formatCurrency(1000.4)).toBe('1.000 €');
    });
  });

  describe('formatNumber', () => {
    it('handles null', () => {
      expect(formatNumber(null)).toBe('0');
    });

    it('handles undefined', () => {
      expect(formatNumber(undefined)).toBe('0');
    });

    it('handles NaN', () => {
      expect(formatNumber(NaN)).toBe('0');
    });

    it('handles negative numbers', () => {
      expect(formatNumber(-5000)).toBe('-5.000');
    });

    it('formats thousands correctly', () => {
      expect(formatNumber(1000)).toBe('1.000');
      expect(formatNumber(1000000)).toBe('1.000.000');
    });
  });

  describe('formatDecimal', () => {
    it('handles null', () => {
      expect(formatDecimal(null)).toBe('0,00');
    });

    it('handles undefined', () => {
      expect(formatDecimal(undefined)).toBe('0,00');
    });

    it('handles NaN', () => {
      expect(formatDecimal(NaN)).toBe('0,00');
    });

    it('formats with comma as decimal separator', () => {
      expect(formatDecimal(1.5)).toBe('1,50');
      expect(formatDecimal(2.375)).toBe('2,38');
    });

    it('formats whole numbers with zeros', () => {
      expect(formatDecimal(5)).toBe('5,00');
    });
  });

  describe('formatPercent', () => {
    it('handles null', () => {
      expect(formatPercent(null)).toBe('0,0%');
    });

    it('handles undefined', () => {
      expect(formatPercent(undefined)).toBe('0,0%');
    });

    it('handles NaN', () => {
      expect(formatPercent(NaN)).toBe('0,0%');
    });

    it('formats with comma decimal separator', () => {
      expect(formatPercent(25.5)).toBe('25,5%');
    });

    it('formats with one decimal place', () => {
      expect(formatPercent(33.333)).toBe('33,3%');
    });
  });
});
