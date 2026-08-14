import type { GeoPoint } from '@/services/location/types';

import type { StormType } from './storm-type';

export type WeatherSnapshot = {
  temperatureF: number;
  windSpeedMph: number;
  precipitationIn: number;
  weatherCode: number;
  observedAt: string;
};

export type StormObservation = {
  id: string;
  createdAt: string;
  capturedAt: string;
  notes: string;
  stormType: StormType;
  location: GeoPoint;
  weather: WeatherSnapshot | null;
  photoRelativePath: string;
};

export type CreateStormObservationInput = {
  id?: string;
  capturedAt: string;
  notes: string;
  stormType: StormType;
  location: GeoPoint;
  weather: WeatherSnapshot | null;
  photoRelativePath: string;
};
