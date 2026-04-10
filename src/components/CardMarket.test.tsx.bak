// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CardMarket } from './CardMarket';
import '@testing-library/jest-dom';

// Mock stores
vi.mock('../store/publicStore', () => ({
  usePublicStore: (selector: any) => selector({
    faceUpCards: {
      1: [
        { id: 'c1', tier: 1, points: 1, bonus: 'radiant_gem', cost: { arcane_crystal: 1 }, name: 'Card 1', type: 'spell' }
      ],
      2: [],
      3: [],
    },
    decks: {
      1: [{}, {}],
      2: [],
      3: [],
    },
  }),
}));

vi.mock('../store/playerStore', () => ({
  usePlayerStore: (selector: any) => selector({
    resources: { radiant_gem: 1 },
    bonuses: {},
  }),
}));

// Mock domain logic
vi.mock('../domain/logic', () => ({
  calculateEffectiveCost: (card: any) => card.cost,
}));

describe('CardMarket Component', () => {
  it('renders the card market with title', () => {
    render(<CardMarket />);
    expect(screen.getByText('Card Market')).toBeInTheDocument();
  });

  it('renders cards in the market', () => {
    render(<CardMarket />);
    // Card c1 has bonus radiant_gem, which becomes RADIANT_GEM in CardProps
    // In Card.tsx it renders substring(0, 2) -> RA
    expect(screen.getByText('RA')).toBeInTheDocument();
  });

  it('renders deck counts', () => {
    render(<CardMarket />);
    // Tier 1 deck has 2 cards
    expect(screen.getByText('2')).toBeInTheDocument();
  });
});
