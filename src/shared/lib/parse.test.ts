import { z } from 'zod';

import { AppError } from './errors';
import { parseWithSchema } from './parse';

const sampleSchema = z.object({
  temperatureF: z.number(),
});

describe('parseWithSchema', () => {
  it('returns typed data when the payload matches', () => {
    const result = parseWithSchema(sampleSchema, { temperatureF: 72 }, 'Invalid weather payload.');

    expect(result.temperatureF).toBe(72);
  });

  it('throws AppError when the payload does not match', () => {
    expect(() =>
      parseWithSchema(sampleSchema, { temperatureF: 'hot' }, 'Invalid weather payload.')
    ).toThrow(AppError);
  });
});
