import { useRouter } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useCurrentWeather } from '@/features/weather/hooks/use-current-weather';
import { WeatherNotFound } from '@/features/weather/ui/weather-not-found';
import { WeatherLoading, WeatherSummary } from '@/features/weather/ui/weather-summary';
import { useTheme } from '@/hooks/use-theme';
import { Screen } from '@/shared/ui/screen';

export default function ConditionsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { weather, location, isLoading, errorMessage, canRetry, refetch } = useCurrentWeather();
  const canLog = !isLoading && !errorMessage && Boolean(weather && location);

  return (
    <Screen>
      <ThemedText type="subtitle">Conditions</ThemedText>

      {isLoading ? <WeatherLoading /> : null}

      {!isLoading && errorMessage ? (
        <WeatherNotFound message={errorMessage} canRetry={canRetry} onRetry={refetch} />
      ) : null}

      {!isLoading && !errorMessage && weather && location ? (
        <WeatherSummary weather={weather} location={location} />
      ) : null}

      {canLog ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Log this weather as a storm observation"
          onPress={() => router.push('/capture')}
          style={({ pressed }) => [
            styles.logButton,
            { backgroundColor: theme.accent, opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <ThemedText style={styles.logButtonLabel}>Log this</ThemedText>
        </Pressable>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  logButton: {
    alignSelf: 'flex-start',
    marginTop: Spacing.one,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    borderRadius: Spacing.two,
  },
  logButtonLabel: {
    color: '#ffffff',
    fontWeight: '600',
  },
});
