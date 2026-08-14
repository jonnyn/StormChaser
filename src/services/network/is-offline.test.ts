import { isOffline } from './is-offline';

describe('isOffline', () => {
  it('returns false when connectivity is unknown', () => {
    expect(isOffline({})).toBe(false);
    expect(isOffline({ isConnected: true })).toBe(false);
  });

  it('returns true when not connected', () => {
    expect(isOffline({ isConnected: false })).toBe(true);
  });

  it('returns true when connected but internet is not reachable', () => {
    expect(isOffline({ isConnected: true, isInternetReachable: false })).toBe(true);
  });

  it('returns false when connected and internet is reachable', () => {
    expect(isOffline({ isConnected: true, isInternetReachable: true })).toBe(false);
  });
});
