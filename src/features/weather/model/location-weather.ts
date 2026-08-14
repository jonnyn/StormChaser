import type { CurrentWeather } from './current-weather';
import type { DailyForecastDay } from './daily-forecast';
import type { HourlyForecastHour } from './hourly-forecast';

export type LocationWeather = {
  current: CurrentWeather;
  hourly: HourlyForecastHour[];
  daily: DailyForecastDay[];
};

export type WeatherProvider = {
  getCurrentWeather: (latitude: number, longitude: number) => Promise<CurrentWeather>;
  getLocationWeather: (latitude: number, longitude: number) => Promise<LocationWeather>;
};
