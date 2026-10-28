// All unit conversion and number formatting lives here.
// The server stores kg and mm; anything else is display only.

export type WeightUnit = 'kg' | 'lb';

const LB_PER_KG = 2.20462262;
const MM_PER_CM = 10;

export function kgToLb(kg: number): number {
  return kg * LB_PER_KG;
}

export function convertWeight(kg: number, unit: WeightUnit): number {
  return unit === 'lb' ? kgToLb(kg) : kg;
}

export function mmToCm(mm: number): number {
  return mm / MM_PER_CM;
}

/** Rounds for display. Never shows "-0.0". */
export function formatNumber(value: number, decimals = 1): string {
  const rounded = Number(value.toFixed(decimals));
  return (Object.is(rounded, -0) ? 0 : rounded).toFixed(decimals);
}

/** Like formatNumber, but adds a "+" for positive values. */
export function formatSigned(value: number, decimals = 1): string {
  const text = formatNumber(value, decimals);
  return Number(text) > 0 ? `+${text}` : text;
}

export function formatWeight(kg: number, unit: WeightUnit): string {
  return `${formatNumber(convertWeight(kg, unit))} ${unit}`;
}

export function formatWeightChange(kgDelta: number, unit: WeightUnit): string {
  return `${formatSigned(convertWeight(kgDelta, unit))} ${unit}`;
}

export function formatGirth(mm: number): string {
  return `${formatNumber(mmToCm(mm))} cm`;
}

export function formatGirthChange(mmDelta: number): string {
  return `${formatSigned(mmToCm(mmDelta))} cm`;
}
