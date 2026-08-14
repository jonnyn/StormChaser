import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';

import { isAppError } from '@/shared/lib/errors';

import { createSqliteStormRepository } from '../api/sqlite-storm-repository';
import type { StormObservation } from '../model/storm-observation';

type RefreshOptions = {
  quiet?: boolean;
};

export function useObservations() {
  const db = useSQLiteContext();
  const [observations, setObservations] = useState<StormObservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const refresh = useCallback(
    async (options?: RefreshOptions) => {
      const quiet = options?.quiet === true;
      if (quiet) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      setErrorMessage(null);
      try {
        const repository = createSqliteStormRepository(db);
        const rows = await repository.list();
        setObservations(rows);
      } catch (error) {
        setErrorMessage(isAppError(error) ? error.userMessage : 'Unable to load the field log.');
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [db]
  );

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh])
  );

  return {
    observations,
    isLoading,
    isRefreshing,
    errorMessage,
    refresh,
  };
}
