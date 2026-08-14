import type { CurrentWeather } from '../model/current-weather';
import { mapOpenMeteoCurrent } from './open-meteo-mapper';
import type { OpenMeteoCurrentResponse } from './open-meteo-schema';

describe('mapOpenMeteoCurrent', () => {
  const baseResponse: OpenMeteoCurrentResponse = {
    latitude: 35.4676,
    longitude: -97.5164,
    current: {
      time: '2026-08-13T18:00',
      temperature_2m: 30,
      weather_code: 95,
      wind_speed_10m: 35.4,
      precipitation: 2.5,
    },
  };

  it('maps a valid Open-Meteo current block into domain weather', () => {
    const result = mapOpenMeteoCurrent(baseResponse);

    expect(result).toMatchObject({
      temperatureC: 30,
      weatherCode: 95,
      windSpeedKmh: 35.4,
      precipitationMm: 2.5,
    } satisfies Partial<CurrentWeather>);
    expect(result.observedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });
});
