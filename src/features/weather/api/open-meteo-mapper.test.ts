import { mapOpenMeteoCurrent } from './open-meteo-mapper';
import { openMeteoCurrentSchema } from './open-meteo-schema';

const fixture = {
  latitude: 35.2,
  longitude: -97.4,
  current: {
    time: '2026-08-13T17:00',
    temperature_2m: 86.4,
    wind_speed_10m: 18.2,
    precipitation: 0.12,
    weather_code: 95,
  },
};

describe('openMeteoCurrentSchema', () => {
  it('accepts a valid Open-Meteo current payload', () => {
    const result = openMeteoCurrentSchema.safeParse(fixture);
    expect(result.success).toBe(true);
  });

  it('rejects a payload missing current fields', () => {
    const result = openMeteoCurrentSchema.safeParse({
      latitude: 1,
      longitude: 2,
      current: { time: '2026-08-13T17:00' },
    });
    expect(result.success).toBe(false);
  });
});

describe('mapOpenMeteoCurrent', () => {
  it('maps DTO fields onto the domain CurrentWeather type', () => {
    const parsed = openMeteoCurrentSchema.parse(fixture);
    const weather = mapOpenMeteoCurrent(parsed);

    expect(weather).toEqual({
      temperatureF: 86.4,
      windSpeedMph: 18.2,
      precipitationIn: 0.12,
      weatherCode: 95,
      observedAt: expect.any(String),
    });
    expect(Number.isNaN(Date.parse(weather.observedAt))).toBe(false);
  });
});
