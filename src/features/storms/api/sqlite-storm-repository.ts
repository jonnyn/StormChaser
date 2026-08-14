import * as Crypto from 'expo-crypto';
import type { SQLiteDatabase } from 'expo-sqlite';

import { AppError } from '@/shared/lib/errors';

import type { CreateStormObservationInput, StormObservation } from '../model/storm-observation';
import { isStormType } from '../model/storm-type';
import type { StormRepository } from './storm-repository';

export type StormObservationRow = {
  id: string;
  created_at: string;
  captured_at: string;
  photo_relative_path: string;
  notes: string;
  storm_type: string;
  latitude: number;
  longitude: number;
  accuracy_meters: number | null;
  temperature_c: number | null;
  wind_speed_kmh: number | null;
  precipitation_mm: number | null;
  weather_code: number | null;
  weather_observed_at: string | null;
};

export function mapStormObservationRow(row: StormObservationRow): StormObservation {
  if (!isStormType(row.storm_type)) {
    throw new AppError('unknown', `Unknown storm type stored in the database: ${row.storm_type}`);
  }

  const weather =
    row.temperature_c == null ||
    row.wind_speed_kmh == null ||
    row.precipitation_mm == null ||
    row.weather_code == null ||
    row.weather_observed_at == null
      ? null
      : {
          temperatureC: row.temperature_c,
          windSpeedKmh: row.wind_speed_kmh,
          precipitationMm: row.precipitation_mm,
          weatherCode: row.weather_code,
          observedAt: row.weather_observed_at,
        };

  return {
    id: row.id,
    createdAt: row.created_at,
    capturedAt: row.captured_at,
    notes: row.notes,
    stormType: row.storm_type,
    location: {
      latitude: row.latitude,
      longitude: row.longitude,
      accuracyMeters: row.accuracy_meters,
    },
    weather,
    photoRelativePath: row.photo_relative_path,
  };
}

export function createSqliteStormRepository(db: SQLiteDatabase): StormRepository {
  return {
    async list() {
      const rows = await db.getAllAsync<StormObservationRow>(
        `SELECT * FROM storm_observations ORDER BY captured_at DESC`
      );
      return rows.map(mapStormObservationRow);
    },

    async getById(id: string) {
      const row = await db.getFirstAsync<StormObservationRow>(
        `SELECT * FROM storm_observations WHERE id = ?`,
        id
      );
      return row ? mapStormObservationRow(row) : null;
    },

    async create(input: CreateStormObservationInput) {
      const id = input.id ?? Crypto.randomUUID();
      const createdAt = new Date().toISOString();
      const observation = buildObservation(id, createdAt, input);

      await db.runAsync(
        `INSERT INTO storm_observations (
          id, created_at, captured_at, photo_relative_path, notes, storm_type,
          latitude, longitude, accuracy_meters,
          temperature_c, wind_speed_kmh, precipitation_mm, weather_code, weather_observed_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        observation.id,
        observation.createdAt,
        observation.capturedAt,
        observation.photoRelativePath,
        observation.notes,
        observation.stormType,
        observation.location.latitude,
        observation.location.longitude,
        observation.location.accuracyMeters,
        observation.weather?.temperatureC ?? null,
        observation.weather?.windSpeedKmh ?? null,
        observation.weather?.precipitationMm ?? null,
        observation.weather?.weatherCode ?? null,
        observation.weather?.observedAt ?? null
      );

      return observation;
    },

    async delete(id: string) {
      await db.runAsync(`DELETE FROM storm_observations WHERE id = ?`, id);
    },
  };
}

function buildObservation(
  id: string,
  createdAt: string,
  input: CreateStormObservationInput
): StormObservation {
  return {
    id,
    createdAt,
    capturedAt: input.capturedAt,
    notes: input.notes,
    stormType: input.stormType,
    location: input.location,
    weather: input.weather,
    photoRelativePath: input.photoRelativePath,
  };
}
