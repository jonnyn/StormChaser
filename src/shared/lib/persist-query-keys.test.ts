import { shouldPersistQuery } from './persist-query-keys';

describe('shouldPersistQuery', () => {
  it('persists weather and current location queries only', () => {
    expect(shouldPersistQuery(['weather', 'location', 35.2, -97.4])).toBe(true);
    expect(shouldPersistQuery(['location', 'current'])).toBe(true);
    expect(shouldPersistQuery(['storms', 'list'])).toBe(false);
    expect(shouldPersistQuery(['location', 'history'])).toBe(false);
  });
});
