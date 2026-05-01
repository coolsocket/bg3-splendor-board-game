import { describe, it, expect } from 'vitest';
import { validateTokenTake, canSelectToken } from './tokenRules';
import { type ResourceCollection } from '../models';

describe('tokenRules', () => {
  describe('validateTokenTake', () => {
    it('should allow taking 3 different tokens', () => {
      const selected: ResourceCollection = {
        'radiant_gem': 1,
        'arcane_crystal': 1,
        'natures_blessing': 1
      };
      expect(validateTokenTake(selected, {})).toBe(true);
    });

    it('should allow taking 2 same tokens if pool has >= 4', () => {
      const selected: ResourceCollection = { 'radiant_gem': 2 };
      const pool = { 'radiant_gem': 4 };
      expect(validateTokenTake(selected, pool)).toBe(true);
    });

    it('should not allow taking 2 same tokens if pool has < 4', () => {
      const selected: ResourceCollection = { 'radiant_gem': 2 };
      const pool = { 'radiant_gem': 3 };
      expect(validateTokenTake(selected, pool)).toBe(false);
    });

    it('should not allow taking more than 3 tokens', () => {
      const selected: ResourceCollection = {
        'radiant_gem': 1,
        'arcane_crystal': 1,
        'natures_blessing': 1,
        'infernal_iron': 1
      };
      expect(validateTokenTake(selected, {})).toBe(false);
    });

    it('should not allow taking 2 same and 1 different', () => {
      const selected: ResourceCollection = {
        'radiant_gem': 2,
        'arcane_crystal': 1
      };
      const pool = { 'radiant_gem': 4 };
      expect(validateTokenTake(selected, pool)).toBe(false);
    });
  });

  describe('canSelectToken', () => {
    it('should allow selecting a token if less than 3 selected', () => {
      const selected: ResourceCollection = { 'radiant_gem': 1 };
      expect(canSelectToken('arcane_crystal', selected, { 'arcane_crystal': 1 })).toBe(true);
    });

    it('should not allow selecting a token if 3 already selected', () => {
      const selected: ResourceCollection = {
        'radiant_gem': 1,
        'arcane_crystal': 1,
        'natures_blessing': 1
      };
      expect(canSelectToken('infernal_iron', selected, { 'infernal_iron': 1 })).toBe(false);
    });

    it('should allow selecting same token if 1 selected and pool >= 4', () => {
      const selected: ResourceCollection = { 'radiant_gem': 1 };
      const pool = { 'radiant_gem': 4 };
      expect(canSelectToken('radiant_gem', selected, pool)).toBe(true);
    });

    it('should not allow selecting same token if 1 selected and pool < 4', () => {
      const selected: ResourceCollection = { 'radiant_gem': 1 };
      const pool = { 'radiant_gem': 3 };
      expect(canSelectToken('radiant_gem', selected, pool)).toBe(false);
    });

    it('should allow selecting even if player total tokens + selected >= 10 (discard handled later)', () => {
      const selected: ResourceCollection = { 'radiant_gem': 1 };
      const pool = { 'arcane_crystal': 1 };
      // Note: canSelectToken no longer takes playerTotalTokens, allowing selections to exceed 10.
      expect(canSelectToken('arcane_crystal', selected, pool)).toBe(true);
    });
  });
});
