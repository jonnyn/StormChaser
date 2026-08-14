import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { GeoPoint } from '@/services/location/types';
import { formatDateTime } from '@/shared/lib/dates';

import type { CurrentWeather } from '../model/current-weather';
import { weatherCodeLabel } from '../model/weather-code-label';

type WeatherSummaryProps = {
  weather: CurrentWeather;
  location: GeoPoint;
};

function formatCoordinate(value: number): string {
  return value.toFixed(3);
}

export function WeatherSummary({ weather, location }: WeatherSummaryProps) {
  const theme = useTheme();

  return (
    <View style={styles.stack}>
      <ThemedText type="small" themeColor="textSecondary">
        {weatherCodeLabel(weather.weatherCode)}
      </ThemedText>

      <ThemedView type="backgroundElement" style={styles.card}>
        <Metric label="Temperature" value={`${Math.round(weather.temperatureF)}°F`} />
        <Metric label="Wind" value={`${Math.round(weather.windSpeedMph)} mph`} />
        <Metric label="Precipitation" value={`${weather.precipitationIn.toFixed(2)} in`} />
      </ThemedView>

      <ThemedText type="small" themeColor="textSecondary">
        Observed {formatDateTime(weather.observedAt)}
      </ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        {formatCoordinate(location.latitude)}, {formatCoordinate(location.longitude)}
      </ThemedText>
      <ThemedText type="code" style={{ color: theme.textSecondary }}>
        Open-Meteo
      </ThemedText>
    </View>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metric}>
      <ThemedText type="small" themeColor="textSecondary">
        {label}
      </ThemedText>
      <ThemedText type="subtitle">{value}</ThemedText>
    </View>
  );
}

export function WeatherLoading() {
  const theme = useTheme();

  return (
    <View style={styles.loading}>
      <ActivityIndicator color={theme.accent} />
      <ThemedText themeColor="textSecondary">Fetching conditions…</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: Spacing.three,
  },
  card: {
    borderRadius: Spacing.three,
    padding: Spacing.four,
    gap: Spacing.four,
  },
  metric: {
    gap: Spacing.one,
  },
  loading: {
    gap: Spacing.three,
    alignItems: 'flex-start',
    paddingTop: Spacing.two,
  },
});
