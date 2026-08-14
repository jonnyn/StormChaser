import type { CreateStormObservationInput, StormObservation } from '../model/storm-observation';

/**
 * Persistence boundary for storm observations.
 * Screens and hooks depend on this interface, not on expo-sqlite directly.
 */
export type StormRepository = {
  list: () => Promise<StormObservation[]>;
  getById: (id: string) => Promise<StormObservation | null>;
  create: (input: CreateStormObservationInput) => Promise<StormObservation>;
  delete: (id: string) => Promise<void>;
};
