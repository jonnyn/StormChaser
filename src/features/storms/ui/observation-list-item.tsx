import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { resolvePhotoUri } from '@/services/files/photo-store';
import { formatDateTime } from '@/shared/lib/dates';
import { formatCoordinatePair } from '@/shared/lib/coordinates';

import type { StormObservation } from '../model/storm-observation';
import { stormTypeLabel } from '../model/storm-type';

type ObservationListItemProps = {
  observation: StormObservation;
  onPress: (id: string) => void;
};

export function ObservationListItem({ observation, onPress }: ObservationListItemProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${stormTypeLabel(observation.stormType)} observation`}
      onPress={() => onPress(observation.id)}
      style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
    >
      <ThemedView type="backgroundElement" style={styles.row}>
        <Image
          source={{ uri: resolvePhotoUri(observation.photoRelativePath) }}
          style={styles.thumb}
          contentFit="cover"
        />
        <View style={styles.meta}>
          <ThemedText type="smallBold">{stormTypeLabel(observation.stormType)}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {formatDateTime(observation.capturedAt)}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {formatCoordinatePair(observation.location.latitude, observation.location.longitude)}
          </ThemedText>
        </View>
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.three,
    padding: Spacing.two,
    borderRadius: Spacing.three,
    alignItems: 'center',
  },
  thumb: {
    width: 72,
    height: 72,
    borderRadius: Spacing.two,
  },
  meta: {
    flex: 1,
    gap: Spacing.half,
  },
});
