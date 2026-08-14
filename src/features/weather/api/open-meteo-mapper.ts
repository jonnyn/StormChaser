import type { CurrentWeather } from '../model/current-weather';
import type { DailyForecastDay } from '../model/daily-forecast';
import type { HourlyForecastHour } from '../model/hourly-forecast';
import type { LocationWeather } from '../model/location-weather';
import type { OpenMeteoCurrentResponse, OpenMeteoLocationResponse } from './open-meteo-schema';

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

function zipLength(...lengths: number[]): number {
  return Math.min(...lengths);
}

export function mapOpenMeteoCurrent(response: OpenMeteoCurrentResponse): CurrentWeather {
  const { current } = response;

  return {
    temperatureC: current.temperature_2m,
    apparentTemperatureC: current.apparent_temperature,
    windSpeedKmh: current.wind_speed_10m,
    precipitationMm: current.precipitation,
    precipitationProbability: current.precipitation_probability,
    weatherCode: current.weather_code,
    observedAt: toIsoObservedAt(current.time),
  };
}

export function mapOpenMeteoHourly(response: OpenMeteoLocationResponse): HourlyForecastHour[] {
  const { hourly } = response;
  const count = zipLength(
    hourly.time.length,
    hourly.temperature_2m.length,
    hourly.weather_code.length,
    hourly.precipitation_probability.length,
    hourly.precipitation.length,
    hourly.wind_speed_10m.length
  );

  const hours: HourlyForecastHour[] = [];
  for (let index = 0; index < count; index += 1) {
    hours.push({
      time: hourly.time[index]!,
      temperatureC: hourly.temperature_2m[index]!,
      weatherCode: hourly.weather_code[index]!,
      precipitationProbability: hourly.precipitation_probability[index]!,
      precipitationMm: hourly.precipitation[index]!,
      windSpeedKmh: hourly.wind_speed_10m[index]!,
    });
  }

  return hours;
}

export function mapOpenMeteoDaily(response: OpenMeteoLocationResponse): DailyForecastDay[] {
  const { daily } = response;
  const count = zipLength(
    daily.time.length,
    daily.weather_code.length,
    daily.temperature_2m_max.length,
    daily.temperature_2m_min.length,
    daily.precipitation_sum.length,
    daily.precipitation_probability_max.length,
    daily.wind_speed_10m_max.length,
    daily.wind_gusts_10m_max.length
  );

  const days: DailyForecastDay[] = [];
  for (let index = 0; index < count; index += 1) {
    days.push({
      date: daily.time[index]!,
      weatherCode: daily.weather_code[index]!,
      temperatureMaxC: daily.temperature_2m_max[index]!,
      temperatureMinC: daily.temperature_2m_min[index]!,
      precipitationMm: daily.precipitation_sum[index]!,
      precipitationProbabilityMax: daily.precipitation_probability_max[index]!,
      windSpeedMaxKmh: daily.wind_speed_10m_max[index]!,
      windGustsMaxKmh: daily.wind_gusts_10m_max[index]!,
    });
  }

  return days;
}

export function mapOpenMeteoLocation(response: OpenMeteoLocationResponse): LocationWeather {
  return {
    current: mapOpenMeteoCurrent(response),
    hourly: mapOpenMeteoHourly(response),
    daily: mapOpenMeteoDaily(response),
  };
}
