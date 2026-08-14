import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type WeatherNotFoundProps = {
  message: string;
  canRetry: boolean;
  onRetry: () => void;
};

export function WeatherNotFound({ message, canRetry, onRetry }: WeatherNotFoundProps) {
  const theme = useTheme();

  return (
    <ThemedView type="backgroundElement" style={styles.notFound}>
      <ThemedText type="smallBold">Not found</ThemedText>
      <ThemedText themeColor="textSecondary">{message}</ThemedText>
      {canRetry ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Try again"
          onPress={onRetry}
          style={({ pressed }) => [
            styles.retry,
            { backgroundColor: theme.accent, opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <ThemedText style={styles.retryLabel}>Try again</ThemedText>
        </Pressable>
      ) : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  notFound: {
    borderRadius: Spacing.three,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  retry: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
  },
  retryLabel: {
    color: '#ffffff',
    fontWeight: '600',
  },
});
