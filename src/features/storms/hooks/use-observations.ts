import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';

import { isAppError } from '@/shared/lib/errors';

import { createSqliteStormRepository } from '../api/sqlite-storm-repository';
import type { StormObservation } from '../model/storm-observation';

export function useObservations() {
  const db = useSQLiteContext();
  const [observations, setObservations] = useState<StormObservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setErrorMessage(null);
    try {
      const repository = createSqliteStormRepository(db);
      const rows = await repository.list();
      setObservations(rows);
    } catch (error) {
      setErrorMessage(isAppError(error) ? error.userMessage : 'Unable to load the field log.');
    } finally {
      setIsLoading(false);
    }
  }, [db]);

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      void refresh();
    }, [refresh])
  );

  return {
    observations,
    isLoading,
    errorMessage,
    refresh,
  };
}
