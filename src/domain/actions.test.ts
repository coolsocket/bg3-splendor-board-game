import { describe, it, expect } from 'vitest';
import { takeTokensAction, buyCardAction, reserveCardAction } from './actions';
import { ResourceType, GamePhase, CardTier, CardType } from './models';
import type { GameState } from './models';
import { createPlayer, createEmptyResourceCollection } from './logic';

describe('takeTokensAction', () => {
    const player1 = createPlayer('1', 'Player 1');
    const player2 = createPlayer('2', 'Player 2');

    const baseState: GameState = {
        phase: GamePhase.IN_PROGRESS,
        players: [player1, player2],
        currentPlayerIndex: 0,
        availableResources: {
            [ResourceType.RADIANT_GEM]: 4,
            [ResourceType.ARCANE_CRYSTAL]: 4,
            [ResourceType.NATURES_BLESSING]: 4,
            [ResourceType.INFERNAL_IRON]: 4,
            [ResourceType.DARK_QUARTZ]: 4,
            [ResourceType.TRUE_SOUL_TADPOLE]: 5,
        },
        decks: { 1: [], 2: [], 3: [] },
        faceUpCards: { 1: [], 2: [], 3: [] },
        availablePatrons: [],
        turnNumber: 1,
    };

    it('should allow taking 3 different tokens', () => {
        const tokens = {
            [ResourceType.RADIANT_GEM]: 1,
            [ResourceType.ARCANE_CRYSTAL]: 1,
            [ResourceType.NATURES_BLESSING]: 1,
        };

        const result = takeTokensAction(baseState, '1', tokens);

        expect(result.success).toBe(true);
        if (result.success) {
            const newState = result.data;
            expect(newState.players[0].resources[ResourceType.RADIANT_GEM]).toBe(1);
            expect(newState.players[0].resources[ResourceType.ARCANE_CRYSTAL]).toBe(1);
            expect(newState.players[0].resources[ResourceType.NATURES_BLESSING]).toBe(1);
            
            expect(newState.availableResources[ResourceType.RADIANT_GEM]).toBe(3);
            expect(newState.availableResources[ResourceType.ARCANE_CRYSTAL]).toBe(3);
            expect(newState.availableResources[ResourceType.NATURES_BLESSING]).toBe(3);
        }
    });

    it('should allow taking 2 of the same color if 4+ are available', () => {
        const tokens = {
            [ResourceType.RADIANT_GEM]: 2,
        };

        const result = takeTokensAction(baseState, '1', tokens);

        expect(result.success).toBe(true);
        if (result.success) {
            const newState = result.data;
            expect(newState.players[0].resources[ResourceType.RADIANT_GEM]).toBe(2);
            expect(newState.availableResources[ResourceType.RADIANT_GEM]).toBe(2);
        }
    });

    it('should fail if taking 2 of the same color when less than 4 are available', () => {
        const state = {
            ...baseState,
            availableResources: {
                ...baseState.availableResources,
                [ResourceType.RADIANT_GEM]: 3,
            },
        };
        const tokens = {
            [ResourceType.RADIANT_GEM]: 2,
        };

        const result = takeTokensAction(state, '1', tokens);

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error).toContain('Invalid token selection pattern');
        }
    });

    it('should fail if player not found', () => {
        const tokens = {
            [ResourceType.RADIANT_GEM]: 1,
            [ResourceType.ARCANE_CRYSTAL]: 1,
            [ResourceType.NATURES_BLESSING]: 1,
        };

        const result = takeTokensAction(baseState, 'non-existent', tokens);

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error).toContain('Player not found');
        }
    });

    it('should fail if taking tadpoles directly', () => {
        const tokens = {
            [ResourceType.TRUE_SOUL_TADPOLE]: 1,
            [ResourceType.RADIANT_GEM]: 1,
            [ResourceType.ARCANE_CRYSTAL]: 1,
        };

        const result = takeTokensAction(baseState, '1', tokens);

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error).toContain('Cannot take tadpole tokens directly');
        }
    });

    it('should fail if taking invalid combination (e.g. 2 different)', () => {
        const tokens = {
            [ResourceType.RADIANT_GEM]: 1,
            [ResourceType.ARCANE_CRYSTAL]: 1,
        };

        const result = takeTokensAction(baseState, '1', tokens);

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error).toContain('Invalid token selection pattern');
        }
    });

    it('should fail if taking more than 3 tokens', () => {
        const tokens = {
            [ResourceType.RADIANT_GEM]: 2,
            [ResourceType.ARCANE_CRYSTAL]: 2,
        };

        const result = takeTokensAction(baseState, '1', tokens);

        expect(result.success).toBe(false);
    });

    it('should fail if not enough tokens available on board', () => {
        const state = {
            ...baseState,
            availableResources: {
                ...baseState.availableResources,
                [ResourceType.RADIANT_GEM]: 0,
            },
        };
        const tokens = {
            [ResourceType.RADIANT_GEM]: 1,
            [ResourceType.ARCANE_CRYSTAL]: 1,
            [ResourceType.NATURES_BLESSING]: 1,
        };

        const result = takeTokensAction(state, '1', tokens);

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error).toContain('Not enough');
        }
    });

    it('should allow player to exceed 10 tokens limit (discard handled by UI)', () => {
        const richPlayer = {
            ...player1,
            resources: {
                ...createEmptyResourceCollection(),
                [ResourceType.RADIANT_GEM]: 8,
            },
        };
        const state = {
            ...baseState,
            players: [richPlayer, player2],
        };
        const tokens = {
            [ResourceType.ARCANE_CRYSTAL]: 1,
            [ResourceType.NATURES_BLESSING]: 1,
            [ResourceType.INFERNAL_IRON]: 1,
        };

        const result = takeTokensAction(state, '1', tokens);

        expect(result.success).toBe(true);
    });
});

describe('buyCardAction', () => {
    const player1 = createPlayer('1', 'Player 1');
    const player2 = createPlayer('2', 'Player 2');

    const testCard = {
        id: 'card1',
        name: 'Test Card',
        tier: CardTier.TIER_1,
        type: CardType.SPELL,
        cost: { [ResourceType.RADIANT_GEM]: 2 },
        bonus: ResourceType.RADIANT_GEM,
        points: 1,
    };

    const baseState: GameState = {
        phase: GamePhase.IN_PROGRESS,
        players: [player1, player2],
        currentPlayerIndex: 0,
        availableResources: {
            [ResourceType.RADIANT_GEM]: 4,
            [ResourceType.ARCANE_CRYSTAL]: 4,
            [ResourceType.NATURES_BLESSING]: 4,
            [ResourceType.INFERNAL_IRON]: 4,
            [ResourceType.DARK_QUARTZ]: 4,
            [ResourceType.TRUE_SOUL_TADPOLE]: 5,
        },
        decks: { [CardTier.TIER_1]: [], [CardTier.TIER_2]: [], [CardTier.TIER_3]: [] },
        faceUpCards: { [CardTier.TIER_1]: [testCard], [CardTier.TIER_2]: [], [CardTier.TIER_3]: [] },
        availablePatrons: [],
        turnNumber: 1,
    };

    it('should allow buying a card with exact resources', () => {
        const state = {
            ...baseState,
            players: [
                {
                    ...player1,
                    resources: { ...createEmptyResourceCollection(), [ResourceType.RADIANT_GEM]: 2 },
                },
                    player2,
            ],
        };

        const result = buyCardAction(state, '1', 'card1');

        expect(result.success).toBe(true);
        if (result.success) {
            const newState = result.data;
            expect(newState.players[0].resources[ResourceType.RADIANT_GEM]).toBe(0);
            expect(newState.players[0].acquiredCards.length).toBe(1);
            expect(newState.players[0].acquiredCards[0].id).toBe('card1');
            expect(newState.players[0].prestigePoints).toBe(1);
            expect(newState.players[0].bonuses[ResourceType.RADIANT_GEM]).toBe(1);
            expect(newState.availableResources[ResourceType.RADIANT_GEM]).toBe(6); // 4 + 2
            expect(newState.faceUpCards[CardTier.TIER_1].length).toBe(0);
        }
    });

    it('should allow buying a card using tadpoles as wildcards', () => {
        const state = {
            ...baseState,
            players: [
                {
                    ...player1,
                    resources: {
                        ...createEmptyResourceCollection(),
                        [ResourceType.RADIANT_GEM]: 1,
                        [ResourceType.TRUE_SOUL_TADPOLE]: 1,
                    },
                },
                player2,
            ],
        };

        const result = buyCardAction(state, '1', 'card1');

        expect(result.success).toBe(true);
        if (result.success) {
            const newState = result.data;
            expect(newState.players[0].resources[ResourceType.RADIANT_GEM]).toBe(0);
            expect(newState.players[0].resources[ResourceType.TRUE_SOUL_TADPOLE]).toBe(0);
            expect(newState.players[0].acquiredCards.length).toBe(1);
            expect(newState.availableResources[ResourceType.RADIANT_GEM]).toBe(5); // 4 + 1
            expect(newState.availableResources[ResourceType.TRUE_SOUL_TADPOLE]).toBe(6); // 5 + 1
        }
    });

    it('should fail if not enough resources', () => {
        const state = {
            ...baseState,
            players: [
                {
                    ...player1,
                    resources: { ...createEmptyResourceCollection(), [ResourceType.RADIANT_GEM]: 1 },
                },
                player2,
            ],
        };

        const result = buyCardAction(state, '1', 'card1');

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error).toContain('Not enough resources');
        }
    });

    it('should fail if card not found', () => {
        const result = buyCardAction(baseState, '1', 'non-existent-card');

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error).toContain('Card not found');
        }
    });

    it('should allow buying a reserved card', () => {
        const reservedCard = { ...testCard, id: 'reserved1' };
        const state = {
            ...baseState,
            players: [
                {
                    ...player1,
                    resources: { ...createEmptyResourceCollection(), [ResourceType.RADIANT_GEM]: 2 },
                    reservedCards: [reservedCard],
                },
                player2,
            ],
            faceUpCards: { [CardTier.TIER_1]: [], [CardTier.TIER_2]: [], [CardTier.TIER_3]: [] },
        };

        const result = buyCardAction(state, '1', 'reserved1', true);

        expect(result.success).toBe(true);
        if (result.success) {
            const newState = result.data;
            expect(newState.players[0].resources[ResourceType.RADIANT_GEM]).toBe(0);
            expect(newState.players[0].acquiredCards.length).toBe(1);
            expect(newState.players[0].reservedCards.length).toBe(0);
        }
    });

    it('should handle discounts from bonuses', () => {
        const expensiveCard = {
            id: 'card2',
            name: 'Expensive Card',
            tier: CardTier.TIER_1,
            type: CardType.SPELL,
            cost: { [ResourceType.RADIANT_GEM]: 3 },
            bonus: ResourceType.RADIANT_GEM,
            points: 1,
        };
        const state = {
            ...baseState,
            players: [
                {
                    ...player1,
                    resources: { ...createEmptyResourceCollection(), [ResourceType.RADIANT_GEM]: 2 },
                    bonuses: { ...createEmptyResourceCollection(), [ResourceType.RADIANT_GEM]: 1 },
                },
                player2,
            ],
            faceUpCards: { [CardTier.TIER_1]: [expensiveCard], [CardTier.TIER_2]: [], [CardTier.TIER_3]: [] },
        };

        const result = buyCardAction(state, '1', 'card2');

        expect(result.success).toBe(true);
        if (result.success) {
            const newState = result.data;
            expect(newState.players[0].resources[ResourceType.RADIANT_GEM]).toBe(0);
            expect(newState.players[0].acquiredCards.length).toBe(1);
        }
    });

    it('should replace face-up card from deck if available', () => {
        const replacementCard = {
            id: 'card2',
            name: 'Replacement Card',
            tier: CardTier.TIER_1,
            type: CardType.SPELL,
            cost: { [ResourceType.RADIANT_GEM]: 1 },
            bonus: ResourceType.RADIANT_GEM,
            points: 1,
        };
        const state = {
            ...baseState,
            players: [
                {
                    ...player1,
                    resources: { ...createEmptyResourceCollection(), [ResourceType.RADIANT_GEM]: 2 },
                },
                player2,
            ],
            decks: { [CardTier.TIER_1]: [replacementCard], [CardTier.TIER_2]: [], [CardTier.TIER_3]: [] },
        };

        const result = buyCardAction(state, '1', 'card1');

        expect(result.success).toBe(true);
        if (result.success) {
            const newState = result.data;
            expect(newState.faceUpCards[CardTier.TIER_1].length).toBe(1);
            expect(newState.faceUpCards[CardTier.TIER_1][0].id).toBe('card2');
            expect(newState.decks[CardTier.TIER_1].length).toBe(0);
        }
    });

    it('should trigger patron visit if conditions met', () => {
        const patron = {
            id: 'patron1',
            name: 'Test Patron',
            requirements: { [ResourceType.RADIANT_GEM]: 1 },
            points: 3,
        };
        const state = {
            ...baseState,
            players: [
                {
                    ...player1,
                    resources: { ...createEmptyResourceCollection(), [ResourceType.RADIANT_GEM]: 2 },
                },
                player2,
            ],
            availablePatrons: [patron],
        };

        const result = buyCardAction(state, '1', 'card1');

        expect(result.success).toBe(true);
        if (result.success) {
            const newState = result.data;
            expect(newState.players[0].patrons.length).toBe(1);
            expect(newState.players[0].patrons[0].id).toBe('patron1');
            expect(newState.players[0].prestigePoints).toBe(4); // 1 (card) + 3 (patron)
            expect(newState.availablePatrons.length).toBe(0);
        }
    });

    it('should not trigger patron visit if conditions are not met', () => {
        const patron = {
            id: 'patron1',
            name: 'Test Patron',
            requirements: { [ResourceType.RADIANT_GEM]: 3 }, // Requires 3, player will only have 2
            points: 3,
        };
        const state = {
            ...baseState,
            players: [
                {
                    ...player1,
                    resources: { ...createEmptyResourceCollection(), [ResourceType.RADIANT_GEM]: 2 },
                },
                player2,
            ],
            availablePatrons: [patron],
        };

        const result = buyCardAction(state, '1', 'card1');

        expect(result.success).toBe(true);
        if (result.success) {
            const newState = result.data;
            expect(newState.players[0].patrons.length).toBe(0);
            expect(newState.players[0].prestigePoints).toBe(1); // Only card points
            expect(newState.availablePatrons.length).toBe(1);
        }
    });
});

describe('reserveCardAction', () => {
    const player1 = createPlayer('1', 'Player 1');
    const player2 = createPlayer('2', 'Player 2');

    const testCard = {
        id: 'card1',
        name: 'Test Card',
        tier: CardTier.TIER_1,
        type: CardType.SPELL,
        cost: { [ResourceType.RADIANT_GEM]: 2 },
        bonus: ResourceType.RADIANT_GEM,
        points: 1,
    };

    const baseState: GameState = {
        phase: GamePhase.IN_PROGRESS,
        players: [player1, player2],
        currentPlayerIndex: 0,
        availableResources: {
            [ResourceType.RADIANT_GEM]: 4,
            [ResourceType.ARCANE_CRYSTAL]: 4,
            [ResourceType.NATURES_BLESSING]: 4,
            [ResourceType.INFERNAL_IRON]: 4,
            [ResourceType.DARK_QUARTZ]: 4,
            [ResourceType.TRUE_SOUL_TADPOLE]: 5,
        },
        decks: { [CardTier.TIER_1]: [], [CardTier.TIER_2]: [], [CardTier.TIER_3]: [] },
        faceUpCards: { [CardTier.TIER_1]: [testCard], [CardTier.TIER_2]: [], [CardTier.TIER_3]: [] },
        availablePatrons: [],
        turnNumber: 1,
    };

    it('should allow reserving a card from board and give a tadpole', () => {
        const result = reserveCardAction(baseState, '1', 'card1');

        expect(result.success).toBe(true);
        if (result.success) {
            const newState = result.data;
            expect(newState.players[0].reservedCards.length).toBe(1);
            expect(newState.players[0].reservedCards[0].id).toBe('card1');
            expect(newState.players[0].resources[ResourceType.TRUE_SOUL_TADPOLE]).toBe(1);
            expect(newState.availableResources[ResourceType.TRUE_SOUL_TADPOLE]).toBe(4);
            expect(newState.faceUpCards[CardTier.TIER_1].length).toBe(0);
        }
    });

    it('should allow reserving a card from deck and give a tadpole', () => {
        const deckCard = { ...testCard, id: 'deckCard' };
        const state = {
            ...baseState,
            decks: { ...baseState.decks, [CardTier.TIER_1]: [deckCard] },
            faceUpCards: { [CardTier.TIER_1]: [], [CardTier.TIER_2]: [], [CardTier.TIER_3]: [] },
        };

        const result = reserveCardAction(state, '1', undefined, CardTier.TIER_1);

        expect(result.success).toBe(true);
        if (result.success) {
            const newState = result.data;
            expect(newState.players[0].reservedCards.length).toBe(1);
            expect(newState.players[0].reservedCards[0].id).toBe('deckCard');
            expect(newState.players[0].resources[ResourceType.TRUE_SOUL_TADPOLE]).toBe(1);
            expect(newState.decks[CardTier.TIER_1].length).toBe(0);
        }
    });

    it('should not give tadpole if none available', () => {
        const state = {
            ...baseState,
            availableResources: {
                ...baseState.availableResources,
                [ResourceType.TRUE_SOUL_TADPOLE]: 0,
            },
        };

        const result = reserveCardAction(state, '1', 'card1');

        expect(result.success).toBe(true);
        if (result.success) {
            const newState = result.data;
            expect(newState.players[0].reservedCards.length).toBe(1);
            expect(newState.players[0].resources[ResourceType.TRUE_SOUL_TADPOLE]).toBe(0);
        }
    });

    it('should not give tadpole if player has 10 tokens', () => {
        const richPlayer = {
            ...player1,
            resources: {
                ...createEmptyResourceCollection(),
                [ResourceType.RADIANT_GEM]: 10,
            },
        };
        const state = {
            ...baseState,
            players: [richPlayer, player2],
        };

        const result = reserveCardAction(state, '1', 'card1');

        expect(result.success).toBe(true);
        if (result.success) {
            const newState = result.data;
            expect(newState.players[0].reservedCards.length).toBe(1);
            expect(newState.players[0].resources[ResourceType.TRUE_SOUL_TADPOLE]).toBe(0);
            expect(newState.availableResources[ResourceType.TRUE_SOUL_TADPOLE]).toBe(5);
        }
    });

    it('should fail if player already has 3 reserved cards', () => {
        const fullPlayer = {
            ...player1,
            reservedCards: [
                { ...testCard, id: 'res1' },
                { ...testCard, id: 'res2' },
                { ...testCard, id: 'res3' },
            ],
        };
        const state = {
            ...baseState,
            players: [fullPlayer, player2],
        };

        const result = reserveCardAction(state, '1', 'card1');

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error).toContain('Cannot reserve more than 3 cards');
        }
    });

    it('should fail if card not found on board', () => {
        const result = reserveCardAction(baseState, '1', 'non-existent');

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error).toContain('Card not found in face-up cards');
        }
    });

    it('should fail if deck is empty when reserving from deck', () => {
        const result = reserveCardAction(baseState, '1', undefined, CardTier.TIER_1);

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error).toContain('No cards left in tier');
        }
    });

    it('should fail if neither cardId nor fromDeck is specified', () => {
        const result = reserveCardAction(baseState, '1');

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error).toContain('Must specify either cardId or fromDeck');
        }
    });
});
