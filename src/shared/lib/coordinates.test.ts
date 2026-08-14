import { formatCoordinate, formatCoordinatePair, roundCoord } from '@/shared/lib/coordinates';

describe('coordinates', () => {
  it('rounds to three decimal places', () => {
    expect(roundCoord(37.7749123)).toBe(37.775);
    expect(roundCoord(-122.4194)).toBe(-122.419);
  });

  it('formats a single coordinate for display', () => {
    expect(formatCoordinate(37.7749123)).toBe('37.775');
  });

  it('formats latitude and longitude as a pair', () => {
    expect(formatCoordinatePair(37.7749123, -122.4194)).toBe('37.775, -122.419');
  });
});
