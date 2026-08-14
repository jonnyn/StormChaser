import type { SQLiteDatabase } from 'expo-sqlite';

import { fahrenheitToCelsius, inchesToMm, mphToKmh } from '@/shared/lib/units';

export const DATABASE_VERSION = 2;

const CREATE_STORM_OBSERVATIONS_V2 = `
CREATE TABLE IF NOT EXISTS storm_observations (
  id TEXT PRIMARY KEY NOT NULL,
  created_at TEXT NOT NULL,
  captured_at TEXT NOT NULL,
  photo_relative_path TEXT NOT NULL,
  notes TEXT NOT NULL DEFAULT '',
  storm_type TEXT NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  accuracy_meters REAL,
  temperature_c REAL,
  wind_speed_kmh REAL,
  precipitation_mm REAL,
  weather_code INTEGER,
  weather_observed_at TEXT
);
`;

export async function migrateDatabase(db: SQLiteDatabase): Promise<void> {
  await db.execAsync('PRAGMA journal_mode = WAL;');
  await db.execAsync('PRAGMA foreign_keys = ON;');

  const row = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  let currentVersion = row?.user_version ?? 0;

  if (currentVersion >= DATABASE_VERSION) {
    return;
  }

  if (currentVersion === 0) {
    await db.execAsync(CREATE_STORM_OBSERVATIONS_V2);
    currentVersion = 2;
  }

  if (currentVersion === 1) {
    await migrateImperialSchemaToMetric(db);
    currentVersion = 2;
  }

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}

async function migrateImperialSchemaToMetric(db: SQLiteDatabase): Promise<void> {
  await db.execAsync(
    `ALTER TABLE storm_observations RENAME COLUMN temperature_f TO temperature_c;`
  );
  await db.execAsync(
    `ALTER TABLE storm_observations RENAME COLUMN wind_speed_mph TO wind_speed_kmh;`
  );
  await db.execAsync(
    `ALTER TABLE storm_observations RENAME COLUMN precipitation_in TO precipitation_mm;`
  );

  const rows = await db.getAllAsync<{
    id: string;
    temperature_c: number | null;
    wind_speed_kmh: number | null;
    precipitation_mm: number | null;
  }>(`SELECT id, temperature_c, wind_speed_kmh, precipitation_mm FROM storm_observations`);

  for (const observation of rows) {
    if (
      observation.temperature_c == null ||
      observation.wind_speed_kmh == null ||
      observation.precipitation_mm == null
    ) {
      continue;
    }

    await db.runAsync(
      `UPDATE storm_observations
       SET temperature_c = ?, wind_speed_kmh = ?, precipitation_mm = ?
       WHERE id = ?`,
      fahrenheitToCelsius(observation.temperature_c),
      mphToKmh(observation.wind_speed_kmh),
      inchesToMm(observation.precipitation_mm),
      observation.id
    );
  }
}
