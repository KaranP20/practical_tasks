import { useCallback, useEffect, useRef, useState } from 'react';

import {
  ApiError,
  createWeightEntry,
  deleteWeightEntry,
  getWeightEntries,
} from '../services';
import type { NewWeightEntry, WeightEntry } from '../types/api';
import {
  getErrorMessage,
  getRangeStartISO,
  isInRange,
  sortNewestFirst,
  type RangeKey,
} from '../utils';

export type WeightRow = WeightEntry & {
  isPending?: boolean;
};

type Status = 'loading' | 'success' | 'error';

let tempIdCounter = 0;
const nextTempId = () => `temp_${Date.now()}_${++tempIdCounter}`;

export function useWeightEntries(clientId: string, range: RangeKey) {
  const [entries, setEntries] = useState<WeightRow[]>([]);
  const [status, setStatus] = useState<Status>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasNoData, setHasNoData] = useState(false);
  const latestRequestId = useRef(0);
  const rangeRef = useRef(range);
  rangeRef.current = range;

  const loadEntries = useCallback(
    async (isRefresh: boolean) => {
      const requestId = ++latestRequestId.current;
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setStatus('loading');
      }

      try {
        const fromISO = getRangeStartISO(range);
        const items = await getWeightEntries(clientId, fromISO);

        let noDataAtAll = items.length === 0;
        if (noDataAtAll && fromISO) {
          noDataAtAll = await getWeightEntries(clientId).then(
            all => all.length === 0,
            () => false,
          );
        }

        if (requestId === latestRequestId.current) {
          setEntries(sortNewestFirst(items));
          setHasNoData(noDataAtAll);
          setErrorMessage(null);
          setStatus('success');
        }
      } catch (error) {
        if (requestId === latestRequestId.current) {
          setEntries([]);
          setErrorMessage(getErrorMessage(error));
          setStatus('error');
        }
      } finally {
        if (requestId === latestRequestId.current) {
          setIsRefreshing(false);
        }
      }
    },
    [clientId, range],
  );

  useEffect(() => {
    loadEntries(false);
    return () => {
      latestRequestId.current += 1;
    };
  }, [loadEntries]);

  const addEntry = useCallback(
    async (input: NewWeightEntry) => {
      const tempId = nextTempId();
      const optimisticRow: WeightRow = {
        ...input,
        id: tempId,
        clientId,
        source: 'coach',
        isPending: true,
      };

      if (isInRange(input.dateISO, rangeRef.current)) {
        setEntries(prev => sortNewestFirst([...prev, optimisticRow]));
      }

      try {
        const created = await createWeightEntry(clientId, input);
        setEntries(prev => {
          const rest = prev.filter(
            item => item.id !== tempId && item.id !== created.id,
          );
          return isInRange(created.dateISO, rangeRef.current)
            ? sortNewestFirst([...rest, created])
            : rest;
        });
      } catch (error) {
        setEntries(prev => prev.filter(item => item.id !== tempId));
        throw error;
      }
    },
    [clientId],
  );

  const removeEntry = useCallback(async (entry: WeightRow) => {
    setEntries(prev => prev.filter(item => item.id !== entry.id));

    try {
      await deleteWeightEntry(entry.id);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return;
      }
      setEntries(prev =>
        prev.some(item => item.id === entry.id)
          ? prev
          : sortNewestFirst([...prev, entry]),
      );
      throw error;
    }
  }, []);

  return {
    entries,
    status,
    errorMessage,
    isRefreshing,
    hasNoData,
    reload: () => loadEntries(false),
    refresh: () => loadEntries(true),
    addEntry,
    removeEntry,
  };
}
