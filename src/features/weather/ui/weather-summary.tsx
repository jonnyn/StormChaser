import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { GeoPoint } from '@/services/location/types';
import { formatCoordinatePair } from '@/shared/lib/coordinates';
import { formatDateTime } from '@/shared/lib/dates';
import { formatPrecipitation, formatTemperature, formatWindSpeed } from '@/shared/lib/units';
import { Skeleton } from '@/shared/ui/skeleton';
import { useUnits } from '@/shared/units/units-context';

import type { CurrentWeather } from '../model/current-weather';
import { weatherCodeLabel } from '../model/weather-code-label';
import { WeatherGlyph } from './weather-glyph';

type WeatherSummaryProps = {
  weather: CurrentWeather;
  location: GeoPoint;
};

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
        {formatCoordinatePair(location.latitude, location.longitude)}
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
    <View
      accessibilityLabel="Loading conditions"
      accessibilityRole="progressbar"
      accessible
      style={styles.loading}
    >
      <View style={styles.headerRow}>
        <Skeleton width={48} height={12} />
        <Skeleton width={72} height={28} borderRadius={Spacing.two} />
      </View>

      <View style={[styles.hero, { backgroundColor: theme.backgroundElement }]}>
        <View style={styles.heroMain}>
          <Skeleton width={52} height={52} borderRadius={26} />
          <View style={styles.heroCopy}>
            <Skeleton width={110} height={36} borderRadius={10} />
            <Skeleton width="70%" height={14} />
            <Skeleton width="55%" height={12} />
          </View>
        </View>
        <View style={styles.metrics}>
          <Skeleton height={40} borderRadius={Spacing.two} style={styles.metric} />
          <Skeleton height={40} borderRadius={Spacing.two} style={styles.metric} />
          <Skeleton height={40} borderRadius={Spacing.two} style={styles.metric} />
        </View>
      </View>

      <View style={styles.hourlySkeleton}>
        <Skeleton width={120} height={14} />
        <View style={styles.hourlyRow}>
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} width={76} height={110} borderRadius={Spacing.three} />
          ))}
        </View>
      </View>

      <View style={styles.dailySkeleton}>
        <Skeleton width={110} height={14} />
        <View style={[styles.dailyCard, { backgroundColor: theme.backgroundElement }]}>
          {Array.from({ length: 3 }, (_, index) => (
            <View key={index} style={styles.dailyRow}>
              <Skeleton width={40} height={14} />
              <Skeleton width={22} height={22} borderRadius={11} />
              <Skeleton height={14} style={{ flex: 1 }} />
              <Skeleton width={40} height={14} />
            </View>
          ))}
        </View>
      </View>
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
  },
  hourlySkeleton: {
    gap: Spacing.two,
  },
  hourlyRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  dailySkeleton: {
    gap: Spacing.two,
  },
  dailyCard: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  dailyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
});
