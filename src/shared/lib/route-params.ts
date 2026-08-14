/** Normalize Expo Router search params that may be string or string[]. */
export function parseRouteParam(value: string | string[] | undefined): string {
  if (typeof value === 'string') {
    return value;
  }

  return value?.[0] ?? '';
}
