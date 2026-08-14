import { z } from 'zod';

export const openMeteoCurrentSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  current: z.object({
    time: z.string().min(1),
    temperature_2m: z.number(),
    apparent_temperature: z.number(),
    wind_speed_10m: z.number(),
    precipitation: z.number(),
    precipitation_probability: z.number(),
    weather_code: z.number().int(),
  }),
});

export type OpenMeteoCurrentResponse = z.infer<typeof openMeteoCurrentSchema>;

const hourlyArraysSchema = z.object({
  time: z.array(z.string().min(1)),
  temperature_2m: z.array(z.number()),
  weather_code: z.array(z.number().int()),
  precipitation_probability: z.array(z.number()),
  precipitation: z.array(z.number()),
  wind_speed_10m: z.array(z.number()),
});

const dailyArraysSchema = z.object({
  time: z.array(z.string().min(1)),
  weather_code: z.array(z.number().int()),
  temperature_2m_max: z.array(z.number()),
  temperature_2m_min: z.array(z.number()),
  precipitation_sum: z.array(z.number()),
  precipitation_probability_max: z.array(z.number()),
  wind_speed_10m_max: z.array(z.number()),
  wind_gusts_10m_max: z.array(z.number()),
});

export const openMeteoLocationSchema = openMeteoCurrentSchema.extend({
  hourly: hourlyArraysSchema,
  daily: dailyArraysSchema,
});

export type OpenMeteoLocationResponse = z.infer<typeof openMeteoLocationSchema>;
