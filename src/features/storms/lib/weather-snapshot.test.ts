import type { CurrentWeather } from '@/features/weather/model/current-weather';

import { toWeatherSnapshot } from './weather-snapshot';

describe('toWeatherSnapshot', () => {
  it('copies the fields stored on an observation', () => {
    const current: CurrentWeather = {
      temperatureC: 18.2,
      apparentTemperatureC: 17.1,
      windSpeedKmh: 22.4,
      precipitationMm: 0.5,
      precipitationProbability: 40,
      weatherCode: 61,
      observedAt: '2026-08-14T12:00:00.000Z',
    };

    expect(toWeatherSnapshot(current)).toEqual({
      temperatureC: 18.2,
      windSpeedKmh: 22.4,
      precipitationMm: 0.5,
      weatherCode: 61,
      observedAt: '2026-08-14T12:00:00.000Z',
    });
  });
});
