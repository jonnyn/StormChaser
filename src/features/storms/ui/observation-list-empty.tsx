import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ObservationListEmptyProps = {
  onDocumentStorm: () => void;
};

export function ObservationListEmpty({ onDocumentStorm }: ObservationListEmptyProps) {
  const theme = useTheme();

  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <ThemedText type="smallBold">No storms logged yet</ThemedText>
      <ThemedText themeColor="textSecondary">
        Capture a photo with location and weather metadata to start your field log.
      </ThemedText>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Document a storm"
        onPress={onDocumentStorm}
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: theme.accent, opacity: pressed ? 0.85 : 1 },
        ]}
      >
        <ThemedText style={[styles.buttonLabel, { color: theme.onAccent }]}>
          Document storm
        </ThemedText>
      </Pressable>
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
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
  },
  buttonLabel: {
    fontWeight: '600',
  },
});
