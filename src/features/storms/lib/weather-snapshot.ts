import type { CurrentWeather } from '@/features/weather/model/current-weather';

import type { WeatherSnapshot } from '../model/storm-observation';

export function toWeatherSnapshot(weather: CurrentWeather): WeatherSnapshot {
  return {
    temperatureC: weather.temperatureC,
    windSpeedKmh: weather.windSpeedKmh,
    precipitationMm: weather.precipitationMm,
    weatherCode: weather.weatherCode,
    observedAt: weather.observedAt,
  };
}
