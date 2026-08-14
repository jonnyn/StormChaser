import { buildBackupManifest } from './backup-manifest';
import { createSupabaseCloudProvider } from './supabase-cloud-provider';
import type { CloudConfig } from './types';

jest.mock('expo-crypto', () => ({
  randomUUID: () => 'batch-test-id',
}));

const config: CloudConfig = {
  provider: 'supabase',
  supabaseUrl: 'https://example.supabase.co',
  anonKey: 'test-anon-key',
  bucket: 'storm-backups',
};

describe('createSupabaseCloudProvider', () => {
  it('uploads manifest first, then photos, with auth headers', async () => {
    const uploads: { objectPath: string; contentType: string }[] = [];

    const provider = createSupabaseCloudProvider(config, {
      uploadObject: async (_config, objectPath, _body, contentType) => {
        uploads.push({ objectPath, contentType });
      },
      getPhotoBody: () => 'photo-bytes',
    });

    const observations = [
      {
        id: 'obs-1',
        createdAt: '2026-08-13T12:00:00.000Z',
        capturedAt: '2026-08-13T11:30:00.000Z',
        notes: 'Shelf cloud',
        stormType: 'wall_cloud' as const,
        location: { latitude: 35.1, longitude: -97.2, accuracyMeters: null },
        weather: null,
        photoRelativePath: 'storms/obs-1.jpg',
      },
      {
        id: 'obs-2',
        createdAt: '2026-08-13T13:00:00.000Z',
        capturedAt: '2026-08-13T12:30:00.000Z',
        notes: 'Lightning',
        stormType: 'lightning' as const,
        location: { latitude: 35.2, longitude: -97.3, accuracyMeters: 8 },
        weather: null,
        photoRelativePath: 'storms/obs-2.jpg',
      },
    ];

    const manifest = buildBackupManifest(observations);
    const photoPaths = new Map(observations.map((o) => [o.id, o.photoRelativePath]));

    const result = await provider.uploadBackup(manifest, photoPaths);

    expect(result.observationCount).toBe(2);
    expect(result.uploadedCount).toBe(3);
    expect(result.batchId).toBe('batch-test-id');

    expect(uploads).toHaveLength(3);
    expect(uploads[0]?.objectPath).toMatch(/^storm-backups\/.+\/manifest\.json$/);
    expect(uploads[0]?.contentType).toBe('application/json');
    expect(uploads[1]?.objectPath).toMatch(/^storm-backups\/.+\/photos\/obs-1\.jpg$/);
    expect(uploads[1]?.contentType).toBe('image/jpeg');
    expect(uploads[2]?.objectPath).toMatch(/^storm-backups\/.+\/photos\/obs-2\.jpg$/);
  });
});

describe('createSupabaseCloudProvider defaultUploadObject', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('posts to the Supabase object URL with bearer auth', async () => {
    const fetchMock = jest.fn().mockResolvedValue({ ok: true });
    global.fetch = fetchMock as typeof fetch;

    const provider = createSupabaseCloudProvider(config);
    const manifest = buildBackupManifest([]);
    const photoPaths = new Map<string, string>();

    await provider.uploadBackup(manifest, photoPaths);

    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toMatch(
      /^https:\/\/example\.supabase\.co\/storage\/v1\/object\/storm-backups\/storm-backups\/.+\/manifest\.json$/
    );
    expect(init.method).toBe('POST');
    expect(init.headers).toMatchObject({
      Authorization: 'Bearer test-anon-key',
      'Content-Type': 'application/json',
    });
  });
});
