/**
 * Resource types in BG3 Splendor
 * These replace the standard gem types from classic Splendor
 */
export const ResourceType = {
    RADIANT_GEM: 'radiant_gem', // ⚪ (formerly Diamond) - Clerics and Paladins
    ARCANE_CRYSTAL: 'arcane_crystal', // 🔵 (formerly Sapphire) - Wizards and Sorcerers
    NATURES_BLESSING: 'natures_blessing', // 🟢 (formerly Emerald) - Druids and Rangers
    INFERNAL_IRON: 'infernal_iron', // 🔴 (formerly Ruby) - Karlach and hellish powers
    DARK_QUARTZ: 'dark_quartz', // ⚫ (formerly Onyx) - Rogues and Warlocks
    TRUE_SOUL_TADPOLE: 'true_soul_tadpole', // 🟡 (formerly Gold/Joker) - Wildcard
} as const;
export type ResourceType = typeof ResourceType[keyof typeof ResourceType];


/**
 * Display metadata for resources
 */
export interface ResourceMetadata {
    type: ResourceType;
    name: string;
    emoji: string;
    description: string;
}

/**
 * Resource display information
 */
export const RESOURCE_METADATA: Record<ResourceType, ResourceMetadata> = {
    [ResourceType.RADIANT_GEM]: {
        type: ResourceType.RADIANT_GEM,
        name: 'Radiant Gem',
        emoji: '⚪',
        description: 'Associated with Clerics and Paladins',
    },
    [ResourceType.ARCANE_CRYSTAL]: {
        type: ResourceType.ARCANE_CRYSTAL,
        name: 'Arcane Crystal',
        emoji: '🔵',
        description: 'Associated with Wizards and Sorcerers',
    },
    [ResourceType.NATURES_BLESSING]: {
        type: ResourceType.NATURES_BLESSING,
        name: "Nature's Blessing",
        emoji: '🟢',
        description: 'Associated with Druids and Rangers',
    },
    [ResourceType.INFERNAL_IRON]: {
        type: ResourceType.INFERNAL_IRON,
        name: 'Infernal Iron',
        emoji: '🔴',
        description: 'Associated with Karlach and hellish powers',
    },
    [ResourceType.DARK_QUARTZ]: {
        type: ResourceType.DARK_QUARTZ,
        name: 'Dark Quartz',
        emoji: '⚫',
        description: 'Associated with Rogues and Warlocks',
    },
    [ResourceType.TRUE_SOUL_TADPOLE]: {
        type: ResourceType.TRUE_SOUL_TADPOLE,
        name: 'True Soul Tadpole',
        emoji: '🟡',
        description: 'Can be used as any resource (wildcard)',
    },
};

/**
 * Regular (non-joker) resource types
 */
export const REGULAR_RESOURCES = [
    ResourceType.RADIANT_GEM,
    ResourceType.ARCANE_CRYSTAL,
    ResourceType.NATURES_BLESSING,
    ResourceType.INFERNAL_IRON,
    ResourceType.DARK_QUARTZ,
] as const;

/**
 * Resource cost or collection mapping
 */
export type ResourceCollection = {
    [K in ResourceType]?: number;
};

/**
 * Card tier/level
 */
export const CardTier = {
    TIER_1: 1, // Cantrips, basic potions, common equipment
    TIER_2: 2, // Mid-level spells, rare items, class features
    TIER_3: 3, // Legendary items, high-level spells, epic boons
} as const;
export type CardTier = typeof CardTier[keyof typeof CardTier];


/**
 * Card type for thematic organization
 */
export const CardType = {
    SPELL: 'spell',
    ITEM: 'item',
    SKILL: 'skill',
} as const;
export type CardType = typeof CardType[keyof typeof CardType];


/**
 * A card represents a skill, spell, or magic item that players can acquire
 */
export interface Card {
    /** Unique identifier for the card */
    id: string;

    /** ID for asset lookup (images, sounds) */
    assetId?: string;

    /** Display name */
    name: string;

    /** Card tier/level */
    tier: CardTier;

    /** Card type for thematic purposes */
    type: CardType;

    /** Resource cost to acquire this card */
    cost: ResourceCollection;

    /** Permanent resource bonus this card provides */
    bonus: ResourceType;

    /** Prestige points this card grants */
    points: number;

    /** Optional flavor text */
    description?: string;
}

/**
 * Card deck for a specific tier
 */
export interface CardDeck {
    tier: CardTier;
    cards: Card[];
}

/**
 * A patron represents a powerful entity in the BG3 universe
 * They visit players who meet specific resource bonus requirements
 */
export interface Patron {
    /** Unique identifier for the patron */
    id: string;

    /** ID for asset lookup (images, sounds) */
    assetId?: string;

    /** Display name (e.g., "Withers", "Raphael", "Vlaakith") */
    name: string;

    /** Resource bonus requirements to attract this patron */
    requirements: ResourceCollection;

    /** Prestige points awarded when this patron visits */
    points: number;

    /** Optional flavor text */
    description?: string;
}

/**
 * Pre-defined patrons from BG3 lore
 */
export const PREDEFINED_PATRONS = {
    WITHERS: 'withers',
    RAPHAEL: 'raphael',
    VLAAKITH: 'vlaakith',
    MYSTRA: 'mystra',
    THE_ABSOLUTE: 'the_absolute',
} as const;

/**
 * Represents a player in the game
 */
export interface Player {
    /** Unique identifier for the player */
    id: string;

    /** Display name */
    name: string;

    /** Resources (tokens) currently held by the player */
    resources: ResourceCollection;

    /** Permanent resource bonuses from acquired cards */
    bonuses: ResourceCollection;

    /** Cards the player has acquired */
    acquiredCards: Card[];

    /** Cards the player has reserved (max 3) */
    reservedCards: Card[];

    /** Patrons that have visited this player */
    patrons: Patron[];

    /** Total prestige points */
    prestigePoints: number;
}

/**
 * Game phase/status
 */
export const GamePhase = {
    SETUP: 'setup',
    IN_PROGRESS: 'in_progress',
    LAST_ROUND: 'last_round', // Round continues until the last player in order finishes
    COMPLETED: 'completed',
} as const;
export type GamePhase = typeof GamePhase[keyof typeof GamePhase];


/**
 * The main game state
 */
export interface GameState {
    /** Current game phase */
    phase: GamePhase;

    /** List of players in turn order */
    players: Player[];

    /** Index of the current player */
    currentPlayerIndex: number;

    /** Available resource tokens on the board */
    availableResources: ResourceCollection;

    /** Card decks by tier */
    decks: {
        [CardTier.TIER_1]: Card[];
        [CardTier.TIER_2]: Card[];
        [CardTier.TIER_3]: Card[];
    };

    /** Face-up cards on the board (4 per tier) */
    faceUpCards: {
        [CardTier.TIER_1]: Card[];
        [CardTier.TIER_2]: Card[];
        [CardTier.TIER_3]: Card[];
    };

    /** Available patrons */
    availablePatrons: Patron[];

    /** Turn number */
    turnNumber: number;

    /** Optional: ID of the player who triggered the end game */
    endGameTriggeredBy?: string;
}


/**
 * Represents a discrete, syncable game action.
 * Using actions instead of full state snapshots prevents most race conditions.
 */
export type GameAction = 
    | { type: 'TAKE_TOKENS'; payload: { playerId: string; tokens: Record<string, number> } }
    | { type: 'BUY_CARD'; payload: { playerId: string; cardId: string; fromReserved: boolean } }
    | { type: 'RESERVE_CARD'; payload: { playerId: string; cardId?: string; fromDeck?: CardTier } }
    | { type: 'DISCARD_TOKENS'; payload: { playerId: string; tokens: Record<string, number> } }
    | { type: 'END_TURN'; payload: { playerId: string } }
    | { type: 'RESET_GAME'; payload: { playerNames?: string[] } };
