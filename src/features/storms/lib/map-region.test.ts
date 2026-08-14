import { regionForCoordinates } from './map-region';

describe('regionForCoordinates', () => {
  it('returns null when there are no points', () => {
    expect(regionForCoordinates([])).toBeNull();
  });

  it('uses a minimum delta for a single point', () => {
    expect(regionForCoordinates([{ latitude: 35.2, longitude: -97.4 }])).toEqual({
      latitude: 35.2,
      longitude: -97.4,
      latitudeDelta: 0.08,
      longitudeDelta: 0.08,
    });
  });

  it('pads the bounding box for multiple points', () => {
    expect(
      regionForCoordinates([
        { latitude: 35.0, longitude: -97.0 },
        { latitude: 36.0, longitude: -96.0 },
      ])
    ).toEqual({
      latitude: 35.5,
      longitude: -96.5,
      latitudeDelta: 1.2,
      longitudeDelta: 1.2,
    });
  });

  it('does not shrink below the minimum delta for clustered points', () => {
    const region = regionForCoordinates([
      { latitude: 35.2, longitude: -97.4 },
      { latitude: 35.201, longitude: -97.401 },
    ]);

    expect(region?.latitudeDelta).toBe(0.08);
    expect(region?.longitudeDelta).toBe(0.08);
    expect(region?.latitude).toBeCloseTo(35.2005);
    expect(region?.longitude).toBeCloseTo(-97.4005);
  });
});
