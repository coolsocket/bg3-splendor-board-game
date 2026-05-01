/**
 * Global Game Configuration
 * All constants related to gameplay balance and physical layout are defined here.
 */

export const GAME_CONFIG = {
  // Gameplay Balance
  WINNING_PRESTIGE: 18,
  MAX_TOKEN_LIMIT: 10,
  MAX_TEMPORARY_TOKENS: 13, 
  MAX_RESERVED_CARDS: 3,
  MAX_PATRONS_ON_BOARD: 3,
  CARDS_PER_TIER: 4,
  
  // Scoring / Balancing
  TIER_RESERVATION_TADPOLES: 1,
  
  // Animation Timings (ms)
  ANIMATION_DURATION: {
    TOKEN_TRANSFER: 1500,
    CARD_FLIGHT: 2000,
    PATRON_VISIT: 2500,
    TURN_ANNOUNCEMENT: 3000,
    NOTIFICATION: 4000,
  },
  
  // Physical Layout Constants
  UI: {
    DETAILED_CARD_IMAGE_SIZE: 360,
    DETAILED_CARD_WIDTH: 420,
    PARCHMENT_BORDER_WIDTH: 12,
    MODAL_MAX_WIDTH: 600,
    SIDEBAR_WIDTH_FULL: 280,
    SIDEBAR_WIDTH_COMPACT: 220,
    PLAYER_BOARD_WIDTH: '13.5rem',
    RESOURCE_POOL_MAX_WIDTH: 240,
    MARKET_MAX_WIDTH: 'min(100%, calc((100vh - 200px) * 1.1))',
    DECK_SEAL_SIZE: 64,
    PRESTIGE_BADGE_SIZES: {
      xs: 20,
      sm: 26,
      md: 32,
      lg: 44,
    },
    TOKEN_SIZES: {
      sm: 28,
      md: 40,
      lg: 56,
    }
  },
  
  // Logic Keys
  RESOURCE_KEYS: ['RADIANT_GEM', 'ARCANE_CRYSTAL', 'NATURES_BLESSING', 'INFERNAL_IRON', 'DARK_QUARTZ', 'TRUE_SOUL_TADPOLE'] as const,
};
