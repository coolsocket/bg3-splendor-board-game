/**
 * Greedy AI for BG3 Splendor
 * This AI makes decisions based on a greedy strategy with patron awareness
 */

import type {
    GameState,
    Player,
    Card,
    Patron,
} from '../domain/models';
import {
    CardTier,
    ResourceType,
    REGULAR_RESOURCES,
    RESOURCE_METADATA,
} from '../domain/models';
import { calculateEffectiveCost, meetsPatronRequirements, getTotalResourceCount } from '../domain/logic';
import { takeTokensAction, buyCardAction, reserveCardAction } from '../domain/actions';

/**
 * AI Configuration
 */
export interface AIConfig {
    patronAware: boolean; // Whether AI considers patrons when making decisions
    resourceTargeting: boolean; // Whether AI targets specific resources needed for cards
    strategicTadpoleUse: boolean; // Whether to save tadpoles for critical purchases
    defensiveBlocking: boolean; // Whether to reserve cards to block opponent
    name?: string; // AI player name

    // Scoring weights (RALPH-201)
    pointWeight: number; // Multiplier for card points in scoring
    patronAlignmentBonus: number; // Bonus score for cards that help achieve patron
    minReserveScore: number; // Minimum score to consider reserving a card

    // Tadpole strategy (RALPH-202)
    saveTadpolesForTier: number; // Save tadpoles for cards of this tier or higher (1-3)
    tadpoleThreshold: number; // Minimum tadpoles to keep in reserve
}

const DEFAULT_CONFIG: AIConfig = {
    patronAware: true,
    resourceTargeting: true,
    strategicTadpoleUse: false,
    defensiveBlocking: false,
    pointWeight: 2,
    patronAlignmentBonus: 2,
    minReserveScore: 5,
    saveTadpolesForTier: 3,
    tadpoleThreshold: 1,
};

/**
 * Execute a full AI turn
 */
export function executeAITurn(
    state: GameState,
    config: AIConfig = DEFAULT_CONFIG
): {
    state: GameState;
    action: string;
} {
    const player = state.players[state.currentPlayerIndex];
    const action = chooseAIAction(state, player, config);

    let newState = state;
    let actionDescription = '';

    if (action === 'buy') {
        const result = executeAIBuy(state, player, config);
        newState = result.state;
        actionDescription = result.action;
    } else if (action === 'reserve') {
        const result = executeAIReserve(state, player, config);
        newState = result.state;
        actionDescription = result.action;
    } else {
        const result = executeAITake(state, player, config);
        newState = result.state;
        actionDescription = result.action;
    }

    return { state: newState, action: actionDescription };
}

/**
 * Choose which type of action to take
 */
function chooseAIAction(
    state: GameState,
    player: Player,
    config: AIConfig
): 'buy' | 'reserve' | 'take' {
    // Check reserved cards first
    for (const card of player.reservedCards) {
        if (canAffordCard(card, player) && shouldUseTadpoles(card, player, state, config)) {
            return 'buy';
        }
    }

    // Check face-up cards
    const allFaceUpCards: Card[] = [
        ...state.faceUpCards[CardTier.TIER_1],
        ...state.faceUpCards[CardTier.TIER_2],
        ...state.faceUpCards[CardTier.TIER_3],
    ];

    for (const card of allFaceUpCards) {
        if (canAffordCard(card, player) && shouldUseTadpoles(card, player, state, config)) {
            return 'buy';
        }
    }

    // Reserve if we have space and there are good cards
    if (player.reservedCards.length < 3) {
        const valuableCards = getValuableCards(
            allFaceUpCards,
            state.availablePatrons,
            player,
            config
        );
        if (valuableCards.length > 0) {
            return 'reserve';
        }
    }

    return 'take';
}

/**
 * Check if player can afford a card
 */
export function canAffordCard(card: Card, player: Player): boolean {
    const effectiveCost = calculateEffectiveCost(card, player.bonuses);
    let tadpolesNeeded = 0;

    for (const resourceType of REGULAR_RESOURCES) {
        const needed = effectiveCost[resourceType] || 0;
        const have = player.resources[resourceType] || 0;
        if (have < needed) {
            tadpolesNeeded += needed - have;
        }
    }

    return tadpolesNeeded <= (player.resources[ResourceType.TRUE_SOUL_TADPOLE] || 0);
}

/**
 * RALPH-202: Check if we should use tadpoles for this purchase
 * Strategic tadpole usage - save for critical purchases
 */
function shouldUseTadpoles(
    card: Card,
    player: Player,
    state: GameState,
    config: AIConfig
): boolean {
    if (!config.strategicTadpoleUse) {
        return true; // No restrictions if strategy is disabled
    }

    const effectiveCost = calculateEffectiveCost(card, player.bonuses);
    let tadpolesNeeded = 0;

    for (const resourceType of REGULAR_RESOURCES) {
        const needed = effectiveCost[resourceType] || 0;
        const have = player.resources[resourceType] || 0;
        if (have < needed) {
            tadpolesNeeded += needed - have;
        }
    }

    if (tadpolesNeeded === 0) {
        return true; // Not using tadpoles anyway
    }

    const tadpolesAvailable = player.resources[ResourceType.TRUE_SOUL_TADPOLE] || 0;

    // Always use tadpoles if this wins the game
    const pointsAfterBuy = player.prestigePoints + card.points;
    if (pointsAfterBuy >= 15) {
        return true;
    }

    // Check if this completes a patron
    const newBonuses = { ...player.bonuses };
    if (card.bonus) {
        newBonuses[card.bonus] = (newBonuses[card.bonus] || 0) + 1;
    }
    for (const patron of state.availablePatrons) {
        if (meetsPatronRequirements(newBonuses, patron)) {
            return true; // Completing a patron is worth tadpoles
        }
    }

    // Only use tadpoles for high-tier cards
    if (card.tier >= config.saveTadpolesForTier) {
        return true;
    }

    // Don't use tadpoles if we'd go below threshold for lower-tier cards
    if (tadpolesAvailable - tadpolesNeeded >= config.tadpoleThreshold) {
        return true;
    }

    return false;
}

/**
 * Get valuable cards to reserve
 * Considers both point value and patron alignment
 * RALPH-201: Uses parameterized scoring weights from config
 */
function getValuableCards(
    cards: Card[],
    patrons: Patron[],
    player: Player,
    config: AIConfig
): Card[] {
    if (!config.patronAware) {
        // Simple greedy: just look at points
        return cards.filter((c) => c.points >= 3);
    }

    // Patron-aware: score cards based on both points and patron alignment
    const scoredCards = cards.map((card) => {
        let score = card.points * config.pointWeight; // Base score from points (configurable)

        // Add score if the card's bonus helps us get a patron
        if (card.bonus) {
            for (const patron of patrons) {
                const patronRequirements = patron.requirements;
                const currentBonuses = player.bonuses;

                // Check if we need this bonus type for the patron
                const needed = patronRequirements[card.bonus] || 0;
                const current = currentBonuses[card.bonus] || 0;

                if (needed > 0 && current < needed) {
                    score += config.patronAlignmentBonus; // Configurable bonus for patron alignment
                }
            }
        }

        return { card, score };
    });

    // Sort by score descending and filter for valuable ones
    scoredCards.sort((a, b) => b.score - a.score);
    return scoredCards.filter((sc) => sc.score >= config.minReserveScore).map((sc) => sc.card);
}

/**
 * Execute buy action
 */
function executeAIBuy(
    state: GameState,
    player: Player,
    config: AIConfig
): { state: GameState; action: string } {
    // Try reserved cards first
    for (const card of player.reservedCards) {
        if (shouldUseTadpoles(card, player, state, config)) {
            const result = buyCardAction(state, player.id, card.id, true);
            if (result.success) {
                return {
                    state: result.data,
                    action: `bought reserved card: ${card.name} (${card.points} pts)`,
                };
            }
        }
    }

    // Try face-up cards, prioritizing higher tiers
    const allFaceUpCards: Card[] = [
        ...state.faceUpCards[CardTier.TIER_3],
        ...state.faceUpCards[CardTier.TIER_2],
        ...state.faceUpCards[CardTier.TIER_1],
    ];

    for (const card of allFaceUpCards) {
        if (shouldUseTadpoles(card, player, state, config)) {
            const result = buyCardAction(state, player.id, card.id, false);
            if (result.success) {
                return {
                    state: result.data,
                    action: `bought card: ${card.name} (${card.points} pts)`,
                };
            }
        }
    }

    return { state, action: 'failed to buy' };
}

/**
 * Execute reserve action
 * RALPH-203: Includes defensive blocking to prevent opponent from getting key cards
 */
function executeAIReserve(
    state: GameState,
    player: Player,
    config: AIConfig
): { state: GameState; action: string } {
    const allFaceUpCards: Card[] = [
        ...state.faceUpCards[CardTier.TIER_3],
        ...state.faceUpCards[CardTier.TIER_2],
        ...state.faceUpCards[CardTier.TIER_1],
    ];

    let cardsToConsider = [...allFaceUpCards];

    // RALPH-203: Defensive blocking
    if (config.defensiveBlocking) {
        const opponent = state.players.find((p) => p.id !== player.id);
        if (opponent) {
            // Check which cards the opponent can buy
            const threateningCards = allFaceUpCards.filter((card) => {
                if (!canAffordCard(card, opponent)) return false;

                // High-value cards (4+ points) are worth blocking
                if (card.points >= 4) return true;

                // Check if card completes a patron for opponent
                const newBonuses = { ...opponent.bonuses };
                if (card.bonus) {
                    newBonuses[card.bonus] = (newBonuses[card.bonus] || 0) + 1;
                }
                for (const patron of state.availablePatrons) {
                    if (meetsPatronRequirements(newBonuses, patron)) return true;
                }

                // Check if opponent is close to winning
                if (opponent.prestigePoints + card.points >= 15) return true;

                return false;
            });

            // Prioritize blocking threatening cards
            if (threateningCards.length > 0) {
                cardsToConsider = [
                    ...threateningCards,
                    ...allFaceUpCards.filter((c) => !threateningCards.includes(c)),
                ];
            }
        }
    }

    // Sort by points descending
    cardsToConsider.sort((a, b) => b.points - a.points);

    for (const card of cardsToConsider) {
        const result = reserveCardAction(state, player.id, card.id);
        if (result.success) {
            return {
                state: result.data,
                action: `reserved card: ${card.name} (${card.points} pts)`,
            };
        }
    }

    return { state, action: 'failed to reserve' };
}

/**
 * Execute take tokens action
 * Enhanced with resource targeting
 * RALPH-204: Optimized to evaluate both 3-different and 2-same strategies
 */
function executeAITake(
    state: GameState,
    player: Player,
    config: AIConfig
): { state: GameState; action: string } {
    const playerTotalTokens = getTotalResourceCount(player);
    const canTake = 10 - playerTotalTokens;

    if (canTake === 0) {
        return { state, action: 'cannot take tokens (at limit)' };
    }

    let resourcesNeeded: ResourceType[];

    if (config.resourceTargeting) {
        // Smart targeting: look at cards we want to buy and get resources for them
        resourcesNeeded = getNeededResources(state, player);
    } else {
        // Simple greedy: take resources we have least bonuses for
        resourcesNeeded = [...REGULAR_RESOURCES].sort((a, b) => {
            const bonusA = player.bonuses[a] || 0;
            const bonusB = player.bonuses[b] || 0;
            return bonusA - bonusB;
        });
    }

    // RALPH-204: Evaluate both strategies and choose the better one

    // Strategy 1: Take 3 different tokens
    const strategy1: { [key: string]: number } = {};
    let count1 = 0;
    for (const resourceType of resourcesNeeded) {
        if (count1 >= Math.min(3, canTake)) break;
        const available = state.availableResources[resourceType] || 0;
        if (available > 0) {
            strategy1[resourceType] = 1;
            count1++;
        }
    }

    // Strategy 2: Take 2 of the same color (most needed)
    const strategy2: { [key: string]: number } = {};
    let count2 = 0;
    if (canTake >= 2 && resourcesNeeded.length > 0) {
        const mostNeeded = resourcesNeeded[0];
        const available = state.availableResources[mostNeeded] || 0;
        if (available >= 4) {
            strategy2[mostNeeded] = 2;
            count2 = 2;
        }
    }

    // Choose the better strategy based on how much it helps us
    let tokensToTake = strategy1;
    let tokenCount = count1;

    if (count2 > 0 && config.resourceTargeting) {
        // Score both strategies based on needed resources
        const score1 = Object.keys(strategy1).reduce((sum, type) => {
            const index = resourcesNeeded.indexOf(type as ResourceType);
            return sum + (index >= 0 ? resourcesNeeded.length - index : 0);
        }, 0);

        const score2 = Object.keys(strategy2).reduce((sum, type) => {
            const index = resourcesNeeded.indexOf(type as ResourceType);
            return sum + (index >= 0 ? (resourcesNeeded.length - index) * 2 : 0); // Double weight for 2 tokens
        }, 0);

        if (score2 > score1) {
            tokensToTake = strategy2;
            tokenCount = count2;
        }
    } else if (count2 > 0 && count1 <= 1) {
        // If we can only get 1 token with strategy 1, prefer 2 of same color
        tokensToTake = strategy2;
        tokenCount = count2;
    }

    if (tokenCount === 0) {
        return { state, action: 'no tokens available to take' };
    }

    const result = takeTokensAction(state, player.id, tokensToTake);
    if (result.success) {
        const tokenList = Object.entries(tokensToTake)
            .map(([type, count]) => `${count}x ${RESOURCE_METADATA[type as ResourceType].emoji}`)
            .join(', ');
        return {
            state: result.data,
            action: `took tokens: ${tokenList}`,
        };
    }

    return { state, action: 'failed to take tokens' };
}

/**
 * Get resources needed for high-value cards
 * Considers reserved cards and high-value face-up cards
 */
function getNeededResources(state: GameState, player: Player): ResourceType[] {
    const resourceNeeds: { [key in ResourceType]?: number } = {};

    // Check reserved cards
    for (const card of player.reservedCards) {
        const effectiveCost = calculateEffectiveCost(card, player.bonuses);
        for (const resourceType of REGULAR_RESOURCES) {
            const needed = effectiveCost[resourceType] || 0;
            const have = player.resources[resourceType] || 0;
            if (needed > have) {
                resourceNeeds[resourceType] = (resourceNeeds[resourceType] || 0) + (needed - have);
            }
        }
    }

    // Check high-value face-up cards
    const allFaceUpCards: Card[] = [
        ...state.faceUpCards[CardTier.TIER_3],
        ...state.faceUpCards[CardTier.TIER_2],
        ...state.faceUpCards[CardTier.TIER_1],
    ];

    const highValueCards = allFaceUpCards.filter((c) => c.points >= 2);

    for (const card of highValueCards) {
        const effectiveCost = calculateEffectiveCost(card, player.bonuses);
        for (const resourceType of REGULAR_RESOURCES) {
            const needed = effectiveCost[resourceType] || 0;
            const have = player.resources[resourceType] || 0;
            if (needed > have) {
                resourceNeeds[resourceType] =
                    (resourceNeeds[resourceType] || 0) + (needed - have) * 0.5;
            }
        }
    }

    // Sort resources by need (descending)
    const sortedResources = [...REGULAR_RESOURCES].sort((a, b) => {
        const needA = resourceNeeds[a] || 0;
        const needB = resourceNeeds[b] || 0;
        return needB - needA;
    });

    return sortedResources;
}

/**
 * RALPH-205: BG3 Character AI Personalities
 * Each companion has a unique AI configuration reflecting their lore personality
 */

// Shadowheart: Balanced and strategic, follows Shar's teachings of loss and secrecy
export const SHADOWHEART_AI: AIConfig = {
    patronAware: true,
    resourceTargeting: true,
    strategicTadpoleUse: true,
    defensiveBlocking: true,
    pointWeight: 2,
    patronAlignmentBonus: 2,
    minReserveScore: 5,
    saveTadpolesForTier: 3,
    tadpoleThreshold: 1,
    name: 'Shadowheart',
};

// Astarion: Aggressive and opportunistic, takes risks and goes for high value
export const ASTARION_AI: AIConfig = {
    patronAware: true,
    resourceTargeting: true,
    strategicTadpoleUse: false, // Spends tadpoles freely (risky)
    defensiveBlocking: true, // Very defensive
    pointWeight: 3, // Prioritizes points heavily
    patronAlignmentBonus: 1, // Less interested in long-term patron strategy
    minReserveScore: 6, // Only reserves very high-value cards
    saveTadpolesForTier: 2,
    tadpoleThreshold: 0, // Uses all tadpoles
    name: 'Astarion',
};

// Gale: Calculated and methodical, focuses on arcane knowledge (patrons/bonuses)
export const GALE_AI: AIConfig = {
    patronAware: true,
    resourceTargeting: true,
    strategicTadpoleUse: true,
    defensiveBlocking: false, // Less defensive, focuses on own strategy
    pointWeight: 1.5, // Balanced points
    patronAlignmentBonus: 3, // Heavily prioritizes patron alignment
    minReserveScore: 4, // Reserves more cards
    saveTadpolesForTier: 3,
    tadpoleThreshold: 2, // Hoards tadpoles
    name: 'Gale',
};

// Lae'zel: Aggressive and direct, warrior mentality
export const LAEZEL_AI: AIConfig = {
    patronAware: false, // Doesn't care about patrons, just points
    resourceTargeting: true,
    strategicTadpoleUse: false,
    defensiveBlocking: true, // Blocks opponents aggressively
    pointWeight: 3, // Very aggressive point-seeking
    patronAlignmentBonus: 0,
    minReserveScore: 7, // Only reserves extremely valuable cards
    saveTadpolesForTier: 2,
    tadpoleThreshold: 0,
    name: "Lae'zel",
};

// Wyll: Honorable and balanced, the Blade of Frontiers
export const WYLL_AI: AIConfig = {
    patronAware: true,
    resourceTargeting: true,
    strategicTadpoleUse: true,
    defensiveBlocking: false, // Honorable, doesn't block
    pointWeight: 2,
    patronAlignmentBonus: 2,
    minReserveScore: 5,
    saveTadpolesForTier: 3,
    tadpoleThreshold: 1,
    name: 'Wyll',
};

// Karlach: Enthusiastic and resource-hungry, engine always burning
export const KARLACH_AI: AIConfig = {
    patronAware: true,
    resourceTargeting: true,
    strategicTadpoleUse: false, // Uses tadpoles freely (burning hot)
    defensiveBlocking: false,
    pointWeight: 2.5,
    patronAlignmentBonus: 1.5,
    minReserveScore: 5,
    saveTadpolesForTier: 2,
    tadpoleThreshold: 0, // Burns through everything
    name: 'Karlach',
};

/**
 * Get AI config for a specific companion
 */
export function getCompanionAI(companionName: string): AIConfig {
    const configs: { [key: string]: AIConfig } = {
        Shadowheart: SHADOWHEART_AI,
        Astarion: ASTARION_AI,
        Gale: GALE_AI,
        "Lae'zel": LAEZEL_AI,
        Wyll: WYLL_AI,
        Karlach: KARLACH_AI,
    };

    return configs[companionName] || SHADOWHEART_AI; // Default to Shadowheart
}
