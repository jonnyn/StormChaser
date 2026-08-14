import { Image } from 'expo-image';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { resolvePhotoUri } from '@/services/files/photo-store';
import { formatDateTime } from '@/shared/lib/dates';
import { formatWeatherSummary } from '@/shared/lib/units';
import { useUnits } from '@/shared/units/units-context';

import type { StormObservation } from '../model/storm-observation';
import { stormTypeLabel } from '../model/storm-type';

type ObservationDetailProps = {
  observation: StormObservation;
  isDeleting: boolean;
  errorMessage: string | null;
  onDelete: () => void;
};

export function ObservationDetail({
  observation,
  isDeleting,
  errorMessage,
  onDelete,
}: ObservationDetailProps) {
  const theme = useTheme();
  const { units } = useUnits();

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Image
        source={{ uri: resolvePhotoUri(observation.photoRelativePath) }}
        style={styles.photo}
        contentFit="cover"
        accessibilityLabel="Storm observation photo"
      />

      <ThemedView type="backgroundElement" style={styles.card}>
        <ThemedText type="smallBold">{stormTypeLabel(observation.stormType)}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {formatDateTime(observation.capturedAt)}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {observation.location.latitude.toFixed(3)}, {observation.location.longitude.toFixed(3)}
        </ThemedText>
        {observation.location.accuracyMeters != null ? (
          <ThemedText type="small" themeColor="textSecondary">
            Accuracy ±{Math.round(observation.location.accuracyMeters)} m
          </ThemedText>
        ) : null}
      </ThemedView>

      <ThemedView type="backgroundElement" style={styles.card}>
        <ThemedText type="smallBold">Weather at capture</ThemedText>
        {observation.weather ? (
          <View style={styles.weatherBlock}>
            <ThemedText type="small" themeColor="textSecondary">
              {formatWeatherSummary(observation.weather, units)}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              Observed {formatDateTime(observation.weather.observedAt)}
            </ThemedText>
          </View>
        ) : (
          <ThemedText type="small" themeColor="warning">
            Weather unavailable at capture
          </ThemedText>
        )}
      </ThemedView>

      <ThemedView type="backgroundElement" style={styles.card}>
        <ThemedText type="smallBold">Notes</ThemedText>
        <ThemedText themeColor="textSecondary">
          {observation.notes.trim().length > 0 ? observation.notes : 'No notes'}
        </ThemedText>
      </ThemedView>

      {errorMessage ? <ThemedText themeColor="danger">{errorMessage}</ThemedText> : null}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Delete observation"
        disabled={isDeleting}
        onPress={onDelete}
        style={({ pressed }) => [
          styles.deleteButton,
          {
            backgroundColor: theme.danger,
            opacity: isDeleting ? 0.6 : pressed ? 0.85 : 1,
          },
        ]}
      >
        {isDeleting ? (
          <ActivityIndicator color={theme.onDanger} />
        ) : (
          <ThemedText style={[styles.deleteLabel, { color: theme.onDanger }]}>
            Delete observation
          </ThemedText>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: Spacing.three,
    paddingBottom: Spacing.six,
  },
  photo: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: Spacing.three,
  },
  card: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  weatherBlock: {
    gap: Spacing.half,
  },
  deleteButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.three,
    borderRadius: Spacing.two,
    minHeight: 48,
  },
  deleteLabel: {
    fontWeight: '600',
  },
});
