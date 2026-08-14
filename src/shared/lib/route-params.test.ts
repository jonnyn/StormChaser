import { parseRouteParam } from '@/shared/lib/route-params';

describe('parseRouteParam', () => {
  it('returns a string param unchanged', () => {
    expect(parseRouteParam('abc-123')).toBe('abc-123');
  });

  it('returns the first item from an array param', () => {
    expect(parseRouteParam(['first', 'second'])).toBe('first');
  });

  it('returns an empty string when missing', () => {
    expect(parseRouteParam(undefined)).toBe('');
  });
});
