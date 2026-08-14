import type { ZodType } from 'zod';

import { AppError } from './errors';

export function parseWithSchema<T>(schema: ZodType<T>, data: unknown, userMessage: string): T {
  const result = schema.safeParse(data);

  if (!result.success) {
    throw new AppError('not_found', userMessage, { cause: result.error });
  }

  return result.data;
}
