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

export const STORM_TYPE_LABELS: Record<StormType, string> = {
  supercell: 'Supercell',
  tornado: 'Tornado',
  wall_cloud: 'Wall cloud',
  funnel_cloud: 'Funnel cloud',
  hail: 'Hail',
  lightning: 'Lightning',
  flash_flood: 'Flash flood',
  dust_storm: 'Dust storm',
  tropical: 'Tropical',
  other: 'Other',
};

export function isStormType(value: string): value is StormType {
  return (STORM_TYPES as readonly string[]).includes(value);
}

export function stormTypeLabel(type: StormType): string {
  return STORM_TYPE_LABELS[type];
}
