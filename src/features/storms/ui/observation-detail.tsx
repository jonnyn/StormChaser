import { Image } from 'expo-image';
import { ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { resolvePhotoUri } from '@/services/files/photo-store';
import { formatDateTime } from '@/shared/lib/dates';
import { formatCoordinatePair } from '@/shared/lib/coordinates';
import { formatWeatherSummary } from '@/shared/lib/units';
import { Button } from '@/shared/ui/button';
import { InfoCard } from '@/shared/ui/info-card';
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
  const { units } = useUnits();

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Image
        source={{ uri: resolvePhotoUri(observation.photoRelativePath) }}
        style={styles.photo}
        contentFit="cover"
        accessibilityLabel="Storm observation photo"
      />

      <InfoCard>
        <ThemedText type="smallBold">{stormTypeLabel(observation.stormType)}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {formatDateTime(observation.capturedAt)}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {formatCoordinatePair(observation.location.latitude, observation.location.longitude)}
        </ThemedText>
        {observation.location.accuracyMeters != null ? (
          <ThemedText type="small" themeColor="textSecondary">
            Accuracy ±{Math.round(observation.location.accuracyMeters)} m
          </ThemedText>
        ) : null}
      </InfoCard>

      <InfoCard>
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
      </InfoCard>

      <InfoCard>
        <ThemedText type="smallBold">Notes</ThemedText>
        <ThemedText themeColor="textSecondary">
          {observation.notes.trim().length > 0 ? observation.notes : 'No notes'}
        </ThemedText>
      </InfoCard>

      {errorMessage ? <ThemedText themeColor="danger">{errorMessage}</ThemedText> : null}

      <Button
        label="Delete observation"
        variant="danger"
        disabled={isDeleting}
        loading={isDeleting}
        onPress={onDelete}
      />
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
  weatherBlock: {
    gap: Spacing.half,
  },
});
