import type { SQLiteDatabase, SQLiteRunResult } from 'expo-sqlite';

import {
  createSqliteStormRepository,
  mapStormObservationRow,
  type StormObservationRow,
} from './sqlite-storm-repository';

function createMemoryDatabase() {
  const rows = new Map<string, StormObservationRow>();

  const db = {
    async runAsync(sql: string, ...params: unknown[]): Promise<SQLiteRunResult> {
      const values = flattenParams(params);

      if (sql.includes('INSERT INTO storm_observations')) {
        const row = rowFromInsertParams(values);
        rows.set(row.id, row);
        return { lastInsertRowId: 0, changes: 1 };
      }

      if (sql.includes('DELETE FROM storm_observations')) {
        const id = String(values[0]);
        const existed = rows.delete(id);
        return { lastInsertRowId: 0, changes: existed ? 1 : 0 };
      }

      throw new Error(`Unexpected SQL in test fake: ${sql}`);
    },

    async getFirstAsync(sql: string, ...params: unknown[]): Promise<StormObservationRow | null> {
      const values = flattenParams(params);
      if (sql.includes('WHERE id = ?')) {
        return rows.get(String(values[0])) ?? null;
      }
      throw new Error(`Unexpected SQL in test fake: ${sql}`);
    },

    async getAllAsync(sql: string): Promise<StormObservationRow[]> {
      if (!sql.includes('FROM storm_observations')) {
        throw new Error(`Unexpected SQL in test fake: ${sql}`);
      }
      return [...rows.values()].sort((a, b) => b.captured_at.localeCompare(a.captured_at));
    },
  };

  return { db: db as unknown as SQLiteDatabase, rows };
}

function flattenParams(params: unknown[]): unknown[] {
  if (params.length === 1 && Array.isArray(params[0])) {
    return params[0];
  }
  return params;
}

function rowFromInsertParams(values: unknown[]): StormObservationRow {
  return {
    id: String(values[0]),
    created_at: String(values[1]),
    captured_at: String(values[2]),
    photo_relative_path: String(values[3]),
    notes: String(values[4]),
    storm_type: String(values[5]),
    latitude: Number(values[6]),
    longitude: Number(values[7]),
    accuracy_meters: (values[8] as number | null) ?? null,
    temperature_c: (values[9] as number | null) ?? null,
    wind_speed_kmh: (values[10] as number | null) ?? null,
    precipitation_mm: (values[11] as number | null) ?? null,
    weather_code: (values[12] as number | null) ?? null,
    weather_observed_at: (values[13] as string | null) ?? null,
  };
}

describe('mapStormObservationRow', () => {
  it('maps a full weather snapshot', () => {
    const observation = mapStormObservationRow({
      id: 'obs-1',
      created_at: '2026-08-13T18:00:00.000Z',
      captured_at: '2026-08-13T17:55:00.000Z',
      photo_relative_path: 'storms/obs-1.jpg',
      notes: 'Wall cloud forming',
      storm_type: 'wall_cloud',
      latitude: 35.2,
      longitude: -97.4,
      accuracy_meters: 12,
      temperature_c: 30,
      wind_speed_kmh: 35.4,
      precipitation_mm: 2.5,
      weather_code: 95,
      weather_observed_at: '2026-08-13T17:45:00.000Z',
    });

    expect(observation.stormType).toBe('wall_cloud');
    expect(observation.weather).toEqual({
      temperatureC: 30,
      windSpeedKmh: 35.4,
      precipitationMm: 2.5,
      weatherCode: 95,
      observedAt: '2026-08-13T17:45:00.000Z',
    });
  });

  it('maps null weather columns to a null snapshot', () => {
    const observation = mapStormObservationRow({
      id: 'obs-2',
      created_at: '2026-08-13T18:00:00.000Z',
      captured_at: '2026-08-13T17:55:00.000Z',
      photo_relative_path: 'storms/obs-2.jpg',
      notes: '',
      storm_type: 'other',
      latitude: 35.2,
      longitude: -97.4,
      accuracy_meters: null,
      temperature_c: null,
      wind_speed_kmh: null,
      precipitation_mm: null,
      weather_code: null,
      weather_observed_at: null,
    });

    expect(observation.weather).toBeNull();
    expect(observation.location.accuracyMeters).toBeNull();
  });
});

describe('createSqliteStormRepository', () => {
  it('creates, lists, gets, and deletes observations including nullable weather', async () => {
    const { db } = createMemoryDatabase();
    const repository = createSqliteStormRepository(db);

    const withWeather = await repository.create({
      id: 'with-weather',
      capturedAt: '2026-08-13T17:00:00.000Z',
      notes: 'Hail core',
      stormType: 'hail',
      location: { latitude: 35.1, longitude: -97.5, accuracyMeters: 8 },
      weather: {
        temperatureC: 21.1,
        windSpeedKmh: 64.4,
        precipitationMm: 12.7,
        weatherCode: 96,
        observedAt: '2026-08-13T16:55:00.000Z',
      },
      photoRelativePath: 'storms/with-weather.jpg',
    });

    const withoutWeather = await repository.create({
      id: 'without-weather',
      capturedAt: '2026-08-13T18:00:00.000Z',
      notes: 'No network',
      stormType: 'other',
      location: { latitude: 35.3, longitude: -97.2, accuracyMeters: null },
      weather: null,
      photoRelativePath: 'storms/without-weather.jpg',
    });

    const listed = await repository.list();
    expect(listed.map((item) => item.id)).toEqual(['without-weather', 'with-weather']);
    expect(listed[0]?.weather).toBeNull();
    expect(listed[1]?.weather?.temperatureC).toBe(21.1);

    await expect(repository.getById(withWeather.id)).resolves.toMatchObject({
      id: 'with-weather',
      stormType: 'hail',
    });
    await expect(repository.getById('missing')).resolves.toBeNull();

    await repository.delete(withoutWeather.id);
    const afterDelete = await repository.list();
    expect(afterDelete).toHaveLength(1);
    expect(afterDelete[0]?.id).toBe('with-weather');
  });
});
