import * as Location from 'expo-location';

import { AppError } from '@/shared/lib/errors';

import type { GeoPoint } from './types';

function toGeoPoint(position: Location.LocationObject): GeoPoint {
  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    accuracyMeters: position.coords.accuracy,
  };
}

export async function getCurrentCoordinates(): Promise<GeoPoint> {
  const permission = await Location.requestForegroundPermissionsAsync();

  if (permission.status !== 'granted') {
    throw new AppError(
      'permission_denied',
      'Location permission is required to show weather for your position.'
    );
  }

  const lastKnown = await Location.getLastKnownPositionAsync({
    maxAge: 5 * 60 * 1000,
    requiredAccuracy: 500,
  });

  if (lastKnown) {
    return toGeoPoint(lastKnown);
  }

  try {
    const current = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    return toGeoPoint(current);
  } catch (error) {
    throw new AppError('not_found', 'Unable to determine your current location.', {
      cause: error,
    });
  }
}
