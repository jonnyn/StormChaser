import { ActivityIndicator, Platform, Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { CloudBackupResult } from '@/services/cloud/types';

type CloudBackupSectionProps = {
  isConfigured: boolean;
  isUploading: boolean;
  isOffline: boolean;
  observationCount: number;
  lastResult: CloudBackupResult | null;
  errorMessage: string | null;
  onBackup: () => void;
};

export function CloudBackupSection({
  isConfigured,
  isUploading,
  isOffline,
  observationCount,
  lastResult,
  errorMessage,
  onBackup,
}: CloudBackupSectionProps) {
  const theme = useTheme();

  if (Platform.OS === 'web') {
    return (
      <ThemedView type="backgroundElement" style={styles.card}>
        <ThemedText type="smallBold">Cloud backup</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          Cloud backup is available on iOS and Android.
        </ThemedText>
      </ThemedView>
    );
  }

  if (!isConfigured) {
    return (
      <ThemedView type="backgroundElement" style={styles.card}>
        <ThemedText type="smallBold">Cloud backup</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          Cloud backup not configured. Add credentials to .env.local.
        </ThemedText>
      </ThemedView>
    );
  }

  const isEmpty = observationCount === 0;
  const isDisabled = isUploading || isOffline || isEmpty;

  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <ThemedText type="smallBold">Cloud backup</ThemedText>

      {isOffline ? (
        <ThemedText type="small" themeColor="textSecondary">
          Connect to the internet to back up your field log.
        </ThemedText>
      ) : null}

      {isUploading ? (
        <ThemedView
          accessibilityRole="progressbar"
          accessibilityLabel={`Backing up ${observationCount} observations`}
          style={styles.progressRow}
        >
          <ActivityIndicator color={theme.accent} />
          <ThemedText type="small" themeColor="textSecondary">
            Backing up {observationCount} observation{observationCount === 1 ? '' : 's'}…
          </ThemedText>
        </ThemedView>
      ) : (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back up field log to cloud"
          accessibilityState={{ disabled: isDisabled }}
          disabled={isDisabled}
          onPress={onBackup}
          style={({ pressed }) => [
            styles.button,
            {
              backgroundColor: theme.accent,
              opacity: isDisabled ? 0.5 : pressed ? 0.85 : 1,
            },
          ]}
        >
          <ThemedText style={[styles.buttonLabel, { color: theme.onAccent }]}>
            {isEmpty ? 'No observations to back up' : 'Back up to cloud'}
          </ThemedText>
        </Pressable>
      )}

      {lastResult ? (
        <ThemedText type="small" themeColor="textSecondary">
          Backed up {lastResult.observationCount} observation
          {lastResult.observationCount === 1 ? '' : 's'}.
        </ThemedText>
      ) : null}

      {errorMessage ? <ThemedText themeColor="danger">{errorMessage}</ThemedText> : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  button: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
    minHeight: 44,
    justifyContent: 'center',
  },
  buttonLabel: {
    fontWeight: '600',
  },
});
