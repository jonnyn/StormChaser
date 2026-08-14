import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useObservation } from '@/features/storms/hooks/use-observation';
import { ObservationDetail } from '@/features/storms/ui/observation-detail';
import { useTheme } from '@/hooks/use-theme';
import { Screen } from '@/shared/ui/screen';

export default function ObservationDetailScreen() {
  const router = useRouter();
  const theme = useTheme();
  const params = useLocalSearchParams<{ id: string }>();
  const id = typeof params.id === 'string' ? params.id : (params.id?.[0] ?? '');
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
    return (
      <Screen>
        <Stack.Screen options={{ title: 'Observation', headerBackTitle: 'Back' }} />
        <ThemedText themeColor="danger">Missing observation id.</ThemedText>
      </Screen>
    );
  }

  return (
    <Screen style={styles.screen}>
      <Stack.Screen options={{ title: 'Observation', headerBackTitle: 'Back' }} />
      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={theme.accent} />
          <ThemedText themeColor="textSecondary">Loading observation…</ThemedText>
        </View>
      ) : null}

      {!isLoading && !observation ? (
        <View style={styles.missing}>
          <ThemedText themeColor="danger">
            {errorMessage ?? 'This observation was not found.'}
          </ThemedText>
          <ThemedText
            type="linkPrimary"
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace('/log');
              }
            }}
          >
            Back to Field Log
          </ThemedText>
        </View>
      ) : null}

      {!isLoading && observation ? (
        <ObservationDetail
          observation={observation}
          isDeleting={isDeleting}
          errorMessage={errorMessage}
          onDelete={confirmDelete}
        />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  loading: {
    gap: 12,
    paddingTop: 24,
  },
  missing: {
    gap: 16,
  },
});
