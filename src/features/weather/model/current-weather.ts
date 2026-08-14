export type CurrentWeather = {
  temperatureF: number;
  windSpeedMph: number;
  precipitationIn: number;
  weatherCode: number;
  observedAt: string;
};

export type WeatherProvider = {
  getCurrentWeather: (latitude: number, longitude: number) => Promise<CurrentWeather>;
};
