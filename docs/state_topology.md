# Core State Topology & Data Flow

This document defines the core state structures for the BG3 Splendor game, separating state into `publicStore`, `playerStore`, and `gameSystemStore` to ensure decoupling and modularity, as outlined in the architecture guide.

## 1. State Topology

### 1.1. `publicStore` (公共池)

The `publicStore` holds the game state that is shared among all players and is visible on the main board.

| State Property | Type | Description |
| :--- | :--- | :--- |
| `availableResources` | `ResourceCollection` | The pool of resource tokens available for players to take. |
| `decks` | `{ [key in CardTier]: Card[] }` | The remaining cards in the deck for each tier, hidden from players. |
| `faceUpCards` | `{ [key in CardTier]: Card[] }` | The cards displayed face-up on the board, available for purchase or reservation. |
| `availablePatrons` | `Patron[]` | The patrons available in the current game who can visit players. |

### 1.2. `playerStore` (玩家资产)

The `playerStore` holds the state specific to each player. In a multi-player environment, this state is managed per player ID.

| State Property | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Unique identifier for the player. |
| `name` | `string` | Display name of the player. |
| `resources` | `ResourceCollection` | Resource tokens currently held by the player. |
| `bonuses` | `ResourceCollection` | Permanent resource bonuses acquired from cards. |
| `acquiredCards` | `Card[]` | Cards the player has purchased. |
| `reservedCards` | `Card[]` | Cards the player has reserved (maximum of 3). |
| `patrons` | `Patron[]` | Patrons that have visited the player. |
| `prestigePoints` | `number` | Total prestige points accumulated by the player. |

### 1.3. `gameSystemStore` (回合逻辑)

The `gameSystemStore` manages the overall game state, turn execution, and game phase transitions.

| State Property | Type | Description |
| :--- | :--- | :--- |
| `phase` | `GamePhase` | Current phase of the game (`SETUP`, `IN_PROGRESS`, `COMPLETED`). |
| `currentPlayerIndex` | `number` | Index of the player whose turn it is currently. |
| `turnNumber` | `number` | The current turn number. |
| `endGameTriggeredBy` | `string \| undefined` | ID of the player who reached the winning condition, triggering the final round. |

## 2. Data Flow & State Transitions

To maintain strict decoupling between the UI and the game logic, all state transitions should follow a unidirectional data flow.

### 2.1. Core Actions and State Updates

| Action | State Changes |
| :--- | :--- |
| **Take Resources** | 1. Deduct resources from `publicStore.availableResources`. <br> 2. Add resources to active player's `playerStore.resources`. |
| **Reserve Card** | 1. Remove card from `publicStore.faceUpCards` (or draw from deck). <br> 2. Add card to player's `playerStore.reservedCards`. <br> 3. (If applicable) Add Gold/Tadpole token to player's `playerStore.resources` and deduct from `publicStore.availableResources`. |
| **Purchase Card** | 1. Deduct cost from player's `playerStore.resources` (taking `playerStore.bonuses` into account). <br> 2. Add deducted resources back to `publicStore.availableResources`. <br> 3. Move card from `publicStore.faceUpCards` or `playerStore.reservedCards` to `playerStore.acquiredCards`. <br> 4. Update player's `playerStore.bonuses` and `playerStore.prestigePoints`. |
| **Patron Visit** | 1. Check if player meets conditions for any patron in `publicStore.availablePatrons`. <br> 2. Move patron from `publicStore.availablePatrons` to player's `playerStore.patrons`. <br> 3. Update player's `playerStore.prestigePoints`. |
| **End Turn** | 1. Check if winning condition is met (set `gameSystemStore.endGameTriggeredBy`). <br> 2. Increment `gameSystemStore.turnNumber` if a full round is complete. <br> 3. Update `gameSystemStore.currentPlayerIndex` to the next player. |

## 3. Design Principles for Decoupling

As specified in the architecture guidelines:

1.  **Pure Function Reducers:** All state modifications must be performed by pure functions in the logic layer, accepting current state and action data, and returning the new state.
2.  **Store Separation:** UI components should subscribe to the minimal necessary slice of state from the stores to prevent unnecessary re-renders.
3.  **Extensibility:** The state structures are designed to be stable. New mechanics (like Master Cards or special abilities) should be added as optional properties or via an extensible metadata field rather than restructuring the core stores.
