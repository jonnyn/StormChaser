import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { useObservations } from '@/features/storms/hooks/use-observations';
import { ObservationList } from '@/features/storms/ui/observation-list';
import { Screen } from '@/shared/ui/screen';

export default function FieldLogScreen() {
  const router = useRouter();
  const { observations, isLoading, errorMessage } = useObservations();

  return (
    <Screen style={{ flex: 1 }}>
      <ThemedText type="subtitle">Field Log</ThemedText>
      <ObservationList
        observations={observations}
        isLoading={isLoading}
        errorMessage={errorMessage}
        onPressItem={(id) => router.push(`/observation/${id}`)}
        onDocumentStorm={() => router.push('/capture')}
      />
    </Screen>
  );
}
