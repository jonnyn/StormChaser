import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatWeekday } from '@/shared/lib/dates';
import { formatPrecipitation, formatTemperature, formatWindSpeed } from '@/shared/lib/units';
import { useUnits } from '@/shared/units/units-context';

import type { DailyForecastDay } from '../model/daily-forecast';
import { weatherCodeLabel } from '../model/weather-code-label';
import { WeatherGlyph } from './weather-glyph';

type WeatherForecastProps = {
  days: DailyForecastDay[];
};

export function WeatherForecast({ days }: WeatherForecastProps) {
  const theme = useTheme();
  const { units } = useUnits();

  if (days.length === 0) {
    return null;
  }

  const rangeMin = Math.min(...days.map((day) => day.temperatureMinC));
  const rangeMax = Math.max(...days.map((day) => day.temperatureMaxC));
  const span = Math.max(rangeMax - rangeMin, 1);

  return (
    <View style={styles.stack} accessibilityRole="summary" accessibilityLabel="Five day forecast">
      <ThemedText type="smallBold">5-day outlook</ThemedText>
      <View style={[styles.card, { backgroundColor: theme.backgroundElement }]}>
        {days.map((day) => {
          const high = formatTemperature(day.temperatureMaxC, units);
          const low = formatTemperature(day.temperatureMinC, units);
          const precip = formatPrecipitation(day.precipitationMm, units);
          const wind = formatWindSpeed(day.windSpeedMaxKmh, units);
          const gusts = formatWindSpeed(day.windGustsMaxKmh, units);
          const chance = `${Math.round(day.precipitationProbabilityMax)}%`;
          const label = weatherCodeLabel(day.weatherCode);
          const weekday = formatWeekday(day.date);
          const left = ((day.temperatureMinC - rangeMin) / span) * 100;
          const width = ((day.temperatureMaxC - day.temperatureMinC) / span) * 100;

          return (
            <View
              key={day.date}
              accessible
              accessibilityLabel={`${weekday}: ${label}, high ${high}, low ${low}, ${chance} chance of precipitation, ${precip}, wind ${wind}, gusts ${gusts}`}
              style={styles.day}
            >
              <View style={styles.dayHeader}>
                <ThemedText style={styles.weekday}>{weekday}</ThemedText>
                <WeatherGlyph code={day.weatherCode} size={22} />
                <ThemedText
                  type="small"
                  themeColor="textSecondary"
                  style={styles.label}
                  numberOfLines={1}
                >
                  {label}
                </ThemedText>
                <ThemedText type="smallBold" style={styles.chance}>
                  {chance}
                </ThemedText>
              </View>

              <View style={styles.tempRow}>
                <ThemedText type="small" themeColor="textSecondary" style={styles.tempEdge}>
                  {low}
                </ThemedText>
                <View style={[styles.tempTrack, { backgroundColor: theme.backgroundSelected }]}>
                  <View
                    style={[
                      styles.tempFill,
                      {
                        backgroundColor: theme.accent,
                        left: `${left}%`,
                        width: `${Math.max(width, 8)}%`,
                      },
                    ]}
                  />
                </View>
                <ThemedText type="smallBold" style={styles.tempEdge}>
                  {high}
                </ThemedText>
              </View>

              <ThemedText type="small" themeColor="textSecondary">
                {precip} · wind {wind} · gusts {gusts}
              </ThemedText>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: Spacing.two,
  },
  card: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  day: {
    gap: Spacing.two,
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  weekday: {
    width: 40,
    fontWeight: '600',
  },
  label: {
    flex: 1,
  },
  chance: {
    minWidth: 40,
    textAlign: 'right',
  },
  tempRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  tempEdge: {
    width: 44,
  },
  tempTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    position: 'relative',
  },
  tempFill: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    borderRadius: 3,
  },
});
