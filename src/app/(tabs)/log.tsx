import { useRouter } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { Screen } from '@/shared/ui/screen';

export default function FieldLogScreen() {
  const router = useRouter();
  const theme = useTheme();

  return (
    <Screen>
      <ThemedText type="subtitle">Field Log</ThemedText>
      <ThemedText themeColor="textSecondary" style={styles.lede}>
        Documented storms will be listed here in the next milestone.
      </ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        Capture a photo with weather and location metadata now. The list view lands in Milestone 4.
      </ThemedText>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Document a storm"
        onPress={() => router.push('/capture')}
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: theme.accent, opacity: pressed ? 0.85 : 1 },
        ]}
      >
        <ThemedText style={styles.buttonLabel}>Document storm</ThemedText>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  lede: {
    marginBottom: Spacing.one,
  },
  button: {
    marginTop: Spacing.two,
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    borderRadius: Spacing.two,
  },
  buttonLabel: {
    color: '#ffffff',
    fontWeight: '600',
  },
});
