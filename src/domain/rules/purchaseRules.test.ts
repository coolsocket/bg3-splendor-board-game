import { describe, it, expect } from 'vitest';
import { calculatePurchaseCost, canAffordCard } from './purchaseRules';
import { type Card, type Player } from '../models';

describe('purchaseRules', () => {
  const mockCard: Card = {
    id: '1',
    name: 'Mock Card',
    tier: 1,
    type: 'spell',
    points: 0,
    bonus: 'radiant_gem',
    cost: {
      'infernal_iron': 2,
      'arcane_crystal': 1
    }
  };

  const mockPlayer = (resources: any = {}, bonuses: any = {}): Player => ({
    id: 'p1',
    name: 'Player 1',
    resources,
    bonuses,
    prestigePoints: 0,
    acquiredCards: [],
    reservedCards: [],
    patrons: []
  });

  describe('calculatePurchaseCost', () => {
    it('should return payment matching cost when player has exact resources and no bonuses', () => {
      const player = mockPlayer({
        'infernal_iron': 2,
        'arcane_crystal': 1
      });
      const cost = calculatePurchaseCost(player, mockCard);
      expect(cost).toBeTruthy();
      expect(cost!['infernal_iron']).toBe(2);
      expect(cost!['arcane_crystal']).toBe(1);
    });

    it('should reduce payment by bonuses', () => {
      const player = mockPlayer({
        'infernal_iron': 1,
        'arcane_crystal': 1
      }, {
        'infernal_iron': 1
      });
      const cost = calculatePurchaseCost(player, mockCard);
      expect(cost).toBeTruthy();
      expect(cost!['infernal_iron']).toBe(1);
      expect(cost!['arcane_crystal']).toBe(1);
    });

    it('should return null if player cannot afford', () => {
      const player = mockPlayer({
        'infernal_iron': 1,
        'arcane_crystal': 0
      });
      const cost = calculatePurchaseCost(player, mockCard);
      expect(cost).toBeNull();
    });

    it('should use wildcards (tadpoles) if short on resources', () => {
      const player = mockPlayer({
        'infernal_iron': 1,
        'arcane_crystal': 1,
        'true_soul_tadpole': 1
      });
      const cost = calculatePurchaseCost(player, mockCard);
      expect(cost).toBeTruthy();
      expect(cost!['infernal_iron']).toBe(1);
      expect(cost!['arcane_crystal']).toBe(1);
      expect(cost!['true_soul_tadpole']).toBe(1);
    });
  });

  describe('canAffordCard', () => {
    it('should return true when player can afford with exact resources', () => {
      const player = mockPlayer({
        'infernal_iron': 2,
        'arcane_crystal': 1
      });
      expect(canAffordCard(player, mockCard)).toBe(true);
    });

    it('should return false when player cannot afford', () => {
      const player = mockPlayer({
        'infernal_iron': 1,
        'arcane_crystal': 1
      });
      expect(canAffordCard(player, mockCard)).toBe(false);
    });
  });
});
