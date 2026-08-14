import { useFocusEffect, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';

import { deleteStormPhoto } from '@/services/files/photo-store';
import { AppError, isAppError } from '@/shared/lib/errors';
import { navigateBackOrReplace } from '@/shared/lib/navigation';

import { createSqliteStormRepository } from '../api/sqlite-storm-repository';
import type { StormObservation } from '../model/storm-observation';

export function useObservation(id: string) {
  const db = useSQLiteContext();
  const router = useRouter();
  const [observation, setObservation] = useState<StormObservation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const refresh = useCallback(async () => {
    setErrorMessage(null);
    try {
      const repository = createSqliteStormRepository(db);
      const row = await repository.getById(id);
      setObservation(row);
      if (!row) {
        setErrorMessage('This observation was not found.');
      }
    } catch (error) {
      setErrorMessage(isAppError(error) ? error.userMessage : 'Unable to load this observation.');
    } finally {
      setIsLoading(false);
    }
  }, [db, id]);

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      void refresh();
    }, [refresh])
  );

  const deleteObservation = useCallback(async () => {
    if (!observation) {
      return;
    }

    setIsDeleting(true);
    setErrorMessage(null);

    try {
      const repository = createSqliteStormRepository(db);
      await repository.delete(observation.id);
      await deleteStormPhoto(observation.photoRelativePath);

      navigateBackOrReplace(router, '/log');
    } catch (error) {
      const message = isAppError(error) ? error.userMessage : 'Unable to delete this observation.';
      setErrorMessage(message);
      throw error instanceof AppError ? error : new AppError('unknown', message, { cause: error });
    } finally {
      setIsDeleting(false);
    }
  }, [db, observation, router]);

  return {
    observation,
    isLoading,
    errorMessage,
    isDeleting,
    deleteObservation,
    refresh,
  };
}
