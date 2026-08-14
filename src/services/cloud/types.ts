import type { StormObservation } from '@/features/storms/model/storm-observation';

export type BackupManifest = {
  version: 1;
  exportedAt: string;
  appVersion: string;
  observationCount: number;
  observations: StormObservation[];
};

export type CloudBackupResult = {
  batchId: string;
  uploadedCount: number;
  observationCount: number;
};

export type CloudBackupProvider = {
  uploadBackup: (
    manifest: BackupManifest,
    photoPaths: ReadonlyMap<string, string>
  ) => Promise<CloudBackupResult>;
};

export type CloudConfig = {
  provider: 'supabase';
  supabaseUrl: string;
  anonKey: string;
  bucket: string;
};
