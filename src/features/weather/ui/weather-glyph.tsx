import { SymbolView } from 'expo-symbols';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

import { weatherGlyphName } from '../model/weather-glyph';
import { weatherCodeLabel } from '../model/weather-code-label';

type WeatherGlyphProps = {
  code: number;
  size?: number;
};

export function WeatherGlyph({ code, size = 28 }: WeatherGlyphProps) {
  const theme = useTheme();
  const label = weatherCodeLabel(code);

  return (
    <View
      accessibilityLabel={label}
      accessible
      style={[styles.wrap, { width: size + 8, height: size + 8 }]}
    >
      <SymbolView
        name={weatherGlyphName(code)}
        size={size}
        tintColor={theme.accent}
        fallback={
          <ThemedText type="smallBold" style={{ color: theme.accent }}>
            {label.slice(0, 1)}
          </ThemedText>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
