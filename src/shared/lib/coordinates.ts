/** Round to three decimal places (~100 m) for cache keys and display. */
export function roundCoord(value: number): number {
  return Math.round(value * 1000) / 1000;
}

export function formatCoordinate(value: number): string {
  return value.toFixed(3);
}

export function formatCoordinatePair(latitude: number, longitude: number): string {
  return `${formatCoordinate(latitude)}, ${formatCoordinate(longitude)}`;
}
