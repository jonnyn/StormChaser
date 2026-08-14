import { ThemedText } from '@/components/themed-text';
import { useCurrentWeather } from '@/features/weather/hooks/use-current-weather';
import { WeatherNotFound } from '@/features/weather/ui/weather-not-found';
import { WeatherLoading, WeatherSummary } from '@/features/weather/ui/weather-summary';
import { Screen } from '@/shared/ui/screen';

export default function ConditionsScreen() {
  const { weather, location, isLoading, errorMessage, canRetry, refetch } = useCurrentWeather();

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
    </Screen>
  );
}
