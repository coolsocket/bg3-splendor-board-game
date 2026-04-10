import { ResourceType, CardTier, CardType, GamePhase, REGULAR_RESOURCES } from './models';
import type { ResourceCollection, Card, Player, Patron, GameState, CardDeck } from './models';

/**
 * Helper function to create an empty resource collection
 */
export function createEmptyResourceCollection(): ResourceCollection {
    return {
        [ResourceType.RADIANT_GEM]: 0,
        [ResourceType.ARCANE_CRYSTAL]: 0,
        [ResourceType.NATURES_BLESSING]: 0,
        [ResourceType.INFERNAL_IRON]: 0,
        [ResourceType.DARK_QUARTZ]: 0,
        [ResourceType.TRUE_SOUL_TADPOLE]: 0,
    };
}

/**
 * Helper function to add resources
 */
export function addResources(
    target: ResourceCollection,
    source: ResourceCollection
): ResourceCollection {
    const result = { ...target };
    for (const [type, amount] of Object.entries(source)) {
        const resourceType = type as ResourceType;
        result[resourceType] = (result[resourceType] || 0) + (amount || 0);
    }
    return result;
}

/**
 * Helper function to subtract resources
 */
export function subtractResources(
    target: ResourceCollection,
    source: ResourceCollection
): ResourceCollection {
    const result = { ...target };
    for (const [type, amount] of Object.entries(source)) {
        const resourceType = type as ResourceType;
        result[resourceType] = (result[resourceType] || 0) - (amount || 0);
    }
    return result;
}

/**
 * Check if target has enough resources compared to required
 */
export function hasEnoughResources(
    available: ResourceCollection,
    required: ResourceCollection
): boolean {
    for (const [type, amount] of Object.entries(required)) {
        const resourceType = type as ResourceType;
        if ((available[resourceType] || 0) < (amount || 0)) {
            return false;
        }
    }
    return true;
}

/**
 * Helper to create a card
 */
export function createCard(
    id: string,
    name: string,
    tier: CardTier,
    type: CardType,
    cost: ResourceCollection,
    bonus: ResourceType,
    points: number,
    description?: string
): Card {
    return {
        id,
        name,
        tier,
        type,
        cost,
        bonus,
        points,
        description,
    };
}

/**
 * Calculate the effective cost of a card after applying bonuses
 */
export function calculateEffectiveCost(
    card: Card,
    bonuses: ResourceCollection
): ResourceCollection {
    const effectiveCost: ResourceCollection = {};

    for (const [type, amount] of Object.entries(card.cost)) {
        const resourceType = type as ResourceType;
        const bonus = bonuses[resourceType] || 0;
        const netCost = Math.max(0, (amount || 0) - bonus);
        if (netCost > 0) {
            effectiveCost[resourceType] = netCost;
        }
    }

    return effectiveCost;
}

/**
 * Helper to create a patron
 */
export function createPatron(
    id: string,
    name: string,
    requirements: ResourceCollection,
    points: number,
    description?: string
): Patron {
    return {
        id,
        name,
        requirements,
        points,
        description,
    };
}

/**
 * Check if a player's bonuses meet the patron's requirements
 */
export function meetsPatronRequirements(bonuses: ResourceCollection, patron: Patron): boolean {
    for (const [type, required] of Object.entries(patron.requirements)) {
        const available = bonuses[type as keyof ResourceCollection] || 0;
        if (available < (required || 0)) {
            return false;
        }
    }
    return true;
}

/**
 * Check if player meets requirements for any patrons and award them
 */
export function checkPatronVisits(
    player: Player,
    availablePatrons: Patron[]
): { player: Player; claimedPatrons: Patron[] } {
    let updatedPlayer = player;
    const claimedPatrons: Patron[] = [];

    for (const patron of availablePatrons) {
        if (meetsPatronRequirements(updatedPlayer.bonuses, patron)) {
            updatedPlayer = addPatronToPlayer(updatedPlayer, patron);
            claimedPatrons.push(patron);
        }
    }

    return { player: updatedPlayer, claimedPatrons };
}

/**
 * Create a new player with initial state
 */
export function createPlayer(id: string, name: string): Player {
    return {
        id,
        name,
        resources: createEmptyResourceCollection(),
        bonuses: createEmptyResourceCollection(),
        acquiredCards: [],
        reservedCards: [],
        patrons: [],
        prestigePoints: 0,
    };
}

/**
 * Add a resource token to the player's inventory
 */
export function addResourceToPlayer(
    player: Player,
    resourceType: ResourceType,
    amount: number = 1
): Player {
    return {
        ...player,
        resources: {
            ...player.resources,
            [resourceType]: (player.resources[resourceType] || 0) + amount,
        },
    };
}

/**
 * Remove a resource token from the player's inventory
 */
export function removeResourceFromPlayer(
    player: Player,
    resourceType: ResourceType,
    amount: number = 1
): Player {
    return {
        ...player,
        resources: {
            ...player.resources,
            [resourceType]: Math.max(0, (player.resources[resourceType] || 0) - amount),
        },
    };
}

/**
 * Acquire a card and add it to the player's collection
 */
export function acquireCard(player: Player, card: Card): Player {
    const newBonuses = {
        ...player.bonuses,
        [card.bonus]: (player.bonuses[card.bonus] || 0) + 1,
    };

    return {
        ...player,
        acquiredCards: [...player.acquiredCards, card],
        bonuses: newBonuses,
        prestigePoints: player.prestigePoints + card.points,
    };
}

/**
 * Reserve a card (max 3 allowed)
 */
export function reserveCard(player: Player, card: Card): Player | null {
    if (player.reservedCards.length >= 3) {
        return null; // Cannot reserve more than 3 cards
    }

    return {
        ...player,
        reservedCards: [...player.reservedCards, card],
    };
}

/**
 * Remove a reserved card from the player's reserved list
 */
export function unreserveCard(player: Player, cardId: string): Player {
    return {
        ...player,
        reservedCards: player.reservedCards.filter((c) => c.id !== cardId),
    };
}

/**
 * Add a patron to the player
 */
export function addPatronToPlayer(player: Player, patron: Patron): Player {
    return {
        ...player,
        patrons: [...player.patrons, patron],
        prestigePoints: player.prestigePoints + patron.points,
    };
}

/**
 * Get the total number of resource tokens held by the player
 */
export function getTotalResourceCount(player: Player): number {
    return Object.values(player.resources).reduce((sum, count) => sum + (count || 0), 0);
}

/**
 * Check if player has won (reached the winning point threshold)
 */
export function hasWon(player: Player, winningPoints: number = 15): boolean {
    return player.prestigePoints >= winningPoints;
}

/**
 * RALPH-M705: Seeded Random Number Generator
 * Allows reproducible game setups based on room code
 */
export class SeededRandom {
    private seed: number;

    constructor(seed: string | number) {
        if (typeof seed === 'string') {
            this.seed = this.hashString(seed);
        } else {
            this.seed = seed;
        }
    }

    private hashString(str: string): number {
        let hash = 5381;
        for (let i = 0; i < str.length; i++) {
            hash = (hash << 5) + hash + str.charCodeAt(i);
        }
        return Math.abs(hash);
    }

    next(): number {
        const a = 1664525;
        const c = 1013904223;
        const m = 2 ** 32;

        this.seed = (a * this.seed + c) % m;
        return this.seed / m;
    }

    nextInt(min: number, max: number): number {
        return Math.floor(this.next() * (max - min)) + min;
    }
}

/**
 * Fisher-Yates shuffle with seeded random number generator
 */
export function shuffleArrayWithSeed<T>(array: T[], rng: SeededRandom): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = rng.nextInt(0, i + 1);
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

/**
 * Utility: Shuffle an array (Fisher-Yates algorithm)
 */
export function shuffleArray<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

/**
 * Initial resource counts based on player count
 */
export function getInitialResourceCount(playerCount: number): number {
    switch (playerCount) {
        case 2:
            return 4;
        case 3:
            return 5;
        case 4:
            return 7;
        default:
            return 7;
    }
}

/**
 * Create initial game state
 */
export function createGameState(
    players: Player[],
    cardDecks: CardDeck[],
    patrons: Patron[],
    seed?: string
): GameState {
    const playerCount = players.length;
    const resourceCount = getInitialResourceCount(playerCount);

    // Initialize available resources
    const availableResources = createEmptyResourceCollection();
    for (const resourceType of REGULAR_RESOURCES) {
        availableResources[resourceType] = resourceCount;
    }
    availableResources[ResourceType.TRUE_SOUL_TADPOLE] = 5; // Always 5 tadpoles

    // Separate decks by tier
    const tier1Deck = cardDecks.find((d) => d.tier === CardTier.TIER_1)?.cards || [];
    const tier2Deck = cardDecks.find((d) => d.tier === CardTier.TIER_2)?.cards || [];
    const tier3Deck = cardDecks.find((d) => d.tier === CardTier.TIER_3)?.cards || [];

    // Shuffle decks with seed if provided
    let shuffledTier1, shuffledTier2, shuffledTier3;
    if (seed) {
        const rng = new SeededRandom(seed);
        shuffledTier1 = shuffleArrayWithSeed([...tier1Deck], rng);
        shuffledTier2 = shuffleArrayWithSeed([...tier2Deck], rng);
        shuffledTier3 = shuffleArrayWithSeed([...tier3Deck], rng);
    } else {
        shuffledTier1 = shuffleArray([...tier1Deck]);
        shuffledTier2 = shuffleArray([...tier2Deck]);
        shuffledTier3 = shuffleArray([...tier3Deck]);
    }

    // Draw initial face-up cards (4 per tier)
    const faceUpTier1 = shuffledTier1.splice(0, 4);
    const faceUpTier2 = shuffledTier2.splice(0, 4);
    const faceUpTier3 = shuffledTier3.splice(0, 4);

    return {
        phase: GamePhase.SETUP,
        players,
        currentPlayerIndex: 0,
        availableResources,
        decks: {
            [CardTier.TIER_1]: shuffledTier1,
            [CardTier.TIER_2]: shuffledTier2,
            [CardTier.TIER_3]: shuffledTier3,
        },
        faceUpCards: {
            [CardTier.TIER_1]: faceUpTier1,
            [CardTier.TIER_2]: faceUpTier2,
            [CardTier.TIER_3]: faceUpTier3,
        },
        availablePatrons: patrons,
        turnNumber: 0,
    };
}

/**
 * Get the current player
 */
export function getCurrentPlayer(state: GameState): Player {
    return state.players[state.currentPlayerIndex];
}

/**
 * Advance to the next player's turn
 */
export function nextTurn(state: GameState): GameState {
    const nextPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;

    return {
        ...state,
        currentPlayerIndex: nextPlayerIndex,
        turnNumber: state.turnNumber + 1,
    };
}

/**
 * Check if the game has ended
 */
export function isGameOver(state: GameState, winningPoints: number = 15): boolean {
    return state.players.some((player) => player.prestigePoints >= winningPoints);
}

/**
 * Get the winner(s) of the game
 */
export function getWinners(state: GameState): Player[] {
    const maxPoints = Math.max(...state.players.map((p) => p.prestigePoints));
    const playersWithMaxPoints = state.players.filter((p) => p.prestigePoints === maxPoints);

    if (playersWithMaxPoints.length === 1) {
        return playersWithMaxPoints;
    }

    const minCards = Math.min(...playersWithMaxPoints.map((p) => p.acquiredCards.length));
    return playersWithMaxPoints.filter((p) => p.acquiredCards.length === minCards);
}

/**
 * Draw a card from a specific tier deck and add it to face-up cards
 */
export function drawCardFromDeck(state: GameState, tier: CardTier): GameState {
    const deck = state.decks[tier];
    const faceUpCards = state.faceUpCards[tier];

    if (deck.length === 0) {
        return state;
    }

    const [drawnCard, ...remainingDeck] = deck;

    return {
        ...state,
        decks: {
            ...state.decks,
            [tier]: remainingDeck,
        },
        faceUpCards: {
            ...state.faceUpCards,
            [tier]: [...faceUpCards, drawnCard],
        },
    };
}

/**
 * Remove a face-up card from the board
 */
export function removeFaceUpCard(state: GameState, cardId: string): GameState {
    const newFaceUpCards = { ...state.faceUpCards };

    for (const tier of [CardTier.TIER_1, CardTier.TIER_2, CardTier.TIER_3]) {
        const filtered = newFaceUpCards[tier].filter((c) => c.id !== cardId);
        if (filtered.length !== newFaceUpCards[tier].length) {
            newFaceUpCards[tier] = filtered;
            break;
        }
    }

    return {
        ...state,
        faceUpCards: newFaceUpCards,
    };
}
