import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type LoadingBlockProps = {
  message?: string;
  accessibilityLabel?: string;
};

export function LoadingBlock({ message, accessibilityLabel }: LoadingBlockProps) {
  const theme = useTheme();

  return (
    <View
      accessibilityLabel={accessibilityLabel ?? message ?? 'Loading'}
      accessibilityRole="progressbar"
      accessible
      style={styles.container}
    >
      <ActivityIndicator color={theme.accent} />
      {message ? <ThemedText themeColor="textSecondary">{message}</ThemedText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
    paddingTop: Spacing.four,
  },
});
