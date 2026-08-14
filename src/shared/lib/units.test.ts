import { z } from 'zod';

import {
  formatPrecipitation,
  formatTemperature,
  formatWindSpeed,
  type UnitSystem,
} from '@/shared/lib/units';

describe('unit formatting', () => {
  const cases: {
    units: UnitSystem;
    temperature: string;
    wind: string;
    precip: string;
  }[] = [
    { units: 'metric', temperature: '20°C', wind: '36 km/h', precip: '12.7 mm' },
    { units: 'imperial', temperature: '68°F', wind: '22 mph', precip: '0.50 in' },
  ];

  it.each(cases)('formats for $units', ({ units, temperature, wind, precip }) => {
    expect(formatTemperature(20, units)).toBe(temperature);
    expect(formatWindSpeed(36, units)).toBe(wind);
    expect(formatPrecipitation(12.7, units)).toBe(precip);
  });
});

describe('unit system guard', () => {
  it('accepts only metric and imperial', () => {
    const schema = z.enum(['metric', 'imperial']);
    expect(schema.safeParse('metric').success).toBe(true);
    expect(schema.safeParse('imperial').success).toBe(true);
    expect(schema.safeParse('kelvin').success).toBe(false);
  });
});
