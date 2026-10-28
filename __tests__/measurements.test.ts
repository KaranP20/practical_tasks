import {
  getTotalChange,
  sortNewestFirst,
  withChanges,
} from '../src/utils/measurements';

type Entry = { id: string; dateISO: string; weightKg: number };

const entry = (id: string, dateISO: string, weightKg: number): Entry => ({
  id,
  dateISO,
  weightKg,
});
const getKg = (e: Entry) => e.weightKg;

// Same shape as client c4 in db.json: out of order, two entries on one day.
const messy: Entry[] = [
  entry('w_1016', '2026-07-17T09:00:00.000Z', 70.1),
  entry('w_1017', '2026-06-19T09:00:00.000Z', 71.6),
  entry('w_1018', '2026-07-26T09:00:00.000Z', 70.0),
  entry('w_1020', '2026-07-10T09:00:00.000Z', 70.4),
  entry('w_1021', '2026-07-10T15:00:00.000Z', 70.7),
];

describe('sortNewestFirst', () => {
  it('sorts by date, newest first, including same-day entries', () => {
    expect(sortNewestFirst(messy).map(e => e.id)).toEqual([
      'w_1018',
      'w_1016',
      'w_1021',
      'w_1020',
      'w_1017',
    ]);
  });

  it('does not mutate the input', () => {
    const copy = [...messy];
    sortNewestFirst(messy);
    expect(messy).toEqual(copy);
  });
});

describe('withChanges', () => {
  it('gives each row the change from the entry before it', () => {
    const rows = withChanges(sortNewestFirst(messy), getKg);
    expect(rows[0].change).toBeCloseTo(-0.1);
    expect(rows[1].change).toBeCloseTo(-0.6);
    // oldest entry has nothing to compare with
    expect(rows[rows.length - 1].change).toBeNull();
  });

  it('handles a single entry', () => {
    const rows = withChanges([entry('w_1', '2026-07-24T09:00:00.000Z', 54.3)], getKg);
    expect(rows).toEqual([{ entry: expect.anything(), change: null }]);
  });

  it('handles an empty list', () => {
    expect(withChanges([], getKg)).toEqual([]);
  });
});

describe('getTotalChange', () => {
  it('is newest minus oldest', () => {
    expect(getTotalChange(sortNewestFirst(messy), getKg)).toBeCloseTo(-1.6);
  });

  it('is null with fewer than two entries, not 0', () => {
    expect(getTotalChange([], getKg)).toBeNull();
    expect(
      getTotalChange([entry('w_1', '2026-07-24T09:00:00.000Z', 54.3)], getKg),
    ).toBeNull();
  });
});
