import { describeRange, type RangeKey } from '../../utils';

type EmptyText = { title: string; message?: string };

/**
 * "No data yet" and "nothing in this range" are different situations,
 * this picks the right text for the empty list.
 */
export function getEmptyText(
  range: RangeKey,
  hasNoData: boolean,
  label: string,
  noDataHint?: string,
): EmptyText {
  if (range === 'ALL' || hasNoData) {
    return { title: `No ${label} logged yet`, message: noDataHint };
  }
  return {
    title: `Nothing in ${describeRange(range)}`,
    message: 'Try a longer range to see older entries.',
  };
}
