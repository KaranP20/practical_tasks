import {
  convertWeight,
  formatGirth,
  formatGirthChange,
  formatNumber,
  formatSigned,
  formatWeight,
  formatWeightChange,
  mmToCm,
} from '../src/utils/units';

describe('weight', () => {
  it('converts kg to lb', () => {
    expect(convertWeight(86, 'lb')).toBeCloseTo(189.6, 1);
    expect(convertWeight(86, 'kg')).toBe(86);
  });

  it('formats for display without float noise', () => {
    expect(formatWeight(86.49999999999999, 'kg')).toBe('86.5 kg');
    expect(formatWeight(86, 'kg')).toBe('86.0 kg');
    expect(formatWeight(86, 'lb')).toBe('189.6 lb');
  });

  it('toggling the unit does not touch the stored value', () => {
    const storedKg = 86.5;
    formatWeight(storedKg, 'lb');
    expect(formatWeight(storedKg, 'kg')).toBe('86.5 kg');
  });

  it('shows a signed change', () => {
    // 70.0 - 70.1 is -0.0999... in floating point
    expect(formatWeightChange(70.0 - 70.1, 'kg')).toBe('-0.1 kg');
    expect(formatWeightChange(1.2, 'kg')).toBe('+1.2 kg');
    expect(formatWeightChange(-6.4, 'kg')).toBe('-6.4 kg');
  });
});

describe('girth', () => {
  it('converts millimetres to centimetres', () => {
    expect(mmToCm(1012)).toBe(101.2);
    expect(formatGirth(1012)).toBe('101.2 cm');
    expect(formatGirth(946)).toBe('94.6 cm');
  });

  it('formats a change in cm', () => {
    expect(formatGirthChange(946 - 1012)).toBe('-6.6 cm');
  });
});

describe('number formatting', () => {
  it('never shows a negative zero', () => {
    expect(formatNumber(-0.04)).toBe('0.0');
    expect(formatSigned(-0.04)).toBe('0.0');
    expect(formatSigned(0)).toBe('0.0');
  });
});
