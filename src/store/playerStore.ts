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
  setName: (name: string) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  id: '',
  name: typeof window !== 'undefined' ? localStorage.getItem('bg3-player-name') || '' : '',
  resources: {},
  bonuses: {},
  acquiredCards: [],
  reservedCards: [],
  patrons: [],
  prestigePoints: 0,
  setName: (name: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('bg3-player-name', name);
    }
    set({ name });
  },
}));
