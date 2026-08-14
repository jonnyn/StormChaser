import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { CloudBackupResult } from '@/services/cloud/types';
import { Button } from '@/shared/ui/button';
import { InfoCard } from '@/shared/ui/info-card';

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
      <InfoCard style={styles.card}>
        <ThemedText type="smallBold">Cloud backup</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          Cloud backup is available on iOS and Android.
        </ThemedText>
      </InfoCard>
    );
  }

  if (!isConfigured) {
    return (
      <InfoCard style={styles.card}>
        <ThemedText type="smallBold">Cloud backup</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          Cloud backup not configured. Add credentials to .env.local.
        </ThemedText>
      </InfoCard>
    );
  }

  const isEmpty = observationCount === 0;
  const isDisabled = isUploading || isOffline || isEmpty;

  return (
    <InfoCard style={styles.card}>
      <ThemedText type="smallBold">Cloud backup</ThemedText>

      {isOffline ? (
        <ThemedText type="small" themeColor="textSecondary">
          Connect to the internet to back up your field log.
        </ThemedText>
      ) : null}

      {isUploading ? (
        <View
          accessibilityRole="progressbar"
          accessibilityLabel={`Backing up ${observationCount} observations`}
          style={styles.progressRow}
        >
          <ActivityIndicator color={theme.accent} />
          <ThemedText type="small" themeColor="textSecondary">
            Backing up {observationCount} observation{observationCount === 1 ? '' : 's'}…
          </ThemedText>
        </View>
      ) : (
        <Button
          label={isEmpty ? 'No observations to back up' : 'Back up to cloud'}
          disabled={isDisabled}
          onPress={onBackup}
          style={styles.button}
        />
      )}

      {lastResult ? (
        <ThemedText type="small" themeColor="textSecondary">
          Backed up {lastResult.observationCount} observation
          {lastResult.observationCount === 1 ? '' : 's'}.
        </ThemedText>
      ) : null}

      {errorMessage ? <ThemedText themeColor="danger">{errorMessage}</ThemedText> : null}
    </InfoCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: Spacing.two,
    gap: Spacing.two,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  button: {
    alignSelf: 'flex-start',
  },
});
