# Domain Layer

This directory contains the core business logic and models for the BG3 Splendor game. It is designed to be pure TypeScript, with no dependencies on React, state management libraries, or browser APIs.

## Main Files

- `models.ts`: Defines the core data structures and types:
    - **Enums**: `ResourceType`, `CardTier`, `CardType`, `GameStatus`.
    - **Interfaces**: `Card`, `Player`, `Patron`, `GameState`, `GameHistoryEntry`.
    - **Constants**: `REGULAR_RESOURCES`, `RESOURCE_METADATA`.
- `logic.ts`: Contains pure functions for game rules and calculations:
    - **State Evaluation**: `calculateEffectiveCost`, `meetsPatronRequirements`, `calculateTotalPoints`.
    - **Validation**: `canTakeTokens`, `canBuyCard`, `canReserveCard`.
    - **Factories**: `createCard`, `createPatron`, `createInitialState`.
- `actions.ts`: Implements state transition functions for game moves:
    - `takeTokensAction`, `buyCardAction`, `reserveCardAction`, `endTurnAction`.
    - These functions take the current state and return a result object containing the new state or an error message.
- `*.test.ts`: Comprehensive unit tests for all domain logic and actions using Vitest.

## Architectural Role

The Domain Layer is the "brain" of the application, representing the innermost layer of the Clean Architecture.
1. **Purity**: All functions are pure, making them deterministic and easy to test.
2. **Decoupling**: It knows nothing about the UI or how the state is stored.
3. **Source of Truth**: Any change to game rules must happen here.

The Store Layer (`src/store`) acts as a bridge, holding the state and calling Domain actions to process user intent.
