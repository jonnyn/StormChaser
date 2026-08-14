import { useRouter } from 'expo-router';
import { Pressable, RefreshControl, ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useCurrentWeather } from '@/features/weather/hooks/use-current-weather';
import { HourlyForecast } from '@/features/weather/ui/hourly-forecast';
import { WeatherForecast } from '@/features/weather/ui/weather-forecast';
import { WeatherNotFound } from '@/features/weather/ui/weather-not-found';
import { WeatherLoading, WeatherSummary } from '@/features/weather/ui/weather-summary';
import { useTheme } from '@/hooks/use-theme';
import { Screen } from '@/shared/ui/screen';

export default function ConditionsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const {
    weather,
    hourly,
    daily,
    location,
    isLoading,
    isFetching,
    errorMessage,
    canRetry,
    refetch,
  } = useCurrentWeather();
  const canLog = !isLoading && !errorMessage && Boolean(weather && location);
  const isPullRefreshing = isFetching && !isLoading;

  return (
    <Screen>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isPullRefreshing}
            onRefresh={refetch}
            tintColor={theme.accent}
            colors={[theme.accent]}
          />
        }
      >
        <ThemedText type="subtitle">Conditions</ThemedText>

        {isLoading ? <WeatherLoading /> : null}

        {!isLoading && errorMessage ? (
          <WeatherNotFound message={errorMessage} canRetry={canRetry} onRetry={refetch} />
        ) : null}

        {!isLoading && !errorMessage && weather && location ? (
          <>
            <WeatherSummary weather={weather} location={location} />
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
            {hourly && hourly.length > 0 ? <HourlyForecast hours={hourly} /> : null}
            {daily && daily.length > 0 ? <WeatherForecast days={daily} /> : null}
          </>
        ) : null}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    gap: Spacing.three,
    flexGrow: 1,
    paddingBottom: Spacing.six,
  },
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
