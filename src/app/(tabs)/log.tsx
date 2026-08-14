import { useRouter } from 'expo-router';
import { useCallback } from 'react';

import { ThemedText } from '@/components/themed-text';
import { useCloudBackup } from '@/features/storms/hooks/use-cloud-backup';
import { useObservations } from '@/features/storms/hooks/use-observations';
import { CloudBackupSection } from '@/features/storms/ui/cloud-backup-section';
import { ObservationList } from '@/features/storms/ui/observation-list';
import { Screen } from '@/shared/ui/screen';

export default function FieldLogScreen() {
  const router = useRouter();
  const { observations, isLoading, isRefreshing, errorMessage, refresh } = useObservations();
  const cloudBackup = useCloudBackup(observations.length);

  const onRefresh = useCallback(() => {
    void refresh({ quiet: true });
  }, [refresh]);

  const onBackup = useCallback(() => {
    void cloudBackup.backup();
  }, [cloudBackup]);

  return (
    <Screen style={{ flex: 1 }}>
      <ThemedText type="subtitle">Field Log</ThemedText>
      <ObservationList
        observations={observations}
        isLoading={isLoading}
        isRefreshing={isRefreshing}
        errorMessage={errorMessage}
        onRefresh={onRefresh}
        onPressItem={(id) => router.push(`/observation/${id}`)}
        onDocumentStorm={() => router.push('/capture')}
        listFooter={
          <CloudBackupSection
            isConfigured={cloudBackup.isConfigured}
            isUploading={cloudBackup.isUploading}
            isOffline={cloudBackup.isOffline}
            observationCount={observations.length}
            lastResult={cloudBackup.lastResult}
            errorMessage={cloudBackup.errorMessage}
            onBackup={onBackup}
          />
        }
      />
    </Screen>
  );
}
