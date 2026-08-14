import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { GeoPoint } from '@/services/location/types';
import { formatDateTime } from '@/shared/lib/dates';
import { formatPrecipitation, formatTemperature, formatWindSpeed } from '@/shared/lib/units';
import { useUnits } from '@/shared/units/units-context';

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
  const { units, toggleUnits } = useUnits();

  const temperature = formatTemperature(weather.temperatureC, units);
  const wind = formatWindSpeed(weather.windSpeedKmh, units);
  const precipitation = formatPrecipitation(weather.precipitationMm, units);

  return (
    <View style={styles.stack}>
      <View style={styles.headerRow}>
        <ThemedText type="small" themeColor="textSecondary">
          {weatherCodeLabel(weather.weatherCode)}
        </ThemedText>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            units === 'metric' ? 'Switch to imperial units' : 'Switch to metric units'
          }
          onPress={toggleUnits}
          style={({ pressed }) => [
            styles.unitsToggle,
            {
              borderColor: theme.backgroundSelected,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <ThemedText type="small">{units === 'metric' ? '°C · km/h' : '°F · mph'}</ThemedText>
        </Pressable>
      </View>

      <View
        accessibilityRole="summary"
        accessibilityLabel={`Temperature ${temperature}, wind ${wind}, precipitation ${precipitation}`}
        style={[styles.card, { backgroundColor: theme.backgroundElement }]}
      >
        <Metric label="Temperature" value={temperature} />
        <Metric label="Wind" value={wind} />
        <Metric label="Precipitation" value={precipitation} />
      </View>

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
    <View accessibilityLabel={`${label} ${value}`} accessible style={styles.metric}>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  unitsToggle: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
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
