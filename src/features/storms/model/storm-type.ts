export const STORM_TYPES = [
  'supercell',
  'tornado',
  'wall_cloud',
  'funnel_cloud',
  'hail',
  'lightning',
  'flash_flood',
  'dust_storm',
  'tropical',
  'other',
] as const;

export type StormType = (typeof STORM_TYPES)[number];

export function isStormType(value: string): value is StormType {
  return (STORM_TYPES as readonly string[]).includes(value);
}
