import Constants from 'expo-constants';

import type { StormObservation } from '@/features/storms/model/storm-observation';

import type { BackupManifest } from './types';

export function buildBackupManifest(observations: StormObservation[]): BackupManifest {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    appVersion: Constants.expoConfig?.version ?? 'unknown',
    observationCount: observations.length,
    observations,
  };
}

export function backupObjectPrefix(batchId: string): string {
  return `storm-backups/${batchId}`;
}
