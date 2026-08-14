import { fetchJson } from '@/shared/lib/http';
import { parseWithSchema } from '@/shared/lib/parse';

import type { CurrentWeather, WeatherProvider } from '../model/current-weather';
import { mapOpenMeteoCurrent } from './open-meteo-mapper';
import { openMeteoCurrentSchema } from './open-meteo-schema';

const OPEN_METEO_URL = 'https://api.open-meteo.com/v1/forecast';

function buildCurrentUrl(latitude: number, longitude: number): string {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: 'temperature_2m,wind_speed_10m,precipitation,weather_code',
    temperature_unit: 'celsius',
    wind_speed_unit: 'kmh',
    precipitation_unit: 'mm',
    timezone: 'auto',
  });

  return `${OPEN_METEO_URL}?${params.toString()}`;
}

export async function fetchOpenMeteoCurrent(
  latitude: number,
  longitude: number
): Promise<CurrentWeather> {
  const payload = await fetchJson<unknown>(buildCurrentUrl(latitude, longitude));
  const parsed = parseWithSchema(
    openMeteoCurrentSchema,
    payload,
    'Weather data could not be retrieved.'
  );
  return mapOpenMeteoCurrent(parsed);
}

export const openMeteoWeatherProvider: WeatherProvider = {
  getCurrentWeather: fetchOpenMeteoCurrent,
};
