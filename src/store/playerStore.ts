import { create } from 'zustand';
import type { ResourceCollection, Card, Patron } from '../domain/models';

export interface PlayerState {
  id: string;
  name: string;
  resources: ResourceCollection;
  bonuses: ResourceCollection;
  acquiredCards: Card[];
  reservedCards: Card[];
  patrons: Patron[];
  prestigePoints: number;
}

export const usePlayerStore = create<PlayerState>(() => ({
  id: '',
  name: '',
  resources: {},
  bonuses: {},
  acquiredCards: [],
  reservedCards: [],
  patrons: [],
  prestigePoints: 0,
}));
