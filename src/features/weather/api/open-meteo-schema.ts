import { z } from 'zod';

export const openMeteoCurrentSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  current: z.object({
    time: z.string().min(1),
    temperature_2m: z.number(),
    wind_speed_10m: z.number(),
    precipitation: z.number(),
    weather_code: z.number().int(),
  }),
});

export type OpenMeteoCurrentResponse = z.infer<typeof openMeteoCurrentSchema>;
