import { STORM_TYPES } from './storm-type';

import { z } from 'zod';

export const captureFormSchema = z.object({
  stormType: z.enum(STORM_TYPES),
  notes: z.string().max(2000),
});

export type CaptureFormValues = z.infer<typeof captureFormSchema>;
