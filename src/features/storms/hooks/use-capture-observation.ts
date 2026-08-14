import { useQueryClient } from '@tanstack/react-query';
import * as Crypto from 'expo-crypto';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';

import { openMeteoWeatherProvider } from '@/features/weather/api/open-meteo-client';
import type { CurrentWeather } from '@/features/weather/model/current-weather';
import { persistStormPhoto } from '@/services/files/photo-store';
import { getCurrentCoordinates } from '@/services/location/get-current-coordinates';
import type { GeoPoint } from '@/services/location/types';
import { AppError, isAppError } from '@/shared/lib/errors';
import { parseWithSchema } from '@/shared/lib/parse';

import { createSqliteStormRepository } from '../api/sqlite-storm-repository';
import { captureFormSchema, type CaptureFormValues } from '../model/capture-form-schema';
import type { WeatherSnapshot } from '../model/storm-observation';

function roundCoord(value: number): number {
  return Math.round(value * 1000) / 1000;
}

function toWeatherSnapshot(weather: CurrentWeather): WeatherSnapshot {
  return {
    temperatureF: weather.temperatureF,
    windSpeedMph: weather.windSpeedMph,
    precipitationIn: weather.precipitationIn,
    weatherCode: weather.weatherCode,
    observedAt: weather.observedAt,
  };
}

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
      const cached = queryClient.getQueryData<CurrentWeather>([
        'weather',
        'current',
        latitude,
        longitude,
      ]);

      let weather: WeatherSnapshot | null = cached ? toWeatherSnapshot(cached) : null;

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

        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace('/log');
        }
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
