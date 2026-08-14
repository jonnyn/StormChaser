import type { StormObservation } from '@/features/storms/model/storm-observation';

import { buildBackupManifest } from './backup-manifest';

const sampleObservation: StormObservation = {
  id: 'obs-1',
  createdAt: '2026-08-13T12:00:00.000Z',
  capturedAt: '2026-08-13T11:30:00.000Z',
  notes: 'Wall cloud forming',
  stormType: 'wall_cloud',
  location: { latitude: 35.1, longitude: -97.2, accuracyMeters: 12 },
  weather: {
    temperatureC: 22,
    windSpeedKmh: 45,
    precipitationMm: 0,
    weatherCode: 3,
    observedAt: '2026-08-13T11:29:00.000Z',
  },
  photoRelativePath: 'storms/obs-1.jpg',
};

describe('buildBackupManifest', () => {
  it('sets version, counts, and preserves observations', () => {
    const manifest = buildBackupManifest([sampleObservation]);

    expect(manifest.version).toBe(1);
    expect(manifest.observationCount).toBe(1);
    expect(manifest.observations).toEqual([sampleObservation]);
    expect(manifest.exportedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(manifest.appVersion).toBeTruthy();
  });

  it('handles an empty log', () => {
    const manifest = buildBackupManifest([]);

    expect(manifest.observationCount).toBe(0);
    expect(manifest.observations).toEqual([]);
  });
});
