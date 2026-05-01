# Domain Logic Specification - BG3 Splendor

This document specifies the core domain logic and game rules for BG3 Splendor. It serves as the authoritative source of truth for game mechanics and state transitions.

## 1. Core Data Models

### 1.1. Resource
- **Types**: `RADIANT_GEM`, `ARCANE_CRYSTAL`, `NATURES_BLESSING`, `INFERNAL_IRON`, `DARK_QUARTZ`, `TRUE_SOUL_TADPOLE` (Wildcard).
- **ResourceCollection**: A mapping of types to numeric amounts.

### 1.2. Card
- **Properties**: `id`, `assetId` (for images), `name`, `tier` (1, 2, 3), `cost`, `bonus`, `points`.

### 1.3. Patron
- **Properties**: `id`, `assetId`, `name`, `requirements`, `points`.

### 1.4. Player
- **Properties**: `id`, `name`, `resources`, `bonuses`, `acquiredCards`, `reservedCards`, `patrons`, `prestigePoints`.

---

## 2. Core Game Rules

### 2.1. Winning Conditions
- **Threshold**: 18 Prestige Points triggers the endgame.
- **Sudden Death**: When a player reaches 18 points, the game ends IMMEDIATELY (`GamePhase.COMPLETED`).
- **Tie-Breaker**: 
  - (Used only if simultaneous checks happen): Fewest total cards acquired.

### 2.2. Token Management & Overflow
- **Standard Limit**: 10 tokens.
- **Action Overflow**: During a "Take Tokens" or "Reserve" action, a player is allowed to temporarily hold up to **13 tokens**.
- **Discard Phase**: If a player ends their action with > 10 tokens, they MUST choose and discard tokens back to the bank until they have exactly 10 before their turn can officially end.

### 2.3. Resource Deduction Priority
When purchasing a card, the system automatically calculates the most efficient payment path:
1.  **Permanent Bonuses**: Applied first as a flat discount.
2.  **Colored Tokens**: Used to pay the remaining net cost.
3.  **True Soul Tadpoles (Wildcards)**: Used only to cover remaining deficits.

---

## 3. Game Actions (Actions.ts)

### 3.1. `takeTokensAction`
- **Valid Patterns**: Take 3 different colors OR Take 2 of the same color (if stack size >= 4).
- **Constraint**: Cannot take Tadpoles directly.

### 3.2. `reserveCardAction`
- **Effect**: Move card to private hand + Gain 1 Tadpole (if available).
- **Limit**: Max 3 reserved cards.

### 3.3. `buyCardAction`
- **Effect**: Deduct resources -> Grant Bonus -> Grant Points -> Check Patron Visit.
- **Patron Visits**: Only one Patron can visit per turn. If multiple criteria are met, the first one in the board's array visits.

### 3.4. `discardTokensAction`
- **Trigger**: Only available when player's token count > 10.
- **Effect**: Returns specified tokens to the bank.
