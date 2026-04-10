# Domain Logic Specification - BG3 Splendor

This document specifies the core domain logic and pure functions for the BG3 Splendor game, decoupled from any user interface. It serves as the source of truth for game rules and state transitions.

## Core Data Models

The game state is composed of the following immutable data structures:

### Resource
Represents the currency in the game.
- **Resource Types**: `RADIANT_GEM` (Cleric/Paladin), `ARCANE_CRYSTAL` (Wizard/Sorcerer), `NATURES_BLESSING` (Druid/Ranger), `INFERNAL_IRON` (Karlach/Hellish), `DARK_QUARTZ` (Rogue/Warlock), `TRUE_SOUL_TADPOLE` (Wildcard).
- **ResourceCollection**: A mapping of `ResourceType` to numeric amounts.

### Card
Represents a skill, spell, or magic item players can acquire.
- **Properties**: `id`, `name`, `tier` (1, 2, 3), `type` (Spell, Item, Skill), `cost` (ResourceCollection), `bonus` (ResourceType), `points` (number).

### Patron
Represents powerful entities (e.g., Withers, Raphael) that visit players meeting specific conditions.
- **Properties**: `id`, `name`, `requirements` (ResourceCollection), `points` (number).

### Player
Represents a participant in the game.
- **Properties**: `id`, `name`, `resources` (ResourceCollection), `bonuses` (ResourceCollection), `acquiredCards` (Card[]), `reservedCards` (Card[]), `patrons` (Patron[]), `prestigePoints` (number).

### GameState
The top-level container for the game world.
- **Properties**: `phase` (SETUP, IN_PROGRESS, COMPLETED), `players` (Player[]), `currentPlayerIndex` (number), `availableResources` (ResourceCollection), `decks` (Cards by tier), `faceUpCards` (Cards by tier), `availablePatrons` (Patron[]), `turnNumber` (number).

---

## Core Pure Functions

These functions must remain pure (no side effects, no I/O, deterministic) and are used to compute new states or derive information.

### Resource Operations

#### `addResources(target: ResourceCollection, source: ResourceCollection): ResourceCollection`
Combines two resource collections and returns the summed collection.

#### `subtractResources(target: ResourceCollection, source: ResourceCollection): ResourceCollection`
Subtracts the source collection from the target collection.

#### `hasEnoughResources(available: ResourceCollection, required: ResourceCollection): boolean`
Returns true if the available resources are greater than or equal to the required resources for all types.

### Card Operations

#### `calculateEffectiveCost(card: Card, bonuses: ResourceCollection): ResourceCollection`
Calculates the net cost of a card after applying the player's permanent bonuses. Cost cannot drop below 0 for any resource type.

### Player Operations

#### `addResourceToPlayer(player: Player, resourceType: ResourceType, amount: number): Player`
Returns a new Player with increased resources.

#### `removeResourceFromPlayer(player: Player, resourceType: ResourceType, amount: number): Player`
Returns a new Player with decreased resources (clamped at 0).

#### `acquireCard(player: Player, card: Card): Player`
Adds the card to `acquiredCards`, increments the player's bonus for that card's type, and adds the card's points to the player's prestige points.

#### `reserveCard(player: Player, card: Card): Player | null`
Adds a card to `reservedCards` if the count is less than 3. Returns null if full.

#### `unreserveCard(player: Player, cardId: string): Player`
Removes a card from `reservedCards`.

#### `addPatronToPlayer(player: Player, patron: Patron): Player`
Adds a patron to the player's collection and adds points to prestige points.

#### `getTotalResourceCount(player: Player): number`
Returns the sum of all tokens held by the player.

#### `hasWon(player: Player, winningPoints: number = 15): boolean`
Returns true if the player meets or exceeds the winning points threshold.

### Game State Management

#### `createGameState(players: Player[], cardDecks: CardDeck[], patrons: Patron[], seed?: string): GameState`
Creates the initial game state.

#### `getCurrentPlayer(state: GameState): Player`
Returns the current player based on `currentPlayerIndex`.

#### `nextTurn(state: GameState): GameState`
Advances to the next player's turn.

#### `isGameOver(state: GameState, winningPoints: number = 15): boolean`
Checks if any player has reached the winning points.

#### `getWinners(state: GameState): Player[]`
Determines the winner(s) applying tie-breaker rules.

#### `drawCardFromDeck(state: GameState, tier: CardTier): GameState`
Draws a card from the deck and puts it face-up.

#### `removeFaceUpCard(state: GameState, cardId: string): GameState`
Removes a face-up card from the board.

---

## Game Action State Transitions

These functions handle the core player actions, validating rules and returning either a successful new `GameState` or an error message.

### `takeTokensAction(state: GameState, playerId: string, tokens: TokenSelection): ActionResult<GameState>`

**Rules:**
1. **Valid Selections**: Player must take either:
   - Exactly 3 different colored tokens.
   - Exactly 2 tokens of the exact same color (only allowed if there are at least 4 tokens of that color available on the board).
2. **Constraints**:
   - Cannot take `TRUE_SOUL_TADPOLE` tokens directly (they are only acquired via reserving cards).
   - Player's total token count cannot exceed 10 after the action.
   - Requested tokens must be available on the board.

### `buyCardAction(state: GameState, playerId: string, cardId: string, fromReserved: boolean): ActionResult<GameState>`

**Rules:**
1. **Validation**:
   - The card must be available (either face-up on the board or in the player's reserved list).
   - The player must be able to afford the card's effective cost (cost minus bonuses).
2. **Wildcards**: `TRUE_SOUL_TADPOLE` tokens act as wildcards and can substitute for any missing resource.
3. **Resolution**:
   - Deduct resources from the player.
   - Return deducted resources to the board's available pool.
   - Move the card to the player's acquired list.
   - If bought from the board, fill the empty slot by drawing a card from the corresponding tier deck.
   - Check if the player triggers a visit from any available Patrons.

### `reserveCardAction(state: GameState, playerId: string, cardId?: string, fromDeck?: CardTier): ActionResult<GameState>`

**Rules:**
1. **Validation**:
   - Player cannot have more than 3 reserved cards.
   - Must specify either a specific `cardId` from the board or a `fromDeck` tier to blind-reserve.
2. **Resolution**:
   - Remove the card from the board (and replace it) or draw it from the top of the specified deck.
   - Add the card to the player's reserved list.
   - Give the player 1 `TRUE_SOUL_TADPOLE` token from the board, if any are available and the player does not exceed the 10-token limit.
