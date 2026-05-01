import { describe, it, expect } from 'vitest';
import { canAffordCard } from './domain/rules/purchaseRules';
import { ResourceType, CardTier, CardType } from './domain/models';
import type { Player, Card } from './domain/models';
import { useGameStateStore } from './store/gameStateStore';

describe('Scratch Test for Affordability', () => {
  it('should check affordability with correct casing', () => {
    const player: Player = {
      id: 'player1',
      name: 'Gale',
      resources: {
        [ResourceType.RADIANT_GEM]: 3,
        [ResourceType.TRUE_SOUL_TADPOLE]: 0
      },
      bonuses: {},
      acquiredCards: [],
      reservedCards: [],
      patrons: [], prestigePoints: 0
    };

    const card: Card = {
      id: 'card1',
      name: 'Test Card',
      tier: CardTier.TIER_1,
      type: CardType.SPELL,
      cost: {
        [ResourceType.RADIANT_GEM]: 3
      },
      bonus: ResourceType.RADIANT_GEM,
      points: 0,
      description: 'Test'
    };

    console.log('ResourceType.RADIANT_GEM is:', ResourceType.RADIANT_GEM);
    console.log('Player resources:', player.resources);
    console.log('Card cost:', card.cost);

    const result = canAffordCard(player, card);
    console.log('Result with correct casing:', result);
    expect(result).toBe(true);
  });

  it('should check affordability with incorrect casing (simulating bug)', () => {
    const player = {
      resources: {
        'RADIANT_GEM': 3 // Uppercase!
      },
      bonuses: {}
    } as any;

    const card: Card = {
      id: 'card2',
      name: 'Test Card 2',
      tier: CardTier.TIER_1,
      type: CardType.SPELL,
      cost: {
        'radiant_gem': 3 // Lowercase!
      },
      bonus: ResourceType.RADIANT_GEM,
      points: 0,
      description: 'Test'
    };

    const result = canAffordCard(player, card);
    console.log('Result with mixed casing:', result);
    expect(result).toBe(false); // Should fail if casing mismatch!
  });

  it('should read store state', () => {
    const { players } = useGameStateStore.getState();
    console.log('Store players:', JSON.stringify(players, null, 2));
    expect(players.length).toBeGreaterThan(0);
  });

  it('should check affordability of all face-up cards for Astarion', () => {
    const { players, faceUpCards } = useGameStateStore.getState();
    const astarion = players.find(p => p.name === 'Astarion')!;
    
    console.log('Astarion resources:', astarion.resources);
    console.log('Astarion bonuses:', astarion.bonuses);

    for (const [tier, cards] of Object.entries(faceUpCards)) {
      console.log(`Tier ${tier} cards:`);
      for (const card of cards) {
        const affordable = canAffordCard(astarion, card);
        console.log(`  Card ${card.id} cost:`, card.cost, 'Affordable:', affordable);
      }
    }
    expect(true).toBe(true);
  });
});
