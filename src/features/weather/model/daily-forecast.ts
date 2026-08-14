export type DailyForecastDay = {
  date: string;
  weatherCode: number;
  temperatureMaxC: number;
  temperatureMinC: number;
  precipitationMm: number;
  precipitationProbabilityMax: number;
  windSpeedMaxKmh: number;
  windGustsMaxKmh: number;
};
