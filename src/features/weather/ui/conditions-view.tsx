import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useCurrentWeather } from '@/features/weather/hooks/use-current-weather';
import { HourlyForecast } from '@/features/weather/ui/hourly-forecast';
import { WeatherForecast } from '@/features/weather/ui/weather-forecast';
import { WeatherNotFound } from '@/features/weather/ui/weather-not-found';
import { WeatherLoading, WeatherSummary } from '@/features/weather/ui/weather-summary';
import { AppRefreshControl } from '@/shared/ui/app-refresh-control';
import { Button } from '@/shared/ui/button';
import { OfflineBanner } from '@/shared/ui/offline-banner';

export function ConditionsView() {
  const router = useRouter();
  const {
    weather,
    hourly,
    daily,
    location,
    isLoading,
    isFetching,
    isOffline,
    isShowingCachedWeather,
    errorMessage,
    canRetry,
    refetch,
  } = useCurrentWeather();

  const canLog = !isLoading && !errorMessage && Boolean(weather && location);
  const isPullRefreshing = isFetching && !isLoading;

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      refreshControl={<AppRefreshControl refreshing={isPullRefreshing} onRefresh={refetch} />}
    >
      <ThemedText type="subtitle">Conditions</ThemedText>

      {isOffline ? <OfflineBanner /> : null}

      {isShowingCachedWeather ? (
        <ThemedText type="small" themeColor="textSecondary">
          Last saved conditions
        </ThemedText>
      ) : null}

      {isLoading ? <WeatherLoading /> : null}

      {!isLoading && errorMessage ? (
        <WeatherNotFound message={errorMessage} canRetry={canRetry} onRetry={refetch} />
      ) : null}

      {!isLoading && !errorMessage && weather && location ? (
        <>
          <WeatherSummary weather={weather} location={location} />
          {canLog ? (
            <Button
              label="Log this"
              accessibilityLabel="Log this weather as a storm observation"
              onPress={() => router.push('/capture')}
              style={styles.logButton}
            />
          ) : null}
          {hourly && hourly.length > 0 ? <HourlyForecast hours={hourly} /> : null}
          {daily && daily.length > 0 ? <WeatherForecast days={daily} /> : null}
        </>
      ) : null}
    </ScrollView>
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
  },
});
