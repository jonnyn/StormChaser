import { useQuery } from '@tanstack/react-query';

import { getCurrentCoordinates } from '@/services/location/get-current-coordinates';
import type { GeoPoint } from '@/services/location/types';
import { useNetworkStatus } from '@/services/network/use-network-status';
import { isAppError } from '@/shared/lib/errors';

import { openMeteoWeatherProvider } from '../api/open-meteo-client';
import type { CurrentWeather } from '../model/current-weather';
import type { DailyForecastDay } from '../model/daily-forecast';
import type { HourlyForecastHour } from '../model/hourly-forecast';

const LOCATION_STALE_MS = 5 * 60 * 1000;
const WEATHER_STALE_MS = 3 * 60 * 1000;
const OFFLINE_MESSAGE = "You're offline. Connect to load current conditions.";

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
  hourly: HourlyForecastHour[] | undefined;
  daily: DailyForecastDay[] | undefined;
  location: GeoPoint | undefined;
  isLoading: boolean;
  isFetching: boolean;
  isOffline: boolean;
  isShowingCachedWeather: boolean;
  errorMessage: string | null;
  canRetry: boolean;
  refetch: () => void;
};

export function useCurrentWeather(): CurrentWeatherState {
  const { isOffline } = useNetworkStatus();

  const locationQuery = useQuery({
    queryKey: ['location', 'current'],
    queryFn: getCurrentCoordinates,
    staleTime: LOCATION_STALE_MS,
    retry: shouldRetry,
  });

  const latitude = locationQuery.data ? roundCoord(locationQuery.data.latitude) : null;
  const longitude = locationQuery.data ? roundCoord(locationQuery.data.longitude) : null;

  const weatherQuery = useQuery({
    queryKey: ['weather', 'location', latitude, longitude],
    queryFn: () =>
      openMeteoWeatherProvider.getLocationWeather(
        locationQuery.data!.latitude,
        locationQuery.data!.longitude
      ),
    enabled: latitude != null && longitude != null,
    staleTime: WEATHER_STALE_MS,
    retry: shouldRetry,
  });

  const hasWeatherData = Boolean(weatherQuery.data?.current);
  const weatherError = hasWeatherData && isOffline ? null : weatherQuery.error;
  const error = locationQuery.error ?? weatherError;

  const offlineWithoutCache = isOffline && !hasWeatherData && !isLoading && locationQuery.isSuccess;

  const errorMessage = error
    ? isAppError(error)
      ? error.userMessage
      : 'Weather data could not be retrieved.'
    : offlineWithoutCache
      ? OFFLINE_MESSAGE
      : null;

  const isLoading =
    locationQuery.isLoading ||
    (locationQuery.isSuccess && weatherQuery.isLoading && !weatherQuery.data);

  const isShowingCachedWeather = isOffline && hasWeatherData;

  return {
    weather: weatherQuery.data?.current,
    hourly: weatherQuery.data?.hourly,
    daily: weatherQuery.data?.daily,
    location: locationQuery.data,
    isLoading,
    isFetching: locationQuery.isFetching || weatherQuery.isFetching,
    isOffline,
    isShowingCachedWeather,
    errorMessage,
    canRetry: Boolean(error) && !isOffline,
    refetch: () => {
      if (locationQuery.isError) {
        void locationQuery.refetch();
        return;
      }
      void weatherQuery.refetch();
    },
  };
}
