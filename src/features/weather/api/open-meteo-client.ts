import { fetchJson } from '@/shared/lib/http';
import { parseWithSchema } from '@/shared/lib/parse';

import type { CurrentWeather } from '../model/current-weather';
import type { LocationWeather, WeatherProvider } from '../model/location-weather';
import { mapOpenMeteoLocation } from './open-meteo-mapper';
import { openMeteoLocationSchema } from './open-meteo-schema';

const OPEN_METEO_URL = 'https://api.open-meteo.com/v1/forecast';
const FORECAST_DAYS = 5;
const FORECAST_HOURS = 24;

function buildLocationUrl(latitude: number, longitude: number): string {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current:
      'temperature_2m,apparent_temperature,wind_speed_10m,precipitation,precipitation_probability,weather_code',
    hourly: 'temperature_2m,weather_code,precipitation_probability,precipitation,wind_speed_10m',
    daily:
      'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max',
    forecast_days: String(FORECAST_DAYS),
    forecast_hours: String(FORECAST_HOURS),
    temperature_unit: 'celsius',
    wind_speed_unit: 'kmh',
    precipitation_unit: 'mm',
    timezone: 'auto',
  });

  return `${OPEN_METEO_URL}?${params.toString()}`;
}

export async function fetchOpenMeteoLocationWeather(
  latitude: number,
  longitude: number
): Promise<LocationWeather> {
  const payload = await fetchJson<unknown>(buildLocationUrl(latitude, longitude));
  const parsed = parseWithSchema(
    openMeteoLocationSchema,
    payload,
    'Weather data could not be retrieved.'
  );
  return mapOpenMeteoLocation(parsed);
}

export async function fetchOpenMeteoCurrent(
  latitude: number,
  longitude: number
): Promise<CurrentWeather> {
  const weather = await fetchOpenMeteoLocationWeather(latitude, longitude);
  return weather.current;
}

export const openMeteoWeatherProvider: WeatherProvider = {
  getCurrentWeather: fetchOpenMeteoCurrent,
  getLocationWeather: fetchOpenMeteoLocationWeather,
};
