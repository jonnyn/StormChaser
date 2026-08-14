import type { CreateStormObservationInput, StormObservation } from '../model/storm-observation';

export type StormRepository = {
  list: () => Promise<StormObservation[]>;
  getById: (id: string) => Promise<StormObservation | null>;
  create: (input: CreateStormObservationInput) => Promise<StormObservation>;
  delete: (id: string) => Promise<void>;
};
