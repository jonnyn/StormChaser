export const WEATHER_CACHE_MS = 24 * 60 * 60 * 1000;

export function shouldPersistQuery(queryKey: readonly unknown[]): boolean {
  const root = queryKey[0];

  if (root === 'weather') {
    return true;
  }

  if (root === 'location' && queryKey[1] === 'current') {
    return true;
  }

  return false;
}
