import { Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ObservationDetailView } from '@/features/storms/ui/observation-detail-view';
import { parseRouteParam } from '@/shared/lib/route-params';
import { Screen } from '@/shared/ui/screen';

export default function ObservationDetailScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = parseRouteParam(params.id);

  return (
    <Screen style={styles.screen}>
      <Stack.Screen options={{ title: 'Observation', headerBackTitle: 'Back' }} />
      <ObservationDetailView id={id} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
