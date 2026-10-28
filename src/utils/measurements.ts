type Dated = { id: string; dateISO: string };

export function sortNewestFirst<T extends Dated>(items: readonly T[]): T[] {
  return [...items].sort((a, b) => {
    const diff = Date.parse(b.dateISO) - Date.parse(a.dateISO);
    return diff !== 0 ? diff : b.id.localeCompare(a.id);
  });
}

export type RowWithChange<T> = {
  entry: T;
  change: number | null;
};

export function withChanges<T>(
  newestFirst: readonly T[],
  getValue: (entry: T) => number,
): RowWithChange<T>[] {
  return newestFirst.map((entry, index) => {
    const previous = newestFirst[index + 1];
    return {
      entry,
      change: previous ? getValue(entry) - getValue(previous) : null,
    };
  });
}

export function getTotalChange<T>(
  newestFirst: readonly T[],
  getValue: (entry: T) => number,
): number | null {
  if (newestFirst.length < 2) {
    return null;
  }
  return getValue(newestFirst[0]) - getValue(newestFirst[newestFirst.length - 1]);
}
