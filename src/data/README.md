# Game Data

This directory handles the raw data definitions for the cards, patrons, and initial game states.

## 1. `cardData.ts` (Card Abstraction Engine)
The primary method for adding new cards to the game has been completely abstracted and decoupled.

**Instead of hardcoding complex `createCard` factory logic everywhere, you simply define a `CardTemplate` JSON object.**

### The `CardTemplate` Pattern
Each template in the arrays (`tier1Templates`, `tier2Templates`, etc.) contains:
- `id` and `name`: Identifiers.
- `bonus`: The permanent `ResourceType` gem provided by the card.
- `cost`: The cost required to buy the card (represented as a dictionary of ResourceTypes).
- `points`: The prestige points awarded (default 0).
- `description`: The lore text.

### The `buildCards` Factory
The script automatically iterates through these arrays, passing them into the `buildCards` or `buildPatrons` factory. This ensures the data is strictly bound to its corresponding Tier and generates a unified array (`GENERATED_TIER_1_CARDS`, etc.) that is exported cleanly to the Game Store.

## 2. `initialData.ts`
Acts as the central export module. It pulls the generated arrays from `cardData.ts` and aliases them to the standard `TIER_1_CARDS`, `TIER_2_CARDS`, `TIER_3_CARDS`, and `ALL_PATRONS` variables expected by the rest of the codebase.
