import type { AndroidSymbol, SFSymbol } from 'expo-symbols';

export type WeatherGlyphName = {
  ios: SFSymbol;
  android: AndroidSymbol;
  web: AndroidSymbol;
};

/** Map WMO weather interpretation codes (Open-Meteo) to platform glyphs. */
export function weatherGlyphName(code: number): WeatherGlyphName {
  if (code === 0) {
    return { ios: 'sun.max.fill', android: 'sunny', web: 'sunny' };
  }
  if (code === 1 || code === 2) {
    return { ios: 'cloud.sun.fill', android: 'partly_cloudy_day', web: 'partly_cloudy_day' };
  }
  if (code === 3) {
    return { ios: 'cloud.fill', android: 'cloud', web: 'cloud' };
  }
  if (code === 45 || code === 48) {
    return { ios: 'cloud.fog.fill', android: 'foggy', web: 'foggy' };
  }
  if (code >= 71 && code <= 77) {
    return { ios: 'cloud.snow.fill', android: 'snowing', web: 'snowing' };
  }
  if (code === 85 || code === 86) {
    return { ios: 'cloud.snow.fill', android: 'snowing_heavy', web: 'snowing_heavy' };
  }
  if (code === 96 || code === 99) {
    return { ios: 'cloud.bolt.rain.fill', android: 'weather_hail', web: 'weather_hail' };
  }
  if (code >= 95 && code <= 99) {
    return { ios: 'cloud.bolt.rain.fill', android: 'thunderstorm', web: 'thunderstorm' };
  }
  if (code >= 80 && code <= 82) {
    return { ios: 'cloud.heavyrain.fill', android: 'rainy_heavy', web: 'rainy_heavy' };
  }
  if (code >= 51 && code <= 67) {
    return { ios: 'cloud.rain.fill', android: 'rainy', web: 'rainy' };
  }

  return { ios: 'cloud.fill', android: 'wb_cloudy', web: 'wb_cloudy' };
}
