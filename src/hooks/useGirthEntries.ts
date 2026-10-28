import { useCallback, useEffect, useRef, useState } from 'react';

import { getGirthEntries } from '../services';
import type { GirthEntry, GirthSite } from '../types/api';
import {
  getErrorMessage,
  getRangeStartISO,
  sortNewestFirst,
  type RangeKey,
} from '../utils';

type Status = 'loading' | 'success' | 'error';

// Read only, so just loading. Same flow as useWeightEntries.
export function useGirthEntries(
  clientId: string,
  site: GirthSite,
  range: RangeKey,
) {
  const [entries, setEntries] = useState<GirthEntry[]>([]);
  const [status, setStatus] = useState<Status>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  // true only when the client has nothing for this site, not just none in this range
  const [hasNoData, setHasNoData] = useState(false);

  // Only the latest request may update state, so switching site or range
  // quickly can't show the wrong list.
  const latestRequestId = useRef(0);

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
        const items = await getGirthEntries(clientId, site, fromISO);

        let noDataAtAll = items.length === 0;
        if (noDataAtAll && fromISO) {
          // Nothing in this range. Ask without `from` to know if there is
          // older data. If that fails, "nothing in range" is still true.
          noDataAtAll = await getGirthEntries(clientId, site).then(
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
    [clientId, site, range],
  );

  useEffect(() => {
    loadEntries(false);
    return () => {
      // ignore whatever is still in flight
      latestRequestId.current += 1;
    };
  }, [loadEntries]);

  return {
    entries,
    status,
    errorMessage,
    isRefreshing,
    hasNoData,
    reload: () => loadEntries(false),
    refresh: () => loadEntries(true),
  };
}
