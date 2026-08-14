import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { Button } from '@/shared/ui/button';

type ObservationListEmptyProps = {
  onDocumentStorm: () => void;
};

export function ObservationListEmpty({ onDocumentStorm }: ObservationListEmptyProps) {
  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <ThemedText type="smallBold">No storms logged yet</ThemedText>
      <ThemedText themeColor="textSecondary">
        Capture a photo with location and weather metadata to start your field log.
      </ThemedText>
      <Button
        label="Document storm"
        accessibilityLabel="Document a storm"
        onPress={onDocumentStorm}
        style={styles.button}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Spacing.three,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  button: {
    alignSelf: 'flex-start',
  },
});
