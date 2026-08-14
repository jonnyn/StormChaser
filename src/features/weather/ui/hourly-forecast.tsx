import { ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatHourLabel } from '@/shared/lib/dates';
import { formatTemperature } from '@/shared/lib/units';
import { useUnits } from '@/shared/units/units-context';

import type { HourlyForecastHour } from '../model/hourly-forecast';
import { weatherCodeLabel } from '../model/weather-code-label';
import { WeatherGlyph } from './weather-glyph';

type HourlyForecastProps = {
  hours: HourlyForecastHour[];
};

export function HourlyForecast({ hours }: HourlyForecastProps) {
  const theme = useTheme();
  const { units } = useUnits();

  if (hours.length === 0) {
    return null;
  }

  return (
    <View style={styles.stack} accessibilityRole="summary" accessibilityLabel="Next 24 hours">
      <ThemedText type="smallBold">Next 24 hours</ThemedText>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {hours.map((hour, index) => {
          const temp = formatTemperature(hour.temperatureC, units);
          const chance = `${Math.round(hour.precipitationProbability)}%`;
          const label = weatherCodeLabel(hour.weatherCode);
          const timeLabel = index === 0 ? 'Now' : formatHourLabel(hour.time);

          return (
            <View
              key={hour.time}
              accessible
              accessibilityLabel={`${timeLabel}: ${temp}, ${label}, ${chance} chance of precipitation`}
              style={[styles.card, { backgroundColor: theme.backgroundElement }]}
            >
              <ThemedText type="small" themeColor="textSecondary">
                {timeLabel}
              </ThemedText>
              <WeatherGlyph code={hour.weatherCode} size={26} />
              <ThemedText type="smallBold">{temp}</ThemedText>
              <View style={styles.chance}>
                <View style={[styles.chanceTrack, { backgroundColor: theme.backgroundSelected }]}>
                  <View
                    style={[
                      styles.chanceFill,
                      {
                        backgroundColor: theme.accent,
                        width: `${Math.min(100, Math.max(0, hour.precipitationProbability))}%`,
                      },
                    ]}
                  />
                </View>
                <ThemedText type="small" themeColor="textSecondary">
                  {chance}
                </ThemedText>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: Spacing.two,
  },
  row: {
    gap: Spacing.two,
    paddingRight: Spacing.two,
  },
  card: {
    width: 76,
    borderRadius: Spacing.three,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.two,
    alignItems: 'center',
    gap: Spacing.two,
  },
  chance: {
    width: '100%',
    alignItems: 'center',
    gap: Spacing.one,
  },
  chanceTrack: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  chanceFill: {
    height: '100%',
    borderRadius: 2,
  },
});
