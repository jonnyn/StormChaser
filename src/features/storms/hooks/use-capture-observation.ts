import { useQueryClient } from '@tanstack/react-query';
import * as Crypto from 'expo-crypto';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';

import type { LocationWeather } from '@/features/weather/model/location-weather';
import { openMeteoWeatherProvider } from '@/features/weather/api/open-meteo-client';
import { persistStormPhoto } from '@/services/files/photo-store';
import { getCurrentCoordinates } from '@/services/location/get-current-coordinates';
import type { GeoPoint } from '@/services/location/types';
import { roundCoord } from '@/shared/lib/coordinates';
import { AppError, isAppError } from '@/shared/lib/errors';
import { navigateBackOrReplace } from '@/shared/lib/navigation';
import { parseWithSchema } from '@/shared/lib/parse';

import { createSqliteStormRepository } from '../api/sqlite-storm-repository';
import { toWeatherSnapshot } from '../lib/weather-snapshot';
import { captureFormSchema, type CaptureFormValues } from '../model/capture-form-schema';
import type { WeatherSnapshot } from '../model/storm-observation';

export type CaptureDraft = {
  photoCacheUri: string;
  capturedAt: string;
  location: GeoPoint;
  weather: WeatherSnapshot | null;
};

export function useCaptureObservation() {
  const db = useSQLiteContext();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const prepareDraft = useCallback(
    async (photoCacheUri: string): Promise<CaptureDraft> => {
      const location = await getCurrentCoordinates();
      const capturedAt = new Date().toISOString();

      const latitude = roundCoord(location.latitude);
      const longitude = roundCoord(location.longitude);
      const cached = queryClient.getQueryData<LocationWeather>([
        'weather',
        'location',
        latitude,
        longitude,
      ]);

      let weather: WeatherSnapshot | null = cached?.current
        ? toWeatherSnapshot(cached.current)
        : null;

      if (!weather) {
        try {
          const fresh = await openMeteoWeatherProvider.getCurrentWeather(
            location.latitude,
            location.longitude
          );
          weather = toWeatherSnapshot(fresh);
        } catch {
          weather = null;
        }
      }

      return {
        photoCacheUri,
        capturedAt,
        location,
        weather,
      };
    },
    [queryClient]
  );

  const saveObservation = useCallback(
    async (draft: CaptureDraft, values: CaptureFormValues) => {
      setIsSaving(true);
      setErrorMessage(null);

      try {
        const parsed = parseWithSchema(
          captureFormSchema,
          values,
          'Check the storm details and try again.'
        );
        const id = Crypto.randomUUID();
        const photoRelativePath = await persistStormPhoto(draft.photoCacheUri, id);
        const repository = createSqliteStormRepository(db);

        await repository.create({
          id,
          capturedAt: draft.capturedAt,
          notes: parsed.notes.trim(),
          stormType: parsed.stormType,
          location: draft.location,
          weather: draft.weather,
          photoRelativePath,
        });

        navigateBackOrReplace(router, '/log');
      } catch (error) {
        const message = isAppError(error)
          ? error.userMessage
          : 'Unable to save this storm observation.';
        setErrorMessage(message);
        throw error instanceof AppError
          ? error
          : new AppError('unknown', message, { cause: error });
      } finally {
        setIsSaving(false);
      }
    },
    [db, router]
  );

  return {
    prepareDraft,
    saveObservation,
    isSaving,
    errorMessage,
    clearError: () => setErrorMessage(null),
  };
}
