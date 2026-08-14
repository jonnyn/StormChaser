import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useMemo, useState } from 'react';

import { createSqliteStormRepository } from '@/features/storms/api/sqlite-storm-repository';
import { buildBackupManifest } from '@/services/cloud/backup-manifest';
import { isCloudConfigured } from '@/services/cloud/cloud-config';
import { createCloudProvider } from '@/services/cloud/create-cloud-provider';
import type { CloudBackupResult } from '@/services/cloud/types';
import { useNetworkStatus } from '@/services/network/use-network-status';
import { isAppError } from '@/shared/lib/errors';

export function useCloudBackup(observationCount: number) {
  const db = useSQLiteContext();
  const { isOffline } = useNetworkStatus();
  const provider = useMemo(() => createCloudProvider(), []);
  const isConfigured = isCloudConfigured();

  const [isUploading, setIsUploading] = useState(false);
  const [lastResult, setLastResult] = useState<CloudBackupResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const backup = useCallback(async () => {
    if (!provider || isOffline || observationCount === 0) {
      return;
    }

    setIsUploading(true);
    setErrorMessage(null);
    setLastResult(null);

    try {
      const repository = createSqliteStormRepository(db);
      const observations = await repository.list();

      if (observations.length === 0) {
        return;
      }

      const manifest = buildBackupManifest(observations);
      const photoPaths = new Map(observations.map((o) => [o.id, o.photoRelativePath]));
      const result = await provider.uploadBackup(manifest, photoPaths);
      setLastResult(result);
    } catch (error) {
      setErrorMessage(isAppError(error) ? error.userMessage : 'Cloud backup failed.');
    } finally {
      setIsUploading(false);
    }
  }, [db, isOffline, observationCount, provider]);

  return {
    isConfigured,
    isUploading,
    isOffline,
    lastResult,
    errorMessage,
    observationCount,
    backup,
  };
}
