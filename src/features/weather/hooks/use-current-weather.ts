import { useQuery } from '@tanstack/react-query';

import { getCurrentCoordinates } from '@/services/location/get-current-coordinates';
import type { GeoPoint } from '@/services/location/types';
import { isAppError } from '@/shared/lib/errors';

import { openMeteoWeatherProvider } from '../api/open-meteo-client';
import type { CurrentWeather } from '../model/current-weather';

const LOCATION_STALE_MS = 5 * 60 * 1000;
const WEATHER_STALE_MS = 3 * 60 * 1000;

function roundCoord(value: number): number {
  return Math.round(value * 1000) / 1000;
}

function shouldRetry(failureCount: number, error: unknown): boolean {
  if (isAppError(error) && (error.code === 'permission_denied' || error.code === 'not_found')) {
    return false;
  }
  return failureCount < 2;
}

export type CurrentWeatherState = {
  weather: CurrentWeather | undefined;
  location: GeoPoint | undefined;
  isLoading: boolean;
  isFetching: boolean;
  errorMessage: string | null;
  canRetry: boolean;
  refetch: () => void;
};

export function useCurrentWeather(): CurrentWeatherState {
  const locationQuery = useQuery({
    queryKey: ['location', 'current'],
    queryFn: getCurrentCoordinates,
    staleTime: LOCATION_STALE_MS,
    retry: shouldRetry,
  });

  const latitude = locationQuery.data ? roundCoord(locationQuery.data.latitude) : null;
  const longitude = locationQuery.data ? roundCoord(locationQuery.data.longitude) : null;

  const weatherQuery = useQuery({
    queryKey: ['weather', 'current', latitude, longitude],
    queryFn: () =>
      openMeteoWeatherProvider.getCurrentWeather(
        locationQuery.data!.latitude,
        locationQuery.data!.longitude
      ),
    enabled: latitude != null && longitude != null,
    staleTime: WEATHER_STALE_MS,
    retry: shouldRetry,
  });

  const error = locationQuery.error ?? weatherQuery.error;
  const errorMessage = error
    ? isAppError(error)
      ? error.userMessage
      : 'Weather data could not be retrieved.'
    : null;

  const isLoading =
    locationQuery.isLoading ||
    (locationQuery.isSuccess && weatherQuery.isLoading && !weatherQuery.data);

  return {
    weather: weatherQuery.data,
    location: locationQuery.data,
    isLoading,
    isFetching: locationQuery.isFetching || weatherQuery.isFetching,
    errorMessage,
    canRetry: Boolean(error),
    refetch: () => {
      if (locationQuery.isError) {
        void locationQuery.refetch();
        return;
      }
      void weatherQuery.refetch();
    },
  };
}
