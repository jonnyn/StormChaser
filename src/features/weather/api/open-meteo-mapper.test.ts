import type { CurrentWeather } from '../model/current-weather';
import type { DailyForecastDay } from '../model/daily-forecast';
import type { HourlyForecastHour } from '../model/hourly-forecast';
import {
  mapOpenMeteoCurrent,
  mapOpenMeteoDaily,
  mapOpenMeteoHourly,
  mapOpenMeteoLocation,
} from './open-meteo-mapper';
import type { OpenMeteoLocationResponse } from './open-meteo-schema';

describe('mapOpenMeteoLocation', () => {
  const baseResponse: OpenMeteoLocationResponse = {
    latitude: 35.4676,
    longitude: -97.5164,
    current: {
      time: '2026-08-13T18:00',
      temperature_2m: 30,
      apparent_temperature: 32,
      weather_code: 95,
      wind_speed_10m: 35.4,
      precipitation: 2.5,
      precipitation_probability: 80,
    },
    hourly: {
      time: ['2026-08-13T18:00', '2026-08-13T19:00'],
      temperature_2m: [30, 28],
      weather_code: [95, 61],
      precipitation_probability: [80, 55],
      precipitation: [1.2, 0.4],
      wind_speed_10m: [35, 30],
    },
    daily: {
      time: ['2026-08-13', '2026-08-14'],
      weather_code: [95, 61],
      temperature_2m_max: [32, 28],
      temperature_2m_min: [22, 20],
      precipitation_sum: [5, 12],
      precipitation_probability_max: [90, 70],
      wind_speed_10m_max: [40, 25],
      wind_gusts_10m_max: [55, 35],
    },
  };

  it('maps a valid Open-Meteo current block into domain weather', () => {
    const result = mapOpenMeteoCurrent(baseResponse);

    expect(result).toMatchObject({
      temperatureC: 30,
      apparentTemperatureC: 32,
      weatherCode: 95,
      windSpeedKmh: 35.4,
      precipitationMm: 2.5,
      precipitationProbability: 80,
    } satisfies Partial<CurrentWeather>);
    expect(result.observedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('maps hourly arrays into forecast hours', () => {
    const hours = mapOpenMeteoHourly(baseResponse);

    expect(hours).toEqual([
      {
        time: '2026-08-13T18:00',
        temperatureC: 30,
        weatherCode: 95,
        precipitationProbability: 80,
        precipitationMm: 1.2,
        windSpeedKmh: 35,
      },
      {
        time: '2026-08-13T19:00',
        temperatureC: 28,
        weatherCode: 61,
        precipitationProbability: 55,
        precipitationMm: 0.4,
        windSpeedKmh: 30,
      },
    ] satisfies HourlyForecastHour[]);
  });

  it('maps daily arrays into forecast days', () => {
    const days = mapOpenMeteoDaily(baseResponse);

    expect(days).toEqual([
      {
        date: '2026-08-13',
        weatherCode: 95,
        temperatureMaxC: 32,
        temperatureMinC: 22,
        precipitationMm: 5,
        precipitationProbabilityMax: 90,
        windSpeedMaxKmh: 40,
        windGustsMaxKmh: 55,
      },
      {
        date: '2026-08-14',
        weatherCode: 61,
        temperatureMaxC: 28,
        temperatureMinC: 20,
        precipitationMm: 12,
        precipitationProbabilityMax: 70,
        windSpeedMaxKmh: 25,
        windGustsMaxKmh: 35,
      },
    ] satisfies DailyForecastDay[]);
  });

  it('maps a location bundle with current, hourly, and daily', () => {
    const result = mapOpenMeteoLocation(baseResponse);

    expect(result.current.temperatureC).toBe(30);
    expect(result.hourly).toHaveLength(2);
    expect(result.daily).toHaveLength(2);
    expect(result.daily[0]?.date).toBe('2026-08-13');
  });
});
