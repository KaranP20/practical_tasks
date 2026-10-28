import { DAY_MS } from './date';

export type RangeKey = '7D' | '30D' | '90D' | 'ALL';

export const RANGE_OPTIONS: { value: RangeKey; label: string }[] = [
  { value: '7D', label: '7D' },
  { value: '30D', label: '30D' },
  { value: '90D', label: '90D' },
  { value: 'ALL', label: 'All' },
];

const RANGE_DAYS: Record<Exclude<RangeKey, 'ALL'>, number> = {
  '7D': 7,
  '30D': 30,
  '90D': 90,
};

/** Value for the `from` query param. `undefined` means no filter. */
export function getRangeStartISO(
  range: RangeKey,
  now: Date = new Date(),
): string | undefined {
  if (range === 'ALL') {
    return undefined;
  }
  return new Date(now.getTime() - RANGE_DAYS[range] * DAY_MS).toISOString();
}

export function isInRange(
  dateISO: string,
  range: RangeKey,
  now: Date = new Date(),
): boolean {
  const from = getRangeStartISO(range, now);
  return !from || Date.parse(dateISO) >= Date.parse(from);
}

/** "the last 30 days" */
export function describeRange(range: Exclude<RangeKey, 'ALL'>): string {
  return `the last ${RANGE_DAYS[range]} days`;
}
