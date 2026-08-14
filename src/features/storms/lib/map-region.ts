const MIN_DELTA = 0.08;
const BOUNDS_PADDING = 1.2;

export type MapCoordinate = {
  latitude: number;
  longitude: number;
};

export type MapRegion = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

/** Camera region that fits the given points, or null when there are none. */
export function regionForCoordinates(points: MapCoordinate[]): MapRegion | null {
  if (points.length === 0) {
    return null;
  }

  if (points.length === 1) {
    const point = points[0];
    return {
      latitude: point.latitude,
      longitude: point.longitude,
      latitudeDelta: MIN_DELTA,
      longitudeDelta: MIN_DELTA,
    };
  }

  let minLat = points[0].latitude;
  let maxLat = points[0].latitude;
  let minLng = points[0].longitude;
  let maxLng = points[0].longitude;

  for (let index = 1; index < points.length; index += 1) {
    const point = points[index];
    minLat = Math.min(minLat, point.latitude);
    maxLat = Math.max(maxLat, point.latitude);
    minLng = Math.min(minLng, point.longitude);
    maxLng = Math.max(maxLng, point.longitude);
  }

  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    latitudeDelta: Math.max((maxLat - minLat) * BOUNDS_PADDING, MIN_DELTA),
    longitudeDelta: Math.max((maxLng - minLng) * BOUNDS_PADDING, MIN_DELTA),
  };
}
