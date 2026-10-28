import { useCallback, useEffect, useState } from 'react';

import { getMe } from '../services';
import type { Coach } from '../types/api';
import { getErrorMessage } from '../utils';

export function useProfile() {
  const [coach, setCoach] = useState<Coach | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      setCoach(await getMe());
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return { coach, isLoading, errorMessage, reload: loadProfile };
}
