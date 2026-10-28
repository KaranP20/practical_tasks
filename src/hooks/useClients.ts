import { useCallback, useEffect, useState } from 'react';

import { getClients } from '../services';
import type { Client } from '../types/api';
import { getErrorMessage } from '../utils';

export function useClients() {
  const [clients, setClients] = useState<Client[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadClients = useCallback(async (isRefresh: boolean) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setErrorMessage(null);
    try {
      const items = await getClients();
      // Server shuffles the list on every call, sort by name so it doesn't jump.
      items.sort(
        (a, b) =>
          a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }) ||
          a.id.localeCompare(b.id),
      );
      setClients(items);
    } catch (error) {
      setClients(null);
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadClients(false);
  }, [loadClients]);

  return {
    clients,
    isLoading,
    isRefreshing,
    errorMessage,
    reload: () => loadClients(false),
    refresh: () => loadClients(true),
  };
}
