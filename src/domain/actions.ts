import { ResourceType, CardTier, GamePhase } from './models';
import type { GameState, ResourceCollection, Card } from './models';
import { addResourceToPlayer, getTotalResourceCount, calculateEffectiveCost, removeResourceFromPlayer, acquireCard, unreserveCard, reserveCard, checkPatronVisits } from './logic';
import { validateTokenTake } from './rules/tokenRules';
import { GAME_CONFIG } from '../config/gameConfig';

/**
 * Action result type - either success with new state, or error with message
 */
export type ActionResult<T> = { success: true; data: T } | { success: false; error: string };

/**
 * Token selection for the "take tokens" action
 */
export interface TokenSelection {
    [key: string]: number;
}

/**
 * Action: Take resource tokens from the board
 * Rules:
 * - Take 3 different colored tokens, OR
 * - Take 2 of the same color (only if 4+ available), OR
 * - Cannot exceed 10 total tokens after taking
 * - Cannot take tadpoles directly (they're only from reserving)
 */
export function takeTokensAction(
    state: GameState,
    playerId: string,
    tokens: TokenSelection
): ActionResult<GameState> {
    const playerIndex = state.players.findIndex((p) => p.id === playerId);
    if (playerIndex === -1) {
        return { success: false, error: 'Player not found' };
    }

    const player = state.players[playerIndex];

    // Validate token selection
    const totalTaken = Object.values(tokens).reduce((sum, count) => sum + (count || 0), 0);

    // Cannot take tadpoles directly
    if (tokens[ResourceType.TRUE_SOUL_TADPOLE]) {
        return {
            success: false,
            error: 'Cannot take tadpole tokens directly (only from reserving cards)',
        };
    }

    // Must take at least 1 token
    if (totalTaken === 0) {
        return { success: false, error: 'Must take at least one token' };
    }

    // Check if tokens are available on the board
    for (const [type, count] of Object.entries(tokens)) {
        const resourceType = type as ResourceType;
        const available = state.availableResources[resourceType] || 0;
        if (available < (count || 0)) {
            return { success: false, error: `Not enough ${resourceType} tokens available` };
        }
    }

    // Use unified validation logic (allows "take 3", "take 2", or taking fewer if bank empty)
    const isValid = validateTokenTake(tokens as any, state.availableResources);
    if (!isValid) {
        return {
            success: false,
            error: 'Invalid token selection pattern',
        };
    }

    // Execute the action
    let updatedPlayer = player;
    const updatedResources = { ...state.availableResources };

    for (const [type, count] of Object.entries(tokens)) {
        const resourceType = type as ResourceType;
        const amount = count || 0;
        if (amount > 0) {
            updatedPlayer = addResourceToPlayer(updatedPlayer, resourceType, amount);
            updatedResources[resourceType] = (updatedResources[resourceType] || 0) - amount;
        }
    }

    const newPlayers = [...state.players];
    newPlayers[playerIndex] = updatedPlayer;

    return {
        success: true,
        data: {
            ...state,
            players: newPlayers,
            availableResources: updatedResources,
        },
    };
}

/**
 * Action: Buy a card (from face-up cards or reserved cards)
 * Rules:
 * - Must have enough resources (after bonuses) to pay the cost
 * - Card grants permanent bonus and prestige points
 * - If buying from face-up, replace with new card from deck
 * - Check if any patrons visit after purchase
 */
export function buyCardAction(
    state: GameState,
    playerId: string,
    cardId: string,
    fromReserved: boolean = false
): ActionResult<GameState> {
    const playerIndex = state.players.findIndex((p) => p.id === playerId);
    if (playerIndex === -1) {
        return { success: false, error: 'Player not found' };
    }

    let player = state.players[playerIndex];
    let card: Card | undefined;
    let cardTier: CardTier | undefined;

    // Find the card
    if (fromReserved) {
        card = player.reservedCards.find((c) => c.id === cardId);
        if (!card) {
            return { success: false, error: 'Card not found in reserved cards' };
        }
    } else {
        // Search in face-up cards
        for (const tier of [CardTier.TIER_1, CardTier.TIER_2, CardTier.TIER_3] as const) {
            const foundCard = state.faceUpCards[tier].find((c) => c.id === cardId);
            if (foundCard) {
                card = foundCard;
                cardTier = tier;
                break;
            }
        }
        if (!card) {
            return { success: false, error: 'Card not found in face-up cards' };
        }
    }

    // Calculate effective cost after bonuses
    const effectiveCost = calculateEffectiveCost(card, player.bonuses);

    // Check if player has enough resources (including tadpoles as wildcards)
    const totalResources = { ...player.resources };
    const tadpoles = totalResources[ResourceType.TRUE_SOUL_TADPOLE] || 0;

    // Calculate how many resources we need after using regular resources
    let tadpolesNeeded = 0;
    const resourcesNeeded: ResourceCollection = {};

    for (const [type, needed] of Object.entries(effectiveCost)) {
        const resourceType = type as ResourceType;
        const available = totalResources[resourceType] || 0;
        if (available < (needed || 0)) {
            const shortage = (needed || 0) - available;
            tadpolesNeeded += shortage;
            resourcesNeeded[resourceType] = available; // Use all available
        } else {
            resourcesNeeded[resourceType] = needed;
        }
    }

    if (tadpolesNeeded > tadpoles) {
        return { success: false, error: 'Not enough resources to buy this card' };
    }

    // Deduct resources from player
    for (const [type, amount] of Object.entries(resourcesNeeded)) {
        const resourceType = type as ResourceType;
        player = removeResourceFromPlayer(player, resourceType, amount || 0);
    }

    // Deduct tadpoles if needed
    if (tadpolesNeeded > 0) {
        player = removeResourceFromPlayer(player, ResourceType.TRUE_SOUL_TADPOLE, tadpolesNeeded);
    }

    // Add resources back to the board
    const updatedBoardResources = { ...state.availableResources };
    for (const [type, amount] of Object.entries(resourcesNeeded)) {
        const resourceType = type as ResourceType;
        updatedBoardResources[resourceType] =
            (updatedBoardResources[resourceType] || 0) + (amount || 0);
    }
    if (tadpolesNeeded > 0) {
        updatedBoardResources[ResourceType.TRUE_SOUL_TADPOLE] =
            (updatedBoardResources[ResourceType.TRUE_SOUL_TADPOLE] || 0) + tadpolesNeeded;
    }

    // Acquire the card
    player = acquireCard(player, card);

    // Remove from reserved if applicable
    if (fromReserved) {
        player = unreserveCard(player, cardId);
    }

    // Update game state
    let newState = {
        ...state,
        availableResources: updatedBoardResources,
    };

    // Remove from face-up cards and draw replacement if not from reserved
    if (!fromReserved && cardTier !== undefined) {
        const newFaceUpCards = state.faceUpCards[cardTier].filter((c) => c.id !== cardId);
        newState = {
            ...newState,
            faceUpCards: {
                ...newState.faceUpCards,
                [cardTier]: newFaceUpCards,
            },
        };

        // Draw replacement card from deck
        const deck = newState.decks[cardTier];
        if (deck.length > 0) {
            const [drawnCard, ...remainingDeck] = deck;
            newState = {
                ...newState,
                decks: {
                    ...newState.decks,
                    [cardTier]: remainingDeck,
                },
                faceUpCards: {
                    ...newState.faceUpCards,
                    [cardTier]: [...newFaceUpCards, drawnCard],
                },
            };
        }
    }

    // Check if any patrons visit
    const { player: playerWithPatrons, claimedPatrons } = checkPatronVisits(
        player,
        newState.availablePatrons
    );
    player = playerWithPatrons;

    // Remove claimed patrons from available
    const remainingPatrons = newState.availablePatrons.filter(
        (p) => !claimedPatrons.some((claimed) => claimed.id === p.id)
    );

    // Update players array
    const newPlayers = [...state.players];
    newPlayers[playerIndex] = player;

    // Sudden death: First to reach WINNING_PRESTIGE wins immediately
    const finalPhase = player.prestigePoints >= GAME_CONFIG.WINNING_PRESTIGE 
        ? GamePhase.COMPLETED 
        : newState.phase;

    return {
        success: true,
        data: {
            ...newState,
            players: newPlayers,
            availablePatrons: remainingPatrons,
            phase: finalPhase,
        },
    };
}


/**
 * Action: Reserve a card
 * Rules:
 * - Can only reserve max 3 cards
 * - Get a tadpole token when reserving (if available)
 * - Can reserve from face-up cards or from top of deck
 * - Cannot exceed 10 total tokens after getting tadpole
 */
export function reserveCardAction(
    state: GameState,
    playerId: string,
    cardId?: string,
    fromDeck?: CardTier
): ActionResult<GameState> {
    const playerIndex = state.players.findIndex((p) => p.id === playerId);
    if (playerIndex === -1) {
        return { success: false, error: 'Player not found' };
    }

    let player = state.players[playerIndex];

    // Check if player already has 3 reserved cards
    if (player.reservedCards.length >= 3) {
        return { success: false, error: 'Cannot reserve more than 3 cards' };
    }

    let card: Card | undefined;
    let cardTier: CardTier | undefined;
    let fromDeckTop = false;

    // Determine the card to reserve
    if (cardId) {
        // Reserve from face-up cards
        for (const tier of [CardTier.TIER_1, CardTier.TIER_2, CardTier.TIER_3] as const) {
            const foundCard = state.faceUpCards[tier].find((c) => c.id === cardId);
            if (foundCard) {
                card = foundCard;
                cardTier = tier;
                break;
            }
        }
        if (!card) {
            return { success: false, error: 'Card not found in face-up cards' };
        }
    } else if (fromDeck) {
        // Reserve from top of deck
        const deck = state.decks[fromDeck];
        if (deck.length === 0) {
            return { success: false, error: `No cards left in tier ${fromDeck} deck` };
        }
        card = deck[0];
        cardTier = fromDeck;
        fromDeckTop = true;
    } else {
        return { success: false, error: 'Must specify either cardId or fromDeck' };
    }

    // Check if player would exceed 10 tokens with tadpole
    const currentTokenCount = getTotalResourceCount(player);
    const tadpolesAvailable = state.availableResources[ResourceType.TRUE_SOUL_TADPOLE] || 0;
    const canTakeTadpole = tadpolesAvailable > 0 && currentTokenCount < 10;

    // Reserve the card
    const reservedPlayer = reserveCard(player, card);
    if (!reservedPlayer) {
        return { success: false, error: 'Failed to reserve card' };
    }
    player = reservedPlayer;

    // Give tadpole token if available and under limit
    const updatedBoardResources = { ...state.availableResources };
    if (canTakeTadpole) {
        player = addResourceToPlayer(player, ResourceType.TRUE_SOUL_TADPOLE, 1);
        updatedBoardResources[ResourceType.TRUE_SOUL_TADPOLE] = tadpolesAvailable - 1;
    }

    // Update game state
    let newState = {
        ...state,
        availableResources: updatedBoardResources,
    };

    // Remove from face-up or deck
    if (fromDeckTop && cardTier !== undefined) {
        // Remove from top of deck (skip first card)
        const remainingDeck = newState.decks[cardTier].slice(1);
        newState = {
            ...newState,
            decks: {
                ...newState.decks,
                [cardTier]: remainingDeck,
            },
        };
    } else if (cardTier !== undefined) {
        // Remove from face-up and draw replacement
        const newFaceUpCards = state.faceUpCards[cardTier].filter((c) => c.id !== cardId);
        newState = {
            ...newState,
            faceUpCards: {
                ...newState.faceUpCards,
                [cardTier]: newFaceUpCards,
            },
        };

        // Draw replacement card from deck
        const deck = newState.decks[cardTier];
        if (deck.length > 0) {
            const [drawnCard, ...remainingDeck] = deck;
            newState = {
                ...newState,
                decks: {
                    ...newState.decks,
                    [cardTier]: remainingDeck,
                },
                faceUpCards: {
                    ...newState.faceUpCards,
                    [cardTier]: [...newFaceUpCards, drawnCard],
                },
            };
        }
    }

    // Update players array
    const newPlayers = [...state.players];
    newPlayers[playerIndex] = player;

    return {
        success: true,
        data: {
            ...newState,
            players: newPlayers,
        },
    };
}

/**
 * Action: Discard tokens back to the pool
 */
export function discardTokensAction(
    state: GameState,
    playerId: string,
    tokens: TokenSelection
): ActionResult<GameState> {
    const playerIndex = state.players.findIndex((p) => p.id === playerId);
    if (playerIndex === -1) return { success: false, error: 'Player not found' };

    let player = state.players[playerIndex];
    const updatedBoardResources = { ...state.availableResources };

    for (const [type, count] of Object.entries(tokens)) {
        const resourceType = type as ResourceType;
        const amount = count || 0;
        if (amount > 0) {
            if ((player.resources[resourceType] || 0) < amount) return { success: false, error: `Not enough ${type} to discard` };
            player = removeResourceFromPlayer(player, resourceType, amount);
            updatedBoardResources[resourceType] = (updatedBoardResources[resourceType] || 0) + amount;
        }
    }

    const newPlayers = [...state.players];
    newPlayers[playerIndex] = player;

    return {
        success: true,
        data: { ...state, players: newPlayers, availableResources: updatedBoardResources },
    };
}
