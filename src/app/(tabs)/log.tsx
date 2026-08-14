import { useRouter } from 'expo-router';
import { useCallback } from 'react';

import { ThemedText } from '@/components/themed-text';
import { useObservations } from '@/features/storms/hooks/use-observations';
import { ObservationList } from '@/features/storms/ui/observation-list';
import { Screen } from '@/shared/ui/screen';

export default function FieldLogScreen() {
  const router = useRouter();
  const { observations, isLoading, isRefreshing, errorMessage, refresh } = useObservations();

  const onRefresh = useCallback(() => {
    void refresh({ quiet: true });
  }, [refresh]);

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
      />
    </Screen>
  );
}
