const DAY_MS = 24 * 60 * 60 * 1000;

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export function formatDate(value: string | Date): string {
  const date = typeof value === 'string' ? new Date(value) : value;
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

function startOfDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

export function daysSince(dateISO: string, now: Date = new Date()): number {
  const diff = startOfDay(now) - startOfDay(new Date(dateISO));
  return Math.max(0, Math.round(diff / DAY_MS));
}

export function toEntryISO(date: Date, now: Date = new Date()): string {
  const midday = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    12,
  );
  return (midday > now ? now : midday).toISOString();
}

export { DAY_MS };
