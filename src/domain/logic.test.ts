import { describe, it, expect } from 'vitest';
import { checkPatronVisits, createPlayer, createEmptyResourceCollection, calculateEffectiveCost, getWinners, SeededRandom, hasEnoughResources, reserveCard } from './logic';
import { ResourceType, CardTier, CardType } from './models';
import type { Patron, GameState, Card } from './models';

describe('checkPatronVisits', () => {
    const player = createPlayer('1', 'Test Player');
    
    const patron1: Patron = {
        id: 'patron1',
        name: 'Withers',
        requirements: {
            [ResourceType.RADIANT_GEM]: 3,
            [ResourceType.ARCANE_CRYSTAL]: 3,
        },
        points: 3,
    };

    const patron2: Patron = {
        id: 'patron2',
        name: 'Raphael',
        requirements: {
            [ResourceType.INFERNAL_IRON]: 4,
        },
        points: 3,
    };

    const availablePatrons = [patron1, patron2];

    it('should return no claimed patrons if player does not meet requirements', () => {
        const result = checkPatronVisits(player, availablePatrons);
        
        expect(result.claimedPatrons.length).toBe(0);
        expect(result.player.patrons.length).toBe(0);
        expect(result.player.prestigePoints).toBe(0);
    });

    it('should claim a patron if player meets requirements', () => {
        const playerWithBonuses = {
            ...player,
            bonuses: {
                ...createEmptyResourceCollection(),
                [ResourceType.RADIANT_GEM]: 3,
                [ResourceType.ARCANE_CRYSTAL]: 3,
            },
        };

        const result = checkPatronVisits(playerWithBonuses, availablePatrons);
        
        expect(result.claimedPatrons.length).toBe(1);
        expect(result.claimedPatrons[0].id).toBe('patron1');
        expect(result.player.patrons.length).toBe(1);
        expect(result.player.patrons[0].id).toBe('patron1');
        expect(result.player.prestigePoints).toBe(3);
    });

    it('should claim multiple patrons if player meets requirements for more than one', () => {
        const playerWithBonuses = {
            ...player,
            bonuses: {
                ...createEmptyResourceCollection(),
                [ResourceType.RADIANT_GEM]: 3,
                [ResourceType.ARCANE_CRYSTAL]: 3,
                [ResourceType.INFERNAL_IRON]: 4,
            },
        };

        const result = checkPatronVisits(playerWithBonuses, availablePatrons);
        
        expect(result.claimedPatrons.length).toBe(2);
        expect(result.claimedPatrons.map(p => p.id)).toContain('patron1');
        expect(result.claimedPatrons.map(p => p.id)).toContain('patron2');
        expect(result.player.patrons.length).toBe(2);
        expect(result.player.prestigePoints).toBe(6); // 3 + 3
    });

    it('should not claim a patron if player only meets partial requirements', () => {
        const playerWithBonuses = {
            ...player,
            bonuses: {
                ...createEmptyResourceCollection(),
                [ResourceType.RADIANT_GEM]: 3,
                [ResourceType.ARCANE_CRYSTAL]: 2, // Short by 1
            },
        };

        const result = checkPatronVisits(playerWithBonuses, availablePatrons);
        
        expect(result.claimedPatrons.length).toBe(0);
    });
});

describe('calculateEffectiveCost', () => {
    const card = {
        id: '1',
        name: 'Card',
        tier: CardTier.TIER_1,
        type: CardType.SPELL,
        cost: {
            [ResourceType.RADIANT_GEM]: 3,
            [ResourceType.ARCANE_CRYSTAL]: 2,
        },
        bonus: ResourceType.RADIANT_GEM,
        points: 1,
    };

    it('should return full cost when no bonuses', () => {
        const bonuses = createEmptyResourceCollection();
        const cost = calculateEffectiveCost(card, bonuses);
        expect(cost[ResourceType.RADIANT_GEM]).toBe(3);
        expect(cost[ResourceType.ARCANE_CRYSTAL]).toBe(2);
    });

    it('should reduce cost by bonuses', () => {
        const bonuses = {
            ...createEmptyResourceCollection(),
            [ResourceType.RADIANT_GEM]: 1,
            [ResourceType.ARCANE_CRYSTAL]: 1,
        };
        const cost = calculateEffectiveCost(card, bonuses);
        expect(cost[ResourceType.RADIANT_GEM]).toBe(2);
        expect(cost[ResourceType.ARCANE_CRYSTAL]).toBe(1);
    });

    it('should not reduce cost below zero', () => {
        const bonuses = {
            ...createEmptyResourceCollection(),
            [ResourceType.RADIANT_GEM]: 5,
        };
        const cost = calculateEffectiveCost(card, bonuses);
        expect(cost[ResourceType.RADIANT_GEM]).toBeUndefined();
    });
});

describe('getWinners', () => {
    const player1 = { ...createPlayer('1', 'P1'), prestigePoints: 15 };
    const player2 = { ...createPlayer('2', 'P2'), prestigePoints: 12 };

    it('should return player with most points', () => {
        const state = {
            players: [player1, player2],
        } as GameState;
        const winners = getWinners(state);
        expect(winners.length).toBe(1);
        expect(winners[0].id).toBe('1');
    });

    it('should break ties with fewer cards', () => {
        const p1 = { ...player1, prestigePoints: 15, acquiredCards: [{}, {}, {}] as any };
        const p2 = { ...player2, prestigePoints: 15, acquiredCards: [{}, {}] as any };
        const state = {
            players: [p1, p2],
        } as GameState;
        const winners = getWinners(state);
        expect(winners.length).toBe(1);
        expect(winners[0].id).toBe('2');
    });

    it('should return both if tied on points and cards', () => {
        const p1 = { ...player1, prestigePoints: 15, acquiredCards: [{}, {}] as any };
        const p2 = { ...player2, prestigePoints: 15, acquiredCards: [{}, {}] as any };
        const state = {
            players: [p1, p2],
        } as GameState;
        const winners = getWinners(state);
        expect(winners.length).toBe(2);
    });
});

describe('SeededRandom', () => {
    it('should generate same sequence for same seed', () => {
        const rng1 = new SeededRandom('seed');
        const rng2 = new SeededRandom('seed');
        expect(rng1.next()).toBe(rng2.next());
        expect(rng1.nextInt(1, 10)).toBe(rng2.nextInt(1, 10));
    });

    it('should generate different sequence for different seed', () => {
        const rng1 = new SeededRandom('seed1');
        const rng2 = new SeededRandom('seed2');
        expect(rng1.next()).not.toBe(rng2.next());
    });
});

describe('hasEnoughResources', () => {
    it('should return true if available has more or equal resources', () => {
        const available = { [ResourceType.RADIANT_GEM]: 3 };
        const required = { [ResourceType.RADIANT_GEM]: 2 };
        expect(hasEnoughResources(available, required)).toBe(true);
    });

    it('should return false if available has less resources', () => {
        const available = { [ResourceType.RADIANT_GEM]: 1 };
        const required = { [ResourceType.RADIANT_GEM]: 2 };
        expect(hasEnoughResources(available, required)).toBe(false);
    });

    it('should return true if required is empty', () => {
        const available = { [ResourceType.RADIANT_GEM]: 1 };
        const required = {};
        expect(hasEnoughResources(available, required)).toBe(true);
    });
});

describe('reserveCard', () => {
    const player = createPlayer('1', 'Test Player');
    const card = { id: '1', name: 'Card' } as Card;

    it('should allow reserving a card if less than 3 reserved', () => {
        const result = reserveCard(player, card);
        expect(result).toBeTruthy();
        expect(result?.reservedCards.length).toBe(1);
        expect(result?.reservedCards[0].id).toBe('1');
    });

    it('should NOT allow reserving more than 3 cards', () => {
        const fullPlayer = {
            ...player,
            reservedCards: [card, card, card],
        };
        const result = reserveCard(fullPlayer, card);
        expect(result).toBeNull();
    });
});
