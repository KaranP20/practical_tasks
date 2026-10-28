import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

import { useWeightEntries } from '../src/hooks/useWeightEntries';
import { ApiError } from '../src/services/api/apiClient';
import * as service from '../src/services/measurementsService';
import type { WeightEntry } from '../src/types/api';

jest.mock('../src/services/measurementsService');
const mocked = jest.mocked(service);

const daysAgo = (n: number) =>
  new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString();

const existing: WeightEntry[] = [
  {
    id: 'w_1',
    clientId: 'c1',
    dateISO: daysAgo(10),
    weightKg: 87.1,
    note: null,
    source: 'coach',
  },
  {
    id: 'w_2',
    clientId: 'c1',
    dateISO: daysAgo(3),
    weightKg: 86.5,
    note: null,
    source: 'coach',
  },
];

type HookResult = ReturnType<typeof useWeightEntries>;

async function renderHook() {
  const result: { current: HookResult | null } = { current: null };
  function Probe() {
    result.current = useWeightEntries('c1', '30D');
    return null;
  }
  await ReactTestRenderer.act(async () => {
    ReactTestRenderer.create(<Probe />);
  });
  return result as { current: HookResult };
}

const ids = (hook: { current: HookResult }) =>
  hook.current.entries.map(item => item.id);

beforeEach(() => {
  jest.resetAllMocks();
  mocked.getWeightEntries.mockResolvedValue(existing);
});

it('loads and sorts newest first', async () => {
  const hook = await renderHook();
  expect(hook.current.status).toBe('success');
  expect(ids(hook)).toEqual(['w_2', 'w_1']);
});

it('replaces the optimistic row with the server row on success', async () => {
  const hook = await renderHook();
  const input = { dateISO: daysAgo(1), weightKg: 86.0004, note: null };
  mocked.createWeightEntry.mockResolvedValue({
    ...input,
    id: 'w_5001',
    clientId: 'c1',
    weightKg: 86,
    source: 'coach',
  });

  await ReactTestRenderer.act(() => hook.current.addEntry(input));

  expect(ids(hook)).toEqual(['w_5001', 'w_2', 'w_1']);
  expect(hook.current.entries[0].isPending).toBeUndefined();
});

it('rolls back a failed add', async () => {
  const hook = await renderHook();
  const before = hook.current.entries;
  let rejectSave: (error: unknown) => void = () => {};
  mocked.createWeightEntry.mockReturnValue(
    new Promise((_resolve, reject) => {
      rejectSave = reject;
    }),
  );

  let savePromise: Promise<void> = Promise.resolve();
  await ReactTestRenderer.act(async () => {
    savePromise = hook.current.addEntry({
      dateISO: daysAgo(1),
      weightKg: 85.4,
      note: null,
    });
  });
  // optimistic row is visible while the request is in flight
  expect(hook.current.entries[0].isPending).toBe(true);

  await ReactTestRenderer.act(async () => {
    rejectSave(new ApiError('Server hiccup.', 503, 'SERVICE_UNAVAILABLE'));
    await expect(savePromise).rejects.toBeInstanceOf(ApiError);
  });
  expect(hook.current.entries).toEqual(before);
});

it('puts a row back in place when delete fails', async () => {
  const hook = await renderHook();
  mocked.deleteWeightEntry.mockRejectedValue(
    new ApiError('Server hiccup.', 503, 'SERVICE_UNAVAILABLE'),
  );

  await ReactTestRenderer.act(async () => {
    await expect(hook.current.removeEntry(existing[0])).rejects.toBeInstanceOf(
      ApiError,
    );
  });
  expect(ids(hook)).toEqual(['w_2', 'w_1']);
});

it('treats a 404 on delete as already deleted', async () => {
  const hook = await renderHook();
  mocked.deleteWeightEntry.mockRejectedValue(
    new ApiError('No such entry.', 404, 'NOT_FOUND'),
  );

  await ReactTestRenderer.act(() => hook.current.removeEntry(existing[0]));
  expect(ids(hook)).toEqual(['w_2']);
});

it('tells "no data at all" apart from "nothing in range"', async () => {
  mocked.getWeightEntries.mockResolvedValue([]);
  const empty = await renderHook();
  expect(empty.current.entries).toEqual([]);
  expect(empty.current.hasNoData).toBe(true);

  mocked.getWeightEntries.mockImplementation(async (_id, fromISO) =>
    fromISO ? [] : existing,
  );
  const olderOnly = await renderHook();
  expect(olderOnly.current.entries).toEqual([]);
  expect(olderOnly.current.hasNoData).toBe(false);
});
