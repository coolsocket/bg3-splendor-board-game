import { ResourceType, CardTier, CardType } from './models';
import type { ResourceCollection, Card, Player, Patron, GameState } from './models';
import { GAME_CONFIG } from '../config/gameConfig';

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

export function addResources(target: ResourceCollection, source: ResourceCollection): ResourceCollection {
    const result = { ...target };
    for (const [type, amount] of Object.entries(source)) {
        const resourceType = type as ResourceType;
        result[resourceType] = (result[resourceType] || 0) + (amount || 0);
    }
    return result;
}

export function subtractResources(target: ResourceCollection, source: ResourceCollection): ResourceCollection {
    const result = { ...target };
    for (const [type, amount] of Object.entries(source)) {
        const resourceType = type as ResourceType;
        result[resourceType] = (result[resourceType] || 0) - (amount || 0);
    }
    return result;
}

export function hasEnoughResources(available: ResourceCollection, required: ResourceCollection): boolean {
    for (const [type, amount] of Object.entries(required)) {
        const resourceType = type as ResourceType;
        if ((available[resourceType] || 0) < (amount || 0)) return false;
    }
    return true;
}

export function calculateEffectiveCost(card: Card, bonuses: ResourceCollection): ResourceCollection {
    const effectiveCost: ResourceCollection = {};
    for (const [type, amount] of Object.entries(card.cost)) {
        const resourceType = type as ResourceType;
        const bonus = bonuses[resourceType] || 0;
        const netCost = Math.max(0, (amount || 0) - bonus);
        if (netCost > 0) effectiveCost[resourceType] = netCost;
    }
    return effectiveCost;
}

export function meetsPatronRequirements(bonuses: ResourceCollection, patron: Patron): boolean {
    for (const [type, required] of Object.entries(patron.requirements)) {
        const available = bonuses[type as ResourceType] || 0;
        if (available < (required || 0)) return false;
    }
    return true;
}

export function checkPatronVisits(player: Player, availablePatrons: Patron[]): { player: Player; claimedPatrons: Patron[] } {
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

export function createPlayer(id: string, name: string): Player {
    return {
        id, name,
        resources: createEmptyResourceCollection(),
        bonuses: createEmptyResourceCollection(),
        acquiredCards: [],
        reservedCards: [],
        patrons: [],
        prestigePoints: 0,
    };
}

export function addResourceToPlayer(player: Player, resourceType: ResourceType, amount: number = 1): Player {
    return {
        ...player,
        resources: {
            ...player.resources,
            [resourceType]: (player.resources[resourceType] || 0) + amount,
        },
    };
}

export function removeResourceFromPlayer(player: Player, resourceType: ResourceType, amount: number = 1): Player {
    return {
        ...player,
        resources: {
            ...player.resources,
            [resourceType]: Math.max(0, (player.resources[resourceType] || 0) - amount),
        },
    };
}

export function acquireCard(player: Player, card: Card): Player {
    const newBonuses = { ...player.bonuses };
    newBonuses[card.bonus] = (newBonuses[card.bonus] || 0) + 1;
    return {
        ...player,
        acquiredCards: [...player.acquiredCards, card],
        bonuses: newBonuses,
        prestigePoints: player.prestigePoints + card.points,
    };
}

export function reserveCard(player: Player, card: Card): Player | null {
    if (player.reservedCards.length >= GAME_CONFIG.MAX_RESERVED_CARDS) return null;
    return { ...player, reservedCards: [...player.reservedCards, card] };
}

export function unreserveCard(player: Player, cardId: string): Player {
    return { ...player, reservedCards: player.reservedCards.filter((c) => c.id !== cardId) };
}

export function addPatronToPlayer(player: Player, patron: Patron): Player {
    return {
        ...player,
        patrons: [...player.patrons, patron],
        prestigePoints: player.prestigePoints + patron.points,
    };
}

export function getTotalResourceCount(player: Player): number {
    return Object.values(player.resources).reduce((sum, count) => sum + (count || 0), 0);
}

export function hasWon(player: Player, winningPoints: number = GAME_CONFIG.WINNING_PRESTIGE): boolean {
    return player.prestigePoints >= winningPoints;
}

/**
 * Standard Splendor Win Conditions:
 * 1. Highest prestige points.
 * 2. If points are tied, the player with the fewest cards bought wins.
 */
export function getWinners(state: GameState): Player[] {
    const maxPoints = Math.max(...state.players.map(p => p.prestigePoints));
    const candidates = state.players.filter(p => p.prestigePoints === maxPoints);

    if (candidates.length <= 1) return candidates;

    // Tie-break: Fewest cards acquired
    const minCards = Math.min(...candidates.map(p => p.acquiredCards.length));
    return candidates.filter(p => p.acquiredCards.length === minCards);
}

export function createCard(id: string, assetId: string, name: string, tier: CardTier, type: CardType, cost: ResourceCollection, bonus: ResourceType, points: number, description?: string): Card {
    return { id, assetId, name, tier, type, cost, bonus, points, description };
}

export function createPatron(id: string, assetId: string, name: string, requirements: ResourceCollection, points: number, description?: string): Patron {
    return { id, assetId, name, requirements, points, description };
}

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
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash;
    }
    next(): number {
        const x = Math.sin(this.seed++) * 10000;
        return x - Math.floor(x);
    }
    nextInt(min: number, max: number): number {
        return Math.floor(this.next() * (max - min + 1)) + min;
    }
}

export function nextTurn(state: GameState): GameState {
    const nextIndex = (state.currentPlayerIndex + 1) % state.players.length;
    return { ...state, currentPlayerIndex: nextIndex, turnNumber: state.turnNumber + 1 };
}
