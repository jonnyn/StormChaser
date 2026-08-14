import { useRouter } from 'expo-router';
import { Alert, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { LoadingBlock } from '@/shared/ui/loading-block';
import { navigateBackOrReplace } from '@/shared/lib/navigation';

import { useObservation } from '../hooks/use-observation';
import { ObservationDetail } from './observation-detail';

type ObservationDetailViewProps = {
  id: string;
};

export function ObservationDetailView({ id }: ObservationDetailViewProps) {
  const router = useRouter();
  const { observation, isLoading, errorMessage, isDeleting, deleteObservation } =
    useObservation(id);

  function confirmDelete() {
    Alert.alert(
      'Delete observation?',
      'This removes the photo and metadata from this device. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            void deleteObservation();
          },
        },
      ]
    );
  }

  if (!id) {
    return <ThemedText themeColor="danger">Missing observation id.</ThemedText>;
  }

  if (isLoading) {
    return <LoadingBlock message="Loading observation…" />;
  }

  if (!observation) {
    return (
      <View style={styles.missing}>
        <ThemedText themeColor="danger">
          {errorMessage ?? 'This observation was not found.'}
        </ThemedText>
        <ThemedText type="linkPrimary" onPress={() => navigateBackOrReplace(router, '/log')}>
          Back to Field Log
        </ThemedText>
      </View>
    );
  }

  return (
    <ObservationDetail
      observation={observation}
      isDeleting={isDeleting}
      errorMessage={errorMessage}
      onDelete={confirmDelete}
    />
  );
}

const styles = StyleSheet.create({
  missing: {
    gap: 16,
  },
});
