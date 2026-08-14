import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

export function OfflineBanner() {
  return (
    <ThemedView
      accessibilityRole="alert"
      accessibilityLabel="You are offline. Field log and saved observations still work on this device."
      type="backgroundElement"
      style={styles.banner}
    >
      <ThemedText type="smallBold">Offline</ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        Field log and saved observations still work on this device.
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.one,
  },
});
