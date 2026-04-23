import { formatCurrency, formatNumber, formatDecimal, formatPercent, formatPeriodRange } from '../../../src/utils/formatters';

describe('formatters', () => {
  describe('formatCurrency', () => {
    it('formats a number as Portuguese currency', () => {
      expect(formatCurrency(1000)).toBe('1.000 €');
      expect(formatCurrency(3089796720)).toBe('3.089.796.720 €');
    });

    it('handles null, undefined and NaN values', () => {
      expect(formatCurrency(null)).toBe('0 €');
      expect(formatCurrency(undefined)).toBe('0 €');
      expect(formatCurrency(NaN)).toBe('0 €');
    });

    it('rounds decimal values', () => {
      expect(formatCurrency(1000.6)).toBe('1.001 €');
      expect(formatCurrency(1000.4)).toBe('1.000 €');
    });
  });

  describe('formatNumber', () => {
    it('formats a number with thousand separators', () => {
      expect(formatNumber(1382484)).toBe('1.382.484');
      expect(formatNumber(1000)).toBe('1.000');
    });

    it('handles invalid values', () => {
      expect(formatNumber(null)).toBe('0');
      expect(formatNumber(undefined)).toBe('0');
      expect(formatNumber(NaN)).toBe('0');
    });
  });

  describe('formatDecimal', () => {
    it('formats a number with 2 decimal places using comma', () => {
      expect(formatDecimal(1.5)).toBe('1,50');
      expect(formatDecimal(1.56)).toBe('1,56');
    });

    it('handles invalid values', () => {
      expect(formatDecimal(null)).toBe('0,00');
      expect(formatDecimal(undefined)).toBe('0,00');
    });
  });

  describe('formatPercent', () => {
    it('formats a number as percentage with 1 decimal', () => {
      expect(formatPercent(15.5)).toBe('15,5%');
      expect(formatPercent(0)).toBe('0,0%');
    });

    it('handles invalid values', () => {
      expect(formatPercent(null)).toBe('0,0%');
      expect(formatPercent(undefined)).toBe('0,0%');
    });
  });

  describe('formatPeriodRange', () => {
    it('formats a date range as year range', () => {
      const dateRange = { start: new Date(2020, 0, 1), end: new Date(2025, 11, 31) };
      expect(formatPeriodRange(dateRange)).toBe('2020-2025');
    });

    it('returns default range when dateRange is null', () => {
      expect(formatPeriodRange(null)).toBe('2016-2026');
    });

    it('returns default range when dateRange is undefined', () => {
      expect(formatPeriodRange(undefined)).toBe('2016-2026');
    });

    it('returns default range when start or end is missing', () => {
      expect(formatPeriodRange({ start: new Date(2020, 0, 1) })).toBe('2016-2026');
      expect(formatPeriodRange({ end: new Date(2025, 11, 31) })).toBe('2016-2026');
    });
  });
});
