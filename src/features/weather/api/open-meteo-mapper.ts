import type { CurrentWeather } from '../model/current-weather';
import type { OpenMeteoCurrentResponse } from './open-meteo-schema';

/** Open-Meteo returns local time without an offset when timezone=auto; treat as local clock. */
function toIsoObservedAt(time: string): string {
  if (time.includes('Z') || /[+-]\d{2}:\d{2}$/.test(time)) {
    return new Date(time).toISOString();
  }

  const parsed = new Date(time);
  if (Number.isNaN(parsed.getTime())) {
    return new Date().toISOString();
  }

  return parsed.toISOString();
}

export function mapOpenMeteoCurrent(response: OpenMeteoCurrentResponse): CurrentWeather {
  const { current } = response;

  return {
    temperatureC: current.temperature_2m,
    windSpeedKmh: current.wind_speed_10m,
    precipitationMm: current.precipitation,
    weatherCode: current.weather_code,
    observedAt: toIsoObservedAt(current.time),
  };
}
