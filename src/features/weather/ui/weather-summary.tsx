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
import { WeatherGlyph } from './weather-glyph';

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
  const feelsLike = formatTemperature(weather.apparentTemperatureC, units);
  const wind = formatWindSpeed(weather.windSpeedKmh, units);
  const precipitation = formatPrecipitation(weather.precipitationMm, units);
  const chance = `${Math.round(weather.precipitationProbability)}%`;
  const condition = weatherCodeLabel(weather.weatherCode);

  return (
    <View style={styles.stack}>
      <View style={styles.headerRow}>
        <ThemedText type="small" themeColor="textSecondary">
          Now
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
        accessibilityLabel={`Temperature ${temperature}, feels like ${feelsLike}, ${condition}, wind ${wind}, precipitation ${precipitation}, ${chance} chance of precipitation`}
        style={[styles.hero, { backgroundColor: theme.backgroundElement }]}
      >
        <View style={styles.heroMain}>
          <WeatherGlyph code={weather.weatherCode} size={44} />
          <View style={styles.heroCopy}>
            <ThemedText style={styles.heroTemp}>{temperature}</ThemedText>
            <ThemedText type="smallBold">{condition}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              Feels like {feelsLike}
            </ThemedText>
          </View>
        </View>

        <View style={styles.metrics}>
          <Metric label="Wind" value={wind} />
          <Metric label="Precip" value={precipitation} />
          <Metric label="Chance" value={chance} />
        </View>
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
      <ThemedText type="smallBold">{value}</ThemedText>
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
  hero: {
    borderRadius: Spacing.three,
    padding: Spacing.four,
    gap: Spacing.four,
  },
  heroMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  heroCopy: {
    flex: 1,
    gap: Spacing.one,
  },
  heroTemp: {
    fontSize: 40,
    lineHeight: 44,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  metrics: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  metric: {
    flex: 1,
    gap: Spacing.one,
  },
  loading: {
    gap: Spacing.three,
    alignItems: 'flex-start',
    paddingTop: Spacing.two,
  },
});
