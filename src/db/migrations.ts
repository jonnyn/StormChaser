import type { SQLiteDatabase } from 'expo-sqlite';

export const DATABASE_VERSION = 1;

const CREATE_STORM_OBSERVATIONS = `
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
  temperature_f REAL,
  wind_speed_mph REAL,
  precipitation_in REAL,
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
    await db.execAsync(CREATE_STORM_OBSERVATIONS);
    currentVersion = 1;
  }

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
