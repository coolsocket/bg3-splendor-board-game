import { create } from 'zustand';
import { CardTier } from '../domain/models';
import type { ResourceCollection, Card, Patron } from '../domain/models';

export interface PublicState {
  availableResources: ResourceCollection;
  decks: Record<CardTier, Card[]>;
  faceUpCards: Record<CardTier, Card[]>;
  availablePatrons: Patron[];
}

export const usePublicStore = create<PublicState>(() => ({
  availableResources: {},
  decks: {
    [CardTier.TIER_1]: [],
    [CardTier.TIER_2]: [],
    [CardTier.TIER_3]: [],
  },
  faceUpCards: {
    [CardTier.TIER_1]: [],
    [CardTier.TIER_2]: [],
    [CardTier.TIER_3]: [],
  },
  availablePatrons: [],
}));
