export type CurrentWeather = {
  temperatureC: number;
  windSpeedKmh: number;
  precipitationMm: number;
  weatherCode: number;
  observedAt: string;
};

export type WeatherProvider = {
  getCurrentWeather: (latitude: number, longitude: number) => Promise<CurrentWeather>;
};
