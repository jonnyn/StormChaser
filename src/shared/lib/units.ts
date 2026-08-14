export type UnitSystem = 'metric' | 'imperial';

export const DEFAULT_UNIT_SYSTEM: UnitSystem = 'metric';

export const UNIT_SYSTEM_STORAGE_KEY = 'stormchaser.unitSystem';

export function isUnitSystem(value: string): value is UnitSystem {
  return value === 'metric' || value === 'imperial';
}

export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

export function kmhToMph(kmh: number): number {
  return kmh / 1.609344;
}

export function mmToInches(mm: number): number {
  return mm / 25.4;
}

export function fahrenheitToCelsius(fahrenheit: number): number {
  return ((fahrenheit - 32) * 5) / 9;
}

export function mphToKmh(mph: number): number {
  return mph * 1.609344;
}

export function inchesToMm(inches: number): number {
  return inches * 25.4;
}

export function formatTemperature(celsius: number, units: UnitSystem): string {
  if (units === 'imperial') {
    return `${Math.round(celsiusToFahrenheit(celsius))}°F`;
  }
  return `${Math.round(celsius)}°C`;
}

export function formatWindSpeed(kmh: number, units: UnitSystem): string {
  if (units === 'imperial') {
    return `${Math.round(kmhToMph(kmh))} mph`;
  }
  return `${Math.round(kmh)} km/h`;
}

export function formatPrecipitation(mm: number, units: UnitSystem): string {
  if (units === 'imperial') {
    return `${mmToInches(mm).toFixed(2)} in`;
  }
  return `${mm.toFixed(1)} mm`;
}

export function formatWeatherSummary(
  weather: { temperatureC: number; windSpeedKmh: number; precipitationMm: number },
  units: UnitSystem
): string {
  return [
    formatTemperature(weather.temperatureC, units),
    formatWindSpeed(weather.windSpeedKmh, units),
    formatPrecipitation(weather.precipitationMm, units),
  ].join(' · ');
}
